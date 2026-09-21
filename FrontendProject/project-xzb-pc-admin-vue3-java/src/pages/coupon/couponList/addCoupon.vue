<!-- 调度配置页 -->
<template>
  <div class="contentBox">
    <div class="bodybox bgTable">
      <div class="bodyBox">
        <t-form
          ref="form"
          :rules="rules"
          :data="formData"
          @submit="onSubmit"
          :label-width="96"
        >
          <div class="box bg-wt">
            <div class="title">基本信息</div>
            <div class="cardBox">
              <div class="left">
                <t-form-item name="name" label="活动名称：">
                  <t-input
                    class="form-item-content"
                    v-model="formData.name"
                    placeholder="请输入"
                    :maxlength="20"
                    show-limit-number
                    clearable
                  />
                </t-form-item>
                <t-form-item name="amountCondition" label="满额限制：">
                  <t-input
                    class="form-item-content"
                    v-model.number="formData.amountCondition"
                    placeholder="请输入"
                    suffix="元"
                    clearable
                  />
                </t-form-item>
              </div>
              <div class="right">
                <t-form-item name="type" label="优惠券类型：">
                  <t-radio-group v-model="formData.type">
                    <t-radio :value="1">满减</t-radio>
                    <t-radio :value="2">折扣</t-radio>
                  </t-radio-group>
                </t-form-item>
                <t-form-item
                  name="discountAmount"
                  label="抵扣金额："
                  v-if="formData.type === 1"
                >
                  <t-input
                    class="form-item-content"
                    v-model.number="formData.discountAmount"
                    placeholder="请输入"
                    suffix="元"
                    clearable
                  />
                </t-form-item>
                <t-form-item
                  name="discountRate"
                  label="抵扣比例："
                  v-if="formData.type === 2"
                >
                  <t-input
                    class="form-item-content"
                    v-model.number="formData.discountRate"
                    placeholder="请输入"
                    suffix="%"
                    clearable
                  />
                </t-form-item>
              </div>
            </div>
          </div>
          <div class="box bg-wt">
            <div class="title">发放规则</div>
            <div class="cardBox mb-0">
              <div class="left">
                <t-form-item name="distributeTime" label="发放时间：">
                  <t-date-range-picker
                    v-model="formData.distributeTime"
                    placeholder="日期"
                    clearable
                    enable-time-picker
                  />
                </t-form-item>
                <t-form-item name="totalNum" label="发放数量：">
                  <t-input
                    class="form-item-content"
                    placeholder="请输入"
                    suffix="张"
                    v-model.number="formData.totalNum"
                    clearable
                  />
                </t-form-item>
              </div>
              <div class="right">
                <t-form-item name="validityDays" label="使用期限：">
                  <t-input
                    class="form-item-content"
                    placeholder="请输入"
                    suffix="日内有效"
                    v-model.number="formData.validityDays"
                    clearable
                  />
                </t-form-item>
              </div>
            </div>
          </div>
          <div class="footBox bg-wt">
            <div class="updateInfo" @click="handleBack">
              <span class="bt bt-grey">返回</span>
            </div>
            <button class="bt updateInfo">提交</button>
          </div>
        </t-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import {
  validateNumber100,
  validateNumber1440,
} from '@/utils/validate'
import { ValidateResultContext } from 'tdesign-vue-next'
import { saveCoupon, getCouponDetail } from '@/api/coupon'
const route = useRoute()
const router = useRouter()
const { id } = route.params
// 表单数据
const formData = ref({
  discountRate: null,
  discountAmount: null,
  amountCondition: null,
  type: 1,
  name: '',
  distributeTime: [],
  validityDays: null,
  totalNum: null,
  id: id ? id : null
})
// 更新调度配置数据
const requestData = ref({
  discountRate: null,
  discountAmount: null,
  amountCondition: null,
  type: 1,
  name: '',
  distributeEndTime: null,
  distributeStartTime: null,
  validityDays: null,
  totalNum: null,
  id: id ? id : null
})

