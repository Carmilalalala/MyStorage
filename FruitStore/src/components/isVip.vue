<template>
    <div class="vip-progress-container">
        <div class="showVip">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-vip-dengji-"></use>
            </svg>
        </div>
        <div class="vip-info">
            <div class="vip-level">
                <div class="vip-bar"></div>
            </div>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
</script>

<style scoped lang='less'>
.vip-progress-container {
    .showVip {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon {
            width: 68px;
            height: 68px;
        }
    }

    .vip-info {
        width: 100%;
        height: 32px;

        .vip-level {
            position: relative;
            margin-top: 10px;
            height: 2px;
            width: 100%;
            text-align: center;
            background-color: #e8d9d1;

            .vip-bar {
                height: 2px;
                width: 100%;
                background-color: #fff;
            }

            span {
                display: inline-block;
                margin-top: 8px;
            }
        }
    }
}
</style>
