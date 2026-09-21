package com.jzo2o.orders.dispatch.chain;

import com.jzo2o.orders.dispatch.model.dto.ServeProviderDTO;

import java.util.List;

/**
 * 抽象规则的接口，指定所有规则的规范 ，然后让规则类都实现我的方法*/
public interface IProcessRule {
    /*
    * 获取下一环节的规则对象*/
    IProcessRule next();

    /**
     * 当前环节的过滤
     * @param sourceList  待过滤的提供者列表
     * @return  过滤出来的符合当前规则条件的目标列表
     */
    List<ServeProviderDTO> filter(List<ServeProviderDTO> sourceList);
}
