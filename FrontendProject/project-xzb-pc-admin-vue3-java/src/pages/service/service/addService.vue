<!-- 添加服务项页 -->
<template>
  <div class="bg-wt contentBox">
    <div class="bodybox">
      <t-form
        ref="form"
        label-align="top"
        :rules="rules"
        :data="formData"
        @submit="onSubmit"
      >
        <div class="topBox">
          <div class="leftBox">
            <t-form-item label="服务名称" name="name">
              <t-input
                v-model="formData.name"
                class="form-item-content"
                placeholder="请输入"
                :style="{ minWidth: '134px' }"
                clearable
                @change="(e)=>changeName(e)"
              />
            </t-form-item>
            <t-form-item label="参考服务单价" name="referencePrice">
              <t-input
                v-model="formData.referencePrice"
                class="form-item-content"
                placeholder="请输入"
                :style="{ minWidth: '134px' }"
                clearable
                @change="(e)=>changePrice(e)"
              />
            </t-form-item>
            <t-form-item label="排序" name="sortNum">
              <t-input-number
                theme="column"
                :min="0"
                :max="999"
                v-model="formData.sortNum"
              ></t-input-number>
            </t-form-item>
            <t-form-item label="服务图标" name="serveItemIcon">
              <t-upload
                ref="uploadRef1"
                v-model="formData.serveItemIcon"
                :action="actions"
                :is-batch-upload="true"
                tips="请上传png格式图片，尺寸：114px*114px，在200k以内"
                theme="image"
                accept="image/*"
                :headers="{
                  Authorization: token
                }"
                @validate="onValidate"
                @fail="handleFail"
                :sizeLimit="10240"
                :allow-upload-duplicate-file="true"
                @success="(e) => handleSuccess(e, 1)"
              >
              </t-upload>
            </t-form-item>
          </div>
          <div class="rightBox">
            <t-form-item label="服务类型" name="serveTypeId">
              <t-select
                v-model="formData.serveTypeId"
                class="form-item-content"
                :options="typeSelect"
                placeholder="请选择"
                clearable
              />
            </t-form-item>
            <t-form-item label="服务单位" name="unit" class="unit">
              <t-select
                v-model="formData.unit"
                class="form-item-content"
                :options="UNIT"
                placeholder="请选择"
                clearable
                @change="(e)=>changeUnit(e)"
              />
            </t-form-item>
            <t-form-item label="服务图片" name="img">
              <t-upload
                ref="uploadRef1"
                :action="actions"
                v-model="formData.img"
                :is-batch-upload="true"
                tips="请上传png格式图片，尺寸：750px*620px，在5M以内"
                theme="image"
                accept="image/*"
                @validate="onValidate"
                @fail="handleFail"
                :sizeLimit="10240"
                :headers="{
                  Authorization: token
                }"
                :allow-upload-duplicate-file="true"
                @success="(e) => handleSuccess(e, 2)"
              >
              </t-upload>
            </t-form-item>
          </div>
        </div>
        <div class="bottomBox">
          <t-form-item label="服务描述" name="description">
            <t-textarea
              v-model="formData.description"
              class="form-item-content description"
              placeholder="请输入"
              :maxlength="200"
            />
          </t-form-item>
          <t-form-item label="服务详情长图" name="detailImg">
            <t-upload
              ref="uploadRef1"
              :action="actions"
              v-model="formData.detailImg"
              :is-batch-upload="true"
              tips="请上传png格式图片，尺寸：宽750px，高度不限，在20M以内"
              theme="image"
              accept="image/*"
              :size-limit="20480"
              :headers="{
                Authorization: token
              }"
              @validate="onValidate"
              @fail="handleFail"
              :allow-upload-duplicate-file="true"
              @success="(e) => handleSuccess(e, 3)"
            >
            </t-upload>
          </t-form-item>
          <div class="footBox">
            <div class="updateInfo" @click="handleBack">
              <span class="bt bt-grey">取消</span>
            </div>
            <div class="updateInfo">
              <span :class="isPreview ?'bt' : 'bt-grey bt-dis'" @click="handlePreview">预览</span>
            </div>
            <button class="bt updateInfo">保存</button>
          </div>
        </div>
      </t-form>
    </div>
  </div>
  <previewPopup
  :previewData="previewData"
  :previewVisible="previewVisible"
  @handleClose="handleClose"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import {
  serviceTypeSimpleList,
  serviceItemAdd,
  serviceItemById,
  serviceItemEdit
} from '@/api/service'
import previewPopup from './components/previewPopup.vue'
import { useRouter, useRoute } from 'vue-router'
import { UNIT } from '@/constants'
// 引用正则
import { validateText5 } from '@/utils/validate'
import { MessagePlugin } from 'tdesign-vue-next'
const previewData = reactive({
  title: '',
  img:'',
  detailImg: '',
  price: '',
  unit: 0,
}) // 预览数据
const formData = ref({
  serveTypeId: '',
  img: [],
  description: '',
  referencePrice: null,
  unit: '',
  serveItemIcon: [],
  detailImg: [],
  name: '',
  sortNum: ''
})//表单数据
const router = useRouter()
const route = useRoute()
const previewVisible = ref(false) // 预览弹窗
const { id } = route.params
const form = ref(null) // 表单
const typeSelect = ref([]) // 服务类型下拉框数据
const actions = '/api/publics/storage/upload' // 上传的地址
// 显示的图片
// 默认图片
const token = localStorage.getItem('xzb') // 获取token
const uploadRef1 = ref() // 上传图片
// 生命周期
onMounted(() => {
  getServiceTypeSimpleList() // 获取服务类型下拉框数据
  // 编辑时获取数据
  id ? getData(id) : null
})
// 获取接口数据
const getData = async (val) => {
  await serviceItemById(val).then((res) => {
    if (res.code == 200) {
      formData.value.serveTypeId = res.data.serveTypeId
      formData.value.img = [
        {
          url: res.data.img
        }
      ]
      formData.value.description = res.data.description
      formData.value.referencePrice = res.data.referencePrice
      formData.value.unit = res.data.unit
      formData.value.serveItemIcon = [
        {
          url: res.data.serveItemIcon
        }
      ]
      formData.value.detailImg = [
        {
          url: res.data.detailImg
        }
      ]
      formData.value.name = res.data.name
      formData.value.sortNum = res.data.sortNum
      previewData.title = res.data.name
      previewData.img = res.data.img
      previewData.price = res.data.referencePrice
      previewData.detailImg = res.data.detailImg
      previewData.unit = res.data.unit
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 更新信息
const onSubmit = async (result: any) => {
  if (result.validateResult === true) {
    const data = ref({
      serveTypeId: formData.value.serveTypeId,
      img: formData.value.img[0].url,
      description: formData.value.description,
      referencePrice: formData.value.referencePrice,
      unit: formData.value.unit,
      serveItemIcon: formData.value.serveItemIcon[0].url,
      detailImg: formData.value.detailImg[0].url,
      name: formData.value.name,
      sortNum: formData.value.sortNum
    })
    if (id) {
      await serviceItemEdit(data.value, id)
        .then((res) => {
          if (res.data.code === 200) {
            MessagePlugin.success('修改成功')
            handleBack()
          } else {
            MessagePlugin.error(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      await serviceItemAdd(data.value)
        .then((res) => {
          if (res.code === 200) {
            MessagePlugin.success('添加成功')
            handleBack()
          } else {
            MessagePlugin.error(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}

// 获取服务类型下拉框数据
const getServiceTypeSimpleList = async () => {
  await serviceTypeSimpleList({
    activeStatus: 2
  })
    .then((res) => {
      if (res.code == 200) {
        typeSelect.value = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      } else {
        MessagePlugin.error(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 上传图片失败
const handleFail = (file) => {
  MessagePlugin.error(`文件上传失败`)
}
// 超过大小或者文件格式错误报错提示
const onValidate = (params) => {
  const { files, type } = params
  const messageMap = {
    FILE_OVER_SIZE_LIMIT: files[0].response.error,
    FILES_OVER_LENGTH_LIMIT: '文件数量超出限制，仅上传未超出数量的文件',
    // if you need same name files, setting allowUploadDuplicateFile={true} please
    FILTER_FILE_SAME_NAME: '不允许上传同名文件',
    BEFORE_ALL_FILES_UPLOAD: 'beforeAllFilesUpload 方法拦截了文件',
    CUSTOM_BEFORE_UPLOAD: 'beforeUpload 方法拦截了文件'
  }
  messageMap[type] && MessagePlugin.warning(messageMap[type])
}
// 返回
const handleBack = () => {
  router.push('/service/ServiceList')
}
// 图片上传成功
const handleSuccess = (params, id) => {
  if (id === 1) {
    formData.value.serveItemIcon[0].url = params.response.data.url
  } else if (id === 2) {
    formData.value.img[0].url = params.response.data.url
    previewData.img = params.response.data.url
  } else {
    formData.value.detailImg[0].url = params.response.data.url
    previewData.detailImg = params.response.data.url
  }
}
// 赋值预览数据
const changeName = (val) => {
  previewData.title = val
}
// 计算是否可预览
const isPreview = computed(() => {
  return (
    previewData.title &&
    previewData.img &&
    previewData.detailImg &&
    previewData.price &&
    previewData.unit
  )
})
// 预览
const handlePreview = () => {
  previewVisible.value = true
}
// 改变价格时赋值
const changePrice = (val) => {
  previewData.price = val
}
// 改变单位时赋值
const changeUnit = (val) => {
  previewData.unit = val
}
// 关闭预览
const handleClose = () => {
  previewVisible.value = false
}
// 校验
const rules = ref({
  name: [
    {
      required: true,
      message: '请输入服务名称',
      trigger: 'blur'
    },
    {
      validator: validateText5,
      message: '服务名称格式错误，请输入2-5个汉字，请重新输入服务名称',
      trigger: 'blur'
    }
  ],
  referencePrice: [
    {
      required: true,
      message: '请输入价格',
      trigger: 'blur'
    },
    {
      pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
      message: '请输入数字,最多保留两位小数',
      trigger: 'blur'
    },
    {
      validator: (val) => {
        // const reg = /^1[3456789]\d{9}$/
        if (Number(val) > 10000) {
          return {
            result: false,
            message: '参考服务单价最大不超过10000',
            type: 'error'
          }
        }
        return true
      }
    }
  ],
  sortNum: [
    {
      required: true,
      message: '请输入排序',
      trigger: 'blur'
    },
    {
      pattern: /^[0-9]*$/,
      message: '请输入数字',
      trigger: 'blur'
    },
    {
      validator: (val) => {
        if (Number(val) > 999) {
          return {
            result: false,
            message: '排序最大不超过999',
            type: 'error'
          }
        }
        return true
      }
    }
  ],
  img: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur'
    }
  ],
  serveItemIcon: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur'
    }
  ],
  serveTypeId: [
    {
      required: true,
      message: '请选择服务类型',
      trigger: 'blur'
    }
  ],
  unit: [
    {
      required: true,
      message: '请选择单位',
      trigger: 'blur'
    }
  ],
  detailImg: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur'
    }
  ]
})
</script>

<style lang="less" scoped>
.contentBox {
  padding: 81px 105px 101px;
  .bodybox {
    display: flex;
    .topBox {
      width: 100%;
      display: flex;
      .leftBox {
        width: 48%;
        height: 100%;
        background-color: #fff;
        margin-right: 100px;
        .upbutton {
          margin-top: 24px;
        }
      }
      .rightBox {
        width: 48%;
        height: 100%;
        background-color: #fff;
        :deep(.t-button .t-button__text) {
          color: var(--color-bk2);
        }
        .unit {
          margin-bottom: 110px;
        }
      }
    }
    .bottomBox {
      margin-top: 24px;
      .description {
        :deep(.t-textarea__inner) {
          height: 147px;
        }
      }
    }
  }
  .footBox {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
.t-form {
  width: 100%;
}
.updateInfo {
  width: 60px;
  margin-right: 16px;
}
// 提示文字
:deep(.t-upload) {
  .t-upload__tips {
    color: var(--color-bk4);
  }
}
:deep(.t-form-item__description) {
  margin-bottom: 24px;
}
:deep(.t-input-number.t-is-controls-right) {
  width: auto;
  .t-input-number__decrease,
  .t-input-number__increase {
    opacity: 1;
    visibility: inherit;
  }
}
:deep(.t-upload) {
  margin-top: 6.5px;
}
:deep(.t-upload__tips) {
  margin-top: 10.5px;
}
</style>
