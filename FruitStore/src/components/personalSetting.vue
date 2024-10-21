<template>
    <div>
        <ul>
            <li v-for="(m, index) in personalModel" @click="addClassName(index, m)"
                :class="[index == actP ? 'acted' : '']">
                {{ m }}</li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { router } from '@/router';
const personalModel = ['我的会员', '我的购物车', '我的订单', '前往购物']
const actP = ref(0)
const addClassName = (index: number, m: string) => {
    actP.value = index
    switch (m) {
        case '我的购物车':
            router.push({ name: 'ShopCar' })
            break;
        case '我的订单':
            router.push({ name: 'MyOrders' })
            break;
        case '前往购物':
            router.push({ name: 'Customer' })
            break;
    }
}
</script>

<style scoped lang='less'>
ul {
    padding: 12px 0px;
    background-color: #fff;
    border-radius: 15px;
}

li {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    padding: 0px 15px;
    margin: 16px 18px;
    border-radius: 8px;
    list-style: none;
    cursor: pointer;
}

.acted {
    color: #ff712c;
    background-color: #ffefe6;
}
</style>
