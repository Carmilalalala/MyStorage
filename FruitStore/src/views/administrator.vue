<template>
    <div class="shopkeeper">
        <div id="mask" v-if="submitted"></div>
        <h1>{{ welcome }}</h1>
        <button @click="submitted = !submitted" class="add">添加员工</button>
        <div class="box">
            <Table :dataList="associatesList" :getAllAssociates="getAllAssociates"></Table>
        </div>
        <div class="submitForm" v-if="submitted">
            <h2>请输入员工信息</h2>
            <form @submit.prevent="addStaff">
                <div v-for="data in dataList">
                    {{ data.text }}：<input :type="data.type" v-model="data.name">
                </div>
                <div class="btn">
                    <button @click="cancle">取消</button>
                    <button>确定</button>
                </div>
                <div class="tip" :class="[showTips ? 'showTips' : '']">
                    <el-button :type="tipType">{{ msg }}</el-button>
                </div>
            </form>
        </div>
    </div>
    <div class="leave">
        <logout></logout>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { authInstance } from '@/utils/axios'
import Table from '@/components/tableList.vue'
import logout from '@/components/logout.vue';
const { userName } = JSON.parse(localStorage.getItem('user'))
const welcome = ref<string>('欢迎您，店长' + userName)
const associatesList = reactive([])
const noAssociates = ref<boolean>(false)
const submitted = ref<boolean>(false)
//新员工信息
const phone = ref<string>()
const username = ref<string>()
const password = ref<string>()
const dataList = reactive([
    { type: 'text', text: '电话', name: phone }, { type: 'text', text: '姓名', name: username }, { type: 'password', text: '密码', name: password }
])
//提示框出现与否
const showTips = ref(false)
//提示框内容
const msg = ref('提示信息')
//提示框颜色
const tipType = ref('warning')
//获取所有员工
const getAllAssociates = async () => {
    try {
        const res = await authInstance({ url: '/admin/list' })
        if (res.status === '0') {
            //员工列表不为空
            associatesList.splice(0, associatesList.length, ...res.data)
        } else if (res.status === 'A40002') {
            //员工列表为空
            noAssociates.value = true
        }
    } catch (err) {
        console.log(err);
    }
}

//判断添加员工三个空是否为空
const emptyRef = () => {
    for (const data of dataList) {
        if (!data.name) {
            return data.text;
        }
    }
    return null;
};

//增加员工
const addStaff = async () => {
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
        const data = {
            phone: phone.value,
            password: password.value,
            username: username.value
        };
        console.log(data);
        tipType.value = 'warning'
        showTips.value = true;
        msg.value = '添加中...';
        setTimeout(async () => {
            try {
                const re = await authInstance({
                    url: '/admin/add', params: data, method: 'post'
                })
                console.log(re);
                if (re.status == 'A40004') {
                    tipType.value = 'danger'
                    showTips.value = true;
                    msg.value = '添加失败';
                } else if (re.status === '0') {
                    tipType.value = 'success'
                    showTips.value = true;
                    msg.value = '添加成功';
                }
                setTimeout(() => {
                    showTips.value = false;
                }, 1000)
            } catch (error) {
                tipType.value = 'danger'
                showTips.value = true;
                msg.value = '添加失败，请重试';
                setTimeout(() => {
                    showTips.value = false;
                }, 1000);
                console.log(error);
            }
        }, 2000);
    }
}

const cancle = () => {
    submitted.value = !submitted.value
    getAllAssociates()
}
onMounted(() => {
    getAllAssociates()
})
</script>

<style scoped lang='less'>
.submitForm {
    position: absolute;
    transform: translate(50%, -50%);
    background-color: #fff;
    width: 520px;
    height: 350px;
    text-align: center;
    border-radius: 16px;
    color: #039;
    z-index: 999;

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

    h2 {
        margin-top: 10px;
    }

    form {
        margin-top: 20px;
        font-size: 18px;

        input {
            margin: 20px 0px;
            font-size: 18px;
            border: none;
            outline: none;
            color: #2a51ac;
            border-bottom: 1px solid #a2a2e9;
        }

        .btn {
            margin-bottom: 26px;

            button {
                position: relative;
                top: 16px;
                left: -15px;
                width: 90px;
                height: 35px;
                border-radius: 26px;
                border: none;
                font-size: 15px;
                cursor: pointer;
                transition: all .3s;
                margin-left: 30px;
                color: #fff;
                background-color: #d0dafd;

                &:hover {
                    background-color: #039;
                }
            }
        }
    }
}

.shopkeeper {
    position: relative;
    padding: 10% 10% 0;
}

h1 {
    position: absolute;
    top: 12px;
    left: 10%;
    color: #669;
}

.add {
    position: absolute;
    top: 72px;
    left: 10%;
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
        background-color: #2a51ac;
        color: #fff;
    }
}

.box {
    margin: auto 0;
    width: 962px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.leave {
    position: absolute;
    top: 45px;
    right: 120px;
}
</style>
