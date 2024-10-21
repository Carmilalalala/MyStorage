<template>
    <div class="box">
        开通月份：<input class="amount" v-model="month" type="number">
        <button @click="toCharge">开通</button>
        <div class="fixedAmount">
            <button v-for="num in numbers" @click="fillAmount(num)">{{ num }}</button>
        </div>
        <div class="tip" :class="[showTips ? 'showTips' : '']">
            <el-button :type="tipType">{{ msgData }}</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { authInstance } from '@/utils/Axios'
import emitter from '@/utils/mitter'
const month = ref<number>()
const numbers = [1, 3, 6, 12]
const fillAmount = (num: Number) => {
    month.value = num
}
//提示框出现与否
const showTips = ref(false)
//提示框内容
const msgData = ref()
//提示框颜色
const tipType = ref('success')
const toCharge = async () => {
    try {
        const res = await authInstance({ url: "/memberships/become", method: 'post', params: { month: Number(month.value) } })
        console.log(res);
        if (res.status === "A40006") {
            msgData.value = "余额不足，请充值"
            tipType.value = 'danger'
            showTips.value = true
        }
        else if (res.status === '0') {
            msgData.value = '开通成功'
            tipType.value = 'success'
            showTips.value = true
        }
        setTimeout(() => {
            showTips.value = false
        }, 1000);
    } catch (err) {
        console.log(err);
    }
}
</script>

<style scoped lang='less'>
.box {
    padding: 16px;

    input {
        border: none;
        outline: none;
        color: #f69292;
        border-bottom: 1px solid #ff9797;
    }

    >button {
        margin-left: 10px;
        padding: 0 16px;
        height: 20px;
        border: none;
        border-radius: 5px;
        color: #fff;
        background-color: #f69292;
    }

    .fixedAmount {
        margin-top: 10px;

        >button {
            margin-left: 10px;
            padding: 0 16px;
            height: 20px;
            border: none;
            border-radius: 5px;
            color: #fff;
            background-color: #f69292;
        }
    }

    button {
        cursor: pointer;
    }

    .tip {
        margin-top: 10px;
        opacity: 0;
        transition: all .5s;
    }

    .showTips {
        opacity: 1;
    }
}
</style>
