package com.jzo2o.api.market.dto;

import com.jzo2o.api.market.dto.request.CouponUseBackReqDTO;
import com.jzo2o.api.market.dto.request.CouponUseReqDTO;
import com.jzo2o.api.market.dto.response.AvailableCouponsResDTO;
import com.jzo2o.api.market.dto.response.CouponUseResDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

@FeignClient(value = "jzo2o-market",path = "/market/inner/coupon")
public interface CouponApi {
/*
* 远程调用market服务查询优惠券，前端传参总金额*/
    @GetMapping("/getAvailable")
    List<AvailableCouponsResDTO> getAvailable(@RequestParam("totalAmount") BigDecimal totalAmount);

/*order服务远程调用market服务核销优惠券*/
    @PostMapping("/use")
    CouponUseResDTO use(@RequestBody CouponUseReqDTO dto);
    /**
     * 退回优惠券
     * @param couponUseBackReqDTO
     */
    @PostMapping("/useBack")
    void useBack(@RequestBody CouponUseBackReqDTO couponUseBackReqDTO);
}