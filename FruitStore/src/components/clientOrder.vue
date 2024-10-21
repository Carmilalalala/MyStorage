<template>
    <div class="box">
        <div class="allFruit">
            <table v-if="!isEmpty">
                <thead align="center" valign="center" id="title">
                    <tr>
                        <td v-for="data in orderMenu">{{ data }}</td>
                    </tr>
                </thead>
                <tbody align="center" valign="center" v-for="data in orderList" v-if="orderList.length > 0">
                    <tr id="title" v-show="data.orderStatus >= 0">
                        <td colspan="6">
                            <div class="box">
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
                        <td :rowspan="data.cartsList.length" v-show="index === 0 ? true : false" class="addMargin">￥{{
                            data.totalAmount }}</td>
                        <td :rowspan="data.cartsList.length" v-show="index === 0 ? true : false" class="addMargin">{{
                            menuData[data.orderStatus + 1] }}</td>
                        <td :rowspan="data.cartsList.length" v-show="index === 0 ? true : false"
                            class="addMargin shipments">
                            <button @click="shipments(data.id)" v-if="data.orderStatus == 1">发货</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="listIsEmpty" v-if="isEmpty">
                <h2 v-if="noList == -1">暂无订单</h2>
                <h2 v-if="noList == 0">暂无用户待付款订单</h2>
                <h2 v-if="noList == 1">暂无待发货订单</h2>
                <h2 v-if="noList == 2">暂无已发货订单</h2>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, watchEffect, defineProps } from 'vue'
import emitter from '@/utils/mitter';
const { orderList, noList, isEmpty, shipments } = defineProps(['orderList', 'noList', 'isEmpty', 'shipments'])
const orderMenu = ['商品', '单价', '数量', '实付款', '交易状态', '操作']
const menuData = ['所有订单', '用户待付款', '待发货', '已发货']

const getFruitUrl = (name) => {
    return `/src/assets/image/${name}.jpg`
}
</script>

<style scoped lang='less'>
.box {
    .allFruit {
        padding-bottom: 20px;
        width: 100%;
        height: 100%;
        background-color: #fff;
        overflow: hidden;

        .listIsEmpty {
            width: 100%;

            h2 {
                line-height: 128px;
                text-align: center;
                color: #9ed4b4;

                a {
                    color: #34995d;
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
            background-color: #d0e6d9;
            color: #fff;
            font-size: 20px;
            border: none;

            .box {
                position: relative;
                display: flex;
                align-items: center;
                font-size: 15px;
                line-height: 45px;

                .orderTime {
                    position: absolute;
                    left: 100px;
                }
            }
        }

        thead {
            tr:first-child {
                background-color: #9ed4b4;
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
                border-bottom: 2px solid #9ed4b4;

                button {
                    width: 72px;
                    height: 46px;
                    border-radius: 20px;
                    border: none;
                    background-color: #34995d;
                    color: #fff;
                    cursor: pointer;
                }

                .addMargin {
                    border-left: 2px solid #9ed4b4;
                }

                .shipments {
                    min-width: 90px;
                }
            }
        }
    }
}
</style>
