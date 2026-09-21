package pay;

import java.math.BigDecimal;

/*信用卡支付的策略实现类*/
public class CreditCardPayment implements PaymentStrategy{
    /*写信用卡支付的功能*/
    @Override
    public void pay(BigDecimal Amount) {
        System.out.println("模拟信用卡支付-信用卡支付成功");
    }
}
