<template>
    <div class="shopping"><button><router-link :to="{ name: 'Customer' }">{{ text }}</router-link></button></div>
</template>

<script setup lang='ts'>
import { ref, reactive, withDefaults } from 'vue'
import { router } from '@/router/index'

withDefaults(defineProps<{ text: string }>(), { text: '前往购物' })

</script>

<style scoped lang='less'>
.shopping {
    position: absolute;
    top: 0;
    left: 50%;

    button {
        border: none;
        padding: 6px 14px;
        border-radius: 18px;
        background-color: #fff;
    }

    a {
        text-decoration: none;
        color: #f69292;
        font-size: 16px;
    }
}
</style>
