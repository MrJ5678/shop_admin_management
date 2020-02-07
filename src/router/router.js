import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
const Home = () => import('../components/home/home.vue')
const Users = () => import('../components/users/users.vue')
const Roles = () => import('../components/roles/Roles.vue')
const Rights = () => import('../components/rights/Rights.vue')
const Categories = () => import('../components/categories/Categories.vue')
const Goods = () => import('../components/goods/Goods.vue')
const GoodsAdd = () => import('../components/goods/GoodsAdd.vue')

Vue.use(Router)

let router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/home',
      name: 'home',
      component: Home,
      children: [
        { path: '/users/:page?', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/categories', name: 'categories', component: Categories },
        { path: '/goods', name: 'goods', component: Goods },
        { path: '/goods-add', name: 'goods-add', component: GoodsAdd }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    token ? next() : next('/login')
  }
})

export default router
