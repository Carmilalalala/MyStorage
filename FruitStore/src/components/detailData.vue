<template>
    <!-- 单个水果详情 -->
    <div v-for="(data, index) in fruitDatas" class="singleFruit" :key="index">
        <div class="shop">
            <toShopping :text="text"></toShopping>
        </div>
        <img :src="data.src" alt="">
        <div class="data">
            <span class="name">{{ data.fruitName }}</span>
            <h1>{{ data.description }}</h1>
            <span class="price">价格：{{ data.price }}元/斤</span>
            <span class="quantity">余量：{{ data.quantity }}</span><br>
            <button @click="addFruit" class="addToCar">加入购物车</button>
            <div class="tip pos" :class="[showTips ? 'showTips' : '']">
                <el-button :type="tipType">{{ msgData }}</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import emitter from '@/utils/mitter';
import { authInstance } from '@/utils/Axios'
import toShopping from './toShopping.vue';
const text = '返回选购'
const fruitDatas = reactive([])
//提示框出现与否
const showTips = ref(false)
//提示框内容
const msgData = ref()
//提示框颜色
const tipType = ref('success')
onMounted(() => {
    emitter.on('get-detail', (data) => {
        const detailData = reactive(data)
        detailData.src = `/src/assets/image/${data.fruitName}.jpg`
        fruitDatas.shift()
        fruitDatas.push(detailData)
    })
})

//添加购物车
const addFruit = async () => {
    const fruitId = fruitDatas[0].id
    try {
        const re = await authInstance({
            url: '/carts/add', data: { fruitId }, method: "post", headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        })
        showTips.value = true
        if (re.status === '0') {
            msgData.value = '加购成功'
            tipType.value = 'success'
            fruitDatas[0].quantity -= 1
        } else if (re.status === "A50001") {
            msgData.value = '库存不足'
            tipType.value = 'danger'
        }
        setTimeout(() => {
            showTips.value = false
        }, 1000);
    } catch (err) {
        console.log(err);
    }
}
onUnmounted(() => {
    //组件摧毁后清除通信内容
    emitter.all.clear()
})
</script>

<style scoped lang='less'>
.singleFruit {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    .shop {
        position: fixed;
        top: 155px;
        left: 56px;
    }

    img {
        width: 420px;
    }

    .data {
        margin-top: 55px;
        width: 480px;

        .name {
            margin-left: 0;
        }

        .pos {
            position: absolute;
            bottom: 13%;
            left: 64%;
        }

        h1 {
            margin: 30px 0;
            color: #ec7e7e;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow-wrap: break-word;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }

        span {
            margin-left: 42px;
            font-size: 30px;
            color: #fff;
            cursor: pointer;
        }

        .addToCar {
            margin-top: 36px;
            margin-left: 128px;
            width: 200px;
            height: 60px;
            background-color: #fff;
            border-radius: 30px;
            font-size: 20px;
            font-weight: 600;
            color: #ff3e3e;
            border: none;
            cursor: pointer;
            transition: all .4s;

            &:hover {
                background-color: #ff6565;
                color: #fff;
            }
        }
    }

}
</style>
