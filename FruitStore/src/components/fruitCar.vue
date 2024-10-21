<template>
    <!-- 购物车页面 -->
    <div class="car">
        <div class="car_left">
            <div class="Controls" v-show="!isEmpt">
                <span><input type="checkbox" v-model="selectAll">全选</span>
                <button @click="deleteCart">删除</button>
            </div>
            <table class="show" v-show="!isEmpt">
                <thead align="center" valign="center">
                    <tr>
                        <td v-for="menu in menus">{{ menu }}</td>
                    </tr>
                </thead>
                <tbody align="center" valign="center">
                    <tr v-for="(f, index) in fruitCarList" v-show="f.status != '0'"
                        :id="[f.status == '2' ? 'mask' : '']">
                        <td>
                            <div class="box">
                                <input type="checkbox" v-model="f.selected" :value="index">
                                <img :src=getFruitUrl(f.fruit.fruitName)>
                            </div>
                        </td>
                        <td>
                            <span v-if="discount != 1">会员折扣价</span>
                            <br><span v-if="discount != 1" class="orgPrice">{{ f.fruit.price }}/斤</span>
                            <span>{{ (f.fruit.price * discount).toFixed(2) }}/斤</span>
                        </td>
                        <td style="position: relative;width:220px"><button @click="modify(index, f.count, f.id, 'sub')"
                                ref="btnSub" :disabled="isDisabled">-</button><span class="count">{{
                                    f.count
                                }}</span><button @click="modify(index, f.count, f.id, 'add')">+</button>
                            <transition name="fade">
                                <span class="tips" v-if="isTips && place == index">库存不足</span>
                            </transition>
                        </td>
                        <td style="width:120px">
                            <span>{{ (f.fruit.price * f.count * discount).toFixed(2) }}元</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="emptCar" v-show="isEmpt">
                <span> 购物车为空，前往<a><router-link :to="{ name: 'Customer' }">加购</router-link></a>吧</span>
            </div>
        </div>
        <div class="car_right">
            <div class="right_inner">
                <h3>结算明细</h3>
                <h4>已选{{ selectedList.length }}件商品</h4>
                <div class="imgs">
                    <img :src=getFruitUrl(f.fruit.fruitName) alt="" v-for="f in selectedList">
                </div>
                <h1>合计：{{ total.toFixed(2) }}元</h1>
                <button @click="subMit">提交订单</button>
            </div>
        </div>
        <transition name="fade">
            <div class="success" v-if="isSuccess">
                <p>订单提交成功，是否跳转到订单界面</p>
                <div class="btn">
                    <button class="no" @click="isSuccess = false">取消</button>
                    <button class="yes" @click="toOrders">确定</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang='ts'>
import { authInstance } from '@/utils/Axios'
import { router } from '@/router';
import axios from 'axios'
import { ref, reactive, toRaw, computed, onMounted, watch, watchEffect } from 'vue'

const props = defineProps({
    isVip: Boolean
});

// 直接使用解构的响应式引用
watch(() => props.isVip, () => {
    if (props.isVip) discount.value = 0.9
    else discount.value = 1
});

const discount = ref<number>(1)
//获取水果图片链接
const getFruitUrl = (name) => {
    return `/src/assets/image/${name}.jpg`
}

const menus = ['商品', '单价', '数量', '总价']
const fruitCarList = reactive([])
const isTips = ref<boolean>(false)
//多选框全选
const isDisabled = ref(false)
const selectAll = computed({
    get: () => {
        const allSelected = fruitCarList.length && fruitCarList.every(item => {
            return item.status === 1 ? item.selected : true;
        });
        return allSelected && fruitCarList.length > 0;
    },
    set: (value) => {
        fruitCarList.forEach(item => {
            if (item.status === 1) {
                item.selected = value;
            }
        });
    }
});

//将选择的商品存入到selectedList
const selectedList = reactive([])
watchEffect(() => {
    selectedList.splice(0, selectedList.length, ...fruitCarList.filter(item => item.selected));
});

const isSuccess = ref<boolean>(false)
//提交订单
const subMit = async () => {
    if (selectedList.length != 0) {
        try {
            const cartsId = selectedList.map(item => item.id).join(',')
            selectedList.filter(item => item.selected).forEach(element => {
                element.selected = false
            });
            const re = await authInstance({ url: '/orders/create', method: 'post', params: { cartsId } })
            getFruitCar(currentPage.value)
            isSuccess.value = true
        } catch (err) {
            console.log(err);
        }
    }
}

//跳转订单页面
const toOrders = () => {
    router.push({ name: 'MyOrders' })
}

//加购商品
const place = ref<number>()
const modify = async (index, count, cartId, met) => {
    if (met == 'sub') {
        if (--count <= 0)
            return
    } else {
        //加购超出库存
        if (++count > fruitCarList[index].fruit.quantity) {
            place.value = index
            isTips.value = true
            setTimeout(() => {
                isTips.value = false
            }, 1500);
            return
        }
    }
    try {
        const res = await authInstance({ url: '/carts/modify', method: 'post', params: { cartId, count } });
        fruitCarList[index].count = count
    } catch (err) {
        console.log(err);
    }
}

