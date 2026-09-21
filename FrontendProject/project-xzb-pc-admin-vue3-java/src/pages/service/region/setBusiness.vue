<!-- 调度配置页 -->
<template>
  <div class="bg-wt contentBox">
    <div class="bodybox bgTable">
      <div class="topBox">
        <div class="cityBox">
          <span class="label"
            >区域名称：<span>{{ formData?.name }}</span></span
          >
          <a class="btn-dl" @click="handleRule">调度规则说明</a>
        </div>
      </div>
      <div class="bodyBox">
        <t-form
          ref="form"
          label-align="top"
          :rules="rules"
          :data="requestData"
          @submit="onSubmit"
        >
          <div class="title">全局策略</div>
          <div class="cardBox">
            <div class="left">
              <t-form-item name="staffReceiveOrderMax">
                <span class="label"
                  ><span class="star">*</span>【个体】接单量限制值
                  <div class="description">
                    <span class="beizhu"></span>
                    <span class="hover"
                      >（个体）接单量限制值，是个体服务人员只能接受并执行的订单总量最大值。当进行中订单量+已接单未执行订单量=限制值，该人将无法继续接单。</span
                    >
                  </div></span
                >
                <t-input
                  class="form-item-content"
                  v-model.number="requestData.staffReceiveOrderMax"
                  placeholder="请输入"
                  :style="{ minWidth: '134px' }"
                  suffix="单"
                  clearable
                />
              </t-form-item>
            </div>
            <div class="right">
              <t-form-item name="institutionReceiveOrderMax">
                <span class="label"
                  ><span class="star">*</span>【企业】接单量限制值
                  <div class="description">
                    <span class="beizhu"></span>
                    <span class="hover"
                      >（企业）接单量限制值，是企业只能接受并执行的订单总量最大值。当进行中订单量+已接单未执行订单量=限制，该人将无法继续接单。</span
                    >
                  </div></span
                >
                <t-input
                  class="form-item-content"
                  v-model.number="requestData.institutionReceiveOrderMax"
                  placeholder="请输入"
                  :style="{ minWidth: '134px' }"
                  suffix="单"
                  clearable
                />
              </t-form-item>
            </div>
          </div>
          <div class="title">抢单策略</div>
          <div class="cardBox">
            <div class="left">
              <t-form-item name="staffServeRadius">
                <span class="label"
                  ><span class="star">*</span>【个体】服务范围半径
                  <div class="description">
                    <span class="beizhu"></span>
                    <span class="hover"
                      >（个体）服务区域半径，是以服务个体所设置地址为中心点，能够辐射的服务范围的半径公里数。定位位置与服务地址超出服务范围，服务个体无法抢单和被派单</span
                    >
                  </div></span
                >
                <t-input
                  class="form-item-content"
                  v-model.number="requestData.staffServeRadius"
                  placeholder="请输入"
                  :style="{ minWidth: '134px' }"
                  suffix="公里"
                  clearable
                />
              </t-form-item>
              <t-form-item name="seizeTimeoutInterval">
                <span class="label"
                  ><span class="star">*</span>抢单超时时间</span
                >
                <t-input
                  class="form-item-content"
                  placeholder="请输入"
                  suffix="分钟"
                  v-model.number="requestData.seizeTimeoutInterval"
                  :style="{ minWidth: '134px' }"
                  clearable
                />
              </t-form-item>
            </div>
            <div class="right">
              <t-form-item name="institutionServeRadius">
                <span class="label"
                  ><span class="star">*</span>【企业】服务范围半径
                  <div class="description">
                    <span class="beizhu"></span>
                    <span class="hover"
                      >（个体）服务区域半径，是以服务企业所设置地址为中心点，能够辐射的服务范围的半径公里数。定位位置与服务地址超出服务范围，服务个体无法抢单和被派单</span
                    >
                  </div></span
                >
                <t-input
                  class="form-item-content"
                  v-model.number="requestData.institutionServeRadius"
                  placeholder="请输入"
                  :style="{ minWidth: '134px' }"
                  suffix="公里"
                  clearable
                />
              </t-form-item>
            </div>
          </div>
          <div class="title">派单策略</div>
          <div class="cardBox">
            <div class="left">
              <t-form-item>
                <span class="label"
                  ><span class="star">*</span>【个体】服务范围半径
                  <div class="description">
                    <span class="beizhu"></span>
                    <span class="hover"
                      >（个体）服务区域半径，是以服务个体所设置地址为中心点，能够辐射的服务范围的半径公里数。定位位置与服务地址超出服务范围，服务个体无法抢单和被派单</span
                    >
                  </div></span
                >
                <t-input
                  class="form-item-content"
                  v-model.number="one"
                  placeholder="请输入"
                  disabled
                  :style="{ minWidth: '134px' }"
                  suffix="公里"
                  clearable
                />
              </t-form-item>
              <t-form-item name="dispatchStrategy">
                <span class="label"
                  ><span class="star">*</span>指派规则
                  <div class="short4 description">
                    <span class="beizhu"></span>
                    <span class="hover"
                      >1、距离优先：<br />
                      优先按照距服务地址距离由近到远排列，如多人距离相同，则再按照接单数最少优先原则。<br />
                      2、高评分优先：<br />
                      优先按照评分由高到低排列，如多人评分值相同，则再按照当前接单量最少者优先原则。<br />
                      3、接单量少优先：<br />
                      优先按照服务接单数由少到多排列，如多人接单数相同，则再按照高评分者优先原则。</span
                    >
                  </div></span
                >
                <t-radio-group v-model="requestData.dispatchStrategy">
                  <t-radio :value="1">距离优先</t-radio>
                  <t-radio :value="2">评分优先</t-radio>
                  <t-radio :value="3">接单量优先</t-radio>
                </t-radio-group>
              </t-form-item>
            </div>
            <div class="right">
              <t-form-item>
                <span class="label"
                  ><span class="star">*</span>【企业】服务范围半径
                  <div class="description">
                    <span class="beizhu"></span>
                    <span class="hover"
                      >（个体）服务区域半径，是以服务企业所设置地址为中心点，能够辐射的服务范围的半径公里数。定位位置与服务地址超出服务范围，服务个体无法抢单和被派单</span
                    >
                  </div></span
                >
                <t-input
                  class="form-item-content"
                  v-model.number="one"
                  placeholder="请输入"
                  disabled
                  :style="{ minWidth: '134px' }"
                  suffix="公里"
                  clearable
                />
              </t-form-item>
              <t-form-item name="dispatchPerRoundInterval">
                <span class="label"
                  ><span class="star">*</span>轮询等待时间
                  <div class="short6 description">
                    <span class="beizhu"></span>
                    <span class="hover">每一轮派单等待接单所需要的时间</span>
                  </div></span
                >
                <t-input
                  class="form-item-content"
                  placeholder="请输入"
                  suffix="秒"
                  v-model.number="requestData.dispatchPerRoundInterval"
                  :style="{ minWidth: '134px' }"
                  clearable
                />
              </t-form-item>
            </div>
          </div>
          <div class="footBox">
            <div class="updateInfo" @click="handleBack">
              <span class="bt bt-grey">取消</span>
            </div>
            <button class="bt updateInfo">保存</button>
          </div>
        </t-form>
      </div>
    </div>
  </div>
  <ruleDialog :visible="visible" @close="visible = false" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { businessConfig } from './model'
