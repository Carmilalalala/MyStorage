<template>
    <div class="box">
        <div class="allFruit">
            <table v-if="!isEmpty">
                <thead align="center" valign="center" id="title">
                    <tr>
                        <td v-for="data in orderMenu">{{ data }}</td>
                    </tr>
                    <tr style="border: none;">
                        <td colspan="6">
                            <div class="Controls">
                                <span><input type="checkbox" v-model="selectAll">全选</span>
                                <button @click="delectOrder(selectedList)">取消订单</button>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody align="center" valign="center" v-for="data in orderList" v-if="orderList.length > 0">
                    <tr id="title" v-show="data.orderStatus >= 0">
                        <td colspan="6">
                            <div class="box">
                                <input type="checkbox" v-model="data.selected" v-if="data.orderStatus === 0">
                                <span class="orderTime">{{ data.createdTime }}</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(cart, index) in data?.cartsList" v-show="data.orderStatus >= 0">
                        <td>
                            <div class="fruitImg"><img :src="getFruitUrl(cart.fruit.fruitName)"><span>{{
                                cart.fruit.fruitName
                                    }}</span></div>
                        </td>
                        <td>{{ cart.fruit.price.toFixed(2) }}/斤</td>
                        <td>{{ cart.count }}斤</td>
                        <td :rowspan="data.cartsList.length" v-show="index === 0 ? true : false" class="addMargin">
                            <span v-if="membershipStatus === 1" class="orgPrice">原价：￥{{ data.totalAmount }}</span><br>
                            <span>折扣价：￥{{ data.totalAmount * discount }}</span>
                        </td>
                        <td :rowspan="data.cartsList.length" v-show="index === 0 ? true : false" class="addMargin">{{
                            menuData[data.orderStatus + 1] }}</td>
                        <td :rowspan="data.cartsList.length" v-show="index === 0 ? true : false"
                            class="addMargin shipments">
                            <button @click="payOrder(index, data.id)" v-if="data.orderStatus == 0">支付订单</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="listIsEmpty" v-if="isEmpty">
                <h2 v-if="noList == -1">暂无订单，快去<a><router-link :to="{ name: 'Customer' }">购物</router-link></a>吧</h2>
                <h2 v-if="noList == 0">暂无待付款信息</h2>
                <h2 v-if="noList == 1">暂无已支付信息</h2>
                <h2 v-if="noList == 2">暂无已发货信息</h2>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, watchEffect, defineProps } from 'vue'
import emitter from '@/utils/mitter';
const { orderList, delectOrder, payOrder, noList, isEmpty } = defineProps(['orderList', 'delectOrder', 'payOrder', 'noList', 'isEmpty'])
//获取用户会员信息
const { membershipStatus } = JSON.parse(localStorage.getItem('user'))
const discount = ref<number>(1)
if (membershipStatus === 1) discount.value = 0.9
const orderMenu = ['商品', '单价', '数量', '实付款', '交易状态', '操作']
const menuData = ['所有订单', '待付款', '已支付', '已发货']

const getFruitUrl = (name) => {
    return `/src/assets/image/${name}.jpg`
}

//多选框全选
const isDisabled = ref(false)
const selectAll = computed({
    get: () => {
        const allSelected = orderList.length && orderList.every(item => {
            return item.orderStatus === 0 ? item.selected : true;
        });
        return allSelected && orderList.length > 0;
    },
    set: (value) => {
        orderList.forEach(item => {
            if (item.orderStatus === 0) {
                item.selected = value;
            }
        });
    }
});

//将选择的商品存入到selectedList
const selectedList = reactive([])
watchEffect(() => {
    selectedList.splice(0, selectedList.length, ...orderList.filter(item => item.selected));
});
</script>

<style scoped lang='less'>
.box {
    .allFruit {
        margin-top: 28px;
        padding-bottom: 20px;
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background-color: #fff;
        overflow: hidden;

        .listIsEmpty {
            width: 100%;

            h2 {
                line-height: 128px;
                text-align: center;
                color: #ffd64b;

                a {
                    color: #ff8343;
                }
            }
        }

        table {
            margin: 0 auto;
            width: 100%;
            border-collapse: collapse;
        }

        #title {
            height: 58px;
            background-image: linear-gradient(to right, #ffd64b, #ff8343);
            color: #fff;
            font-size: 20px;
            border: none;

            .box {
                position: relative;
                display: flex;
                align-items: center;
                font-size: 15px;
                line-height: 45px;

                input {
                    width: 20px;
                    height: 20px;
                    margin-left: 60px;
                }

                .orderTime {
                    position: absolute;
                    left: 100px;
                }
            }
        }

        thead {
            tr:first-child {
                background-image: linear-gradient(to right, #ffd64b, #ff8343);
                color: #fff;
                height: 58px;
            }

            tr {
                background-color: #fff;
            }
        }

        tbody {
            .fruitImg {
                img {
                    vertical-align: middle;
                    width: 128px;
                }

                span {
                    padding-left: 20px;
                    font-weight: 700;
                }
            }

            tr {
                border-bottom: 2px solid #ffdc77;

                button {
                    width: 72px;
                    height: 46px;
                    border-radius: 20px;
                    border: none;
                    background-color: #ff8343;
                    color: #fff;
                    cursor: pointer;
                }

                .addMargin {
                    border-left: 2px solid #ffdc77;
                }

                .shipments {
                    min-width: 90px;
                }
            }
        }

        .Controls {
            display: flex;
            padding: 14px 60px;
            color: #ffca4a;
            font-size: 20px;

            span {
                margin-right: 48px;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                input {
                    margin-right: 6px;
                    width: 20px;
                    height: 20px;
                }
            }

            button {
                height: 36px;
                width: 100px;
                border-radius: 6px;
                font-size: 20px;
                background-color: #fff;
                border: 1px solid #ffca4a;
                color: #ffca4a;
                cursor: pointer;
            }
        }
    }
}
</style>
