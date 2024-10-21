<template>
    <div>
        <h1>您目前还不是会员</h1>
        <h2>成为会员可解锁以下超多福利</h2>
        <button><a @click="becVip = !becVip">开通会员</a></button>
    </div>
    <openAMembership v-if="becVip">
    </openAMembership>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import openAMembership from '@/components/openAMembership.vue'
import emitter from '@/utils/mitter'
const becVip = ref(false)
emitter.on('close-openVip', (value: any) => {
    emitter.emit('flushed-vip')
    becVip.value = value
})
</script>

<style scoped lang='less'>
div {
    text-align: center;

    h1,
    h2 {
        cursor: pointer
    }

    button {
        margin-top: 12px;
        padding: 6px 19px;
        background-color: #fff;
        border-radius: 16px;
        border: none;

        a {
            font-size: 20px;
            text-decoration: none;
            color: #ff712c;
            cursor: pointer;
        }
    }

}
</style>
