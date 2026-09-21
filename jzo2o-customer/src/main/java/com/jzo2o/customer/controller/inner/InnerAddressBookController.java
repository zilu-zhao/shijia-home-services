package com.jzo2o.customer.controller.inner;

import cn.hutool.core.bean.BeanUtil;
import com.jzo2o.api.customer.AddressBookApi;
import com.jzo2o.api.customer.dto.response.AddressBookResDTO;
import com.jzo2o.customer.model.domain.AddressBook;
import com.jzo2o.customer.service.IAddressBookService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@Api(tags = "内部接口-地址薄相关接口")
@RequestMapping("/inner/address-book")
public class InnerAddressBookController implements AddressBookApi {
    /*order服务远程使用Api服务调用该查询方法，根据地址id查询地址信息*/
    @Resource
    private IAddressBookService addressBookService;
    @Override
    @GetMapping("/{id}")
    @ApiOperation("根据id查询地址薄")
    @ApiImplicitParams({@ApiImplicitParam(name="id",value = "地址薄id",required = true,dataTypeClass = Long.class)})
    public AddressBookResDTO findById(@PathVariable("id") Long id) {
//        查询到地址对象
        AddressBook addressBook = addressBookService.getById(id);
//        返回值为AddressBookResDTO，我们进行转换然后返回
      return   BeanUtil.toBean(addressBook,AddressBookResDTO.class);
    }
}