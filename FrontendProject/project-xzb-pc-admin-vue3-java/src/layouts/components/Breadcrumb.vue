<!-- 面包屑 -->
<template>
  <div class="bread">
    <t-breadcrumb :max-item-width="'150'" class="tdesign-breadcrumb">
      <t-breadcrumbItem
        v-for="item in crumbs"
        :key="item.to"
        :to="item.to"
        :replace="true"
        class="breadcrumbItem"
        @click="() => $router.push(item.to)"
      >
        {{ item.title }}
      </t-breadcrumbItem>
    </t-breadcrumb>
    <div class="fresh" @click="handleRefresh"><span></span>刷新</div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue' // 从vue中引入computed
import { getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router' // 从vue-router中引入useRoute
const route = useRoute()
const router = useRouter()
// 通过useRoute获取当前路由信息
const crumbs = computed(() => {
  const pathArray = route.path.split('/')
  pathArray.shift()
  // 通过reduce方法将pathArray转换为面包屑数组
  const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
    // 如果路由下有hiddenBreadcrumb或当前遍历到参数则隐藏
    if (
      route.matched[idx]?.meta?.hiddenBreadcrumb ||
      Object.values(route.params).includes(path)
    ) {
      return breadcrumbArray
    }
    //  为面包屑数组添加元素
    breadcrumbArray.push({
      path,
      to: breadcrumbArray[idx - 1]
        ? `/${breadcrumbArray[idx - 1].path}/${path}`
        : `/${path}`,
      title: route.matched[idx]?.meta?.title ?? path
    })
    return breadcrumbArray
  }, [])
  return breadcrumbs
})
const handleRefresh = () => {
  // 刷新整个页面，触发整个页面的生命周期
  // 清空地址栏
  router.push('/dashboard/base')
  nextTick(() => {
    if (route.query.refresh !== '1') {
      router.replace(router.currentRoute.value.path + '?refresh=1')
    } else {
      router.replace(router.currentRoute.value.path)
    }
  })
}
</script>
<style scoped lang="less">
.tdesign-breadcrumb {
  margin-bottom: 24px;
}
.breadcrumbItem {
  /* 将第一项设置为不可点击 */
  &:first-child {
    pointer-events: none;
    :deep(.t-breadcrumb--text-overflow .t-breadcrumb__inner-text) {
      color: var(--color-bk4);
    }
  }
  // 因为当前不存在三级页面，第二级页面即是当前页面故不需要点击跳转功能，先进行禁用，后续有三级页面时再进行开启
  &:last-child {
    pointer-events: none;
    :deep(.t-breadcrumb--text-overflow .t-breadcrumb__inner-text) {
      color: var(--color-bk3);
    }
  }
}
.bread {
  display: flex;
  justify-content: space-between;
  .fresh {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 22px;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url('@/assets/btn_shuaxin@2x.png');
      background-size: 100% 100%;
      margin-right: 7px;
    }
  }
}
</style>
