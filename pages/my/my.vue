<template>
	<!-- #ifdef H5 -->
	 <view class="username">用户名:{{username}}</view>
	<!-- #endif -->
</template>
<script>
    export default {
        data() {
            return {
				username:""
            }
        },
        onLoad() {
			this.username = uni.getStorageSync('username')
			// #ifdef MP-WEIXIN
			let token = uni.getStorageSync('token');
			if(!token){
				uni.navigateTo({
					url:'../login/login'
				})
			}
			// #endif
			if(this.username === ""){
				uni.navigateTo({
					url:"../login/login"
				})
			}
        },
        methods: {
        }
    }
</script>
<style>
	.username{
		font-size: 60rpx;
		text-align: center;
		color: #007AFF;
	}
</style>