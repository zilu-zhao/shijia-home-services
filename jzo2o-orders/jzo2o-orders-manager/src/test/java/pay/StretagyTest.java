package pay;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

public class StretagyTest {
    @Test
    public  void test(){
        //创建上下文类的有所有策略实现类的对象
        PaymentStrategyContext ctx = new PaymentStrategyContext();

        //微信支付
       // ctx.getStrategy("weixin").pay(new BigDecimal(100));
        //信用卡支付
        ctx.getStrategy("credit").pay(new BigDecimal(200));
    }
}
