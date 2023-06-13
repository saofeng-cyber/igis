<template>
    <a-layout-content>
        <div :style="{ padding: '0', height: '100%', minWidth: '750px', overflowY: 'auto', overflowX: 'hidden' }">
            <transition name="slide-fade" mode="out-in">
                <keep-alive>
                    <router-view />
                </keep-alive>
            </transition>
        </div>
    </a-layout-content>
</template>
<style lang="less">
/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}
</style>