// 获取接口数据
const fetchData = async (val) => {
  await getCouponDetail(val)
    .then((res) => {
      if (res.code === 200) {
        formData.value = res.data
        formData.value.amountCondition = parseInt(res.data.amountCondition)
        formData.value.discountAmount = parseInt(res.data.discountAmount)
        formData.value.distributeTime = [
          res.data.distributeStartTime,
          res.data.distributeEndTime
        ]
      } else {
        MessagePlugin.error(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 提交
const onSubmit = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    requestData.value.discountRate = formData.value.discountRate
    requestData.value.discountAmount = formData.value.discountAmount
    requestData.value.amountCondition = formData.value.amountCondition
    requestData.value.type = formData.value.type
    requestData.value.name = formData.value.name
    requestData.value.distributeEndTime = formData.value.distributeTime[1]
    requestData.value.distributeStartTime = formData.value.distributeTime[0]
    requestData.value.validityDays = formData.value.validityDays
    requestData.value.totalNum = formData.value.totalNum
    updateData(requestData.value)
  } else {
    MessagePlugin.error('请检查输入项')
  }
}
// 更新调度配置数据
const updateData = async (val) => {
  await saveCoupon(val)
    .then((res) => {
      if (res.code === 200) {
        if (!id) {
          MessagePlugin.success('创建成功')
          router.push('/coupon/couponList')
        } else {
          MessagePlugin.success('更新成功')
          fetchData(id)
        }
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const rules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  amountCondition: [
    { required: true, message: '请输入满额限制', trigger: 'blur' }
  ],
  discountAmount: [
    { required: true, message: '请输入抵扣金额', trigger: 'blur' }
  ],
  discountRate: [
    { required: true, message: '请输入折扣率', trigger: 'blur' },
    {
      validator: validateNumber100,
      trigger: 'blur',
      message: '请输入1-100之间整数'
    }
  ],
  distributeTime: [
    { required: true, message: '请选择发放时间', trigger: 'change' }
  ],
  validityDays: [
    { required: true, message: '请输入使用期限', trigger: 'blur' },
    {
      validator: validateNumber1440,
      trigger: 'blur',
      message: '请输入1-1440之间整数'
    }
  ],
  totalNum: [{ required: true, message: '请输入发放数量', trigger: 'blur' }]
}

// 返回上一级
const handleBack = () => {
  router.push('/coupon/couponList')
}
// 生命周期
onMounted(() => {
  if (id) {
    fetchData(id)
  }
})
// 刷新页面
watch(
  () => route.query,
  () => {
    if (id) {
      fetchData(id)
    }
  }
)
</script>

<style lang="less" scoped>
.contentBox {
  // padding: 80px 100px 50px;
  min-height: 674px;
  .bodybox {
    .bodyBox {
      margin-top: 23px;
      .box {
        &:first-child {
          margin-bottom: 0;
        }
        padding-left: 53px;
        padding-right: 53px;
        padding-top: 37px;
        .title {
          height: 22px;
          font-family: PingFangSC-Medium;
          font-weight: 600;
          font-size: 18px;
          color: var(--color-bk1);
          line-height: 22px;
          margin-bottom: 30px;
        }
        .cardBox {
          display: flex;
          margin-bottom: 20px;
          .left {
            margin-right: 25px;
          }
          .right {
            margin-left: 25px;
          }
          .left,
          .right {
            width: calc(50% - 50px);
            height: 100%;
            background-color: #fff;
            .upbutton {
              margin-top: 24px;
            }
          }
        }
      }
      .footBox {
        padding-top: 37px;
        padding-bottom: 37px;
        display: flex;
        justify-content: center;
        .updateInfo {
          width: 60px;
          margin-right: 16px;
        }
      }
    }
    :deep(.t-form__item) {
      margin-bottom: 40px;
    }
    .regionService {
      margin-top: 26px;
    }
  }
}

:deep(.t-form__controls-content) {
  display: block;
}
:deep(.t-radio-group .t-radio) {
  margin-right: 30px;
  &:last-child {
    margin-right: 0;
  }
}
:deep(.t-radio-group.t-radio-group__outline) {
  line-height: 32px;
  height: 32px;
}
:deep(.t-input .t-input__suffix:not(:empty)) {
  height: 22px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
}
.mb-0 {
  margin-bottom: 0 !important;
}
</style>
