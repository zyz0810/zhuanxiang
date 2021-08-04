<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }}111 </h1>
      </router-link>

      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo block">
        <p class="sidebar-title"><span class="f18">{{title}}</span></p>
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
      } else if((route.path).includes("dataExchange")){
        this.title = '数据交换'
      } else if((route.path).includes("dataAcquisition")){
        this.title = '数据采集'
      } else if((route.path).includes("personnel")){
        this.title = '人员管理'
      } else if((route.path).includes("car")){
        this.title = '车辆管理'
      } else if((route.path).includes("video")){
        this.title = '视频管理'
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
  height: 200px;
  line-height: 50px;
  background: #3358a5;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin: 0 auto;
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
