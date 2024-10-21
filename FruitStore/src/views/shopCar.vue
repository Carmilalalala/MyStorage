<template>
    <div class="nav">
        <div class="fruit_nav">
            <h1 class="welcome">欢迎来到{{ userName }}的购物车</h1>
            <div class="toOther">
                <toShopping></toShopping>
            </div>
            <div class="member">{{ vipMsg }}</div>
        </div>
    </div>
    <div class="fruitCar">
        <fruitCar :isVip="isVip"></fruitCar>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { authInstance } from '@/utils/axios'
import fruitCar from '@/components/fruitCar.vue'
import toShopping from '@/components/toShopping.vue';
const { userName } = JSON.parse(localStorage.getItem('user'))
//查询会员信息
const isVip = ref<boolean>(false)
const vipMsg = ref()
const getVipData = async () => {
    try {
        const data = await authInstance({ url: '/memberships/query' })
        if (data.status === '-1') {
            vipMsg.value = '您还不是会员，成为会员可享更多折扣'
            isVip.value = false
        }
        else if (data.status === '0') {
            vipMsg.value = '您已是会员，可享受九折优惠'
            isVip.value = true
        }
    } catch (err) {
        console.log(err);
    }
}
onMounted(() => {
    getVipData()
})
</script>

<style scoped lang='less'>
.nav {
    margin: 0 auto;
    width: 90%;
    min-width: 1300px;
    height: 80px;

    .fruit_nav {
        position: relative;
        margin: 0 auto;
        width: 100%;
        padding: 0 52px;
        line-height: 80px;
        border-bottom: 1px solid #f69292;

        .welcome {
            font-size: 40px;
            color: #f69292;
            cursor: pointer;
        }


        .member {
            position: absolute;
            top: 20px;
            right: 90px;
            color: #f69292;
            font-weight: 700;
            cursor: pointer;

            a {
                color: #ed3737;
                font-weight: 700;
            }
        }
    }
}

.fruitCar {
    margin: 30px auto;
    width: 90%;
    min-width: 1200px;
    height: auto;
    overflow: hidden;
}
</style>
