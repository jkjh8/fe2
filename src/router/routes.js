import MainLayout from 'src/layouts/MainLayout.vue'
import SimpleLayout from 'src/layouts/SimpleLayout.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }]
  },

  {
    path: '/auth',
    component: () => import('layouts/SimpleLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/loginPage.vue') },
      {
        path: 'register',
        component: () => import('pages/auth/registerPage.vue')
      },
      { path: 'user', component: () => import('pages/auth/userPage.vue') }
    ]
  },

  {
    path: '/zones',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/zones/zonesPage.vue')
      },
      {
        path: 'devices',
        component: () => import('pages/zones/devicesPage.vue')
      }
    ]
  },

  {
    path: '/eventlog',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/eventlog/eventlogPage.vue') }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'users', component: () => import('pages/admin/usersPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
