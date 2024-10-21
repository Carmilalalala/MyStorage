<template>
    <div class="header">
        <fruitheader></fruitheader>
    </div>
    <div class="fruitData">
        <detailData></detailData>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { publicInstance } from '@/utils/Axios'
import fruitheader from '@/components/header.vue'
import detailData from '@/components/detailData.vue'
import emitter from '@/utils/mitter';
const route = useRoute();
onMounted(async () => {
    const id = route.params.id
    try {
        const fruitDetail = await publicInstance({
            url: 'fruits/detail/' + id
        })
        emitter.emit('get-detail', fruitDetail.data.data)
    } catch (err) {
        console.log(err);

    }
})
</script>

<style scoped lang='less'>
.header {
    width: 1000px;
    height: 60px;
}

.fruitData {
    margin: 95px auto 0;
    width: 80%;
    height: 420px;
    border-radius: 30px;
    overflow: hidden;
    background-color: #ffd7d7;
}
</style>
