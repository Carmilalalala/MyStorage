<template>
    <!-- 主页水果列表 -->
    <div class="fruits">
        <div class="fruit_data">
            <!-- <button class="left_btn">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zuoyoujiantou-copy"></use>
                </svg>
            </button> -->
            <div class="fruit" v-for="(fr, index) in fruitData" v-show="fruitData.length > 0 && fr.status == '1'"
                @mouseenter="fruitEnter(index)" @mouseleave="fruitLeave()" :key="index">
                <img :src='getFruitUrl(fr.fruitName)'>
                <div class="box"><span>{{ fr.fruitName }}</span><span>{{ fr.price }}元/斤</span></div>
                <div :class="[details && place == index ? 'details' : '']">
                    <p>{{ fr.description }}</p><a @click="toDetail(fr.id)">查看详情</a>
                </div>
            </div>
            <!-- <button class="right_btn">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zuoyoujiantou-copy-copy"></use>
                </svg>
            </button> -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, onMounted } from 'vue'
import { router } from '@/router';
import emitter from '@/utils/mitter';
import { publicInstance } from '@/utils/Axios'
const place = ref()
const details = ref(false)
const fruitEnter = (index: number) => {
    details.value = true
    place.value = index
}
const fruitLeave = () => {
    details.value = false
}
//点击查看详情跳转
const toDetail = (id) => {
    //路由跳转到details.data
    router.push({ name: 'Details', params: { id: id } })
}
//获取水果图片链接
const getFruitUrl = (name) => {
    return `/src/assets/image/${name}.jpg`
}
//默认水果页面
let currentPage: number = ref(1)
const fruitData = reactive([{}])
// 获取水果列表
async function getFruits(page: number) {
    try {
        const fruits = await publicInstance({ url: '/fruits/list/' + page })
        fruitData.splice(0, fruitData.length, ...fruits.data.data)
    } catch (err) {
        console.log(err);
    }
}
// 初始化水果列表
onMounted(() => {
    getFruits(currentPage.value)
})

//点击查询后，按照名字筛选获取对应水果列表
emitter.on('update-fruit', async (targetName) => {
    if (targetName === '')
        getFruits(currentPage.value)
    else {
        const fruitResult = await publicInstance({ url: '/fruits/search/' + targetName })
        fruitData.splice(0, fruitData.length, ...fruitResult.data.data)
    }
});
</script>

<style scoped lang='less'>
.fruits {
    padding-top: 90px;
    position: relative;
    width: 100%;
    height: 100%;

    .fruit_data {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        justify-content: flex-start;
        width: 100%;
        height: 100%;

        button {
            display: block;
            position: absolute;
            top: 45%;
            width: 48px;
            height: 48px;
            background-color: transparent;
            cursor: pointer;
            border: none;

            svg.icon {
                width: 48px;
                height: 48px;
                border: none;

            }
        }

        .left_btn {
            left: -40px;
        }

        .right_btn {
            right: 56px;
        }

        .fruit {
            position: relative;
            margin: 0 50px 0 42px;
            width: 180px;
            height: 220px;
            border-radius: 15px;
            background-color: #fff;
            overflow: hidden;
            cursor: pointer;

            img {
                width: 180px;
            }



            .box {
                margin-bottom: 6px;
                display: flex;
                text-align: center;
                justify-content: space-evenly;

                span {
                    font-size: 24px;
                    color: #ee6e23;
                }
            }

            .details {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 80%;
                padding: 12px;
                font-size: 24px;
                color: #fff;
                background-color: rgba(0, 0, 0, 0.6);
                animation: theDetails .3s linear;

                p {
                    font-size: 18px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow-wrap: break-word;
                    -webkit-line-clamp: 4;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                a {
                    position: absolute;
                    right: 56px;
                    bottom: 34px;
                    color: #ff5050;
                    font-size: 20px;
                }
            }

            @keyframes theDetails {
                from {
                    bottom: -80%;
                }

                to {
                    bottom: 0;
                }
            }
        }

        .active {
            background-color: #ff4949;
        }
    }
}
</style>
