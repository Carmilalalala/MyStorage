<template>
    <!-- 导航栏 -->
    <div class="ui">
        <div class="l-header">
            <div class="l-header__inner" @mouseenter="enter" @mouseleave="leave">
                <input type="text" v-model="fruitName">
                <button @click="searchFruit">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-sousuo3"></use>
                    </svg>
                </button>
            </div>
            <div class="l-header__nav" v-for="(self, index) in selfData" :class="[!flags[index] ? 'smaller' : '']"
                :key="index" @click="toOther(self.data)">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href=self.icon></use>
                </svg>
                <span v-if="flags[index]">{{ self.data }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { router } from '@/router';
import emitter from '@/utils/mitter';
import { log } from 'console';
const selfData = [{ data: "个人中心", icon: "#icon-sharpicons_chestnuts" }, { data: "我的订单", icon: "#icon-shouye" }, { data: "购物车", icon: "#icon-gouwuche" }]
//默认初始搜索框小，其他框大
const flags = ref<boolean[]>([true, true, true])
const enter = () => {
    flags.value[0] = false
    flags.value[1] = false
    flags.value[2] = false
}
//鼠标经过搜索框，搜索框变大，其他框变小
const leave = () => {
    flags.value[0] = true
    flags.value[1] = true
    flags.value[2] = true
}
//点击跳转到其他三个页面
const toOther = (data: string) => {
    switch (data) {
        case '个人中心':
            router.push({ name: 'PersonHome' })
            break
        case '购物车':
            router.push({ name: 'ShopCar' })
            break;
        case '我的订单':
            router.push({ name: 'MyOrders' })
            break;
    }
}
//模糊查询
const fruitName = ref<string>('')
//传递数据
const searchFruit = () => {
    if (fruitName.value != undefined)
        emitter.emit('update-fruit', fruitName.value)
}
</script>

<style scoped lang='less'>
.ui {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 1000px;
    height: 60px;
    border-radius: 10px;
    z-index: 1;

    .l-header {
        display: flex;
        height: 100%;
        justify-content: space-between;

        div {
            position: relative;
            border-radius: 60px;
            line-height: 60px;
            color: #606f00;
            font-size: 18px;
            background-color: #fff;
            transition: all .3s ease;
            cursor: pointer;
            overflow: hidden;

            &:hover {
                box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.2);
            }
        }

        .l-header__inner {
            width: 410px;

            input {
                position: absolute;
                width: 80%;
                height: 100%;
                border: none;
                outline: none;
                font-size: 30px;
                padding-left: 25px;
                color: #f2bdd7;
                overflow: hidden;
            }

            button {
                position: absolute;
                top: 6px;
                right: 20px;
                padding-left: 10px;
                height: 48px;
                border: none;
                background-color: #fff;
                border-left: 2px solid #d45d97;
                cursor: pointer;


                .icon {
                    width: 50px;
                    height: 50px;
                }
            }

            &:hover {
                width: 644px;
            }
        }

        .l-header__nav {
            display: flex;
            padding-top: 0;
            align-items: center;
            justify-content: center;
            width: 15%;
            text-align: center;
            overflow: hidden;

            .icon {
                width: 35px;
                height: 35px;
            }
        }

        span {
            color: #727f1d;
            line-height: 60px;
            white-space: nowrap;
        }

        .smaller {
            color: transparent;
            width: 6%;
        }
    }
}
</style>
