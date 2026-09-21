package com.jzo2o.market.service;

import com.jzo2o.common.model.PageResult;
import com.jzo2o.market.model.domain.Activity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.jzo2o.market.model.dto.request.ActivityQueryForPageReqDTO;
import com.jzo2o.market.model.dto.request.ActivitySaveReqDTO;
import com.jzo2o.market.model.dto.response.ActivityInfoResDTO;
import com.jzo2o.market.model.dto.response.SeizeCouponInfoResDTO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author itcast
 * @since 2023-09-16
 */
public interface IActivityService extends IService<Activity> {

    /**
     * 分页查询活动
     *
     * @param activityQueryForPageReqDTO
     * @return
     */
    PageResult<ActivityInfoResDTO> queryForPage(ActivityQueryForPageReqDTO activityQueryForPageReqDTO);

    ActivityInfoResDTO queryById(Long id);

    /**
     * 活动保存
     *
     * @param activitySaveReqDTO
     */
    void save(ActivitySaveReqDTO activitySaveReqDTO);



    /**
     * 更新活动状态，
     * 1.已经进行中但是状态未修改的订单变为进行中
     * 2.
     */
    void updateStatus();

    /**
     * 活动作废
     * 1.活动变为作废
     * 2.活动中产生的未使用的优惠券作废
     */
    void revoke(Long id);
/*
* 活动预热
* 定时扫描activity中的活动添加到redis中*/
    void preheat();
/*
*去Redis缓存中查询activity列表*/
    List<SeizeCouponInfoResDTO> queryActivityListFromCache(Integer tabType);
/*
* 根据活动id查询优惠券活动的详情*/
    Activity queryActivityInfoByIdCache(Long id);
}
