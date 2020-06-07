import Vue from 'vue'
import VueRouter from 'vue-router'
import Evolutions from '@/views/Evolutions'
import Pokemon from '@/views/Pokemon'



Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Evolutions',
      component: Evolutions
    },
    {
      path: '/:name/pokemon',
      name: 'Pokemon',
      component: Pokemon
    }
]

const router = new VueRouter({
  routes
})

export default router
