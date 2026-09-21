package com.jzo2o.trade.handler.wechat;

import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.jzo2o.common.constants.ErrorInfo;
import com.jzo2o.common.expcetions.CommonException;
import com.jzo2o.trade.annotation.PayChannel;
import com.jzo2o.trade.constant.TradingConstant;
import com.jzo2o.api.trade.enums.PayChannelEnum;
import com.jzo2o.trade.enums.RefundStatusEnum;
import com.jzo2o.trade.enums.TradingEnum;
import com.jzo2o.trade.enums.TradingStateEnum;
import com.jzo2o.trade.handler.BasicPayHandler;
import com.jzo2o.trade.handler.wechat.response.WeChatResponse;
import com.jzo2o.trade.model.domain.RefundRecord;
import com.jzo2o.trade.model.domain.Trading;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;
import java.util.Map;

import static com.jzo2o.trade.enums.TradingEnum.NATIVE_REFUND_FAIL;

/**
 * 微信基础支付功能的实现
 *
 * @author zzj
 * @version 1.0
 */
@Slf4j
@Component("weChatBasicPayHandler")
@PayChannel(type = PayChannelEnum.WECHAT_PAY)
public class WeChatBasicPayHandler implements BasicPayHandler {

    @Override
    public Boolean queryTrading(Trading trading) throws CommonException {
        // 获取微信支付的client对象
        WechatPayHttpClient client = WechatPayHttpClient.get(trading.getEnterpriseId());

        //请求地址
        String apiPath = StrUtil.format("/v3/pay/transactions/out-trade-no/{}", trading.getTradingOrderNo());

        //请求参数
        Map<String, Object> params = MapUtil.<String, Object>builder()
                .put("mchid", client.getMchId())
                .build();

        WeChatResponse response;
        try {
            response = client.doGet(apiPath, params);
        } catch (Exception e) {
            log.error("调用微信接口出错！apiPath = {}, params = {}", apiPath, JSONUtil.toJsonStr(params), e);
            throw new CommonException(ErrorInfo.Code.TRADE_FAILED, NATIVE_REFUND_FAIL.getValue());
        }
        if (response.isOk()) {
            JSONObject jsonObject = JSONUtil.parseObj(response.getBody());
            // 交易状态，枚举值：
            // SUCCESS：支付成功
            // REFUND：转入退款
            // NOTPAY：未支付
            // CLOSED：已关闭
            // REVOKED：已撤销（仅付款码支付会返回）
            // USERPAYING：用户支付中（仅付款码支付会返回）
            // PAYERROR：支付失败（仅付款码支付会返回）
            String tradeStatus = jsonObject.getStr("trade_state");
            //已关闭或已撤单的更新状态为取消订单
            if (StrUtil.equalsAny(tradeStatus, TradingConstant.WECHAT_TRADE_CLOSED, TradingConstant.WECHAT_TRADE_REVOKED)) {
                trading.setTradingState(TradingStateEnum.QXDD);
            //支付成功或转入退款的更新为已付款
            } else if (StrUtil.equalsAny(tradeStatus, TradingConstant.WECHAT_TRADE_SUCCESS, TradingConstant.WECHAT_TRADE_REFUND)) {
                trading.setTradingState(TradingStateEnum.YJS);
            } else if (StrUtil.equalsAny(tradeStatus, TradingConstant.WECHAT_TRADE_PAYERROR)) {
                trading.setTradingState(TradingStateEnum.FKSB);
            } else {
                //非最终状态不处理
                return false;
            }
            //修改交易单状态
            trading.setTransactionId(jsonObject.getStr("transaction_id"));
            trading.setResultCode(tradeStatus);
            trading.setResultMsg(jsonObject.getStr("trade_state_desc"));
            trading.setResultJson(response.getBody());
            return true;
        }
        throw new CommonException(ErrorInfo.Code.TRADE_FAILED, NATIVE_REFUND_FAIL.getValue());
    }

