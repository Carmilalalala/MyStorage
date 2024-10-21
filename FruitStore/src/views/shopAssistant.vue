<template>
    <div class="select">
        <h1>欢迎{{ userName }}</h1>
        <h4>请选择您的操作</h4>
        <div class="menu">
            <button class="manage" @click="updatePage(index)" v-for="(data, index) in menu"
                :class="sel == index ? 'active' : ''">{{ data.name }}</button>

        </div>
        <div class="operaPage">
            <component :is="comId" :page="currentPage"></component>
        </div>
    </div>
    <div class="leave">
        <logout></logout>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, shallowRef } from 'vue'
import operaFruit from '@/components/operaFruit.vue';
import operaOrder from '@/components/operaOrder.vue';
import logout from '@/components/logout.vue';
const { userName } = JSON.parse(localStorage.getItem('user'))
//菜单栏
const sel = ref<number>(0)
const menu = [{ name: '水果管理', comId: operaFruit }, { name: '订单管理', comId: operaOrder }]
//页面切换
const comId = shallowRef<number>(operaFruit)
const updatePage = (index: number) => {
    sel.value = index
    comId.value = menu[index].comId
}
//当前页面
const currentPage = ref<number>(1)
</script>

<style scoped lang='less'>
.select {
    margin: 0 auto;
    padding: 0 12%;
    text-align: center;

    h1,
    h4 {
        margin-bottom: 10px;
        color: #9ed4b4;
    }

    .menu {
        margin-bottom: 20px;

        button:first-child {
            border-radius: 10px 0 0 10px;
        }

        button:nth-child(2) {
            border-radius: 0 10px 10px 0;
        }

        .manage {
            color: #9ed4b4;
            background-color: #fff;
            border: none;
            padding: 8px 16px;
            transition: all .4s;
        }

        .active {
            background-color: #9ed4b4;
            color: #fff;
        }
    }

    .operaPage {
        width: 100%;
        background-color: #fff;
        border-radius: 18px;
    }
}

.leave {
    position: absolute;
    top: 52px;
    right: 100px;
}
</style>
