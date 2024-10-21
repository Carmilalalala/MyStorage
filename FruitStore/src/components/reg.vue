<template>
    <div class="reg">
        <div class="tip" :class="[showTips ? 'showTips' : '']">
            <el-button :type="tipType">{{ msg }}</el-button>
        </div>
        <form @submit="submitReg" v-on:submit.prevent>
            <div class="input" v-for="(data, index) in dataList"
                :class="[(index == indId || data.name != '') ? 'active' : '']" :placeholder="data.text"><input
                    :type="data.type" @click="changeAct(index)" v-model="data.name"></div>
            <button class="submit" type="submit">提交</button>
        </form>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import emitter from '@/utils/mitter';
import { publicInstance } from '@/utils/Axios'
const phone = ref('')
const userName = ref('')
const passWord = ref('')
const dataList = reactive([
    { type: 'text', text: '电话', name: phone }, { type: 'text', text: '用户名', name: userName }, { type: 'password', text: '密码', name: passWord }
])
let indId = ref(-1);
const changeAct = (index: number) => {
    indId.value = index
}
const emptyRef = () => {
    for (const data of dataList) {
        if (!data.name) {
            return data.text;
        }
    }
    return null;
};

//提示框出现与否
const showTips = ref(false)
//提示框内容
const msg = ref('提示信息')
//提示框颜色
const tipType = ref('warning')

const submitReg = () => {
    const emptyFieldName = emptyRef();
    //点击提交按钮先判断输入框是否为空，为空则提示，不为空提交数据
    if (emptyFieldName) {
        tipType.value = 'danger'
        showTips.value = true;
        msg.value = `${emptyFieldName}不能为空`;
        setTimeout(() => {
            showTips.value = false;
        }, 1000);
    } else {
        const formData = {
            phone: phone.value,
            password: passWord.value,
            username: userName.value
        };
        tipType.value = 'warning'
        showTips.value = true;
        msg.value = '跳转中...';
        setTimeout(async () => {
            try {
                const response = await publicInstance({
                    url: '/users/register',
                    method: 'post',
                    params: formData
                })
                if (response.data.status == 'A40005') {
                    tipType.value = 'danger'
                    showTips.value = true;
                    msg.value = response.data.msg;
                    setTimeout(() => {
                        showTips.value = false;
                    }, 1000)
                } else {
                    tipType.value = 'success'
                    showTips.value = true;
                    msg.value = '注册成功，前往登录';
                    setTimeout(() => {
                        emitter.emit('to-log', true)
                    }, 1000);
                }
            } catch (error) {
                tipType.value = 'danger'
                showTips.value = true;
                msg.value = '注册失败，请重试';
                setTimeout(() => {
                    showTips.value = false;
                }, 1000);
                console.log(error);
                if (error.code === 'ECONNABORTED') {
                    console.log('请求超时，请检查你的网络连接或服务器状态');
                } else if (error.request) {
                    console.log('请求已发出，但没有收到响应');
                } else {
                    console.log('请求设置错误或其他问题', error.message);
                }
            }
        }, 2000);
    }
}
</script>

<style scoped lang='less'>
.reg {
    position: relative;

    .tip {
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.5s;

        &>button {
            margin: 0 auto;
        }
    }

    .showTips {
        opacity: 1;
    }

    form {
        margin: 2rem 2.8rem 0;

        .input {
            position: relative;
            margin: 2.4rem 0;

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

        .submit {
            display: block;
            width: 80px;
            height: 32px;
            position: absolute;
            bottom: -66px;
            background-color: #cebcff;
            border: none;
            border-radius: 16px;
            color: #fff;
            font-size: 16px;
        }
    }
}
</style>
