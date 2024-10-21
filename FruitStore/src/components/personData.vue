<template>
    <div class="personTop">
        <div class="v-info">
            <div class="data">
                <div class="avatar">
                    <el-avatar :icon="UserFilled" :size="64" />
                </div>
                <div class="box">
                    <h4>{{ userName }}</h4>
                    <p>id：{{ id }}</p>
                    <span class="signature"><a>{{ vipData }}</a></span>
                </div>
                <button @click="recharge" class="recharge">余额充值</button>
            </div>
            <div class="opera">
                <ul class="orders">
                    <li v-for="data in menuData"><span class="count">{{
                        data.count }}</span>{{ data.name }}</li>
                </ul>
            </div>
        </div>
        <div class="vipInfo">
            <component :is="ifVip"></component>
            <div class="vip-benefits">
                <h4>会员专享权益</h4>
                <ul>
                    <li v-for="benefit in benefits">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href=benefit.icon></use>
                        </svg>
                        <span>{{ benefit.data }}</span>
                    </li>
                </ul>
            </div>
            <openAMembership :vipData="vipMsg" v-if="becVip"></openAMembership>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, shallowRef, onMounted } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { authInstance } from '@/utils/Axios'
import emitter from '@/utils/mitter'
import isVip from '@/components/isVip.vue'
import notVip from '@/components/notVip.vue'
import openAMembership from '@/components/openAMembership.vue'
let ifVip = shallowRef(notVip)
const becVip = ref<boolean>(false)
const vipMsg = ref<string>()
const allOrders = ref<number>(0)
const pendingPayment = ref<number>(0)
const paid = ref<number>(0)
const shipped = ref<number>(0)
const orderList = reactive([])
const menuData = [{ name: '所有订单', count: allOrders }, { name: '待付款', count: pendingPayment }, { name: '已支付', count: paid }, { name: '已发货', count: shipped }]

//获取用户信息
const { id, userName } = JSON.parse(localStorage.getItem('user'))
//判断是否会员
const vipData = ref('未开通会员')
const getVipData = async () => {
    try {
        const data = await authInstance({ url: '/memberships/query' })
        if (data.status === '-1') {
            ifVip.value = notVip
            vipData.value = data.msg
            vipMsg.value = '您还不是会员'
        }
        else if (data.status === '0') {
            ifVip.value = isVip
            vipData.value = '会员到期时间为' + data.data.expired
            vipMsg.value = '您已是会员，可享受九折优惠'
        }
    } catch (err) {
        console.log(err);
    }
}


//获取订单数量信息
const getOrds = async (page: number, status: number) => {
    const data = await authInstance({
        url: '/orders/list', method: 'post', data: { status: status, currentPage: page }, headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
    if (data.status === '0') {
        orderList.splice(0, orderList.length, ...data.data)
    }
    else if (data.status === 'A40002') {
        orderList.length = 0
    }
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

//余额充值
const recharge = () => {
    becVip.value = true
}
const benefits = [{ data: '生日礼', icon: "#icon-shengri" }, { data: '免运费', icon: "#icon-mianyunfei" }, { data: '积分翻倍', icon: "#icon-tequan_jifenfanbei" }, { data: '1分钱试吃', icon: "#icon-shichiquan" }, { data: '会员日', icon: "#icon-vip-fill" }, { data: 'VIP专享价', icon: "#icon-yx-icon-huiyuanquanyi-yuanxinhuiyuanri" }, { data: '百天礼', icon: "#icon-gift-full" }, { data: '升级礼包', icon: "#icon-shengjilibao" }]

//开通会员后刷新界面
emitter.on('flushed-vip', () => {
    getVipData()
})

emitter.on('close-openVip', (value: any) => {
    emitter.emit('flushed-vip')
    becVip.value = value
})

onMounted(() => {
    getVipData()
    getOrds(1, -1)
})
</script>

<style scoped lang='less'>
.personTop {
    width: 100%;
    height: 100%;

    .v-info {
        width: 100%;
        border-radius: 20px;
        background-color: #fff;

        .data {
            position: relative;
            padding-left: 24px;
            padding-top: 24px;
            display: flex;
            width: 100%;
            flex-direction: row;
            justify-content: flex-start;

            .box {
                margin-left: 24px;

                .signature {
                    cursor: pointer;
                    color: #ff8d5c;
                }
            }

            .recharge {
                position: absolute;
                top: 20px;
                right: 40px;
                width: 86px;
                height: 34px;
                font-size: 16px;
                border: none;
                background-color: #ff712c;
                color: #fff;
                border-radius: 18px;
            }
        }

        .opera {
            margin-top: 35px;
            width: 100%;
            padding-bottom: 20px;

            .orders {
                display: flex;
                justify-content: space-around;

                li {
                    position: relative;
                    list-style: none;
                    height: 48px;
                    line-height: 64px;
                    font-size: 18px;
                    cursor: pointer;
                }

                .count {
                    position: absolute;
                    top: -28px;
                    left: 41%;
                    cursor: pointer;
                }
            }
        }
    }

    .vipInfo {
        margin-top: 20px;
        background-color: #ffefe6;
        border-radius: 20px;
        padding: 10px 0;
        color: #ff712c;

        .vip-benefits {
            padding-top: 8px;

            h4 {
                text-align: center;
                font-size: 24px;
                margin-bottom: 10px;
                cursor: pointer;
            }

            ul {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;

                &>li {
                    display: flex;
                    flex-direction: column;
                    list-style: none;
                    flex-wrap: wrap;
                    align-items: center;
                    min-width: 170px;
                    align-content: center;
                    min-height: 108px;
                    cursor: pointer;

                    .icon {
                        fill: currentColor;
                        color: #9d9d9d;
                        width: 45px;
                        height: 58px;

                        &:hover {
                            color: #ff712c;
                        }
                    }
                }
            }
        }
    }
}
</style>
