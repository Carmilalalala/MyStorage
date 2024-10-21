<template>
    <div class="mask">
    </div>
    <div class="paySuccess" :style="{ color: color }">
        <button class="closebtn" @click="clostTip">
            <svg class="icon" aria-hidden="true" :style="{ color: color }">
                <use xlink:href="#icon-cuowu"></use>
            </svg>
        </button>
        <h1>{{ emsg }}</h1>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import emitter from '@/utils/mitter'
const { clostTip, emsg, color } = defineProps(['clostTip', 'emsg', 'color'])

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
    width: 360px;
    height: 120px;
    background-color: #fff;
    border-radius: 16px;
    color: #ff8c44;
    z-index: 999;

    h1 {
        margin-top: 32px;
        text-align: center;
    }

    button {
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
