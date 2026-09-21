<template>
  <div>
    <!--登录 -->
    <div class="login-wrapper type2">
      <div class="left">
        <div class="login-container">
          <div class="title-container">
            <h1 class="title">
              <img src="@/assets/test-img/logofull.png" alt="" class="logo" />
            </h1>
          </div>
          <login v-if="type === 'login'" />
        </div>
        <footer class="copyright">
          Copyright @ 2021-2022 czri. All Rights Reserved
        </footer>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Login from './components/Login.vue'

const type = ref('login')
</script>

<style lang="less" scoped>
@import url('./index.less');
// 分格二样式 如果使用分格一 直接删除
.type2 {
  flex-direction: row;
  .login-container {
    background: transparent;
    top: auto;
    left: auto;
    transform: translateX(0);
  }
  .left {
    min-width: 600px;
    height: 100%;
    background: var(--color-bk10);
    // 内容居中
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .right {
    min-width: 840px;
    width: 100%;
    height: 100%;
    background: var(--color-bk10);
    background-image: url(@/assets/img_denglu-bg@2x.png);
    // 撑满父元素
    background-size: cover;
    background-repeat: no-repeat;
  }
}

//风格一登录样式
.login-wrapper {
  position: relative;
  .companyFooter {
    position: absolute;
    bottom: 0;
    background-color: transparent;
    left: 50%;
    transform: translateX(-50%);
    color: #c0d1ff;
  }
}
.logo {
  width: 150px;
  height: 70px;
}
:deep(.t-input .t-input__prefix > .t-icon){
  color: var(--td-text-color-placeholder);
}
</style>
