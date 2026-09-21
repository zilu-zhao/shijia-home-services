package pay;

import java.math.BigDecimal;
/*微信支付*/
public class WeixinPayment implements PaymentStrategy{
    @Override
    public void pay(BigDecimal Amount) {
/*该方法内写实现功能的代码*/
        System.out.println("模拟微信支付--微信支付成功");
    }

}
