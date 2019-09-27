import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Member from './views/Member.vue'
import NewMember from './views/NewMember.vue'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/entrar',
    name: 'login',
    component: Login
  },
  {
    path: '/miembro/:id',
    name: 'member',
    props: true,
    component: Member
  },
  {
    path: '/miembros/nuevo',
    name: 'new_member',
    props: true,
    component: NewMember,
    beforeEnter: AuthGuard
  },
  {
    path: '/about',
    name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
    ]
  })
