import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getRole, getToken, setRole} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
let newRole = false
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // if((to.path).includes("system")&&!((from.path).includes("system"))){
  //   setRole(['system']);
  //   newRole = true;
  // }else if((to.path).includes("system")&&(from.path).includes("system")){
  //   setRole(['system']);
  //   newRole = false;
  // } else if((to.path).includes("dataExchange")&&!((from.path).includes("dataExchange"))){
  //   setRole(['dataExchange']);
  //   newRole = true;
  // }else if((to.path).includes("dataExchange")&&(from.path).includes("dataExchange")){
  //   setRole(['dataExchange']);
  //   newRole = false;
  // } else if((to.path).includes("dataAcquisition")&&!((from.path).includes("dataAcquisition"))){
  //   setRole(['dataAcquisition']);
  //   newRole = true;
  // }else if((to.path).includes("dataAcquisition")&&(from.path).includes("dataAcquisition")){
  //   setRole(['dataAcquisition']);
  //   newRole = false;
  // } else if((to.path).includes("personnel")&&!((from.path).includes("personnel"))){
  //   setRole(['personnel']);
  //   newRole = true;
  // }else if((to.path).includes("personnel")&&(from.path).includes("personnel")){
  //   setRole(['personnel']);
  //   newRole = false;
  // } else if((to.path).includes("car")&&!((from.path).includes("car"))){
  //   setRole(['car']);
  //   newRole = true;
  // } else if((to.path).includes("car")&&(from.path).includes("car")){
  //   setRole(['car']);
  //   newRole = false;
  // }else if((to.path).includes("video")&&!((from.path).includes("video"))){
  //   setRole(['video']);
  //   newRole = true;
  // }else if((to.path).includes("video")&&(from.path).includes("video")){
  //   setRole(['video']);
  //   newRole = false;
  // }else{
  //   setRole(['system']);
  //   newRole = true;
  // }

  if((to.path).includes("system")){
    setRole(['system']);
  } else if((to.path).includes("dataExchange")){
    setRole(['dataExchange']);
  } else if((to.path).includes("dataAcquisition")){
    setRole(['dataAcquisition']);
  } else if((to.path).includes("personnel")){
    setRole(['personnel']);
  }else if((to.path).includes("car")){
    setRole(['car']);
  } else if((to.path).includes("video")){
    setRole(['video']);
  } else if((to.path).includes("electron")){
    setRole(['map']);
  }else{
    setRole(['system']);
  }


  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = sessionStorage.getItem('Admin-Token')
  // const hasToken = 'token=Admin-Token'
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0 &&(store.getters.roles.sort().toString() == getRole().sort().toString())
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const roles = await store.dispatch('user/getInfo')
          console.log('获取')
          console.log(roles)
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )
          console.log(accessRoutes)
          router.addRoutes(accessRoutes)
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      // next(`/login?redirect=/system/organization/manage`)
      NProgress.done()
    }
  }

  // //搞好的一版开始
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     next({path: '/'})
  //     NProgress.done()
  //   } else {
  //     try {
  //       const accessRoutes = await store.dispatch('permission/generateRoutes')
  //       router.addRoutes(accessRoutes)
  //       next()
  //     } catch (error) {
  //       next(`/login?redirect=${to.path}`)
  //       NProgress.done()
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     console.log('拦截')
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
  // //搞好的一版结束
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
