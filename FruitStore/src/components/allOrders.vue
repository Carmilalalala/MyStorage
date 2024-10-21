<template>
    <!-- 我的订单 -->
    <div class="all">
        <div class="menu">
            <div class="menu_left">
                <ul>
                    <li v-for="(data, index) in menuData" :key="index" @click="getASpecificOrder(index)"
                        :class="index === plc ? 'active' : ''">{{ data.name
                        }}<span class="count">{{ data.count }}</span><span class="separate"></span></li>
                </ul>
            </div>
            <div class="choose">
                <toShopping></toShopping>
            </div>
        </div>
        <Order :orderList="orderList" :delectOrder="delectOrder" :payOrder="payOrder" :noList="noList"
            :isEmpty="isEmpty"></Order>
        <payOrders v-if="subOrder" :emsg="emsg" :clostTip="clostTip" :color="color"></payOrders>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, nextTick } from 'vue'
import Order from '@/components/order.vue'
import payOrders from '@/components/payOrders.vue'
import emitter from '@/utils/mitter';
import { authInstance } from '@/utils/Axios'
import toShopping from './toShopping.vue';
const page = ref(1)
const status = ref<number>(-1)
//点击li高亮
const plc = ref(0)
//四个订单数量
const allOrders = ref<number>(0)
const pendingPayment = ref<number>(0)
const paid = ref<number>(0)
const shipped = ref<number>(0)
//菜单栏
const menuData = [{ name: '所有订单', count: allOrders }, { name: '待付款', count: pendingPayment }, { name: '已支付', count: paid }, { name: '已发货', count: shipped }]
const orderList = reactive([])
//订单提交提示
const emsg = ref<string>('')
const subOrder = ref<boolean>(false)
const color = '#ff8c44'
//订单为空/没货时显示
const noList = ref<number>(-2)
const isEmpty = ref(false)
//获取订单，一次十个
const getOrds = async (page: number, status: number) => {
    const data = await authInstance({
        url: '/orders/list', method: 'post', data: { status: status, currentPage: page }, headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
    console.log(data);
    if (data.status === '0') {
        // 操作成功
        orderList.splice(0, orderList.length, ...data.data)
        orderList.forEach(item => {
            item.selected = false
        });
    }
    else if (data.status === 'A40002') {
        orderList.length = 0
        isEmpty.value = true
        //订单列表为空
        noList.value = status
    }
    if (status == -1)
        updateCount(orderList)
}


// 更新订单数量
const updateCount = (list) => {
    pendingPayment.value = 0
    paid.value = 0
    shipped.value = 0
    allOrders.value = 0
    list.forEach(item => {
        switch (item.orderStatus) {
            case 0:
                pendingPayment.value += 1
                break
            case 1:
                paid.value += 1
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
    getOrds(page.value, index - 1)
}

// 删除订单
const delectOrder = async (selectedList) => {
    try {
        // 使用 Promise.all 来并行处理所有删除操作
        const promises = selectedList.map(element => {
            const delId = element.id;
            return authInstance({ url: `/orders/delete/${delId}`, method: 'delete' });
        });
        // 等待所有删除操作完成
        await Promise.all(promises);
        // 所有删除操作完成后，重新获取页面数据
        getOrds(page.value, status.value)
    } catch (err) {
        console.error('删除订单失败:', err);
    }
}

//支付订单
const payOrder = async (index: number, payId: number) => {
    try {
        const res = await authInstance({ url: `/orders/pay/${payId}` })
        console.log(res);
        if (res.status === "A40006") {
            subOrder.value = true
            emsg.value = '余额不足'
        } else if (res.status === "0") {
            orderList[index].selected = false
            subOrder.value = true
            emsg.value = '支付成功'
        }
        // 支付所有订单后，弹出提示框，重新获取页面数据
        getOrds(page.value, status.value)
    } catch (err) {
        console.log(err);
    }
}

// 关闭订单提示
const clostTip = () => {
    subOrder.value = false
}

onMounted(async () => {
    getOrds(page.value, status.value)
})
</script>

<style scoped lang='less'>
.all {
    margin: 45px auto 0;
    width: 90%;
    height: 100%;

    .menu {
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 62px;
        line-height: 50px;
        border-radius: 15px;
        background-color: #fff;
        border-top: 2px solid #ff8343;
        border-left: 2px solid #ff8343;
        border-right: 2px solid #ffd64b;
        border-bottom: 2px solid #ffd64b;

        .menu_left {
            position: relative;

            ul {
                display: flex;
                cursor: pointer;

                .active {
                    color: #ff8343;
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
                        color: #ff8343;
                    }

                    .count {
                        position: absolute;
                        right: -9px;
                        color: #ffd64b;
                    }

                    .separate {
                        position: absolute;
                        right: -28px;
                        width: 2px;
                        height: 28px;
                        background-color: #ffa920;
                        border: 1px solid #ffa920;
                        border-radius: 2px;
                    }
                }
            }
        }
    }
}
</style>
