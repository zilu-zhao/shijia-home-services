package com.jzo2o.orders.dispatch.chain;

import com.jzo2o.orders.dispatch.model.dto.ServeProviderDTO;
import org.checkerframework.checker.units.qual.min;

import java.util.Arrays;
import java.util.List;

/**
 * 责任链条的使用类
 */
public class ProcessRuleTest {
    public static void main(String[] args) {
//        准备一些数据进行测试
        //准备服务提供者列表
        List<ServeProviderDTO> serveProviderDTOS = Arrays.asList(
                //1号 接单数最少
                ServeProviderDTO.builder().id(1L).acceptanceNum(0).acceptanceDistance(30).evaluationScore(50).build(),
                //2号 得分最高
                ServeProviderDTO.builder().id(2L).acceptanceNum(1).acceptanceDistance(10).evaluationScore(100).build(),
                //3号 得分最高
                ServeProviderDTO.builder().id(3L).acceptanceNum(2).acceptanceDistance(10).evaluationScore(100).build(),
                //4号 距离最近
                ServeProviderDTO.builder().id(4L).acceptanceNum(2).acceptanceDistance(5).evaluationScore(50).build(),
                //5号 距离最近
                ServeProviderDTO.builder().id(5L).acceptanceNum(1).acceptanceDistance(5).evaluationScore(50).build()
        );
        //1：构建责任链的时候，建议：从后往前一次创建每个环节的对象
/*构建一个最短距离优先的责任链：第一环节，最短距离对象 第二环节，最少接单数的规则对象*/
        //MinAcceptNumRule minAcceptNumRule = new MinAcceptNumRule(null);
        //MinDistanceRule chain = new MinDistanceRule(minAcceptNumRule);
/*构建一个最少接单数优先的责任链，第一环节：最少接单数的规则对象，第二环节：最短距离对象*/
        MinDistanceRule minDistanceRule = new MinDistanceRule(null);
        MinAcceptNumRule chain = new MinAcceptNumRule(minDistanceRule);
        //2：使用责任链过滤提供者（我们准备的数据）
        List<ServeProviderDTO> list = chain.filter(serveProviderDTOS);
        //list就是过滤之后的数据，还需要进行判断，如果全部过滤完毕只筛选出来一个，直接返回
        //3：若筛选出的不止一个，那我们随机进行选择一个
        if (list.size()==1){
            ServeProviderDTO target = list.get(0);
            System.out.println("最后筛选出来的结果为 = " + target);
        }else {
            ServeProviderDTO target = list.get((int) (Math.random() * list.size()));
            System.out.println("最后筛选出来的结果为 = " + target);
        }

    }
}
