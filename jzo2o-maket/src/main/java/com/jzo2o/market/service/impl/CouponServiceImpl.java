package com.jzo2o.market.service.impl;

import cn.hutool.db.DbRuntimeException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jzo2o.api.market.dto.request.CouponUseBackReqDTO;
import com.jzo2o.api.market.dto.request.CouponUseReqDTO;
import com.jzo2o.api.market.dto.response.AvailableCouponsResDTO;
import com.jzo2o.api.market.dto.response.CouponUseResDTO;
import com.jzo2o.common.expcetions.BadRequestException;
import com.jzo2o.common.expcetions.CommonException;
import com.jzo2o.common.expcetions.DBException;
import com.jzo2o.common.model.PageResult;
import com.jzo2o.common.utils.*;
import com.jzo2o.market.constants.RedisConstants;
import com.jzo2o.market.enums.ActivityStatusEnum;
import com.jzo2o.market.enums.CouponStatusEnum;
import com.jzo2o.market.mapper.CouponMapper;
import com.jzo2o.market.model.domain.Activity;
import com.jzo2o.market.model.domain.Coupon;
import com.jzo2o.market.model.domain.CouponWriteOff;
import com.jzo2o.market.model.dto.request.CouponOperationPageQueryReqDTO;
import com.jzo2o.market.model.dto.request.SeizeCouponReqDTO;
import com.jzo2o.market.model.dto.response.ActivityInfoResDTO;
import com.jzo2o.market.model.dto.response.CouponInfoResDTO;
import com.jzo2o.market.service.IActivityService;
import com.jzo2o.market.service.ICouponService;
import com.jzo2o.market.service.ICouponUseBackService;
import com.jzo2o.market.service.ICouponWriteOffService;
import com.jzo2o.market.utils.CouponUtils;
import com.jzo2o.mvc.utils.UserContext;
import com.jzo2o.mysql.utils.PageUtils;
import com.jzo2o.redis.utils.RedisSyncQueueUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.jzo2o.common.constants.ErrorInfo.Code.SEIZE_COUPON_FAILD;
import static com.jzo2o.market.constants.RedisConstants.RedisKey.*;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author itcast
 * @since 2023-09-16
 */
