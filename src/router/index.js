import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import blank from '@/views/blank'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '首页',
  //       meta: { title: '首页', icon: 'indexIcon', affix: true }
  //     }
  //   ]
  // }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/system/organization',
    component: Layout,
    redirect: 'noRedirect',
    name: '组织结构',
    alwaysShow: true,
    meta: {
      title: '组织结构',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'system',
      ]
    },
    children: [{
      path: 'manage',
      component: () => import('@/views/system/organization/manage/list'),
      name: 'manageList',
      meta: {
        title: '组织管理',
        roles: [
          'system',
        ]
      }
    },{
      path: 'platform',
      component: () => import('@/views/system/organization/plantform/list'),
      name: 'platform',
      meta: {
        title: '分平台管理',
        roles: [
          'system',
        ]
      }
    }],
  },
  {
    path: '/system/jurisdiction',
    component: Layout,
    redirect: 'noRedirect',
    name: '权限管理',
    alwaysShow: true,
    meta: {
      title: '权限管理',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'system',
      ]
    },
    children: [{
      path: 'category',
      component: () => import('@/views/system/jurisdiction/category/list'),
      name: 'categoryList',
      meta: {
        title: '权限类目',
        roles: [
          'system',
        ]
      }
    },{
      path: 'role',
      component: () => import('@/views/system/jurisdiction/role/list'),
      name: 'roleList',
      meta: {
        title: '角色管理',
        roles: [
          'system',
        ]
      }
    },{
      path: 'nav',
      component: () => import('@/views/system/jurisdiction/nav/list'),
      name: 'navList',
      meta: {
        title: '菜单管理',
        roles: [
          'system',
        ]
      }
    },{
      path: 'authorize',
      component: () => import('@/views/system/jurisdiction/authorize/list'),
      name: 'authorize',
      meta: {
        title: '应用授权',
        roles: [
          'system',
        ]
      }
    }],
  },
  {
    path: '/system/logAlarm',
    component: Layout,
    redirect: 'noRedirect',
    name: '日志告警',
    alwaysShow: true,
    meta: {
      title: '日志告警',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'system',
      ]
    },
    children: [{
      path: 'log',
      component: () => import('@/views/system/logAlarm/log/list'),
      name: 'logList',
      meta: {
        title: '日志',
        roles: [
          'system',
        ]
      }
    },{
      path: 'alarm',
      component: () => import('@/views/system/logAlarm/alarm/list'),
      name: 'alarm',
      meta: {
        title: '告警',
        roles: [
          'system',
        ]
      }
    }],
  },
  {
    path: '/system/dictionary',
    component: Layout,
    redirect: 'noRedirect',
    name: '数据字典',
    alwaysShow: true,
    meta: {
      title: '数据字典',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'system',
      ]
    },
    children: [{
      path: 'data',
      component: () => import('@/views/system/dictionary/data/list'),
      name: 'dataList',
      meta: {
        title: '数据字典',
        roles: [
          'system',
        ]
      }
    },{
      path: 'type',
      component: () => import('@/views/system/dictionary/type/list'),
      name: 'typeList',
      meta: {
        title: '类型管理',
        roles: [
          'system',
        ]
      }
    }],
  },
  {
    path: '/system/function',
    component: Layout,
    redirect: 'noRedirect',
    name: '功能设置',
    meta: {
      title: '功能设置',
      icon: 'iconfont icon-xiangqing',
      roles: ['system'],
    },
    children: [
      {
        path: 'set',
        component: () => import('@/views/system/function/set'),
        name: 'functionSet',
        meta: {
          title: '功能设置',
          roles: ['system'],
        }
      }
    ]
  },
  {
    path: '/system/user',
    component: Layout,
    redirect: 'noRedirect',
    name: '个人中心',
    alwaysShow: true,
    meta: {
      title: '个人中心',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'system',
      ]
    },
    children: [{
      path: 'data',
      component: () => import('@/views/system/user/data'),
      name: 'userData',
      meta: {
        title: '个人资料',
        roles: [
          'system',
        ]
      }
    },{
      path: 'password',
      component: () => import('@/views/system/user/password'),
      name: 'password',
      meta: {
        title: '修改密码',
        roles: [
          'system',
        ]
      }
    }],
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataExchange'],
    },
    children: [
      {
        path: 'exchangeApi',
        component: () => import('@/views/dataExchange/exchangeApi/list'),
        name: 'exchangeApiList',
        meta: {
          title: '交换接口管理',
          roles: ['dataExchange'],
        }
      },
    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataExchange'],
    },
    children: [
      {
        path: 'database',
        component: () => import('@/views/dataExchange/dataExchange/list'),
        name: 'databaseList',
        meta: {
          title: '交换数据库管理',
          roles: ['dataExchange'],
        }
      },

    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataExchange'],
    },
    children: [
      {
        path: 'api',
        component: () => import('@/views/dataExchange/api/list'),
        name: 'apiList',
        meta: {
          title: '开发接口管理',
          roles: ['dataExchange'],
        }
      },
    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataExchange'],
    },
    children: [

      {
        path: 'log',
        component: () => import('@/views/dataExchange/log/list'),
        name: 'logList',
        meta: {
          title: '交换日志管理',
          roles: ['dataExchange'],
        }
      },

    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataExchange'],
    },
    children: [

      {
        path: 'monitor',
        component: () => import('@/views/dataExchange/monitor/list'),
        name: 'monitorList',
        meta: {
          title: '交换监控管理',
          roles: ['dataExchange'],
        }
      }
    ]
  },



