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
    path: '/',
    component: Layout,
    redirect: '/testing/monitor',
    // name: '实时监测',
    meta: {
      // title: '实时监测',
      icon: 'iconfont icon-xiangqing',
      roles: ['admin'],
    },
    children: [
      {
        path: 'testing/monitor',
        component: () => import('@/views/testing/monitor/list'),
        name: 'modelList',
        meta: {
          title: '实时监测',
          roles: ['admin'],
        }
      }
    ]
  },
  {
    path: '/workOrder',
    component: Layout,
    redirect: '/workOrder/police',
    // name: '预警审核',
    meta: {
      // title: '预警审核',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'police',
        component: () => import('@/views/workOrder/police/list'),
        name: '预警审核',
        meta: {
          title: '预警审核',
          roles: [
            'admin',
          ]
        }
      },
      {
        path: 'police/view',
        hidden:true,
        component: () => import('@/views/workOrder/police/components/view'),
        name: '预警审核',
        meta: {
          title: '预警审核',
          activeMenu: '/workOrder/police',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: '系统管理',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'organization',
        component: blank,
        redirect: 'noRedirect',
        name: '组织结构',
        alwaysShow: true,
        meta: {
          title: '组织结构',
          icon: 'iconfont icon-xiangqing',
          roles: [
            'admin',
          ]
        },
        children: [{
          path: 'manage',
          component: () => import('@/views/statistics/intelligence/list'),
          name: 'manageList',
          meta: {
            title: '组织管理',
            roles: [
              'admin',
            ]
          }
        },{
          path: 'platform',
          component: () => import('@/views/statistics/intelligence/list'),
          name: 'platform',
          meta: {
            title: '分平台管理',
            roles: [
              'admin',
            ]
          }
        }],
      },
      {
        path: 'data',
        component: () => import('@/views/statistics/data/list'),
        name: 'dataList',
        meta: {
          title: '设备检索',
          roles: [
            'admin',
          ]
        }
      },{
        path: 'data1',
        component: () => import('@/views/statistics/data/list'),
        name: 'dataList',
        meta: {
          title: '重复事件查询',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
  {
    path: '/devOps',
    component: Layout,
    redirect: 'noRedirect',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-xingxing',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'verify',
        component: () => import('@/views/devOps/verify/list'),
        name: 'verifyList',
        meta: {
          title: '示范小区',
          roles: [
            'admin',
          ]
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