//删除商品
const deleteCart = () => {
    try {
        const delList = fruitCarList.filter(item => item.selected === true)
        const statusList = []
        delList.forEach(async (del) => {
            const re = await authInstance({ url: `/carts/delete/${del.id}`, method: 'delete' })
            statusList.push(re.status)
        });
        if (statusList.every(element => element === '0')) {
            alert('删除成功')
            //清空右侧总价
            delList.forEach(element => {
                element.selected = false
            });
            //重新获取水果列表
            getFruitCar(currentPage.value)
        }
    } catch (err) {
        console.log(err);

    }
}

//计算总价
const total = computed(() => {
    return fruitCarList.reduce((prev, next) => {
        if (next.selected)
            return prev + next.count * next.fruit.price * discount.value
        else
            return prev * discount.value
    }, 0)
})

//获取购物车列表，一页十条
let currentPage = ref(1)
const isEmpt = ref<boolean>(true)
async function getFruitCar(page: number) {
    try {
        const fruitShopCarData = await authInstance({ url: `/carts/list/${page}`, method: 'get' })
        if (fruitShopCarData.status === '0') {
            isEmpt.value = false
            fruitCarList.splice(0, fruitCarList.length, ...fruitShopCarData.data)
            fruitCarList.forEach(item => {
                item.selected = false
            });
        } else {
            isEmpt.value = true
        }
    } catch (error) {
        console.log(err);
    }
}
onMounted(async () => {
    getFruitCar(currentPage.value)
})

</script>

<style scoped lang='less'>
.car {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    .car_left {
        width: 66%;
        height: 100%;
        min-height: 240px;
        border-radius: 20px;
        background-color: #fff;

        .Controls {
            display: flex;
            padding: 14px 60px;
            width: 98%;
            height: 55px;
            color: #f69292;
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
                height: 28px;
                width: 68px;
                border-radius: 6px;
                font-size: 20px;
                background-color: #ececec;
                border: none;
                color: #f69292;
            }
        }

        .show {
            margin: 0 auto 25px;
            width: 100%;
            height: 45px;
            border-collapse: collapse;
            color: #f69292;

            thead {
                height: 48px;
                font-size: 18px;
                border: none;
                background-color: #ececec;
            }

            tbody {

                tr {
                    border-top: 1px solid #ececec;
                    border-bottom: 1px solid #ececec;

                    .tips {
                        position: absolute;
                        bottom: 18px;
                        left: 80px;
                        transition: opacity .6s ease;
                    }

                    .orgPrice {
                        position: relative;
                        margin-right: 6px;

                        &::after {
                            content: '';
                            position: absolute;
                            top: 10px;
                            left: 0px;
                            display: block;
                            width: 100%;
                            border-bottom: 2px solid #a56262;
                        }
                    }
                }

                #mask {
                    position: relative;

                    &::after {
                        content: "已失效";
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        font-size: 60px;
                        line-height: 119px;
                        color: #ebebeb;
                        font-family: 'Roboto', sans-serif;
                        background-color: rgba(0, 0, 0, 0.2);
                        z-index: 99;
                    }
                }

                .box {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    input {
                        position: absolute;
                        top: 45%;
                        left: 25px;
                        width: 20px;
                        height: 20px;
                    }

                    img {
                        margin-right: 10px;
                        height: 128px;
                    }
                }

                button {
                    width: 32px;
                    height: 32px;
                    border: none;
                    color: #f69292;
                    border-radius: 15px;
                }

                .count {
                    margin: 0 10px;
                }
            }
        }

        .emptCar {
            font-size: 60px;
            color: #f69292;
            cursor: pointer;
            text-align: center;
            line-height: 240px;

            a {
                color: #f69292;
                text-decoration: none;
                transition: all .4s ease;
            }

            a:hover {
                color: #e74c4c;
            }
        }
    }

    .car_right {
        width: 26%;
        border-radius: 20px;
        background-color: #fff;
        color: #f69292;

        .right_inner {
            display: flex;
            margin: 10px auto;
            width: 80%;
            flex-direction: column;

            .imgs {
                margin: 18px 0;
            }

            img {
                margin-right: 8px;
                width: 110px;
            }

            & button {
                margin-top: 58px;
                height: 42px;
                border: none;
                border-radius: 22px;
                color: #fff;
                font-size: 20px;
                background-color: #f69292;
            }
        }
    }

    .success {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        height: 150px;
        color: #fff;
        background-color: #f69292;
        border-radius: 18px;
        transition: opacity .6s ease;

        p {
            line-height: 68px;
            font-size: 18px;
            text-align: center;
        }

        .btn {
            position: absolute;
            bottom: 32px;
            left: 30%;
            width: 300px;
            margin: 0 auto;
        }

        .btn>button {
            padding: 6px 18px;
            border-radius: 15px;
            color: #f69292;
            background-color: #fff;
            border: none;
        }

        .no {
            margin-right: 50px;
        }
    }
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
