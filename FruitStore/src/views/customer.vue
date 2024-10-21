<template>
    <div class="main">
        <div class="header">
            <fruitheader></fruitheader>
        </div>
        <div class="fruitShelf">
            <fruitShelf></fruitShelf>
        </div>
    </div>
</template>

<script setup lang='ts'>
import fruitheader from '@/components/header.vue'
import fruitShelf from '@/components/fruitShelf.vue'

</script>

<style scoped lang='less'>
.main {
    position: relative;

    .header {
        width: 1000px;
        height: 60px;
    }

    .fruitShelf {
        margin-top: -20px;
        padding: 0 0 0 100px;
        height: 570px;
        width: 100%;
    }
}
</style>
