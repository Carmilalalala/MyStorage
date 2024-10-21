<template>
    <div class="main">
        <button class="add" @click="clostForm()">新增水果</button>
        <table>
            <thead>
                <td v-for="data in menu">{{ data }}</td>
            </thead>
            <tbody>
                <tr v-for="(fruit, index) in fruitList">
                    <td>
                        <div class="image"><img :src="getFruitUrl(fruit.fruitName)"></div>
                    </td>
                    <td>{{ fruit.fruitName }}</td>
                    <td>{{ fruit.description }}</td>
                    <td>{{ fruit.quantity }}</td>
                    <td>{{ fruit.price }}</td>
                    <td>{{ statusList[fruit.status] }}</td>
                    <td><button @click="delFruit(fruit.id)">删除</button>
                        <button @click="clostTip(fruit.id)">补货</button>
                        <button @click="handleFruit(fruit.id, fruit.status)">{{ getOppositeState(fruit.status)
                            }}</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <increaseInventory v-if="supplement" :clostTip=clostTip :color="color" :addInventory="addInventory">
    </increaseInventory>
    <addFruit v-if="fruitForm" :clostForm=clostForm :color="color" :increaseFruits="increaseFruits"></addFruit>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { authInstance } from '@/utils/axios'
import increaseInventory from './increaseInventory.vue';
import { tr } from 'element-plus/es/locales.mjs';
import emitter from '@/utils/mitter';
import addFruit from './addFruit.vue';
const { page } = defineProps(['page'])
const menu = ['图片', '名称', '描述', '余量', '价格', '状态', '操作']
const statusList = ['已下架', '上架中']
const getOppositeState = (number) => number == 0 ? '上架' : '下架'
const supplement = ref<boolean>(false)
const color = '#9ed4b4'
const addId = ref<number>()
const fruitList = reactive([])
const fruitForm = ref<boolean>(false)
const getFruitUrl = (name) => {
    return `/src/assets/image/${name}.jpg`
}
//获取所有水果
const getFruits = async (page) => {
    const re = await authInstance({ url: `/clerks/fruits/list/${page}` })
    if (re.status === '0')
        fruitList.splice(0, fruitList.length, ...re.data)
}

//增加水果
const increaseFruits = async (formData) => {
    console.log(formData);
    const re = await authInstance({ url: '/clerks/fruits/add', method: 'post', params: formData })
    console.log(re);
    if (re.status === '0')
        emitter.emit('opera-data', '添加成功')
    else if (re.status === '-1')
        emitter.emit('opera-data', re.msg)
}

//关闭添加水果
const clostForm = () => {
    fruitForm.value = !fruitForm.value
    getFruits(page)
}

//上下架水果
const handleFruit = async (fruitId, status) => {
    const upDown = status === 1 ? 0 : 1
    const params = { fruitId, upDown }
    const re = await authInstance({ url: '/clerks/fruits/upDown', method: 'post', params })
    getFruits(page)
}

//删除水果
const delFruit = async (fruitId) => {
    const params = { fruitId }
    const re = await authInstance({ url: '/clerks/fruits/delete', method: 'delete', params })
    getFruits(page)
}

//水果补货
const addInventory = async (count: number) => {
    const params = { fruitId: addId.value, count }
    const re = await authInstance({ url: '/clerks/fruits/addition', method: 'post', params })
    if (re.status == '0') {
        emitter.emit('add-fruit', '补货成功')
    }
}

const clostTip = (id: number) => {
    supplement.value = !supplement.value
    if (supplement.value)
        addId.value = id
    getFruits(page)
}

onMounted(() => {
    getFruits(page)
})
</script>

<style scoped lang='less'>
.main {
    position: relative;
    padding-top: 68px;
}

.add {
    position: absolute;
    top: 16px;
    left: 52px;
    padding: 10px 20px;
    border-radius: 18px;
    border: none;
    background-color: #9ed4b4;
    color: #fff;
    cursor: pointer;
    transition: all .4s;

    &:hover {
        background-color: #559d7f;
        color: #fff;
    }
}

table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    color: #fff;

    thead {
        height: 48px;
        font-size: 20px;
        background-color: #9ed4b4;
    }

    td {
        text-align: center;
    }

    tbody {
        .image {
            height: 128px;

            img {
                width: 128px;
            }
        }


        tr {
            button {
                margin: 0 6px;
                width: 66px;
                height: 36px;
                border-radius: 18px;
                border: none;
                color: #559d7f;
                background-color: #fff;
                cursor: pointer;
                transition: all .4s;
            }

            &:nth-child(odd) {
                background-color: #d0e6d9;
            }

            &:nth-child(even) {
                background-color: #9ed4b4;
            }
        }
    }
}

button:hover {
    background-color: #559d7f;
    color: #fff;

}
</style>
