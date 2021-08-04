<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }}111 </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title"><span class="f18">{{title}}</span></h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
  import logo from '@/assets/image/point04.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '运营中心后台',
      logo: logo
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      if((route.path).includes("system")){
        this.title = '系统设置'
      } else if(route.path == '/record/approval'){
        this.title = '备案审批数字驾驶舱'
      } else if(route.path == '/garbage/link'){
        this.title = '垃圾全链路数字驾驶舱'
      } else if(route.path == '/digital/services'){
        this.title = '数字服务驾驶舱'
      } else if(route.path == '/demonstration/community'){
        this.title = '示范小区数字驾驶舱'
      } else if(route.path == '/city/appearance'){
        this.title = '市容市貌数字驾驶舱'
      } else if(route.path == '/law/soldier'){
        this.title = '执法单兵数字驾驶舱'
      } else if(route.path == '/illegal/construction'){
        this.title = '违法建筑数字驾驶舱'
      } else if(route.path == '/city/water'){
        this.title = '城市治水数字驾驶舱'
      } else if(route.path == '/municipal/facilities'){
        this.title = '市政设施数字驾驶舱'
      } else if(route.path == '/law/case'){
        this.title = '案件归集下派数字驾驶舱'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 20px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      letter-spacing: 3px;
      /*font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;*/
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
