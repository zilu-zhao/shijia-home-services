<template>
  <div class="noData">
    <img
      src="@/assets/default/zwnr@2x.png"
      :style="{
        width: props.photoWidth + 'px',
        height: props.photoHeight + 'px',
        marginTop: props.PhotoMt + 'px',
        marginBottom: props.PhotoMb + 'px'
      }"
    />
    <p :style="{
      marginBottom: props.pMb + 'px'
    }">{{content}}</p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  // 是否显示
  photoWidth: {
    type: Number,
    default: 220
  },
  photoHeight: {
    type: Number,
    default: 200
  },
  PhotoMt: {
    type: Number,
    default: 60
  },
  PhotoMb: {
    type: Number,
    default: 30
  },
  pMb: {
    type: Number,
    default: 75
  },
  content:{
    type: String,
    default: '暂无内容哦～'
  }
})
</script>
<style lang="less" scoped>
.noData {
  text-align: center;
  img {
    width: 220px;
    height: 200px;
    margin-top: 60px;
    margin-bottom: 30px;
  }
  p {
    text-align: center;
    color: var(--color-black);
    margin-bottom: 75px;
  }
}
</style>
