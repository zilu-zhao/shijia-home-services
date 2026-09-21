package pay;

import org.apache.shardingsphere.sql.parser.autogen.OpenGaussStatementParser;
import org.aspectj.weaver.ast.Var;

import java.util.HashMap;
import java.util.Map;

/*策略上下文类*/
public class PaymentStrategyContext {
    //1：创建一个map
  private Map<String,PaymentStrategy> strategyMap=new HashMap<>();
    public PaymentStrategyContext(){
        strategyMap.put("weixin", new WeixinPayment());
        strategyMap.put("credit", new CreditCardPayment());
    }

    public PaymentStrategy getStrategy(String type){
        return strategyMap.get(type);
    }
}
