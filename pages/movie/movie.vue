<template>
	<view class="movieContainer">
		<view>
			<text>{{city}}</text>
			<icon class="iconfont icon-dingwei"></icon>
		</view>
		<!-- tabs标签页 -->
		<view class="tabs">
			<view class="tab_item" :class="{cur:index === tabCur}" v-for="(item, index) in ['热映', '待映']" :key="index"
				@click="tabSelect(index)">{{ item }}</view>
		</view>
		<!-- open-type="openSetting" 	打开授权设置页    -->
		<button open-type="openSetting" type="warn" plain v-if="!isAgreeGetLocation">打开授权页面</button>
		<!-- 标签页对应的内容 -->
		<view>
			<!-- 热映电影 -->
			<block v-if="tabCur === 0">
				<!--  onload生命周期设置 refresher-triggered 绑定的变量设为true      @refresherrestore  自定义下拉刷新被复位  也就是重置
				这样才可以再次下来刷新      this.isPullRefresh = 'restore';    进行重置
				refresher-enabled 开启自定义下拉刷新    @refresherrefresh   自定义下拉刷新被触发 
				refresher-triggered   true 表示下拉刷新已经被触发   true 也就是复位   不然会卡在那里
				刚开始为false    下拉刷新改为true就关闭    -->
				<scroll-view refresher-enabled="true" @scrolltolower="scrollLoadMore"
					@refresherrefresh="pullToRefresh" :refresher-triggered="isPullRefresh" @refresherrestore="onRestore" scroll-y="true"
					:style="{height: windowHeight + 'px'}">
					<block v-for="item in movieListData" :key="item.auto_id">
						<navigator open-type="navigate" style="border-bottom: 2rpx solid #f7ebeb">
							<movieList :hotMovieData="item"></movieList>
						</navigator>
					</block>
				</scroll-view>
				<view style="margin:auto;background-color:red;color:white;width:200rpx;" v-if="!isLoadFinish">已经到底啦!!!
				</view>
			</block>
			<!-- 待映电影 -->
			<block v-else-if="tabCur === 1">
				<scroll-view  scroll-x="true" >
					<!-- 期待电影 -->
					<!-- <view class="rich">
						<rich-text :nodes="expectMoviesData"></rich-text>
					</view> -->
					<view class="lateralContainer">
					<view class="expectMovies" v-for="item in crosswiseData" :key="item.id">
						<image class="movies" :src="item.img"></image>
						<view class="title">{{item.nm}}</view>
					</view>
					</view>
				</scroll-view>
			<scroll-view  scroll-y="true" >
				<!-- 待映电影列表 -->
				<view v-for="(item,index) in reflectedData" :key="item.id">
					<view> {{index}} </view>
					<block v-for="data in item" :key="data.id">
						<navigator open-type="navigate" style="border-bottom: 2rpx solid #f7ebeb">
							<movieList :hotMovieData="data"></movieList>
						</navigator>
					</block>
				</view>
			</scroll-view>
			</block>
		</view>
	</view>
