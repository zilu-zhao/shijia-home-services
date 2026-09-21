package com.jzo2o.market.handler;

import com.jzo2o.api.customer.CommonUserApi;
import com.jzo2o.api.customer.dto.response.CommonUserResDTO;
import com.jzo2o.common.expcetions.CommonException;
import com.jzo2o.common.utils.NumberUtils;
import com.jzo2o.market.constants.RedisConstants;
import com.jzo2o.market.enums.CouponStatusEnum;
import com.jzo2o.market.model.domain.Activity;
import com.jzo2o.market.model.domain.Coupon;
import com.jzo2o.market.service.IActivityService;
import com.jzo2o.market.service.ICouponService;
import com.jzo2o.redis.handler.SyncProcessHandler;
import com.jzo2o.redis.model.SyncMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component(RedisConstants.RedisKey.COUPON_SEIZE_SYNC_QUEUE_NAME)
public class SeizeCouponSyncProcessHandler implements SyncProcessHandler<Object> {
    @Resource
    private IActivityService activityService;
    @Resource
    private ICouponService couponService;
    @Resource
    private CommonUserApi commonUserApi;
    @Resource
    private SeizeCouponSyncProcessHandler currentProxy;

    @Override
    public void batchProcess(List<SyncMessage<Object>> multiData) {
        throw new CommonException("不支持批量操作");
    }

    @Override
    public void singleProcess(SyncMessage<Object> singleData) {
        long userId = NumberUtils.parseLong(singleData.getKey());
        long activityId = NumberUtils.parseLong(singleData.getValue().toString());
        log.info("用户{}抢到活动{}的优惠券", userId, activityId);

        //查询活动信息
        Activity activity = activityService.getById(activityId);
        if (activity == null) {
            return;
        }

        //查询用户信息
        CommonUserResDTO user = commonUserApi.findById(userId);
        if (user == null) {
            return;
        }

        currentProxy.saveCoupon(activity, user);
    }

    @Transactional(rollbackFor = Exception.class)
    public void saveCoupon(Activity activity, CommonUserResDTO user) {
        Coupon coupon = new Coupon();
        coupon.setName(activity.getName());
        coupon.setUserId(user.getId());
        coupon.setUserName(user.getNickname());
        coupon.setUserPhone(user.getPhone());
        coupon.setActivityId(activity.getId());
        coupon.setType(activity.getType());
        coupon.setDiscountRate(activity.getDiscountRate());
        coupon.setDiscountAmount(activity.getDiscountAmount());
        coupon.setAmountCondition(activity.getAmountCondition());
        coupon.setValidityTime(LocalDateTime.now().plusDays(activity.getValidityDays()));
        coupon.setStatus(CouponStatusEnum.NO_USE.getStatus());
        couponService.save(coupon);
    
        boolean updated = activityService.lambdaUpdate()
                .setSql("stock_num = stock_num - 1")
                .eq(Activity::getId, activity.getId())
                .gt(Activity::getStockNum, 0)
                .update();
        if (!updated) {
            throw new CommonException("优惠券活动" + activity.getId() + "扣库存失败");
        }
    }
}