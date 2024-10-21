import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/home.vue'
import Customer from '@/views/customer.vue'
import Details from '@/views/details.vue'
import ShopCar from '@/views/shopCar.vue'
import MyOrders from '@/views/myOrders.vue'
import PersonHome from '@/views/personHome.vue'
import Administrator from '@/views/administrator.vue'
import ShopAssistant from '@/views/shopAssistant.vue'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/Home',
      component: Home
    },
    {
      name: 'Customer',
      path: '/Customer',
      component: Customer
    },
    {
      name: 'Details',
      path: '/Details/:id',
      component: Details
    },
    {
      name: 'ShopCar',
      path: '/ShopCar',
      component: ShopCar
    },
    {
      name: 'MyOrders',
      path: '/MyOrders',
      component: MyOrders
    },
    {
      name: 'PersonHome',
      path: '/PersonHome',
      component: PersonHome
    },
    {
      name: 'Administrator',
      path: '/Administrator',
      component: Administrator
    },
    {
      name: 'ShopAssistant',
      path: '/ShopAssistant',
      component: ShopAssistant
    },
    {
      path: '/',
      redirect: '/Home'
    }
  ]
})
