package com.jzo2o.market.controller.consumer;

import com.jzo2o.common.model.PageResult;
import com.jzo2o.market.model.dto.request.ActivityQueryForPageReqDTO;
import com.jzo2o.market.model.dto.request.ActivitySaveReqDTO;
import com.jzo2o.market.model.dto.response.ActivityInfoResDTO;
import com.jzo2o.market.model.dto.response.SeizeCouponInfoResDTO;
import com.jzo2o.market.service.IActivityService;
import com.rabbitmq.utility.IntAllocator;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController("consumerActivityController")
@RequestMapping("/consumer/activity")
@Api(tags = "用户端-活动相关接口")
public class ActivityController {

    @Resource
    private IActivityService activityService;
/*去Redis中查询活动列表*/
@GetMapping("/list")
@ApiOperation("优惠券活动列表查询")
@ApiImplicitParam(name = "tabType",value = "页面tab类型，1为疯抢中，2是即将开始")
    public List<SeizeCouponInfoResDTO> activityList(@RequestParam("tabType") Integer tabType){
    return activityService.queryActivityListFromCache(tabType);
}

}