    @Override
    public Boolean closeTrading(Trading trading) throws CommonException {
        // 获取微信支付的client对象
        WechatPayHttpClient client = WechatPayHttpClient.get(trading.getEnterpriseId());
        //请求地址
        String apiPath = StrUtil.format("/v3/pay/transactions/out-trade-no/{}/close", trading.getTradingOrderNo());
        //请求参数
        Map<String, Object> params = MapUtil.<String, Object>builder()
                .put("mchid", client.getMchId())
                .build();
        try {
            WeChatResponse response = client.doPost(apiPath, params);
            if (response.getStatus() == 204) {
                trading.setTradingState(TradingStateEnum.QXDD);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new CommonException(ErrorInfo.Code.TRADE_FAILED, TradingEnum.CLOSE_FAIL.getValue());
        }
    }

    @Override
    public Boolean refundTrading(RefundRecord refundRecord) throws CommonException {
        // 获取微信支付的client对象
        WechatPayHttpClient client = WechatPayHttpClient.get(refundRecord.getEnterpriseId());
        //请求地址
        String apiPath = "/v3/refund/domestic/refunds";
        //请求参数
        Map<String, Object> params = MapUtil.<String, Object>builder()
                .put("out_refund_no", Convert.toStr(refundRecord.getRefundNo()))
                .put("out_trade_no", Convert.toStr(refundRecord.getTradingOrderNo()))
                .put("amount", MapUtil.<String, Object>builder()
                        .put("refund", NumberUtil.mul(refundRecord.getRefundAmount(), 100)) //本次退款金额
                        .put("total", NumberUtil.mul(refundRecord.getTotal(), 100)) //原订单金额
                        .put("currency", "CNY") //币种
                        .build())
                .build();
        WeChatResponse response;
        try {
            response = client.doPost(apiPath, params);
        } catch (Exception e) {
            log.error("调用微信接口出错！apiPath = {}, params = {}", apiPath, JSONUtil.toJsonStr(params), e);
            throw new CommonException(ErrorInfo.Code.TRADE_FAILED, NATIVE_REFUND_FAIL.getValue());
        }
        refundRecord.setRefundCode(Convert.toStr(response.getStatus()));
        refundRecord.setRefundMsg(response.getBody());
        if (response.isOk()) {
            JSONObject jsonObject = JSONUtil.parseObj(response.getBody());
            refundRecord.setRefundId(jsonObject.getStr("refund_id"));
            // SUCCESS：退款成功
            // CLOSED：退款关闭
            // PROCESSING：退款处理中
            // ABNORMAL：退款异常
            String status = jsonObject.getStr("status");
            if (StrUtil.equals(status, TradingConstant.WECHAT_REFUND_PROCESSING)) {
                refundRecord.setRefundStatus(RefundStatusEnum.SENDING);
            } else if (StrUtil.equals(status, TradingConstant.WECHAT_REFUND_SUCCESS)) {
                refundRecord.setRefundStatus(RefundStatusEnum.SUCCESS);
            } else {
                refundRecord.setRefundStatus(RefundStatusEnum.FAIL);
            }
            return true;
        }
        throw new CommonException(ErrorInfo.Code.TRADE_FAILED, NATIVE_REFUND_FAIL.getValue());
    }

    @Override
    public Boolean queryRefundTrading(RefundRecord refundRecord) throws CommonException {
        // 获取微信支付的client对象
        WechatPayHttpClient client = WechatPayHttpClient.get(refundRecord.getEnterpriseId());

        //请求地址
        String apiPath = StrUtil.format("/v3/refund/domestic/refunds/{}", refundRecord.getRefundNo());

        WeChatResponse response;
        try {
            response = client.doGet(apiPath);
        } catch (Exception e) {
            log.error("调用微信接口出错！apiPath = {}", apiPath, e);
            throw new CommonException(ErrorInfo.Code.TRADE_FAILED, TradingEnum.NATIVE_QUERY_REFUND_FAIL.getValue());
        }

        refundRecord.setRefundCode(Convert.toStr(response.getStatus()));
        refundRecord.setRefundMsg(response.getBody());
        if (response.isOk()) {
            JSONObject jsonObject = JSONUtil.parseObj(response.getBody());
            refundRecord.setRefundId(jsonObject.getStr("refund_id"));
            // SUCCESS：退款成功
            // CLOSED：退款关闭
            // PROCESSING：退款处理中
            // ABNORMAL：退款异常
            String status = jsonObject.getStr("status");
            if (StrUtil.equals(status, TradingConstant.WECHAT_REFUND_PROCESSING)) {
                refundRecord.setRefundStatus(RefundStatusEnum.SENDING);
            } else if (StrUtil.equals(status, TradingConstant.WECHAT_REFUND_SUCCESS)) {
                refundRecord.setRefundStatus(RefundStatusEnum.SUCCESS);
            } else {
                refundRecord.setRefundStatus(RefundStatusEnum.FAIL);
            }
            return true;
        }
        throw new CommonException(ErrorInfo.Code.TRADE_FAILED, TradingEnum.NATIVE_QUERY_REFUND_FAIL.getValue());
    }
}
