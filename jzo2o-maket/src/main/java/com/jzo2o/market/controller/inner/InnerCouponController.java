package com.jzo2o.market.controller.inner;

import com.jzo2o.api.market.dto.CouponApi;
import com.jzo2o.api.market.dto.request.CouponUseBackReqDTO;
import com.jzo2o.api.market.dto.request.CouponUseReqDTO;
import com.jzo2o.api.market.dto.response.AvailableCouponsResDTO;
import com.jzo2o.api.market.dto.response.CouponUseResDTO;
import com.jzo2o.market.service.ICouponService;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.List;
/*远程调用查询优惠券列表*/
@RestController
@RequestMapping("/inner/coupon")
@Api(tags = "内部接口-优惠券相关接口")
public class InnerCouponController implements CouponApi {
    @Resource
    private ICouponService couponService;//注入优惠券service
    @Override
    @GetMapping("/getAvailable")
    public List<AvailableCouponsResDTO> getAvailable(BigDecimal totalAmount) {
        return couponService.getAvailable(totalAmount);
    }
/*order服务远程调用market方法核销优惠券*/
@Override
@PostMapping("/use")
public CouponUseResDTO use(@RequestBody CouponUseReqDTO dto) {
    return couponService.useCoupon(dto);
}

    @Override
    @PostMapping("/useBack")
    public void useBack(CouponUseBackReqDTO couponUseBackReqDTO) {
        System.out.println("模拟退回优惠券");
    }
}

