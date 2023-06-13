<template>
    <div class="igis-card">
        <div class="igis-card-top">
            <div class="card-left">
                <a-icon type="home" theme="filled" style="font-size: 18px;color: #999da8;" />
                <span style="font-size: 16px;font-weight: bold;color: #999da8;padding-left: 8px;">{{ title }}</span>
            </div>
            <div class="card-right">
                <a-icon type="fullscreen" style="font-size: 18px;color: #999da8;cursor: pointer;" @click="openDialog" />
            </div>
        </div>
        <div class="igis-card-center">
            <draggable v-model="myArray" class="igis-card-list" tag="transition-group" :component-data="{
                tag: 'ul',
                type: 'transition-group',
                name: !drag ? 'flip-list' : null
            }" item-key="order" animation="300" @start="drag = true" @end="handlEnd">
                <div v-for="item in myArray" :key="item.id" class="igis-card-list-item">
                    <div class="igis-card-item-left">
                        {{ item.id }}
                    </div>
                    <div class="igis-card-item-right">
                        {{ item.name }}
                    </div>
                </div>
            </draggable>
        </div>
        <div class="igis-card-bottom">
            <div class="igis-card-footer">
                已检：0 未检： 26
            </div>
        </div>
        <a-modal title="Title" :visible="visible" @ok="handleOk" @cancel="handleCancel">
            <p>{{ title }}</p>
        </a-modal>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable'
defineProps<{
    title: string
}>()
const visible = ref<boolean>(false)
const myArray = ref([
    {
        id: 1,
        name: 'John Brown',
    },
    {
        id: 2,
        name: 'Jim Green',
    },
    {
        id: 3,
        name: 'Joe Black',
    },
    {
        id: 4,
        name: 'Jim Red',
    },
    {
        id: 5,
        name: 'John Brown',
    },
    {
        id: 6,
        name: 'Jim Green',
    },
    {
        id: 7,
        name: 'Joe Black',
    },
])
const drag = ref<boolean>(false)
const handlEnd = () => {
    drag.value = false
    console.log(myArray.value);
}
const openDialog = () => {
    console.log(666);
    visible.value = true
}
const handleOk = () => {
    visible.value = true
}
const handleCancel = () => {
    visible.value = false
}
</script>
<style lang="less" scoped>
@igis-card-top-height: 4vh;
@igis-card-footer-height: 6vh;

.igis-card {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.25);

    .igis-card-top {
        height: @igis-card-top-height;
        display: flex;
        align-items: center;
        padding: 0 12px;
        justify-content: space-between;
        color: #7b818f;
        border-bottom: 1px solid #d2d4db;
    }

    .igis-card-center {
        flex: 1;
        overflow: hidden;

        .igis-card-list {
            height: 100%;

            .igis-card-list-item {
                display: flex;
                align-items: center;
                height: calc(100% / 7);
                width: 100%;
                border-bottom: 1px solid #d2d4db;

                .igis-card-item-left {
                    width: 48px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid #d2d4db;
                    color: #000000;
                    font-size: 0.8vw;
                }

                .igis-card-item-right {
                    flex: 1;
                    text-align: center;
                    // font-weight: bold;
                    font-size: 0.8vw;
                    color: #000;
                }
            }
        }
    }

    .igis-card-bottom {
        height: @igis-card-footer-height;
        display: flex;
        align-items: center;

        .igis-card-footer {
            width: 100%;
            height: 4vh;
            margin: 0 12px;
            line-height: 4vh;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #f06176;
            color: #f06176;
            font-weight: bold;
        }
    }
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}
</style>