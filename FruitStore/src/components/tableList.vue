<template>
    <table>
        <thead>
            <tr>
                <th>员工编号</th>
                <th>员工姓名</th>
                <th>联系方式</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="data in dataList">
                <td>{{ data.id }}</td>
                <td>{{ data.username }}</td>
                <td>{{ data.phone }}</td>
                <td><button @click="delStaff(data.id)">解雇</button></td>
            </tr>
        </tbody>
    </table>
    <payOrders :clostTip="clostTip" :emsg="emsg" v-if="showTips" :color="color"></payOrders>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps } from 'vue'
import type { EmployeeList } from '@/utils/type'
import { authInstance } from '@/utils/Axios';
import payOrders from './payOrders.vue';
import { log } from 'console';
const { dataList, getAllAssociates } = defineProps(['dataList', 'getAllAssociates'])

//删除员工后提示框
const showTips = ref<boolean>(false)
const clostTip = () => {
    showTips.value = !showTips.value
}
const color = '#b9c9fe'
const emsg = ref<string>()

//删除员工
const delStaff = async (clerkId) => {
    const re = await authInstance({ url: `/admin/delete/${clerkId}`, method: 'delete' })
    if (re.status === '0') {
        clostTip()
        emsg.value = '解雇成功'
        //更新所有员工表
        getAllAssociates()
    }
}
</script>

<style scoped lang='less'>
table {
    margin: 0 auto;
    width: 100%;
    font-size: 18px;
    text-align: center;
    border-collapse: collapse;

    th {
        padding: 8px;
        font-weight: normal;
        font-size: 20px;
        color: #039;
        background: #b9c9fe;
        cursor: pointer;
    }

    tr:hover {
        background-color: #d0dafd;
    }

    td {
        padding: 16px;
        background: #e8edff;
        border-top: 1px solid #fff;
        color: #669;
        cursor: pointer;
    }

    button {
        width: 90px;
        height: 35px;
        background-color: #fff;
        border-radius: 26px;
        border: none;
        font-size: 15px;
        color: #2a51ac;
        cursor: pointer;
        transition: all .3s;

        &:hover {
            background-color: #b9c9fe;
            color: #fff;
        }
    }
}
</style>
