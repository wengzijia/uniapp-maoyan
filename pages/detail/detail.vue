<template>
	<view>
	<view class="detailBox">
	<view class="detail" :style="{backgroundColor:detailData.bgColor}">
	    <view class="content">
	        <view class="imgWrap">
	            <image :src="detailData.img"></image>
	            <!-- <image class="icon icon-play" src="/assets/images/i_play.png"></image> -->
	        </view>
	        <view class="info">
	            <view class="item">
	                <text>{{ detailData.nm }}</text>
	            </view>
	            <view class="item">
	                <text v-if="detailData.sc">{{ detailData.sc }}分</text>
	                <text>（11万人评）</text>
	                <!-- <text>{{ movie.data.movie.wish }} 人想看</text> -->
	            </view>
	            <view class="item">
	                <text>{{ detailData.cat }} </text>
	                <text>{{ detailData.dur }}分钟</text>
	                <text>{{ detailData.pubDesc}}</text>
	            </view>
	        </view>
	    </view>
	    <view class="btngroup">
			<!-- <i class="iconfont icon-aixin {{ isSee ? 'movie-want': '' }}"></i> -->
	       <button :bind="wantSee">想看</button>
	        <button><i class="iconfont icon-star"></i>评分</button>
	    </view>
	</view>
	
	
	<!-- 动态添加一个类 limit_desc -->
	<view class="desc">
	    {{ detailData.dra}}
	</view>
	

	
	<view class="photo">
	    <view class="video">
	        <text>视频和剧照</text>
	        <text>></text>
	    </view>
	    <scroll-view  scroll-x="true">
	        <view class="container">
	           <view class="imgWrap"  v-for="(item,index) in photos" :key="index">
	                <image class="img" :src="item"></image>
				</view>
	        </view>
	    </scroll-view>
	
	    <view style="margin:20rpx 0;">
	        <video style="width:100%;height:340rpx;" :src="detailData.vd"></video>
	    </view>
	
	</view>
	</view>
	<button class="buy youhui" >优惠购票</button>
	</view>
</template>

<script>
	let {fetchMovieDetail} = require('../../api/index.js')
	export default{
		data(){
			return{
				detailData:{},
				photos:[]
			}
		},
		async onLoad(option){
			let result = await fetchMovieDetail(option.id);
			result[0].img = result[0].img.replace(/\w.h/, '');
			this.detailData = result[0];
			this.photos.push(result[0].photos.split(','));
			this.photos = this.photos[0]
			console.log('232',this.photos)
			console.log(this.detailData)
		}
	}
</script>

<style>
	.detailBox{
		padding-bottom: 20rpx;
	}
	.detail {
	    /* background-image: linear-gradient(to right,#6b6c70, #848e97); */
	    padding: 16rpx;
	}
	
	.detail .content {
	    display: flex;
	
	}
	
	
	.detail .content .imgWrap {
	    position: relative;
	    width: 460rpx;
	    height: 360rpx;
	}
	
	.detail .content {
	    display: flex;
	}
	
	.detail .content .imgWrap image {
	    width: 100%;
	    height: 100%;
	}
	
	.detail .content  .info {
	    font-size: 28rpx;
	    padding: 16rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	}
	
	.detail .content  .info .item {
	    display:flex;
	    flex-direction: column;
	}
	
	.detail .content .imgWrap .icon-play {
	    width: 40rpx;
	    height: 40rpx;
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate3d(-50%,-50%,0);
	
	}
	
	.detail .btngroup {
	   
	    margin-top: 20rpx;
	    display:flex;
	    justify-content: space-around;
	}
	
	.detail .btngroup button {
	    /* background-color: #9b9481; */
	    background-image: linear-gradient(to right,#6b6c70, #848e97,#6b6c70);
	    height: 80rpx;
	    font-size: 28rpx;
	    flex: 1;
	    margin-right: 20rpx;
	    color: #fff;
	}
	
	.detail .btngroup button:last-child {
	    margin-right: 0;
	}
	
	.detail .btngroup .iconfont {
	    margin-right: 10rpx;
	}
	
	
	.desc {
	    position: relative;
	    padding: 20rpx;
	    transition: all .4s linear 0s;
	
	}
	
	.limit_desc {
	   
	    height: 140rpx;
	    overflow: hidden;
	}
	
	.arrow {
	    color: #e3e3e3;
	    text-align: center;
	
	}
	
	.photo {
	    padding: 20rpx;
	    margin-bottom: 80rpx;
	}
	.photo .video {
	    display: flex;
	    justify-content: space-between;
	    margin-bottom: 20rpx;
	}
	
	.photo .container {
	    display: flex;
	}
	
	.photo .container .imgWrap {
	    height: 200rpx;
	    flex: 0 0 380rpx; /* flex-grow flex-shrink flex-basic */
	    margin-right: 20rpx;
	}
	
	.photo .container .imgWrap image {
	    width: 100%;
	    height: 100%;
	}
	
	
	.buy.youhui {
	    position: fixed;
	    bottom:0;
	    left:0;
	    width: 100vw;
	    color: #fff;
	    background-color: #ef4238;
	    border-radius: 0;
	    font-size: 40rpx;
	    z-index: 999999;
	}
	
	
	.movie-want {
	    color: #f5a54f;
	}
	
	
	

</style>
