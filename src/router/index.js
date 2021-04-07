import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Kusama from '../views/kusama/Kusama'
import Polkadot from '../views/polkadot/Polkadot'
import User from '../views/user/Index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: Home,
    component: Home
  },
  {
    path: '/kusama',
    name: 'Kusama',
    component: Kusama
  },
  {
    path: '/polkadot',
    name: 'Polkadot',
    component: Polkadot
  },
  {
    path: '/user',
    name: 'User',
    component: User
  }
]

const router = new VueRouter({
  routes
})

export default router
