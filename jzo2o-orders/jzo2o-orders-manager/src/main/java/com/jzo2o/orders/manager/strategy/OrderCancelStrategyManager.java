package com.jzo2o.orders.manager.strategy;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.jzo2o.common.expcetions.ForbiddenOperationException;
import com.jzo2o.orders.base.enums.OrderStatusEnum;
import com.jzo2o.orders.base.model.domain.Orders;
import com.jzo2o.orders.manager.model.dto.OrderCancelDTO;
import com.jzo2o.orders.manager.service.IOrdersManagerService;
import com.jzo2o.orders.manager.strategy.OrderCancelStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class OrderCancelStrategyManager {
    @Resource
    private IOrdersManagerService ordersManagerService;

    //key格式：userType+":"+orderStatusEnum，例如 1:NO_PAY
    private final Map<String, OrderCancelStrategy> strategyMap = new HashMap<>();
/*是JDK提供的一个注解，Spring框架拿来直接使用了
* 用法：加在bean对象内的任意方法上
* 作用：当bean对象被创建之后，Spring框架会立即执行一次这个方法
* 当前类是一个单例bean对象，在IOC容器初始化完成时创建的，而ICO容器初始化是在系统启动时执行的
* 最终：当项目已启动，就初始化IOC，然后创建单例bean对象，然后执行单例bean的@PostConstruct*/
    @PostConstruct
    public void init() {
        Map<String, OrderCancelStrategy> strategies = SpringUtil.getBeansOfType(OrderCancelStrategy.class);
        strategyMap.putAll(strategies);
        log.debug("订单取消策略类初始化到map完成！");
    }

    /**
     * 获取策略实现类
     *
     * @param userType    用户类型
     * @param orderStatus 订单状态
     * @return 策略实现类
     */
    public OrderCancelStrategy getStrategy(Integer userType, Integer orderStatus) {
        String key = userType + ":" + OrderStatusEnum.codeOf(orderStatus).toString();
        return strategyMap.get(key);
    }

    /**
     * 订单取消
     *
     * @param orderCancelDTO 订单取消模型
     */
    public void cancel(OrderCancelDTO orderCancelDTO) {
        Orders orders = ordersManagerService.queryById(orderCancelDTO.getId());
        OrderCancelStrategy strategy = getStrategy(orderCancelDTO.getCurrentUserType(), orders.getOrdersStatus());
        if (ObjectUtil.isEmpty(strategy)) {
            throw new ForbiddenOperationException("不被许可的操作");
        }

        orderCancelDTO.setUserId(orders.getUserId());
        orderCancelDTO.setServeStartTime(orders.getServeStartTime());
        orderCancelDTO.setCityCode(orders.getCityCode());
        orderCancelDTO.setRealPayAmount(orders.getRealPayAmount());
        orderCancelDTO.setTradingOrderNo(orders.getTradingOrderNo());
        orderCancelDTO.setRealServeEndTime(orders.getRealServeEndTime());
        strategy.cancel(orderCancelDTO);
    }

}