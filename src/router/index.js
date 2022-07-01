import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/useUserStore'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  const auth = useUserStore()

  Router.beforeEach(async (to, from, next) => {
    if (to.path === '/auth/login' || to.path === '/auth/register') {
      return next()
    }
    try {
      const r = await api.get('/auth')
      console.log(r)
      if (r.data && r.data.user) {
        auth.update(r.data.user)
      } else {
        auth.update(null)
      }
    } catch (err) {
      auth.update(null)
      console.error(err)
    }
    next()
  })

  return Router
})
