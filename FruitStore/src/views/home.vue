<template>
    <div class="main">
        <div class="box">
            <img src="../assets/image/homeBg.jpg" alt="">
            <div class="switch">
                <div class="select">
                    <span v-for="(btn, index) in tabList" :class="[act == index ? 'active' : '']"
                        @click="addActive(index, btn.com)" :key="index">{{ btn.name }}</span>
                </div>
                <Transition :name="currentView" mode="out-in">
                    <component :is="comId"></component>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, markRaw, shallowRef } from 'vue'
import Reg from "@/components/reg.vue"
import Log from "@/components/log.vue";
import emitter from '@/utils/mitter';
import Transition from 'vue';
let act = ref(0)
let comId = shallowRef(Log)
let currentView = ref('slide-left')
const addActive = (index: number, com: any) => {
    if (index != 1) {
        act.value = index
        comId.value = com
        currentView.value = comId.value == Log ? 'slide-left' : 'slide-right'
    }
}
const tabList = reactive([
    { name: '登录 ', com: markRaw(Log), comId: 1 }, { name: '/ ', com: '', comId: 0 }, { name: '注册', com: markRaw(Reg), comId: 2 }
])

emitter.on('to-log', () => {
    comId.value = Log
    act.value = 0
})
</script>

<style scoped lang='less'>
.main {
    padding-top: 60px;
    width: 100%;
    height: 100%;

    &::before {
        content: "";
        width: 100%;
        height: 100%;
        background: url(../assets/image/homeBg.jpg) no-repeat;
        background-size: cover;
        position: absolute;
        top: 0;
        z-index: -1;
        filter: opacity(20%);
    }

    .box {
        margin-left: 160px;
        display: flex;
        width: 990px;
        height: 500px;
        border-radius: 10px;
        background-color: #fff;
        overflow: hidden;

        img {
            width: 660px;
        }

        .switch {
            margin: 50px auto 0;
            overflow: hidden;

            .select {
                height: 38px;
                text-align: center;
                font-size: 18px;
                margin-bottom: 20px;

                span {
                    color: #ccc;
                    font-size: 1.4rem;
                    cursor: pointer;
                    transition: all .4s;
                }

                .active {
                    color: rgb(181, 154, 254);
                    font-size: 1.8rem;
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
    }
}
</style>
