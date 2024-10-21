<template>
    <div><router-link :to="{ name: 'Home' }">登出</router-link></div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { router } from '@/router/index'
</script>

<style scoped lang='less'></style>
