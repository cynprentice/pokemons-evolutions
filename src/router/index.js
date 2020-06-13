import Vue from 'vue'
import VueRouter from 'vue-router'
import Evolutions from '@/views/Evolutions'
import Pokemon from '@/views/Pokemon'
import About from '@/views/About'
import VueCarousel from 'vue-carousel';


Vue.use(VueRouter)
Vue.use(VueCarousel);

  const routes = [
    {
      path: '/',
      name: 'Evolutions',
      component: Evolutions
    },
    {
      path: '/:pokedexNumber/pokemon',
      name: 'Pokemon',
      component: Pokemon
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
]

const router = new VueRouter({
  routes
})

export default router
