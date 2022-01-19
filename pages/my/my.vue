<template>
    <view>
        <scroll-view style="height: 300px;" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
            :refresher-threshold="100" refresher-background="lightgreen" 
            @refresherrefresh="onRefresh" @refresherrestore="onRestore" ></scroll-view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                triggered: false
            }
        },
        //  页面初始化触发 相当于vue  created生命周期       this.triggered = true;   非常重要
        onLoad() {
            this._freshing = false;
            // setTimeout(() => {
 
                this.triggered = true;   // 非常重要
            // }, 1000)
        },
        methods: {
            onRefresh() {
                if (this._freshing) return;
                this._freshing = true;
                    this.triggered = false;  // 未触发
                    this._freshing = false;
            },
            onRestore() {
                this.triggered = 'restore'; // 需要重置
                console.log("onRestore");
            }
        }
    }
</script>