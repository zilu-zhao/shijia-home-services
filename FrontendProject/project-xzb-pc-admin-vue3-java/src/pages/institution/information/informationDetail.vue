<!-- 机构详情页 -->
<template>
  <div class="topBox bg-wt">
    <div class="title">基本信息</div>
    <div class="body">
      <div class="card">
        <div class="left">
          <div class="tag">
            <div class="label">企业名称</div>
            <div class="content">{{ formData.name ? formData.name : '-' }}</div>
          </div>
        </div>
        <!-- 暂时去掉后续加不加不确定 -->
        <!-- <div class="tag">
          <div class="label">法人身份证号</div>
          <div class="content">{{formData.idCardNo}}</div>
        </div> -->
        <div class="right">
          <div class="tag">
            <div class="label">登录账号</div>
            <div class="content">
              {{ formData.phone ? formData.phone : '-' }}
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="left">
          <div class="tag">
            <div class="label">服务分类</div>
            <div class="content">
              {{ formData.serveTypes ? formData.serveTypes : '-' }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="tag">
            <div class="label">服务技能</div>
            <div class="content">
              {{ formData.serveSkills ? formData.serveSkills : '-' }}
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="left">
          <div class="tag">
            <div class="label">服务城市</div>
            <div class="content">
              {{ formData.cityName ? formData.cityName : '-' }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="tag">
            <div class="label">服务地址</div>
            <div class="content">
              {{ formData.intentionScope ? formData.intentionScope : '-' }}
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="left">
          <div class="tag">
            <div class="label">接单状态</div>
            <div
              class="content status-dot"
              :class="`status-dot-${formData.canPickUp + 1}`"
            >
              {{
                formData.canPickUp === -1
                  ? '未设置'
                  : formData.canPickUp === 0
                  ? '休息中'
                  : '接单中'
              }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="tag">
            <div class="label">综合评分</div>
            <div class="content">
              {{ formData.score ? formData.score +'分' : '-' }}
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="left">
          <div class="tag">
            <div class="label">账号状态</div>
            <div
              class="content status-dot"
              :class="`status-dot-${formData.status === 0 ? 2 : 1}`"
            >
              {{ formData.status === 1 ? '冻结' : '正常' }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="tag">
            <div class="label">认证时间</div>
            <div class="content">
              {{
                formData.certificationTime ? formatDateTimeToDateTimeString(
                  new Date(formData.certificationTime)
                ) : '-'
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bodyBox bg-wt">
    <switchBar
      :data="tableBar"
      :currentId="currentId"
      @changeId="changeId"
    ></switchBar>
    <!-- 认证信息 -->
    <div class="authentication" v-if="isActive === 1">
      <div class="leftBox">
        <div class="authTag">
          <div class="authLabel">企业名称</div>
          <div class="authContent">
            {{ authData.name ? authData.name : '-' }}
          </div>
        </div>
        <div class="authTag">
          <div class="authLabel">法定代表人姓名</div>
          <div class="authContent">
            {{ authData.legalPersonName ? authData.legalPersonName : '-' }}
          </div>
        </div>
        <div class="authImgBox">
          <div class="authImgTag">
            <div class="authLabel">营业执照</div>
            <t-image-viewer :images="[authData.businessLicense]" v-if="authData.businessLicense">
              <template #trigger="{ open }">
                <div class="tdesign-demo-image-viewer__ui-image">
                  <img
                    alt="test"
                    :src="authData.businessLicense"
                    class="tdesign-demo-image-viewer__ui-image--img"
                  />
                  <div
                    class="tdesign-demo-image-viewer__ui-image--hover"
                    @click="open"
                  >
                    <span><ZoomInIcon size="1.8em" /></span>
                  </div>
                </div>
              </template>
            </t-image-viewer>
            <div v-else>-</div>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="authTag">
          <div class="authLabel">统一社会信用代码</div>
          <div class="authContent">
            {{ authData.idNumber ? authData.idNumber : '-' }}
          </div>
        </div>
        <div class="authTag">
          <div class="authLabel">身份证号</div>
          <div class="authContent">
            {{
              authData.legalPersonIdCardNo ? authData.legalPersonIdCardNo : '-'
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="authentication" v-if="isActive === 2">
      <div class="leftBox">
        <div class="authTag">
          <div class="authLabel">户名</div>
          <div class="authContent">
            {{ accountData.name ? accountData.name : '-' }}
          </div>
        </div>
        <div class="authTag">
          <div class="authLabel">开户行</div>
          <div class="authContent" v-if="accountData.district || accountData.city || accountData.province">
            {{
              accountData.province === accountData.city
                ? ''
                : accountData.province
            }}
            {{ accountData.city }} {{ accountData.district }}
          </div>
          <div class="authContent" v-else>-</div>
        </div>
        <div class="authTag">
          <div class="authLabel">银行账号</div>
          <div class="authContent">
            {{ accountData.account ? accountData.account : '-' }}
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="authTag">
          <div class="authLabel">银行</div>
          <div class="authContent">
            {{ accountData.bankName ? accountData.bankName : '-' }}
          </div>
        </div>
        <div class="authTag">
          <div class="authLabel">网点</div>
          <div class="authContent">
            {{ accountData.branch ? accountData.branch : '-' }}
          </div>
        </div>
        <div class="authImgBox">
          <div class="authImgTag">
            <div class="authLabel">开户证明</div>
            <t-image-viewer :images="[accountData.accountCertification]" v-if="accountData.accountCertification">
              <template #trigger="{ open }">
                <div class="tdesign-demo-image-viewer__ui-image">
                  <img
                    alt="test"
                    :src="accountData.accountCertification"
                    class="tdesign-demo-image-viewer__ui-image--img"
                  />
                  <div
                    class="tdesign-demo-image-viewer__ui-image--hover"
                    @click="open"
                  >
                    <span><ZoomInIcon size="1.8em" /></span>
                  </div>
                </div>
              </template>
            </t-image-viewer>
            <div v-else>-</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <tableList
      v-show="isActive !== 1 && isActive !== 2"
      :list-data="listData"
      :pagination="pagination"
      :isActive="isActive"
      @handleSortChange="handleSortChange"
      @onPageChange="onPageChange"
    ></tableList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import switchBar from '@/components/switchBar/switchBartop.vue'
import { formatDateTimeToDateTimeString } from '@/utils/date'
import {
  servicePersonDetail,
  servicePersonItemList,
  serviceInstitutionAuditDetail,
  servicePersonBankDetail,
  servicePersonData
} from '@/api/service'
import { useRoute } from 'vue-router'
import { ZoomInIcon } from 'tdesign-icons-vue-next'
import tableList from './components/TableList.vue' // 表格
// 引用正则
import { MessagePlugin } from 'tdesign-vue-next'
import { forEach } from 'lodash'
import { Score } from '@/constants'
const isActive = ref() // 当前选中的tab
const route = useRoute()
const { id } = route.params
const formData = ref({
  name: '',
  serveTypes: '',
  cityName: '',
  canPickUp: null,
  status: null,
  accountLockReason: '',
  phone: '',
  serveSkills: '',
  serveAddress: '',
  score: '',
  certificationTime: '',
  intentionScope: ''
})
// 服务数据
const requestServiceData = ref({
  isAsc1: false,
  orderBy1: 'realServeEndTime',
  pageNo: 1,
  pageSize: 10,
  serveProviderId: id,
  userType: 3
}) // 请求参数
// 服务人员请求数据
const requestPerson = ref({
  institutionId: id,
  isAsc1: false,
  orderBy1: 'createTime',
  pageNo: 1,
  pageSize: 10
}) // 请求参数
const listData = ref([]) // 表格数据
const currentId = ref() // 当前选中的id
const pagination = reactive({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
}) // 分页数据
// 认证信息数据
const authData = ref({
  name: '',
  legalPersonName: '',
  idNumber: '',
  legalPersonIdCardNo: '',
  businessLicense: ''
})
// 账户信息
const accountData = ref({
  name: '',
  province: '',
  city: '',
  district: '',
  bankName: '',
  branch: '',
  account: '',
  accountCertification: ''
})
// tab数据
const tableBar = [
  {
    id: 1,
    name: '认证信息'
  },
  {
    id: 2,
    name: '账户信息'
  },
  {
    id: 3,
    name: '服务数据'
  },
  {
    id: 4,
    name: '服务人员信息'
  }
]
// 生命周期
onMounted(() => {
  isActive.value = 1
  if (id) {
    getData(id)
    getInstitutionAuditDetail(id)
  }
})
watch(
  () => route.query,
  (val) => {
    isActive.value = 1
    currentId.value = 1
    if (id) {
      getData(id)
      getInstitutionAuditDetail(id)
    }
  }
)
// 获取接口数据
const getData = async (val) => {
  await servicePersonDetail(val).then((res) => {
    if (res.code == 200) {
      formData.value = res.data
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 获取服务人员列表数据
const getPersonList = async () => {
  await servicePersonItemList(requestPerson.value).then((res) => {
    if (res.code == 200) {
      listData.value = res.data.list
      pagination.total = res.data.total
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 获取机构认证信息
const getInstitutionAuditDetail = async (val) => {
  await serviceInstitutionAuditDetail(val).then((res) => {
    if (res.code == 200) {
      authData.value = res.data
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 获取账户信息
const getAccountData = async (val) => {
  await servicePersonBankDetail(val).then((res) => {
    if (res.code == 200) {
      accountData.value = res.data
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 翻页
const onPageChange = (val) => {
  if (isActive.value === 4) {
    pagination.defaultCurrent = val.defaultCurrent
    requestPerson.value.pageNo = val.defaultCurrent
    pagination.defaultPageSize = val.defaultPageSize
    requestPerson.value.pageSize = val.defaultPageSize
    getPersonList()
  } else {
    pagination.defaultCurrent = val.defaultCurrent
    requestServiceData.value.pageNo = val.defaultCurrent
    pagination.defaultPageSize = val.defaultPageSize
    requestServiceData.value.pageSize = val.defaultPageSize
    serviceData()
  }
}
// 排序
const handleSortChange = (val) => {
  if (isActive.value === 4) {
    forEach(val, (item) => {
      if (item.sortBy === 'createTime') {
        requestPerson.value.isAsc1 = item.descending === true ? false : true
      }
    })
    getPersonList()
  }
}
// 切换tab
const changeId = (val) => {
  isActive.value = val
  currentId.value = val
  switch (val) {
    case 1:
      getInstitutionAuditDetail(id)
      break
    case 2:
      getAccountData(id)
      break
    case 3:
      pagination.defaultCurrent = 1
      pagination.defaultPageSize = 10
      serviceData()
      break
    case 4:
      pagination.defaultCurrent = 1
      pagination.defaultPageSize = 10
      getPersonList()
      break
  }
}
const serviceData = async () => {
  await servicePersonData(requestServiceData.value).then((res) => {
    
    if (res.code == 200) {
      listData.value = res.data.list
      pagination.total = res.data.total
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
</script>

<style lang="less" scoped>
.topBox {
  padding: 36px 49px;
  margin-bottom: 25px;
  .title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-bk1);
    margin-bottom: 30px;
  }
  .body {
    // display: flex;
    width: 100%;
    .card {
      display: flex;
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 6px;
      }
    }
    .right {
      padding-left: 50px;
    }
    .left,
    .right {
      width: 50%;
      .tag {
        display: flex;

        .label {
          min-width: 56px;
          height: 20px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 14px;
          color: var(--color-bk3);
          margin-right: 114px;
          letter-spacing: 0;
          text-align: justify;
        }
        .content {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 14px;
          color: var(--color-bk1);
          letter-spacing: 0;
          text-align: justify;
        }
      }
    }
  }
}
.bodyBox {
  padding: 24px 20px 30px 23px;
  min-height: 56vh;
  :deep(.headBox) {
    padding-bottom: 12px;
    margin-bottom: 19.5px;
    // tab
    .sw-box {
      .title {
        padding-left: 3px;
        padding-right: 3px;
        margin-right: 36px;
      }
      .line {
        padding-left: 3px;
        padding-right: 3px;
        &::before {
          bottom: -12px;
        }
      }
    }
  }
  .authentication {
    padding-top: 20px;
    display: flex;
    padding-left: 26px;
    // 宽占满容器
    .leftBox,
    .rightBox {
      width: 50%;
    }
    .authTag {
      display: flex;
      margin-bottom: 30px;
      .authLabel {
        width: 112px;
        margin-right: 36px;
        color: var(--color-bk3);
      }
      .authContent {
        color: var(--color-bk1);
      }
    }
    .authImgBox {
      .authImgTag {
        width: 48%;
        margin-bottom: 27.5px;
        display: flex;
        &:last-child {
          margin-bottom: 0;
        }
        .authLabel {
          margin-bottom: 25px;
          width: 122px;
          margin-right: 25px;
          color: var(--color-bk3);
        }
        :deep(.tdesign-demo-image-viewer__ui-image) {
          width: 60px;
          height: 60px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
        }
      }
    }
  }
  :deep(.tableBoxs) {
    margin: 0;
  }
}
</style>
