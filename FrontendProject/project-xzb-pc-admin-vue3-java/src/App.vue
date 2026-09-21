<template>
  <router-view :class="[mode]" />
</template>

<script setup lang="ts">
import { computed, watch} from 'vue'
import { useRoute } from 'vue-router'
import { useSettingStore } from '@/store'

const route = useRoute()
const store = useSettingStore()
const mode = computed(() => {
  return store.displayMode
})
// 监听路由变化
watch(
  () => route.path,
  () => {
    const { back } = window.history.state
    if (!back) return
    // 其中从登录页跳转之后的api也需要保留
    if (back.indexOf('/login?') === -1) {
      store.clearRequestList()
    }
  }
)
</script>

<style lang="less" scoped>
#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>