@Service
@Slf4j
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements ICouponService {

    @Resource(name = "seizeCouponScript")
    private DefaultRedisScript<String> seizeCouponScript;

    @Resource
    private RedisTemplate redisTemplate;
   /* @Resource
    private UserContext userContext;*/

    @Resource
    private IActivityService activityService;

    @Resource
    private ICouponUseBackService couponUseBackService;

    @Resource
    private ICouponWriteOffService couponWriteOffService;


    @Override
    public PageResult<CouponInfoResDTO> queryForPageOfOperation(CouponOperationPageQueryReqDTO couponOperationPageQueryReqDTO) {
        // 1.数据校验
        if (ObjectUtils.isNull(couponOperationPageQueryReqDTO.getActivityId())) {
            throw new BadRequestException("请指定活动");
        }
        // 2.数据查询
        // 分页 排序
        Page<Coupon> couponQueryPage = PageUtils.parsePageQuery(couponOperationPageQueryReqDTO, Coupon.class);
        // 查询条件
        LambdaQueryWrapper<Coupon> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(Coupon::getActivityId, couponOperationPageQueryReqDTO.getActivityId());
        // 查询数据
        Page<Coupon> couponPage = baseMapper.selectPage(couponQueryPage, lambdaQueryWrapper);

        // 3.数据转化，并返回
        return PageUtils.toPage(couponPage, CouponInfoResDTO.class);
    }

    @Override
    public List<CouponInfoResDTO> queryForList(Long lastId, Long userId, Integer status) {

        // 1.校验
        if (status > 3 || status < 1) {
            throw new BadRequestException("请求状态不存在");
        }
        // 2.查询准备
        LambdaQueryWrapper<Coupon> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        // 查询条件
        lambdaQueryWrapper.eq(Coupon::getStatus, status)
                .eq(Coupon::getUserId, userId)
                .lt(ObjectUtils.isNotNull(lastId), Coupon::getId, lastId);
        // 查询字段
        lambdaQueryWrapper.select(Coupon::getId);
        // 排序
        lambdaQueryWrapper.orderByDesc(Coupon::getId);
        // 查询条数限制
        lambdaQueryWrapper.last(" limit 10 ");
        // 3.查询数据(数据中只含id)
        List<Coupon> couponsOnlyId = baseMapper.selectList(lambdaQueryWrapper);
        //判空
        if (CollUtils.isEmpty(couponsOnlyId)) {
            return new ArrayList<>();
        }

        // 4.获取数据且数据转换
        // 优惠id列表
        List<Long> ids = couponsOnlyId.stream()
                .map(Coupon::getId)
                .collect(Collectors.toList());
        // 获取优惠券数据
        List<Coupon> coupons = baseMapper.selectBatchIds(ids);
        // 数据转换
        return BeanUtils.copyToList(coupons, CouponInfoResDTO.class);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void revoke(Long activityId) {
        lambdaUpdate()
                .set(Coupon::getStatus, CouponStatusEnum.VOIDED.getStatus())
                .eq(Coupon::getActivityId, activityId)
                .eq(Coupon::getStatus, CouponStatusEnum.NO_USE.getStatus())
                .update();
    }

    @Override
    public Integer countReceiveNumByActivityId(Long activityId) {
        return lambdaQuery().eq(Coupon::getActivityId, activityId)
                .count();
    }

    @Override
    public void processExpireCoupon() {
        lambdaUpdate()
                .set(Coupon::getStatus, CouponStatusEnum.INVALID.getStatus())
                .eq(Coupon::getStatus, CouponStatusEnum.NO_USE.getStatus())
                .le(Coupon::getValidityTime, DateUtils.now())
                .update();
    }
/*
* 用户抢券的功能*/
    @Override
    public void seizeCoupon(SeizeCouponReqDTO dto) {
        //1. 校验活动时间是否进行中：要避免从数据库中查询数据，会影响并发
        Activity activity = activityService.queryActivityInfoByIdCache(dto.getId());
        if (activity == null) {
            throw new CommonException(SEIZE_COUPON_FAILD, "活动未开始");
        }
        if (activity.getDistributeEndTime().isBefore(LocalDateTime.now())) {
            throw new CommonException(SEIZE_COUPON_FAILD, "活动已结束");
        }
        if (activity.getDistributeStartTime().isAfter(LocalDateTime.now())) {
            throw new CommonException(SEIZE_COUPON_FAILD, "活动未开始");
        }

        //2. 抢券准备：为执行lua脚本准备key列表和参数值
        Long activityId = activity.getId();
        int index = (int) (activityId % 10);
        List<String> keys = List.of(
                //QUEUE:COUPON:SEIZE:SYNC:{活动id%10}
                RedisSyncQueueUtils.getQueueRedisKey(RedisConstants.RedisKey.COUPON_SEIZE_SYNC_QUEUE_NAME, index),
                //COUPON:RESOURCE:STOCK:{活动id%10}
                String.format(RedisConstants.RedisKey.COUPON_RESOURCE_STOCK, index),
                //COUPON:SEIZE:LIST:活动id_{活动id%10}
                String.format(RedisConstants.RedisKey.COUPON_SEIZE_LIST, activityId,index)
        );

        //3. 执行lua脚本，开始抢券
        Object execute = redisTemplate.execute(seizeCouponScript, keys, activityId, UserContext.currentUserId());

        //4. 处理lua脚本执行结果，如果失败则抛出异常
        if (execute == null) {
            throw new CommonException(SEIZE_COUPON_FAILD, "抢券失败");
        }
        long res = Long.parseLong(execute.toString());
        //抢券成功
        if (res > 0) {
            return;
        }
        if (res == -1) {
            throw new CommonException(SEIZE_COUPON_FAILD, "限领一张");
        }
        if (res == -2) {
            throw new CommonException(SEIZE_COUPON_FAILD, "优惠券已抢光");
        }
        throw new CommonException(SEIZE_COUPON_FAILD, "抢券失败");
    }
/*
* 远程调用查询可用的优惠券*/
    @Override
    public List<AvailableCouponsResDTO> getAvailable(BigDecimal totalAmount) {
        //查询当前用户的优惠券，并筛选优惠券未过期、未使用，订单的金额要大于使用门槛,优惠金额要小于订单金额
        //使用lambdaQuery进行查询
        List<Coupon> couponList = lambdaQuery()
                .eq(Coupon::getUserId, UserContext.currentUserId())  //优惠券的用户id为当前用户
                .le(Coupon::getAmountCondition, totalAmount)   //优惠金额要小于总金额
                .gt(Coupon::getValidityTime, LocalDateTime.now())  //有效期要大于现在
                .eq(Coupon::getStatus, CouponStatusEnum.NO_USE.getStatus()) //优惠券状态要未使用
                .list();
        //校验：如果查询不到符合的优惠券 返回一个空集合
        if (CollUtils.isEmpty(couponList)){
            return Collections.emptyList();
        }
        //组装数据并返回 前端需要该 List<AvailableCouponsResDTO>类型的返回值，我们组装并返回
        //使用stream流对数据进行处理
       return couponList.stream()
                .peek(coupon -> coupon.setDiscountAmount(CouponUtils.calDiscountAmount(coupon,totalAmount)))//计算优惠金额
                //保留实际优惠金额在0到总金额之间的优惠券，超过总金额的优惠券不展示
                .filter(coupon -> coupon.getDiscountAmount().compareTo(BigDecimal.ZERO)>0  //优惠金额和0比较要大于0，
                        &&coupon.getDiscountAmount().compareTo(totalAmount)<0) //优惠金额和总金额做比较要小于总金额
               //把处理好的数据和优惠券数据一并赋值给AvailableCouponsResDTO
                .map(coupon -> BeanUtils.toBean(coupon,AvailableCouponsResDTO.class))
                //根据折扣力度的大小进行降序排序
                .sorted(Comparator.comparing(AvailableCouponsResDTO::getDiscountAmount).reversed())
                //收集成集合
                .collect(Collectors.toList());


    }
/*order服务远程调用核销优惠券*/
    //更改优惠券的状态、使用订单等信息
    //再使用记录表中添加信息
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CouponUseResDTO useCoupon(CouponUseReqDTO dto) {
        //1：先校验订单，订单是否为空，优惠券是否存在，优惠券是否是自己的
        if (ObjectUtils.isNull(dto.getOrdersId())||ObjectUtils.isNull(dto.getTotalAmount())){
            throw new BadRequestException("订单信息为空不能使用优惠券");
        }
             //校验优惠券是否存在
        Coupon coupon = getById(dto.getId());
        if (coupon==null){
            throw new BadRequestException("没有可用的优惠券");
        }
           //校验优惠券是否是自己的
           //获取当前用户的id
        Long userId = UserContext.currentUserId();
        if (ObjectUtils.notEqual(userId,coupon.getUserId())){
            throw new BadRequestException("只允许核销自己的优惠券");
        }

        //2:修改优惠券表 使用时间、状态、使用的订单id
        boolean update = lambdaUpdate()
                .set(Coupon::getUseTime, LocalDateTime.now())
                .set(Coupon::getStatus, CouponStatusEnum.USED.getStatus())
                .set(Coupon::getOrdersId, dto.getOrdersId())
                .eq(Coupon::getId, coupon.getId())
                .eq(Coupon::getStatus, CouponStatusEnum.NO_USE.getStatus())
                .le(Coupon::getAmountCondition, dto.getTotalAmount())  //总金额要大于满减金额
                .gt(Coupon::getValidityTime, LocalDateTime.now())  //有效期要大于当前时间
                .update();
        if (!update){
            throw new BadRequestException("优惠券核销失败");
        }

        //3:添加核销记录--往核销表添加一条记录
        CouponWriteOff couponWriteOff = new CouponWriteOff();
        couponWriteOff.setCouponId(coupon.getId());
        couponWriteOff.setUserId(coupon.getUserId());
        couponWriteOff.setOrdersId(dto.getOrdersId());
        couponWriteOff.setActivityId(coupon.getActivityId());
        couponWriteOff.setWriteOffTime(LocalDateTime.now());
        couponWriteOff.setWriteOffManPhone(coupon.getUserPhone());
        couponWriteOff.setWriteOffManName(coupon.getUserName());
        boolean saved = couponWriteOffService.save(couponWriteOff);
        if (!saved){
            throw new BadRequestException("核销失败--核销记录添加错误");
        }

        //4:获取优惠金额
        BigDecimal discountAmount = CouponUtils.calDiscountAmount(coupon, dto.getTotalAmount());
        CouponUseResDTO res = new CouponUseResDTO();
        res.setDiscountAmount(discountAmount);
        return res;
    }
}
