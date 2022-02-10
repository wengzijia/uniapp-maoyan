<template>
	<view>
		用户名:<input v-model="username" placeholder="请输入用户名"></input>
		密码:<input v-model="password" placeholder="请输入密码" ></input>
		<button @click="register">注册</button>
	</view>
</template>

<script>
	const {fetchRegister} = require('../../api/user.js')
	export default{
		data(){
			return{
				username:'',
				password:''
			}
		},
		methods:{
			async register(){
				let {status,message} = await fetchRegister(this.username,this.password);
				if(status === 0 ){
					uni.showToast({
						title:message
					})
					setTimeout(function(){
						uni.navigateTo({
							url:"../login/login"
						})
					},1000)
				}else{
					uni.showToast({
						title:message
					})
				}
			}
		}
	}
</script>

<style>
	input{
		border: 2rpx solid #4CD964;
	}
</style>
