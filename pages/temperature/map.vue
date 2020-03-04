<template>
	<view>
		<view v-show="!qrcode.show">
			<uni-notice-bar showIcon="true" :text="tip"></uni-notice-bar>
		</view>
		<view>
			<map :longitude="lng" :latitude="lat" :markers="markers" :show-location="true" :scale="scale" @tap="refresh"/>
		</view>
		<cover-view class="button-area" @click="jumpToIndex">
			<button class="submit-button" type="primary">体温登记</button>
		</cover-view>
		<cover-view class="share-area">
			<button class="share-button" open-type="share" type="primary">分享</button>
		</cover-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lat: 30.499402,
				lng: 114.430502,
				scale: 13,
				markers: [],
				tip: "正在玩命加载中..."
			}
		},
		onLoad(option) {
			const that = this;
			if (this.isScanOrShareEnterPage(option)) {
				this.login(() => {
					uni.getLocation({
						type: 'wgs84',
						success(res) {
							that.lng = res.longitude;
							that.lat = res.latitude;
							that.loadData();
						}
					});
					
				});
			} else {
				uni.getLocation({
					type: 'wgs84',
					success(res) {
						that.lng = res.longitude;
						that.lat = res.latitude;
						that.loadData();
					}
				});
			}
		},
		onShareAppMessage(res) {
			return {
				title: "实时掌握20公里内发热人员情况！",
				path: `/pages/temperature/map?action=share`
			}
		},
		methods: {
			jumpToIndex() {
				uni.reLaunch({
					url: "/pages/index/index"
				});
			},
			refresh(event){
				this.lat = event.latitude;
				this.lng = event.longitude;
				this.loadData();
				console.log(event);
			},
			loadData() {
				this.getWithToken(`/health/user/nearby/fevers?lng=${this.lng}&lat=${this.lat}`, (data) => {
					this.markers = [];
					data.forEach((item) => {
						this.markers.push({
							id: item.id,
							latitude: item.lat,
							longitude: item.lng,
							iconPath: "/static/location.png",
							width: 30,
							height: 30,
							label: {
								content: `${item.temperature}℃`,
								color: "#d71345",
								fontSize: "30rpx"
							}
						});
					});
					this.tip = data.length > 0 ? "20公里内有使用小程序登记的发热人员,请注意防护!" : "20公里内没有发热用户使用小程序登记体温!";
				});	
			}
		}
	}
</script>

<style>
	.uni-noticebar {
		margin-bottom: 0rpx !important;
	}

	.button-area {
		position: fixed;
		bottom: 40rpx;
		left: 35%;
		width: 30%;
		border-radius: 50rpx;
		/* font-weight: bold; */
	}
	
	.submit-button {
		font-size: 35rpx;
		height: 75rpx;
		line-height: 75rpx;
	}
	
	.share-area {
		position: fixed;
		bottom: 50rpx;
		right: 20rpx;
		width: 90rpx;
		height: 60rpx;
		border-radius: 50%;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
		padding-bottom: 30rpx;
	}
	
	.share-button {
		font-size: 28rpx;
	}
</style>
