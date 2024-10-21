<template>
    <div>
        <div class="allOrders">
            <allOrders></allOrders>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import allOrders from "@/components/allOrders.vue"
</script>

<style scoped lang='less'>
.allOrders {
    width: 100%;
    height: auto;
}
</style>
