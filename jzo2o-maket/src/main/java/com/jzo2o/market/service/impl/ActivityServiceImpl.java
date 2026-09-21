package com.jzo2o.market.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jzo2o.common.expcetions.BadRequestException;
import com.jzo2o.common.model.PageResult;
import com.jzo2o.common.utils.*;
import com.jzo2o.market.constants.RedisConstants;
import com.jzo2o.market.constants.TabTypeConstants;
import com.jzo2o.market.enums.ActivityStatusEnum;
import com.jzo2o.market.mapper.ActivityMapper;
import com.jzo2o.market.model.domain.Activity;
import com.jzo2o.market.model.dto.request.ActivityQueryForPageReqDTO;
import com.jzo2o.market.model.dto.request.ActivitySaveReqDTO;
import com.jzo2o.market.model.dto.response.ActivityInfoResDTO;
import com.jzo2o.market.model.dto.response.SeizeCouponInfoResDTO;
import com.jzo2o.market.service.IActivityService;
import com.jzo2o.market.service.ICouponService;
import com.jzo2o.market.service.ICouponWriteOffService;
import com.jzo2o.mysql.utils.PageUtils;
import com.rabbitmq.client.AMQP;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.lang.model.type.ReferenceType;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static com.jzo2o.market.constants.RedisConstants.RedisKey.*;
import static com.jzo2o.market.enums.ActivityStatusEnum.*;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author itcast
 * @since 2023-09-16
 */
