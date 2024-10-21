<template>
    <div class="mask">
    </div>
    <div class="getMembership">
        <button class="closebtn" @click="emitter.emit('close-openVip', flase)">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-cuowu"></use>
            </svg>
        </button>
        <h3>{{ userName }},{{ vipData }}</h3>
        <p>请确保您的余额充足</p>
        <div class="select">
            <span v-for="(btn, index) in tabList" :class="[act == index ? 'active' : '']"
                @click="addActive(index, btn.com)" :key="index">{{ btn.name }}</span>
        </div>
        <Transition :name="currentView" mode="out-in">
            <component :is="comId"></component>
        </Transition>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, markRaw, shallowRef } from 'vue'
import reCharge from "@/components/reCharge.vue"
import beComeVip from "@/components/beComeVip.vue";
import emitter from '@/utils/mitter'
const { vipData } = withDefaults(defineProps<{
    vipData?: string
}>(), {
    vipData: '您还不是会员'
})
let act = ref(0)
let currentView = ref('slide-left')
let comId = shallowRef(reCharge)
const { userName } = JSON.parse(localStorage.getItem('user'))
const tabList = reactive([
    { name: '充值余额 ', com: markRaw(reCharge), comId: 1 }, { name: '/ ', com: '', comId: 0 }, { name: '成为会员', com: markRaw(beComeVip), comId: 2 }
])
if (vipData != '您还不是会员')
    tabList[2].name = '会员续费'
const addActive = (index: number, com: any) => {
    if (index != 1) {
        act.value = index
        comId.value = com
        currentView.value = comId.value == reCharge ? 'slide-left' : 'slide-right'
    }
}
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

.getMembership {
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-top: 20px;
    width: 680px;
    height: auto;
    border-radius: 10px;
    background-color: #fff;
    color: #ff9797;
    text-align: center;
    z-index: 999;
    overflow: hidden;

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
            color: #ff9797;
        }
    }

    h3 {
        margin: 10px 0;
    }

    .select {
        margin-top: 10px;

        span {
            color: #ccc;
            font-size: 16px;
            cursor: pointer;
            transition: all .4s;
        }

        .active {
            color: #ff9797;
            font-size: 18px;
        }
    }

    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: transform .3s linear;
    }

    .slide-right-leave-from {
        transform: translateX(0);
    }

    .slide-right-leave-to {
        transform: translateX(-100%);
    }

    .slide-left-leave-from {
        transform: translateX(0);
    }

    .slide-left-leave-to {
        transform: translateX(100%);
    }
}
</style>
