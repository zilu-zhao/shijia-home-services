package pay;

import java.math.BigDecimal;
/*创建策略接口*/
public interface PaymentStrategy {
    /*写一个支付的方法*/
    void pay(BigDecimal Amount);
}