@Service
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements IActivityService {
    private static final int MILLION = 1000000;

    @Resource
    private RedisTemplate redisTemplate;

    @Resource
    private ICouponService couponService;

    @Resource
    private ICouponWriteOffService couponWriteOffService;

    @Override
    public PageResult<ActivityInfoResDTO> queryForPage(ActivityQueryForPageReqDTO activityQueryForPageReqDTO) {
        LocalDateTime now = DateUtils.now();
        // 1.查询准备
        LambdaQueryWrapper<Activity> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        // 查询条件
        lambdaQueryWrapper.eq(ObjectUtils.isNotNull(activityQueryForPageReqDTO.getId()), Activity::getId, activityQueryForPageReqDTO.getId())
                .like(StringUtils.isNotEmpty(activityQueryForPageReqDTO.getName()), Activity::getName, activityQueryForPageReqDTO.getName())
                .eq(ObjectUtils.isNotNull(activityQueryForPageReqDTO.getType()), Activity::getType, activityQueryForPageReqDTO.getType())
                .eq(ObjectUtils.isNotNull(activityQueryForPageReqDTO.getStatus()), Activity::getStatus, activityQueryForPageReqDTO.getStatus());

        // 排序
        lambdaQueryWrapper.orderByDesc(Activity::getId);
        // 分页
        Page<Activity> activityPage = new Page<>(activityQueryForPageReqDTO.getPageNo().intValue(), activityQueryForPageReqDTO.getPageSize().intValue());
        activityPage = baseMapper.selectPage(activityPage, lambdaQueryWrapper);
        return PageUtils.toPage(activityPage, ActivityInfoResDTO.class);
    }

    @Override
    public ActivityInfoResDTO queryById(Long id) {
        // 1.获取活动
        Activity activity = baseMapper.selectById(id);
        // 判空
        if (activity == null) {
            return new ActivityInfoResDTO();
        }
        // 2.数据转换，并返回信息
        ActivityInfoResDTO activityInfoResDTO = BeanUtils.toBean(activity, ActivityInfoResDTO.class);
        // 设置状态
//        activityInfoResDTO.setStatus(getStatus(activity.getDistributeStartTime(), activity.getDistributeEndTime(), activity.getStatus()));
        // 3.领取数量
//        Integer receiveNum = couponService.countReceiveNumByActivityId(activity.getId());
        Integer receiveNum = activity.getTotalNum()-activity.getStockNum();
        activityInfoResDTO.setReceiveNum(receiveNum);
        // 4.核销量
        Integer writeOffNum = couponWriteOffService.countByActivityId(id);
        activityInfoResDTO.setWriteOffNum(NumberUtils.null2Zero(writeOffNum));

        //
        return activityInfoResDTO;
    }

    @Override
    public void save(ActivitySaveReqDTO activitySaveReqDTO) {
        // 1.逻辑校验
        activitySaveReqDTO.check();
        // 2.活动数据组装
        // 转换
        Activity activity = BeanUtils.toBean(activitySaveReqDTO, Activity.class);
        // 状态
        activity.setStatus(NO_DISTRIBUTE.getStatus());
        //库存
        activity.setStockNum(activitySaveReqDTO.getTotalNum());
        if(activitySaveReqDTO.getId() == null) {
            activity.setId(IdUtils.getSnowflakeNextId());
        }
        //排序字段
//        long sortBy = DateUtils.toEpochMilli(activity.getDistributeStartTime()) * MILLION + activity.getId() % MILLION;
        // 3.保存
        saveOrUpdate(activity);
    }


    @Override
    public void updateStatus() {
        LocalDateTime now = DateUtils.now();
        // 1.更新已经进行中的状态
        lambdaUpdate()
                .set(Activity::getStatus, ActivityStatusEnum.DISTRIBUTING.getStatus())//更新活动状态为进行中
                .eq(Activity::getStatus, NO_DISTRIBUTE.getStatus())//检索待生效的活动
                .le(Activity::getDistributeStartTime, now)//活动开始时间小于等于当前时间
                .gt(Activity::getDistributeEndTime,now)//活动结束时间大于当前时间
                .update();
        // 2.更新已经结束的
        lambdaUpdate()
                .set(Activity::getStatus, LOSE_EFFICACY.getStatus())//更新活动状态为已失效
                .in(Activity::getStatus, Arrays.asList(DISTRIBUTING.getStatus(), NO_DISTRIBUTE.getStatus()))//检索待生效及进行中的活动
                .lt(Activity::getDistributeEndTime, now)//活动结束时间小于当前时间
                .update();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void revoke(Long id) {
        // 1.活动作废
        boolean update = lambdaUpdate()
                .set(Activity::getStatus, ActivityStatusEnum.VOIDED.getStatus())
                .eq(Activity::getId, id)
                .in(Activity::getStatus, Arrays.asList(NO_DISTRIBUTE.getStatus(), DISTRIBUTING.getStatus()))
                .update();
        if(!update) {
            return;
        }
        // 2.未使用优惠券作废
        couponService.revoke(id);

    }
/*
* 活动预热，将活动信息添加到缓存中*/
    @Override
    public void preheat() {
//进行过滤查询：查询活动中或者未来一个月内会开始的优惠券活动
        List<Activity> activityList = lambdaQuery()
                .in(Activity::getStatus, DISTRIBUTING.getStatus(), NO_DISTRIBUTE.getStatus())//查询状态为进行中或未开始的
                .gt(Activity::getDistributeEndTime, LocalDateTime.now())//结束时间大于现在时间的
                .lt(Activity::getDistributeStartTime, LocalDateTime.now().plusMonths(1))//开始时间小于现在时间的
                .orderByDesc(Activity::getDistributeStartTime)//按照开始进行降序
                .list();
   //如果查询结果为空 直接结束
        if (CollUtils.isEmpty(activityList))
        {
            return;
        }
        //将查询出来的消息列表添加到缓存上
        //将列表转换为Json字符串
        String activityListStr = JsonUtils.toJsonStr(activityList);
        //存储到Redis中，string类型
        redisTemplate.opsForValue().set(ACTIVITY_CACHE_LIST,activityListStr);

        //将余票的库存也预热缓存到Redis中，以便用户抢券的时候用来判断余票
        activityList.forEach(activity -> {
            //设置key为：COUPON_RESOURCE_STOCK活动的id % 10，分别缓存到不同的hash中
            String key = String.format(COUPON_RESOURCE_STOCK, activity.getId() % 10);
            //把即将开放的活动的余票数量存储到Redis中
            if (ObjectUtils.equal(activity.getStatus(), NO_DISTRIBUTE.getStatus())){
                redisTemplate.opsForHash().put(key,activity.getId(),activity.getTotalNum());
                //对正在抢购中的活动余票也存储到Redis中，但是如果已经有了 就不需要在设置了，防止数据库的数据滞后
            } else if (ObjectUtils.equal(activity.getStatus(), DISTRIBUTING.getStatus())) {
                redisTemplate.opsForHash().putIfAbsent(key,activity.getId(),activity.getTotalNum());
            }
        });
        
    }
/*
* 根据类型去Redis中查询活动的列表*/
    @Override
    public List<SeizeCouponInfoResDTO> queryActivityListFromCache(Integer tabType) {
        //1：从Redis中查询优惠券的列表
        Object activityListJsonStr = redisTemplate.opsForValue().get(ACTIVITY_CACHE_LIST);
            //判空，如果为空返回给前端一个空集合
        if (ObjectUtils.isEmpty(activityListJsonStr)){
            return Collections.emptyList();
        }
        //2：查询出来的为Json字符串转换为对象
        List<Activity> activityList = JsonUtils.toList(activityListJsonStr.toString(), Activity.class);
        //3：转换成前端需要的结果（转换的时候需要根据活动开始的时间进行判断当前的状态 是疯抢中还是即将开始）
        //使用stream流进行转换
        return activityList.stream()
                .map(activity -> {
                    //将activity对象转换为前端需要的SeizeCouponInfoResDTO对象
                    SeizeCouponInfoResDTO dto = BeanUtils.toBean(activity, SeizeCouponInfoResDTO.class);
                    //为dto中的剩余票数进行赋值吗，因为Redis中的余票有延迟性
                    dto.setRemainNum(activity.getStockNum());
                    //更新status状态，Redis中的状态有一段时间的不一致性，要判断更新状态。
                    LocalDateTime now = LocalDateTime.now();
                    //如果结束的时间比现在还早，那就是已过期
                    if (activity.getDistributeEndTime().isBefore(now)){
                        dto.setStatus(LOSE_EFFICACY.getStatus());
                        //如果开始的时间比现在的时间还晚 那就是未生效
                    }else if (activity.getDistributeStartTime().isAfter(now)){
                        dto.setStatus(NO_DISTRIBUTE.getStatus());
                    }else {
                        //其他的就是正在进行中了
                        dto.setStatus(DISTRIBUTING.getStatus());
                    }
                    return  dto;
                }).filter(dto->{//进行过滤
                    //如果tabType=抢单中 那就返回活动进行中的活动列表
                    if (ObjectUtils.equal(tabType,TabTypeConstants.SEIZING)){
                        //获取疯抢中的活动列表
                        return ObjectUtils.equal(dto.getStatus(), DISTRIBUTING.getStatus());
                        //如果tabType=未开始，那就把状态=为开始的活动列表进行返回
                    } else if (ObjectUtils.equal(tabType,TabTypeConstants.NO_START)) {
                        return ObjectUtils.equal(dto.getStatus(), NO_DISTRIBUTE.getStatus());
                    }else {
                        return false;//否则就返回false;
                    }
                }).collect(Collectors.toList()); //Streaml流的终结语句，收集成list集合

    }
/*
* 根据活动的id查询活动的详情*/
@Override
public Activity queryActivityInfoByIdCache(Long id) {
    //1. 从Redis中查询优惠券活动列表
    String activityListJsonStr = (String) redisTemplate.opsForValue().get(ACTIVITY_CACHE_LIST);
    if (ObjectUtils.isEmpty(activityListJsonStr)) {
        return null;
    }

    //2. 转换成List
    List<Activity> activityList = JsonUtils.toList(activityListJsonStr, Activity.class);

    //3. 从列表中过滤出符合条件的活动信息
    return activityList.stream()
            .filter(activity -> ObjectUtils.equal(activity.getId(), id))
            .findAny()
            .orElse(null);
}

}