import {
  validateNumber100,
  validateNumber1440,
  validateNumber1000,
  validateNumber20000,
  validateNumber100s
} from '@/utils/validate'
import { cityList } from './city'
import { ValidateResultContext } from 'tdesign-vue-next'
import { servicePersonItemById, servicePersonItemEdit } from '@/api/service'
import ruleDialog from './components/ruleDialog.vue'
const route = useRoute()
const router = useRouter()
const { id } = route.params
const visible = ref(false)
const formData = ref<businessConfig>({
  dispatchPerRoundInterval: 180,
  institutionReceiveOrderMax: 100,
  institutionServeRadius: 200,
  seizeTimeoutInterval: 60,
  staffReceiveOrderMax: 10,
  staffServeRadius: 50,
  id: '1',
  name: null,
  dispatchStrategy: 1,
  cityCode: null
})
const one = ref(100)
// 更新调度配置数据
const requestData = ref({
  dispatchPerRoundInterval: 0,
  institutionReceiveOrderMax: 0,
  institutionServeRadius: 0,
  seizeTimeoutInterval: 0,
  staffReceiveOrderMax: 0,
  staffServeRadius: 0,
  dispatchStrategy: 0,
  id: id,
  cityCode: null
})

// 获取接口数据
const fetchData = async (val) => {
  await servicePersonItemById(val)
    .then((res) => {
      if (res.code === 200) {
        formData.value = res.data
        cityList.forEach((item) => {
          item.children.find((item2) => {
            if (item2.value === res.data.cityCode) {
              formData.value.name = item2.label
            }
          })
        })
        requestData.value.dispatchPerRoundInterval =
          formData.value.dispatchPerRoundInterval
        requestData.value.institutionReceiveOrderMax =
          formData.value.institutionReceiveOrderMax
        requestData.value.institutionServeRadius =
          formData.value.institutionServeRadius
        requestData.value.seizeTimeoutInterval =
          formData.value.seizeTimeoutInterval
        requestData.value.staffReceiveOrderMax =
          formData.value.staffReceiveOrderMax
        requestData.value.staffServeRadius = formData.value.staffServeRadius
        requestData.value.id = formData.value.id
        requestData.value.dispatchStrategy = formData.value.dispatchStrategy
        requestData.value.cityCode = formData.value.cityCode
      } else {
        MessagePlugin.error(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const onSubmit = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    updateData(requestData.value)
  } else {
    MessagePlugin.error('请检查输入项')
  }
}
// 更新调度配置数据
const updateData = async (val) => {
  await servicePersonItemEdit(val)
    .then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('更新成功')
        fetchData(id)
      } else {
        MessagePlugin.error(res.data.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const rules = {
  staffReceiveOrderMax: [
    { required: true, message: '请输入【个体】接单量限制值', trigger: 'blur' },
    {
      validator: validateNumber100,
      trigger: 'blur',
      message: '请输入1-100之间整数'
    }
  ],
  staffServeRadius: [
    { required: true, message: '请输入【个体】服务范围半径', trigger: 'blur' },
    {
      validator: validateNumber100s,
      trigger: 'blur',
      message: '请输入0-100之间整数'
    }
  ],
  institutionReceiveOrderMax: [
    { required: true, message: '请输入【企业】接单量限制值', trigger: 'blur' },
    {
      validator: validateNumber1000,
      trigger: 'blur',
      message: '请输入1-1000之间整数'
    }
  ],
  institutionServeRadius: [
    { required: true, message: '请输入【企业】服务范围半径', trigger: 'blur' },
    {
      validator: validateNumber1000,
      trigger: 'blur',
      message: '请输入1-1000之间整数'
    }
  ],
  seizeTimeoutInterval: [
    { required: true, message: '请输入抢单超时时间', trigger: 'blur' },
    {
      validator: validateNumber1440,
      trigger: 'blur',
      message: '请输入1-1440之间整数'
    }
  ],
  dispatchPerRoundInterval: [
    { required: true, message: '请输入轮询等待时间', trigger: 'blur' },
    {
      validator: validateNumber20000,
      trigger: 'blur',
      message: '请输入1-20000之间整数'
    }
  ]
}
const handleRule = () => {
  visible.value = true
}
// 返回上一级
const handleBack = () => {
  router.push('/service/region')
}
// 生命周期
onMounted(() => {
  fetchData(id) // 获取接口数据
})
watch(
  () => route.query,
  (val) => {
    fetchData(id)
  }
)
</script>

<style lang="less" scoped>
.contentBox {
  padding: 80px 100px 50px;
  min-height: 674px;
  .bodybox {
    .topBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cityBox {
        width: 100%;
        color: var(--color-bk3);
        display: flex;
        justify-content: space-between;
        .label {
          color: var(--color-bk3);
          span {
            color: var(--color-bk1);
            margin-left: 6px;
          }
        }
      }
      .newButton {
        width: 88px;
      }
    }
    .bodyBox {
      margin-top: 23px;
      .title {
        height: 22px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        font-size: 18px;
        color: var(--color-bk1);
        line-height: 22px;
        margin-bottom: 30px;
      }
      .cardBox {
        display: flex;
        margin-bottom: 10px;
        .left {
          width: 48%;
          height: 100%;
          background-color: #fff;
          margin-right: 110px;
          .upbutton {
            margin-top: 24px;
          }
        }
      }
      .right {
        width: 48%;
        height: 100%;
        background-color: #fff;
        :deep(.t-button .t-button__text) {
          color: var(--color-bk2);
        }
      }
      .footBox {
        margin-top: 30px;
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
:deep(.t-form__label--required label::before) {
  display: none;
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
.label {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .star {
    display: inline-block;
    margin-right: var(--td-comp-margin-xs);
    color: var(--td-error-color);
    line-height: var(--td-line-height-body-medium);
    content: '*';
  }
  .description {
    display: flex;
    margin-left: 4px;
    .beizhu {
      background-image: url('@/assets/icon_beizhu@2x.png');
      background-size: 100% 100%;
      width: 18px;
      height: 18px;
      display: inline-block;
    }
    .hover {
      display: none;
      position: absolute;
      // 位于div上方中间位置
      width: 334px;
      top: 30px;
      left: 0;
      font-size: 12px;
      background-color: #fff;
      line-height: 17px;
      box-shadow: 0 0 8px 1px rgba(34, 40, 51, 0.12);
      border-radius: 4px;
      padding: 15px;
      color: var(--color-bk1);
      word-break: break-all;
      z-index: 100;

      &::after {
        content: '';
        position: absolute;
        top: -5px;
        left: 47.5%;
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
        background-color: #fff;
        // box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.05);
      }
    }

    &:hover {
      .beizhu{
        background-image: url('@/assets/icon_beizhu_sel@2x.png');
        background-size: 100% 100%;
      }
      .hover {
        display: block;
      }
    }
  }
  .LongL {
    .hover {
      left: 17%;
    }
  }
  .short6 {
    .hover {
      left: -57px;
    }
  }
  .short4 {
    .hover {
      left: -86px;
    }
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
</style>
