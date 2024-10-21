<template>
    <div class="main">
        <div class="left">
            <personalSetting></personalSetting>
        </div>
        <div class="right">
            <div class="personData">
                <personData></personData>
            </div>
        </div>
        <div id="leave">
            <logout></logout>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import personalSetting from '@/components/personalSetting.vue'
import personData from '@/components/personData.vue'
import logout from '@/components/logout.vue';
</script>

<style scoped lang='less'>
.main {
    position: relative;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    width: 100%;

    &>div {
        height: 100%;
        border-radius: 20px;

        overflow: hidden;
    }

    .left {
        margin-right: 25px;
        width: 15%;
    }

    .right {
        width: 65%;
        height: 100%;

        .personData {
            width: 100%;
        }
    }

    #leave {
        position: absolute;
        top: 85px;
        right: 172px;
        border-radius: 0;
    }
}
</style>
