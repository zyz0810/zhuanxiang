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
  //       name: '??????',
  //       meta: { title: '??????', icon: 'indexIcon', affix: true }
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
    name: '????????????',
    alwaysShow: true,
    meta: {
      title: '????????????',
      icon: 'iconfont icon-zuzhijiegou',
      roles: [
        'system',
        'systemAdmin',
      ]
    },
    children: [{
      path: 'manage',
      component: () => import('@/views/system/organization/manage/list'),
      name: 'manageList',
      meta: {
        title: '????????????',
        roles: [
          'system',
          'systemAdmin',
        ]
      }
    },{
      path: 'platform',
      component: () => import('@/views/system/organization/plantform/list'),
      name: 'platform',
      meta: {
        title: '???????????????',
        roles: [
          'system',
          'systemAdmin',
        ]
      }
    }],
  },
  {
    path: '/system/jurisdiction',
    component: Layout,
    redirect: 'noRedirect',
    name: '????????????',
    alwaysShow: true,
    meta: {
      title: '????????????',
      icon: 'iconfont icon-anniuquanxianguanli',
      roles: [
        'systemAdmin',
      ]
    },
    children: [{
      path: 'category',
      component: () => import('@/views/system/jurisdiction/category/list'),
      name: 'categoryList',
      meta: {
        title: '????????????',
        roles: [
          'systemAdmin',
        ]
      }
    },{
      path: 'role',
      component: () => import('@/views/system/jurisdiction/role/list'),
      name: 'roleList',
      meta: {
        title: '????????????',
        roles: [
          'systemAdmin',
        ]
      }
    },{
      path: 'nav',
      component: () => import('@/views/system/jurisdiction/nav/list'),
      name: 'navList',
      meta: {
        title: '????????????',
        roles: [
          'systemAdmin',
        ]
      }
    },{
      path: 'authorize',
      component: () => import('@/views/system/jurisdiction/authorize/list'),
      name: 'authorize',
      meta: {
        title: '????????????',
        roles: [
          'systemAdmin',
        ]
      }
    }],
  },
  {
    path: '/system/logAlarm',
    component: Layout,
    redirect: 'noRedirect',
    name: '????????????',
    // alwaysShow: true,
    meta: {
      title: '????????????',
      icon: 'iconfont icon-yanfaguanli-rizhiguanli',
      roles: [
        'system',
        'systemAdmin',
      ]
    },
    children: [{
      path: 'log',
      component: () => import('@/views/system/logAlarm/log/list'),
      name: 'logList',
      meta: {
        title: '????????????',
        roles: [
          'system',
          'systemAdmin',
        ]
      }
    },
    //   {
    //   path: 'alarm',
    //   component: () => import('@/views/system/logAlarm/alarm/list'),
    //   name: 'alarm',
    //   meta: {
    //     title: '??????',
    //     roles: [
    //       'system',
    //     ]
    //   }
    // }
    ],
  },
  {
    path: '/system/dictionary',
    component: Layout,
    redirect: 'noRedirect',
    name: '????????????',
    alwaysShow: true,
    meta: {
      title: '????????????',
      icon: 'iconfont icon--zidianbiao',
      roles: [
        'systemAdmin',
      ]
    },
    children: [{
      path: 'data',
      component: () => import('@/views/system/dictionary/data/list'),
      name: 'dataList',
      meta: {
        title: '????????????',
        roles: [
          'systemAdmin',
        ]
      }
    },{
      path: 'type',
      component: () => import('@/views/system/dictionary/type/list'),
      name: 'typeList',
      meta: {
        title: '????????????',
        roles: [
          'systemAdmin',
        ]
      }
    }],
  },
  {
    path: '/system/function',
    component: Layout,
    redirect: 'noRedirect',
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'iconfont icon-shezhixitongshezhigongnengshezhishuxing',
      roles: ['system', 'systemAdmin',],
    },
    children: [
      {
        path: 'set',
        component: () => import('@/views/system/function/set'),
        name: 'functionSet',
        meta: {
          title: '????????????',
          roles: ['system', 'systemAdmin',],
        }
      }
    ]
  },
  {
    path: '/system/user',
    component: Layout,
    redirect: 'noRedirect',
    name: '????????????',
    alwaysShow: true,
    meta: {
      title: '????????????',
      icon: 'iconfont icon-gerenzhongxin',
      roles: [
        'system',
        'systemAdmin',
      ]
    },
    children: [{
      path: 'data',
      component: () => import('@/views/system/user/data'),
      name: 'userData',
      meta: {
        title: '????????????',
        roles: [
          'system',
          'systemAdmin',
        ]
      }
    },{
      path: 'password',
      component: () => import('@/views/system/user/password'),
      name: 'password',
      meta: {
        title: '????????????',
        roles: [
          'system',
          'systemAdmin',
        ]
      }
    }],
  },
  {
    path: '/system/language',
    component: Layout,
    redirect: 'noRedirect',
    name: '???????????????',
    meta: {
      title: '???????????????',
      icon: 'iconfont icon-wenzi',
      roles: [
        'system',
        'systemAdmin',
      ]
    },
    children: [{
      path: 'data',
      component: () => import('@/views/system/language/list'),
      name: 'languageList',
      meta: {
        title: '???????????????',
        roles: [
          'system',
          'systemAdmin',
        ]
      }
    }],
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-jiaohuan',
      roles: ['dataExchange'],
    },
    children: [
      {
        path: 'exchangeApi',
        component: () => import('@/views/dataExchange/exchangeApi/list'),
        name: 'exchangeApiList',
        meta: {
          title: '??????????????????',
          roles: ['dataExchange'],
        }
      },
    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-shujukulianjie',
      roles: ['dataExchange'],
    },
    children: [
      {
        path: 'database',
        component: () => import('@/views/dataExchange/dataExchange/list'),
        name: 'databaseList',
        meta: {
          title: '?????????????????????',
          roles: ['dataExchange'],
        }
      },

    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-kaifazhezhongxin',
      roles: ['dataExchange'],
    },
    children: [
      {
        path: 'api',
        component: () => import('@/views/dataExchange/api/list'),
        name: 'apiList',
        meta: {
          title: '??????????????????',
          roles: ['dataExchange'],
        }
      },
    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-rizhi',
      roles: ['dataExchange'],
    },
    children: [

      {
        path: 'log',
        component: () => import('@/views/dataExchange/log/list'),
        name: 'logList',
        meta: {
          title: '??????????????????',
          roles: ['dataExchange'],
        }
      },

    ]
  },
  {
    path: '/dataExchange',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-jiankong-jiankongbangding',
      roles: ['dataExchange'],
    },
    children: [

      {
        path: 'monitor',
        component: () => import('@/views/dataExchange/monitor/list'),
        name: 'monitorList',
        meta: {
          title: '??????????????????',
          roles: ['dataExchange'],
        }
      }
    ]
  },