{
  path: '/dataAcquisition/grid',
  component: Layout,
  redirect: 'noRedirect',
  // name: '数据交换',
  meta: {
  // title: '数据交换',
  icon: 'iconfont icon-xiangqing',
    roles: ['dataAcquisition'],
},
  children: [

    {
      path: 'index',
      component: () => import('@/views/dataAcquisition/grid/list'),
      name: 'gridList',
      meta: {
        title: '网格对象',
        roles: ['dataAcquisition'],
      }
    }
  ]
},
  {
    path: '/dataAcquisition/gridManage',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataAcquisition'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dataAcquisition/gridManage/list'),
        name: 'gridManageList',
        meta: {
          title: '网格管理',
          roles: ['dataAcquisition'],
        }
      }
    ]
  },
  {
    path: '/dataAcquisition',
    component: Layout,
    redirect: 'noRedirect',
    name: '信息采集',
    meta: {
      title: '信息采集',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataAcquisition'],
    },
    children: [
      {
        path: 'shop',
        component: () => import('@/views/dataAcquisition/shop/list'),
        name: 'shopList',
        meta: {
          title: '店铺采集',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'workSite',
        component: () => import('@/views/dataAcquisition/workSite/list'),
        name: 'workSiteList',
        meta: {
          title: '工地采集',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'community',
        component: () => import('@/views/dataAcquisition/community/list'),
        name: 'communityList',
        meta: {
          title: '示范小区',
          roles: ['dataAcquisition'],
        }
      }
    ]
  },
  {
    path: '/dataAcquisition/driveInput',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['dataAcquisition'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dataAcquisition/driveInput/index'),
        name: 'driveInput',
        meta: {
          title: '驾驶舱录入',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'digital',
        component: () => import('@/views/dataAcquisition/driveInput/digital/list'),
        name: 'digital',
        hidden: true,
        meta: {
          title: '数字城管',
          roles: ['dataAcquisition'],
          activeMenu:'/dataAcquisition/driveInput/index',
        }
      },{
        path: 'letter',
        component: () => import('@/views/dataAcquisition/driveInput/letter/list'),
        name: 'letter',
        hidden: true,
        meta: {
          title: '信访投诉',
          roles: ['dataAcquisition'],
          activeMenu:'/dataAcquisition/driveInput/index',
        }
      },{
        path: 'examine',
        component: () => import('@/views/dataAcquisition/driveInput/examine/list'),
        name: 'letter',
        hidden: true,
        meta: {
          title: '行政审批',
          roles: ['dataAcquisition'],
          activeMenu:'/dataAcquisition/driveInput/index',
        }
      }
    ]
  },

  {
    path: '/personnel',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['personnel'],
    },
    children: [
      {
        path: 'personnelList',
        component: () => import('@/views/personnel/personnelList/list'),
        name: 'personnelList',
        meta: {
          title: '人员管理',
          roles: ['personnel'],
        }
      },
    ]
  },

  {
    path: '/car',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['car'],
    },
    children: [
      {
        path: 'carList',
        component: () => import('@/views/testing/monitor/list'),
        name: 'carList',
        meta: {
          title: '车辆管理',
          roles: ['car'],
        }
      },
    ]
  },

  {
    path: '/video',
    component: Layout,
    redirect: 'noRedirect',
    // name: '数据交换',
    meta: {
      // title: '数据交换',
      icon: 'iconfont icon-xiangqing',
      roles: ['video'],
    },
    children: [
      {
        path: 'videoList',
        component: () => import('@/views/testing/monitor/list'),
        name: 'videoList',
        meta: {
          title: '视频管理',
          roles: ['video'],
        }
      },
    ]
  },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
