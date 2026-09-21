package com.jzo2o.market.config;

import com.jzo2o.redis.properties.RedisSyncProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
/*
**
* 创建线程池*/

@Configuration
public class ThreadPoolConfiguration {
    @Bean("syncThreadPool")
    public ThreadPoolExecutor synchronizeThreadPool(RedisSyncProperties properties){
        return new ThreadPoolExecutor(
                //核心线程数
                1,   properties.getQueueNum() , //最大线程数，队列有几个就设置几个
                120,//线程空闲时间120s
                TimeUnit.MINUTES, //时间单位
                new SynchronousQueue<>(),  //使用SynchronousQueue无存储队列
                new ThreadPoolExecutor.DiscardOldestPolicy() //拒绝策略直接拒绝
        );
    }
}
