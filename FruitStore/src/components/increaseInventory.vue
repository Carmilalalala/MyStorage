<template>
    <div class="mask">
    </div>
    <div class="paySuccess" :style="{ color: color }">
        <div class="tip" :class="[showTips ? 'showTips' : '']">
            <el-button :type="tipType">{{ msgData }}</el-button>
        </div>
        <button class="closebtn" @click="clostTip">
            <svg class="icon" aria-hidden="true" :style="{ color: color }">
                <use xlink:href="#icon-cuowu"></use>
            </svg>
        </button>
        <div class="box">
            输入增加的库存量：<input type="number" :style="{ color: color, borderBottom: `2px solid ${color}` }" v-model="count">
            <button :style="{ backgroundColor: color }" class="save" @click="simpDeal()">确定</button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import emitter from '@/utils/mitter'
const { clostTip, color, addInventory } = defineProps(['clostTip', 'color', 'addInventory'])
const count = ref<number>()
//提示框出现与否
const showTips = ref(false)
//提示框内容
const msgData = ref()
//提示框颜色
const tipType = ref('success')
const simpDeal = () => {
    if (typeof count.value === 'string' || count.value <= 0) {
        count.value = 1
        showTips.value = true
        tipType.value = 'danger'
        msgData.value = '请输入大于等于一的数字'
        setTimeout(() => {
            showTips.value = false
        }, 1000);
    }
    else
        addInventory(count.value)
}

emitter.on('add-fruit', (msg) => {
    showTips.value = true
    if (msg == '补货成功')
        msgData.value = msg
    else {
        tipType.value = 'danger'
        msgData.value = '补货失败'
    }
    setTimeout(() => {
        showTips.value = false
    }, 1000);
})

onBeforeUnmount(() => {
    emitter.all.clear
})
</script>

<style scoped lang='less'>
.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 99;
}

.paySuccess {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 270px;
    height: 235px;
    background-color: #fff;
    border-radius: 16px;
    color: #ff8c44;
    z-index: 999;

    .tip {
        position: relative;
        top: 36px;
    }

    .box {
        position: relative;
        top: 46px;

        input {
            margin-top: 25px;
            width: 140px;
            line-height: 20px;
            border: none;
            outline: none;
            color: #f69292;
            font-size: 16px;
            border-bottom: 1px solid #ff9797;
        }

        .save {
            position: absolute;
            bottom: -55px;
            left: 40%;
            border-radius: 8px;
            padding: 4px 11px;
            border: none;
            background-color: #9ed4b4;
            color: #fff;
        }

    }

    .closebtn {
        position: absolute;
        top: 8px;
        right: 12px;
        border: none;
        background-color: #fff;
        cursor: pointer;

        .icon {
            width: 25px;
            height: 25px;
            fill: currentColor;
            color: #ff8c34;
        }
    }
}
</style>