</template>
<script>
	const {
		fetchCity,
		fetchMovieList,
		fetchExpectMovies,
		fetchHorizontalMovies,
		fetchToHitMovie
	} = require('../../api/index.js')
	const {
		apiCurrying
	} = require("../../utils/util.js")

	const wxLogin = apiCurrying(wx.login)
	const wxGetLocation = apiCurrying(wx.getLocation)
	const wxGetSystemInfo = apiCurrying(wx.getSystemInfo)
	import movieList from "../../components/movieList.vue"
	export default {
		data() {
			return {
				city: "中华人民共和国",
				tabCur: 0, // 当前tabs下标
				isAgreeGetLocation: true,
				isFirstTime: true,
				windowHeight: 0,
				movieListData: [], // 热映电影数据
				isLoadFinish: true, // 是否加载完成,   // true 未加载完毕    false  加载完毕
				page: 1,
				pagesize: 10,
				expectMoviesData: "", // 待映期待电影
				reflectedData: [], // 待映电影数据,
				isPullRefresh: false, // 是否下拉刷新   
				crosswiseData:[] // 横向电影数据
			}
		},
		methods: {
			// tab切换
			tabSelect(index) {

				this.tabCur = index
			},
			// 获取用户位置
			getUserLocation() {
				let _this = this;
				uni.getLocation({
					type: 'wgs84',
					isHighAccuracy: true,
					async success(res) {
						console.log(res)
						let {
							latitude,
							longitude
						} = res;
						let data = await fetchCity(latitude, longitude);
						console.log(data)
						let city = data.result.addressComponent.city;
						wx.setStorageSync('city', city)
						_this.city = city
					},
					fail(err) {
						_this.setData({
							isAgreeGetLocation: false
						})
					}
				})
			},
			// 获取热映电影列表
			async movieList() {
				let result = await fetchMovieList(this.page, this.pagesize);
				// 说明加载完毕
				if (result.length < this.pagesize) {
					this.isLoadFinish = false
					wx.showToast({
						title: '加载完毕了',
					})
					return;
				}
				// 正则替换   w.h 替换为空    图片才能加载出来
				result = result.map(item => {
					item.img = item.img.replace(/\w.h/, '')
					return item
				})
				// 合并数据
				result = [...this.movieListData, ...result]
				this.movieListData = result
			},
			// 获取横向期待电影
			async horizontalMovies(){
				let result = await fetchHorizontalMovies();
				result = result.map(item=>{
					item.img = item.img.replace(/\w.h/,'')
					return item
				})
				this.crosswiseData = result
			},
			// 获取待映电影
			async toHitMovie(){
				let result = await fetchToHitMovie();
				let movieList = result
				movieList = movieList.map(item => {
					item.img = item.img.replace(/\/w.h/, '')
					return item
				})
				// 日期分组  {  1月1日 周六: [{…}] }
				let dateGroupMovies = {};
				movieList.forEach(item => {
					// 如果里面有日期(key)就把每一项数据加进去作为值(value)
					// 没有日期(key)就把每一项数据作为他的key
					if (dateGroupMovies[item.comingTitle]) {
						dateGroupMovies[item.comingTitle].push(item)
					} else {
						dateGroupMovies[item.comingTitle] = [item]
					}
				})
				this.reflectedData = dateGroupMovies
			},
			// 获取设备窗口的高度
			async getWindowHeight() {
				let {
					windowHeight
				} = await wxGetSystemInfo()
				this.windowHeight = windowHeight
				console.log(windowHeight)
			},
			// 上拉加载更多   页码++  然后再发送请求获取
			scrollLoadMore() {
				// 说明加载完毕就不再执行
				if (!this.isLoadFinish) {
					return;
				}
				this.page++,
					this.movieList()
			},

			// 下拉刷新  页码始终为第一页   
			pullToRefresh() {
				if (this.tabCur === 0) {
					this.page = 1,
					this.isLoadFinish = true,
					this.movieListData = [],
					this.isPullRefresh = false,
					this.movieList()
					return
				}
			},
			onRestore(){
				this.isPullRefresh = 'restore'; // 需要重置
			}
		},
		components: {
			movieList
		},
		// 页面显示的时候触发
		onShow: function() {
			let _this = this;
			console.log('显示');
			// 不是第一次就不再往下执行
			if (this.isFirstTime) {
				return
			}
			wx.getSetting({
				success(res) {
					// 如果用户同意,就获取位置,并且隐藏授权按钮
					if (res.authSetting['scope.userLocation']) {
						_this.getUserLocation();
						_this.isAgreeGetLocation = true
					} else {
						// 否则就提示授权,并且把授权按钮显示
						wx.showToast({
								title: '请打开授权页面进行授权',
							}),
							_this.isAgreeGetLocation = false
					}
				}
			})
		},
		// 页面隐藏的时候触发
		onHide: function() {
			console.log('隐藏');
			this.isFirstTime = false
		},
		async onLoad() {
			//初始化设备窗口高度
			this.getWindowHeight()
			// 获取位置
			let city = wx.getStorageSync('city');
			if (city) {
				this.city = city
			} else {
				//调用方法 重新获取用户位置
				this.getUserLocation()
			}
			// 获取横向期待电影
			this.horizontalMovies()
			// 下拉刷新
			this.isPullRefresh = true
			// 初始化热映电影列表
			this.movieList()
			// 获取待映电影列表
			this.toHitMovie()
			// let result = await Promise.all([fetchExpectMovies(), fetchToHitMovie()])
			// // 获取待映近期期待的电影 
			// let expectMoviesData = result[0]
			// this.expectMoviesData = expectMoviesData
			// let movieList = result[1]
			// console.log('mo',result[1])
			// movieList = movieList.map(item => {
			// 	item.img = item.img.replace(/\/w.h/, '')
			// 	return item
			// })
			// // 日期分组  {  1月1日 周六: [{…}] }
			// let dateGroupMovies = {};
			// movieList.forEach(item => {
			// 	// 如果里面有日期(key)就把每一项数据加进去作为值(value)
			// 	// 没有日期(key)就把每一项数据作为他的key
			// 	if (dateGroupMovies[item.comingTitle]) {
			// 		dateGroupMovies[item.comingTitle].push(item)
			// 	} else {
			// 		dateGroupMovies[item.comingTitle] = [item]
			// 	}
			// })
			// this.reflectedData = dateGroupMovies
		}
	}
</script>

<style lang="scss">
	@import "../../assets/iconfont.wxss";

	.tabs {
		display: flex;
		justify-content: space-evenly;
		font-size: 32rpx;
		background-color: #FFF;
		color: #A9A9A9;
	}

	.tab_item {
		height: 114rpx;
		line-height: 100rpx;

		&.cur {
			position: relative;
			color: #F62D5C;

			&::after {
				content: '';
				width: 36rpx;
				height: 6rpx;
				position: absolute;
				bottom: 20rpx;
				left: 50%;
				margin-left: -18rpx;
				background-color: #F62D5C;
			}
		}
	}
	.movieContainer{
	.lateralContainer{
		display: flex;
		justify-content: space-between;
	.expectMovies{
		margin: 20rpx;
		.movies{
			width: 300rpx;
			height: 300rpx;
		}
	}
	}
	}
</style>
