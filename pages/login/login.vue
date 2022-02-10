<template>
	<view>
	<view class="imgWrap" >
	    <image></image>
	</view>
	<!-- #ifdef MP-WEIXIN -->
	<button type="warn" @click="login" class="loginBtn login">微信一键登录</button>
	<!-- #endif -->
	<!-- #ifdef H5 -->
		<view>用户名:<input  v-model="username"  placeholder="请输入用户名"></input></view>
		<view>密码:<input v-model="password" placeholder="请输入密码"></input></view>
		<button @click="h5Login" style="background-color: #F0AD4E;">登录</button>
		<navigator open-type="navigate" url="../register/register" style="width: 100vw;background-color: #DD524D;height: 100rpx;display: flex;justify-content: center;align-items: center;">注册</navigator>
	<!-- #endif -->
</view>
</template>

<script>
	let {  apiCurrying } = require("../../utils/util.js")
	let {  fetchGetToken,fetchLogin } = require("../../api/user.js")
	let wxLogin = apiCurrying(wx.login)
	export default {
		data(){
			return{
				username:"",
				password:""
			}
		},
		methods:{
			async login(){
				let {code} = await wxLogin ()
			    let {token,openid} = await fetchGetToken(code)
				uni.setStorageSync('token', token)
				uni.setStorageSync('openid', openid)
				uni.showToast({
					title:'登陆成功'
				})
				setTimeout(function(){
					uni.switchTab({
						url:'../movie/movie'
					})
				},1000)
			},
		 async h5Login(){
			let {status,message} = await fetchLogin(this.username,this.password);
			if(status==0){
				uni.showToast({
					title:message
				}),
				uni.setStorageSync('username',this.username)
				setTimeout(function(){
					uni.switchTab({
						url:'../movie/movie'
					})
				},2000)
			}else{
				uni.showToast({
					icon:'error',
					title:message
				})
			}
		  }
		}
	}
</script>

<style>
	.imgWrap {
	    display: flex;
	    justify-content: center;
	}
	.imgWrap image {
	    width: 80vw;
		background: url(../../assets/images/login_bg.jpg) no-repeat;
	}
	
	.loginBtn .login {
	    background-color: red;
	    color:#fff;
	}
	input{
		border: 2rpx solid #FF0000;
		border-radius: 10rpx;
	}
</style>
