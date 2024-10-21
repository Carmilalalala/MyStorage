<template>
    <div class="all">
        <div class="menu">
            <ul>
                <li v-for="(data, index) in menuData" :key="index" @click="getASpecificOrder(index)"
                    :class="index === plc ? 'active' : ''">{{ data.name
                    }}<span class="count">{{
                        data.count }}</span></li>
            </ul>
        </div>
        <clientOrder :orderList="orderList" :noList="noList" :isEmpty="isEmpty" :shipments="shipments"></clientOrder>
        <payOrders v-if="subOrder" :emsg="emsg" :clostTip="clostTip" :color="color"></payOrders>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, nextTick } from 'vue'
import clientOrder from '@/components/clientOrder.vue'
import payOrders from '@/components/payOrders.vue'
import emitter from '@/utils/mitter';
import { authInstance } from '@/utils/Axios'
import { pa } from 'element-plus/es/locales.mjs';
const page = ref(1)
const status = ref<number>(-1)
//点击li高亮
const plc = ref(0)
//订单数量
const allOrders = ref<number>(0)
const pendingPayment = ref<number>(0)
const dropshipping = ref<number>(0)
const shipped = ref<number>(0)
//菜单栏
const menuData = [{ name: '所有订单', count: allOrders }, { name: '用户待付款', count: pendingPayment }, { name: '待发货', count: dropshipping }, { name: '已发货', count: shipped }]
const orderList = reactive([])
//订单提交提示
const emsg = ref<string>('')
const subOrder = ref<boolean>(false)
const color = '#9ed4b4'
//订单为空/没货时显示
const noList = ref<number>(-2)
const isEmpty = ref(false)

//订单发货
const shipments = async (orderId) => {
    console.log(orderId);
    const re = await authInstance({ url: `/clerks/orders/finish/${orderId}` })
    getOrders(page.value, status.value)
}

//获取所有订单
const getOrders = async (currentPage: number, status: number) => {
    const re = await authInstance({
        url: 'clerks/orders/list', method: 'post', data: { status, currentPage }, headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
    console.log(re);
    if (re.status === '0')
        orderList.splice(0, orderList.length, ...re.data)
    else if (re.status === 'A40002')
        orderList.length = 0
    if (status == -1)
        updateCount(orderList)
}

// 更新订单数量
const updateCount = (list) => {
    pendingPayment.value = 0
    dropshipping.value = 0
    shipped.value = 0
    allOrders.value = 0
    list.forEach(item => {
        switch (item.orderStatus) {
            case 0:
                pendingPayment.value += 1
                break
            case 1:
                dropshipping.value += 1
                break
            case 2:
                shipped.value += 1
                break
            default:
                break
        }
    })
    allOrders.value = list.length
}

//获取特定订单
const getASpecificOrder = async (index: number) => {
    isEmpty.value = false
    plc.value = index
    status.value = index - 1
    getOrders(page.value, index - 1)
}


// 关闭订单提示
const clostTip = () => {
    subOrder.value = false
}

onMounted(() => {
    getOrders(page.value, status.value)
})

</script>

<style scoped lang='less'>
.all {
    width: 100%;
    height: 100%;
    background-color: #fff;

    .menu {
        display: flex;
        justify-content: space-around;
        height: 62px;

        ul {
            display: flex;
            cursor: pointer;

            .active {
                color: #34995d;
            }

            li {
                position: relative;
                margin: 18px 32px 0px 15px;
                padding: 0 20px 40px 0px;
                height: 26px;
                line-height: 26px;
                color: #3b3b3b;
                font-weight: 600;
                font-size: 20px;
                list-style: none;

                &:hover {
                    color: #34995d;
                }

                .count {
                    position: absolute;
                    right: -9px;
                }
            }
        }
    }
}
</style>
