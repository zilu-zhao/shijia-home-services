package com.jzo2o.orders.dispatch.chain;

import com.jzo2o.common.utils.ObjectUtils;
import com.jzo2o.orders.dispatch.model.dto.ServeProviderDTO;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/*
* 过滤最少接单数规则*/
public class MinAcceptNumRule implements IProcessRule {
    //获取下一环节，因为方法是私有的，想要获取需要构造函数
    private IProcessRule next;
    public MinAcceptNumRule(IProcessRule next) {
        this.next = next;
    }

    @Override
    public IProcessRule next() {
        return null;
    }

    /**
     * 最少接单规则的实现
     * @param sourceList  待过滤的提供者列表
     * @return 过滤完成之后符合要求的
     */
    @Override
    public List<ServeProviderDTO> filter(List<ServeProviderDTO> sourceList) {
        /*该规则是过滤距离的规则，筛选出来距离最近的司机或者一批司机（如果距离相同）*/

        //1：先进行判断，若待过滤的列表为空 返回空集合，若为1，就不需要过滤 返回这一个就可
        if (ObjectUtils.isEmpty(sourceList)){
            return Collections.emptyList();
        }
        if (sourceList.size()==1){
            return sourceList;
        }
        //2：找出接单数最少的
        Integer minAcceptNum = sourceList.stream()
                .map(ServeProviderDTO::getAcceptanceNum)
                .min((o1, o2) -> o1 - o2)
                .get();
        //3；再找出和最少接单书相同的所有提供者列表
        List<ServeProviderDTO> targetList = sourceList.stream()
                .filter(dto -> dto.getAcceptanceNum().equals(minAcceptNum))
                .collect(Collectors.toList());
        //4：查询出来的结果判断一下是否是一个，如果是一个的话直接返回，如果是多个的话
        // 需要判断next是否为空，为空的话就是最后一个过滤规则了 不为空了调用下一个规则继续过滤
        if (targetList.size()>1&& next!=null){
            return next.filter(targetList);
        }
        return targetList;
    }
}
