<template>
  <div class="quickEntry">
    <div class="title">快捷入口</div>
    <div class="content">
      <div
        class="card"
        v-for="(item, index) in listData"
        :key="index"
        @click="handleToPath(item.path)"
      >
        <div class="icon" v-html="item.url"></div>
        <div class="text">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardBase'
}
</script>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { DashboardPanel } from '../constants'

const props = defineProps({
  topPanelData: {
    type: Object,
    default: null
  }
})
const listData = ref<Array<DashboardPanel>>([
  {
    title: '订单列表',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" class="design-iconfont">
  <g transform="translate(.75 .5)" stroke="#191919" fill="none" fill-rule="evenodd">
    <rect x="2.61764706" y="1.68764706" width="12.7647059" height="14.6247059" rx="2"/>
    <path stroke-linecap="square" d="M5.80882353 6.15294347L12.1911765 6.15294347"/>
    <path stroke-linecap="square" d="M5.80882353 9L12.1911765 9"/>
    <path stroke-linecap="square" d="M5.80882353 11.8470565L9.94025735 11.8470565"/>
  </g>
</svg>
`,
    path: '/order/orderList'
  },
  {
    title: '服务人员认证',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" class="design-iconfont">
  <g fill="#191919" fill-rule="nonzero">
    <path d="M6.11504464,10.2855341 L6.11504463,10.2855341 C5.9880934,10.2855341 5.8662929,10.2353036 5.77625713,10.1458054 L3.63626453,8.0039145 L3.63626449,8.00391445 C3.45237872,7.81409755 3.4571852,7.51115208 3.64700146,7.3272663 C3.83256863,7.14749627 4.12733208,7.14749148 4.31290403,7.32725802 L6.45288067,9.46822372 L6.45288067,9.46822372 C6.63998885,9.65486608 6.64036533,9.95784984 6.45372328,10.1449564 C6.36397577,10.2349277 6.24212646,10.2855341 6.11504586,10.2855341 L6.11504464,10.2855341 Z" transform="translate(2.25 1.5)"/>
    <path d="M6.11504464,10.2855242 L6.11504464,10.2855242 C5.85076318,10.2854364 5.63657887,10.0711372 5.63664904,9.80685571 C5.63664904,9.68025623 5.68688309,9.55882823 5.7762573,9.46916415 L9.79585025,5.4495712 L9.79585024,5.44957121 C9.9859495,5.26597737 10.288887,5.27124966 10.4724824,5.46134791 C10.6515777,5.64678745 10.6515745,5.94077561 10.4724741,6.12621196 L6.45288116,10.145789 L6.45288116,10.145789 C6.36307957,10.2350713 6.24166082,10.28529 6.11502848,10.2855242 L6.11504464,10.2855242 Z" transform="translate(2.25 1.5)"/>
    <path d="M7.05293849,15.4535979 L7.0529385,15.4535979 C6.78815135,15.4503172 6.57615891,15.2330055 6.57940119,14.9682183 C6.58223841,14.7422531 6.74243634,14.5489171 6.96394443,14.5041752 C9.60824262,14.001744 12.5875587,10.7286392 12.7990407,8.74274747 L12.796165,3.356506 C9.67236731,2.94019266 6.90840961,1.10170344 6.7868677,1.02034581 L6.7868677,1.02034581 C6.57176772,0.866798934 6.52186997,0.567951173 6.67541669,0.352852787 C6.82272407,0.146493167 7.10541884,0.0908509351 7.31994453,0.225989614 C7.34960337,0.246102494 10.2686159,2.18316685 13.3167989,2.45112057 L13.3167989,2.45112057 C13.5637767,2.47294164 13.7532075,2.6797977 13.7532075,2.92773745 L13.7532075,8.79347841 C13.4746901,11.4425783 10.0168667,14.8965603 7.14384197,15.4440014 L7.14384202,15.4440014 C7.11389428,15.4499717 7.08346063,15.4531729 7.052926,15.4535979 L7.05293849,15.4535979 Z" transform="translate(2.25 1.5)"/>
    <path d="M7.05485279,15.4497667 L7.05485281,15.4497667 C7.02431562,15.4493098 6.99388101,15.4461091 6.96391955,15.4401904 C4.09091073,14.8946589 0.633100137,11.4378102 0.356516127,8.83846608 L0.354576306,2.92391055 C0.354576306,2.67508544 0.544066184,2.46835891 0.790984971,2.44729367 C3.84588391,2.17840673 6.75721057,0.241305683 6.78688218,0.221237469 L6.78688214,0.221237488 C7.01318395,0.0837218905 7.3081165,0.155697224 7.44563162,0.381998554 C7.57442041,0.593938349 7.52033451,0.869116945 7.32091166,1.01654653 C7.19936656,1.09788293 4.43541205,2.93543782 1.31161438,3.35173361 L1.31161438,8.78776276 C1.52022968,10.7238668 4.499541,13.9969637 7.14383919,14.50036 L7.1438392,14.50036 C7.40339554,14.5528342 7.57126821,14.8057844 7.51879414,15.0653408 C7.47402544,15.2867819 7.28074972,15.4469304 7.05484513,15.4497667 L7.05485279,15.4497667 Z" transform="translate(2.25 1.5)"/>
  </g>
</svg>`,
    path: '/personnel/authentication'
  },
  {
    title: '企业认证',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" class="design-iconfont">
  <g stroke="#191919" fill="none" fill-rule="evenodd">
    <path d="M9 2.64374075A3.03254732 3.03254732 0 1 0 9 8.70883539A3.03254732 3.03254732 0 1 0 9 2.64374075Z" transform="translate(.75 .703487)"/>
    <path stroke-linejoin="round" d="M8.09838387 8.70883538L9.90161613 8.70883538 10.9670817 12.0325473 7.03291828 12.0325473z" transform="translate(.75 .703487)"/>
    <path stroke-linejoin="round" d="M4.03451715 12.0325473L13.9654828 12.0325473 14.7636586 15.3562592 3.23634141 15.3562592z" transform="translate(.75 .703487)"/>
  </g>
</svg>
`,
    path: '/institution/authentication'
  },
  {
    title: '客户列表',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" class="design-iconfont">
  <g stroke="#191919" fill="none" fill-rule="evenodd">
    <path d="M4.87669884 0A3 3 0 1 0 4.87669884 6A3 3 0 1 0 4.87669884 0Z" transform="translate(2.878418 4.541453)"/>
    <path d="M9.75339769,10.8766988 C9.75339769,8.18337244 7.57002524,6 4.87669884,6 C2.18337244,6 0,8.18337244 0,10.8766988" stroke-linecap="round" transform="translate(2.878418 4.541453)"/>
    <path stroke-linecap="round" d="M10.9413209 6.75634766L13.3364122 6.75634766" transform="translate(2.878418 4.541453)"/>
    <path stroke-linecap="round" d="M9.75339769 4.46606445L13.3364122 4.46606445" transform="translate(2.878418 4.541453)"/>
    <path stroke-linecap="round" d="M12.1388665 9.04663086L13.3364122 9.04663086" transform="translate(2.878418 4.541453)"/>
  </g>
</svg>
`,
    path: '/custom/management'
  },
  {
    title: '服务项管理',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 18" class="design-iconfont">
  <g stroke="#191919" stroke-linejoin="round" fill="none" fill-rule="evenodd">
    <path d="M2.9170943 2.9170943H8V8H2.9170943z" transform="translate(.75)"/>
    <path d="M2.9170943 10H8V15.082905700000001H2.9170943z" transform="translate(.75)"/>
    <path d="M10 2.9170943H15.082905700000001V8H10z" transform="translate(.75)"/>
    <path d="M10 10H15.082905700000001V15.082905700000001H10z" transform="translate(.75)"/>
  </g>
</svg>
`,
    path: '/service/ServiceList'
  },
  {
    title: '区域管理',
    url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" class="design-iconfont">
  <g stroke="#191919" fill="none" fill-rule="evenodd">
    <path d="M9.00001153,2.08413535 C6.58053924,2.08413535 4.61252664,4.04292528 4.61252664,6.45037915 L4.61252664,6.45036984 C4.61044084,7.33670611 4.88123193,8.2022034 5.38812468,8.92928805 C5.4136003,8.97245506 5.43907593,9.01420689 5.46879748,9.05525112 L8.67165181,13.2573138 L8.67165183,13.2573138 C8.75463598,13.3518562 8.87420967,13.4062305 9.00000475,13.4066288 C9.12384493,13.4066288 9.24131523,13.3528469 9.34321798,13.2396222 L12.5305059,9.05453567 C12.5623505,9.01349156 12.5892414,8.96749393 12.6033946,8.94131059 L12.6033947,8.94131052 C13.114814,8.21170589 13.3886318,7.34206265 13.3874817,6.45106705 C13.3874817,4.04290829 11.4194893,2.08482325 9.00000527,2.08482325 L9.00001153,2.08413535 Z M9.00001153,8.01288367 L9.00001147,8.01288367 C8.13660301,8.01405392 7.43527982,7.31590112 7.43255424,6.45249383 C7.43255424,5.59269089 8.13596508,4.89281391 9.00001147,4.89281391 C9.86406021,4.89281391 10.5674687,5.59339343 10.5674687,6.45249383 L10.5674687,6.45249625 C10.5647356,7.31617844 9.86298407,8.01444357 8.99929482,8.01288367 L9.00001153,8.01288367 Z" transform="translate(.25 .042467)"/>
    <path d="M5.57741177,12.0752551 C3.83417,12.4466907 2.68010129,13.0935989 2.68010129,13.829492 C2.68010129,14.9817638 5.50961632,15.9158647 9,15.9158647 C12.4903837,15.9158647 15.3198987,14.9817638 15.3198987,13.829492 C15.3198987,13.0861286 14.1422804,12.4335659 12.369318,12.0640287" stroke-linecap="round" transform="translate(.25 .042467)"/>
  </g>
</svg>
`,
    path: '/service/region'
  }
])
const resizeTime = ref(1)
const router = useRouter()
// chartSize update
const updateContainer = () => {
  if (
    document.documentElement.clientWidth >= 1400 &&
    document.documentElement.clientWidth < 1920
  ) {
    resizeTime.value = Number(
      (document.documentElement.clientWidth / 2280).toFixed(2)
    )
  } else if (document.documentElement.clientWidth < 1080) {
    resizeTime.value = Number(
      (document.documentElement.clientWidth / 1080).toFixed(2)
    )
  } else {
    resizeTime.value = 1
  }
}
onMounted(() => {
  nextTick(() => {
    updateContainer()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer)
})

const handleToPath = (url) => {
  router.push(url)
}
</script>

<style lang="less" scoped>
.quickEntry {
  background-color: #fff;
  height: 125px;
  padding: 16px 21px 20px;
  margin-bottom: 30px;

  .title {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 16px;
    color: var(--color-bk1);
    margin-bottom: 27px;
  }

  .content {
    display: flex;

    .card {
      display: flex;
      width: 100%;
      height: 40px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      margin-right: 20px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      .icon {
        width: 18px;
        height: 18px;
        margin-right: 2px;
      }
      &:hover {
        border-color: var(--color-main);
        background-color: #ffefec;
        color: var(--color-main);
        .icon {
          .design-iconfont {
            font-size: 9px;
            g {
              stroke: var(--color-main);
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.quickEntry {
  .content {
    .card {
      &:hover {
        .icon {
          .design-iconfont {
            g {
              stroke: var(--color-main);
            }
          }
        }
      }
      &:nth-child(2) {
        &:hover {
          .icon {
            .design-iconfont {
              g {
                stroke: none !important;
                fill: var(--color-main) !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