{
  path: '/dataAcquisition/grid',
  component: Layout,
  redirect: 'noRedirect',
  // name: '????????????',
  meta: {
  // title: '????????????',
  icon: 'iconfont icon-grid-list',
    roles: ['dataAcquisition'],
},
  children: [

    {
      path: 'index',
      component: () => import('@/views/dataAcquisition/grid/list'),
      name: 'gridList',
      meta: {
        title: '????????????',
        roles: ['dataAcquisition'],
      }
    }
  ]
},
  {
    path: '/dataAcquisition/gridManage',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-diliwangge',
      roles: ['dataAcquisition'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dataAcquisition/gridManage/list'),
        name: 'gridManageList',
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
        }
      }
    ]
  },
  {
    path: '/dataAcquisition',
    component: Layout,
    redirect: 'noRedirect',
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'iconfont icon-liuliangcaijishebei',
      roles: ['dataAcquisition'],
    },
    children: [
      {
        path: 'shop',
        component: () => import('@/views/dataAcquisition/shop/list'),
        name: 'shopList',
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'workSite',
        component: () => import('@/views/dataAcquisition/workSite/list'),
        name: 'workSiteList',
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'community',
        component: () => import('@/views/dataAcquisition/community/list'),
        name: 'communityList',
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'manhole',
        component: () => import('@/views/dataAcquisition/manhole/list'),
        name: 'manholeList',
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'company',
        component: () => import('@/views/dataAcquisition/company/list'),
        name: 'manholeList',
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
        }
      }
    ]
  },
  {
    path: '/dataAcquisition/driveInput',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-shujuluru',
      roles: ['dataAcquisition'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dataAcquisition/driveInput/index'),
        name: 'driveInput',
        meta: {
          title: '???????????????',
          roles: ['dataAcquisition'],
        }
      },{
        path: 'digital',
        component: () => import('@/views/dataAcquisition/driveInput/digital/list'),
        name: 'digital',
        hidden: true,
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
          activeMenu:'/dataAcquisition/driveInput/index',
        }
      },{
        path: 'letter',
        component: () => import('@/views/dataAcquisition/driveInput/letter/list'),
        name: 'letter',
        hidden: true,
        meta: {
          title: '????????????',
          roles: ['dataAcquisition'],
          activeMenu:'/dataAcquisition/driveInput/index',
        }
      },{
        path: 'examine',
        component: () => import('@/views/dataAcquisition/driveInput/examine/list'),
        name: 'letter',
        hidden: true,
        meta: {
          title: '????????????',
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
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-renyuan',
      roles: ['personnel'],
    },
    children: [
      {
        path: 'personnelList',
        component: () => import('@/views/personnel/personnelList/list'),
        name: 'personnelList',
        meta: {
          title: '????????????',
          roles: ['personnel'],
        }
      },
    ]
  },

  {
    path: '/car',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon--cheliang',
      roles: ['car'],
    },
    children: [
      {
        path: 'carList',
        component: () => import('@/views/car/list'),
        name: 'carList',
        meta: {
          title: '????????????',
          roles: ['car'],
        }
      },
    ]
  },

  {
    path: '/video',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-shipin',
      roles: ['video'],
    },
    children: [
      {
        path: 'videoList',
        component: () => import('@/views/testing/monitor/list'),
        name: 'videoList',
        meta: {
          title: '????????????',
          roles: ['video'],
        }
      },
    ]
  },
  {
    path: '/electron',
    component: Layout,
    redirect: 'noRedirect',
    // name: '????????????',
    meta: {
      // title: '????????????',
      icon: 'iconfont icon-xiangqing',
      roles: ['map'],
    },
    children: [
      {
        path: 'map',
        component: () => import('@/views/dataAcquisition/gridManage/list'),
        name: 'gridManageList',
        meta: {
          title: '????????????',
          roles: ['map'],
        }
      }
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
