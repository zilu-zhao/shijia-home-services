package com.jzo2o.api.customer;

import com.jzo2o.api.customer.dto.response.AddressBookResDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
/*value=目标服务的名称，path为目标controller的路径*/
@FeignClient(value = "jzo2o-customer",path = "/customer/inner/address-book")
public interface AddressBookApi {
    @GetMapping("/{id}")
    AddressBookResDTO findById(@PathVariable("id") Long id);
}
