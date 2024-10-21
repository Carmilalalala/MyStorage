<template>
    <div class="log">
        <div class="tip" :class="[showTips ? 'showTips' : '']">
            <el-button :type="tipType">{{ msgData }}</el-button>
        </div>
        <form @submit="loginSuccess" v-on:submit.prevent>
            <div class="input" v-for="(data, index) in dataList"
                :class="[(index == indId || data.name != '') ? 'active' : '']" :placeholder="data.text"><input
                    :type="data.type" @click="changeAct(index)" v-model="data.name"></div>
            <span class="forget">忘记密码？</span>
            <button>登录</button>
        </form>
    </div>
</template>

<script setup lang='ts'>
import { router } from '@/router';
import { ref, reactive } from 'vue'
import { publicInstance } from '@/utils/Axios'
import axios from 'axios'
const phone = ref('')
const passWord = ref('')
const dataList = reactive([
    { type: 'text', text: '电话号码', name: phone }, { type: 'password', text: '密码', name: passWord }
])
let indId = ref<number>()
const changeAct = (index: number) => {
    indId.value = index
}
//提示框出现与否
const showTips = ref(false)
//提示框内容
const msgData = ref()
//提示框颜色
const tipType = ref('success')
const identity = ['店长', '店员', '顾客']
const loginSuccess = async () => {
    try {
        const data = reactive({
            phone: phone.value, password: passWord.value
        })
        const result = await publicInstance({
            method: 'post', url: '/users/login', params: data
        })
        //账号密码均正确保存token令牌到本地，弹出登录成功的提示框，跳转页面
        if (result.data.status == 0) {
            //token令牌两个小时自动过期，需要重新登陆
            if (result.headers['authorization']) {
                localStorage.setItem('token', result.headers['authorization'], 60 * 60 * 2000)
            }
            localStorage.setItem('user', JSON.stringify(result.data.data), 60 * 60 * 2000)
            tipType.value = 'success'
            const iden = identity[result.data.data.role]
            msgData.value = '欢迎' + iden + result.data.data.userName
            showTips.value = true
            setTimeout(() => {
                showTips.value = false
                switch (result.data.data.role) {
                    case 1:
                        //店员 shopAssistant
                        router.push({ name: 'ShopAssistant' })
                        break;
                    case 2:
                        //客户 Customer
                        router.push({ name: 'Customer' })
                        break;
                    case 0:
                        //店长 administrator
                        router.push({ name: 'Administrator' })
                        break
                    default:
                        break;
                }
            }, 1000)
        } else if (result.data.status == 'A40003') {
            //账号密码存在错误提示错误信息，不跳转
            tipType.value = 'danger'
            msgData.value = '电话或密码错误'
            showTips.value = true
            setTimeout(() => {
                showTips.value = false
            }, 1600)
        }
    } catch (err) {
        console.log(err);
    }
}
</script>

<style scoped lang='less'>
.log {
    form {
        position: relative;
        margin: 2rem 2.8rem 0;

        .input {
            position: relative;
            margin: 3rem 0;

            &::after {
                content: attr(placeholder);
                position: absolute;
                top: 0px;
                left: 0;
                font-size: 1.2rem;
                color: #7f5fd7;
                transition: all .4s;
            }
        }

        .active {
            &::after {
                top: -20px;
                font-size: 1rem;
            }
        }

        input {
            width: 160px;
            height: 30px;
            outline: none;
            border: none;
            border-bottom: 1.8px solid rgb(181, 154, 254);
        }

        .forget {
            position: absolute;
            top: 124px;
            right: -5px;
            cursor: pointer;
            color: #a769df;
            font-size: 12px;
        }

        button {
            display: block;
            width: 100%;
            height: 32px;
            position: absolute;
            top: 200px;
            background-color: #cebcff;
            border: none;
            border-radius: 20px;
            color: #fff;
            font-size: 14px;
        }
    }
}
</style>
