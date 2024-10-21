<template>
    <div class="mask">
    </div>
    <div class="paySuccess" :style="{ color: color }">
        <button class="closebtn" @click="clostForm">
            <svg class="icon" aria-hidden="true" :style="{ color: color }">
                <use xlink:href="#icon-cuowu"></use>
            </svg>
        </button>
        <div class="box">
            <div class="form" v-for="data in fruitData">
                {{ data.name }}：<input type="text" :style="{ color: color, borderBottom: `2px solid ${color}` }"
                    v-model="data.detail">
            </div>
            描述：<textarea cols="30" rows="6" :style="{ color: color, border: `2px solid ${color}` }"
                v-model="description"></textarea>
            <button :style="{ backgroundColor: color }" class="save" @click="subForm">确定</button>
        </div>
        <div class="tip" :class="[showTips ? 'showTips' : '']">
            <el-button :type="tipType">{{ msgData }}</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import emitter from '@/utils/mitter'
const fruitName = ref<string>("")
const description = ref<string>("")
const price = ref<string>("")
const { clostForm, color, increaseFruits } = defineProps(['clostForm', 'color', 'increaseFruits'])
const fruitData = reactive([{ name: '水果名', detail: fruitName }, { name: '价格', detail: price }])
//提示框出现与否
const showTips = ref(false)
//提示框内容
const msgData = ref()
//提示框颜色
const tipType = ref('success')
const subForm = () => {
    const data = { fruitName: fruitName.value, description: description.value, price: price.value }
    increaseFruits(data)
}

emitter.on('opera-data', (data) => {
    if (data === '添加成功') {
        tipType.value = 'success'
        msgData.value = '添加成功'
    } else {
        tipType.value = 'danger'
        msgData.value = data
    }
    showTips.value = true
    setTimeout(() => {
        showTips.value = false
    }, 1000)
})
onBeforeUnmount(() => {
    emitter.all.clear
})
</script>

<style scoped lang='less'>
.tip {
    position: relative;
    top: 109px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all .5s;
}

.showTips {
    opacity: 1;
}

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
    width: 360px;
    height: 400px;
    background-color: #fff;
    border-radius: 16px;
    color: #ff8c44;
    z-index: 999;

    .box {
        position: relative;
        top: 48px;

        .form {
            margin: 30px 0;
        }

        textarea {
            vertical-align: top;
            outline: none;
        }

        input {
            border: none;
            outline: none;
            color: #f69292;
            font-size: 16px;
            border-bottom: 1px solid #ff9797;
        }

        .save {
            position: absolute;
            bottom: -40px;
            left: 44%;
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
