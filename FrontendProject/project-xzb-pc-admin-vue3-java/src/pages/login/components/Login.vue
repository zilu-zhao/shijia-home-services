<!-- 用户名密码登录-->
<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <!-- 密码登录 -->
    <template v-if="type == 2">
      <t-form-item name="username">
        <t-input
          v-model="formData.username"
          size="large"
          placeholder="账户"
          autocomplete="both"
          :format="formataccount"
          clearable
        >
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="密码"
          :format="formataccount"
          onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
          autocomplete="both"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item class="btn-container">
      <t-loading v-if="loadSt" indicator class="bt load"></t-loading>
      <button v-else class="bt" type="submit">登录</button>
      <div class="tips">
        仅用于IT培训教学使用，为保障您的个人信息安全，请勿向平台录入任何个人敏感信息
        (如手机号、身份证号等) !
      </div>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { useUserStore } from '@/store'
import { userLogins } from '@/api/user'
// tab切换数据
const userStore = useUserStore()
// 登录loadding
const loadSt = ref(false)

const INITIAL_DATA = {
  username: 'lisi',
  password: '888itcast.CN764%...'
}

const FORM_RULES: Record<string, FormRule[]> = {
  account: [{ required: true, message: '账号必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }]
}

const type = ref(2)

const form = ref<FormInstanceFunctions>()
const formData = ref({ ...INITIAL_DATA })
const showPsw = ref(false)

const router = useRouter()
const route = useRoute()

const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    loadSt.value = true
    // 登录相关
    await userLogins(formData.value).then((res: any) => {
      if (res.code === 200) {
        userStore.login(res.data.token)
        // 获取用户信息 并存入pinia
        // const { data } = await getUserInfo()
        // userStore.setUserInfo(data)
        loadSt.value = false
        // 登录成功， 转入首页
        MessagePlugin.success('登录成功')
        const redirect = route.query.redirect as string
        const redirectUrl = redirect
          ? decodeURIComponent(redirect)
          : '/dashboard'
        router.push(redirectUrl)
      } else {
        MessagePlugin.error(res.data.msg)
        loadSt.value = false
      }
    })
  }
}
// 格式化账号
const formataccount = (val: string) => {
  return val.replace(/\s/g, '')
}
</script>

<style lang="less" scoped>
@import url('../index.less');
.tips {
  position: absolute;
  color: var(--color-main);
  top: 60px;
}
</style>
