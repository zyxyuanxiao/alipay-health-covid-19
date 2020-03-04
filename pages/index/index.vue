<template>
	<view class="content">
		<view v-if="qrcode.show" class="qrcode">
			<view class="qrcode-title">专用健康码</view>
			<tkiQrcode :val="qrcode.value" :size="500" :loadMake="qrcode.show" :pdground="qrcode.color" :foreground="qrcode.color" />
			<view class="qrcode-name">{{qrcode.name}}</view>
			<button size="mini" class="qrcode-close" @click="qrcode.show = false">关闭二维码</button>
		</view>
		<view v-show="!qrcode.show">
			<image class="banner" src="/static/banner.jpg" mode="scaleToFill"></image>
		</view>
		<view v-show="!qrcode.show">
			<uni-notice-bar showIcon="true" text="连续14天体温正常且无其他症状,可获得绿色健康码!"></uni-notice-bar>			
		</view>
		<view v-show="!qrcode.show">
			<measure :symptoms="symptoms" fromPage="home" />
		</view>
		<view v-show="!qrcode.show" class="operation-area">
			<view class="circle-button" @click="showQrcode" :class="healthStatusColor">
				<text>健康码</text>
			</view>
		</view>
		<tip v-if="!isCollected" />
	</view>
</template>

<script>
	import measure from '@/components/temperature/measure.vue';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	import tip from "@/components/tips/collect-tip.vue";

	export default {
		components: {
			measure,
			uniNoticeBar,
			tkiQrcode,
			tip
		},
		data() {
			return {
				"symptoms": [],
				"healthStatus": 0,
				"healthStatusColor": "yellow",
				isCollected: true,
				qrcode: {
					value: "",
					show: false,
					name: "",
					color: "#F0AD4E"
				}
			}
		},
		methods: {
			showQrcode() {
				this.qrcode.show = !this.qrcode.show;
				this.updateQrcode();
			},
			updateQrcode() {
				this.getWithToken("/health/user/status", (data) => {
					// console.log(data);
					this.healthStatus = data.status;
					this.healthStatusColor = this.healthStatus == 1 ? 'red' : (this.healthStatus == 3 ? 'green' : 'yellow');
					this.qrcode.name = data.desc;
					this.qrcode.value = data.qrcode;
					this.qrcode.color = this.healthStatus == 1 ? '#d71345' : (this.healthStatus == 3 ? '#b2d235' : '#F0AD4E');
				});
			},
			updateStatus() {
				my.isCollected({
					success: (res) => {
						this.isCollected = res.isCollected;
					}
				});
			}
		},
		onLoad() {
			this.getWithoutToken("/health/user/symptoms", (data) => {
				this.symptoms.push(...data);
			});
			this.login(() => {
				this.updateQrcode();
			});
		},
		onShow() {
			this.updateStatus();
		},
		onShareAppMessage(res) {
			return {
				title: "体温登记，健康申报，人员出入登记",
				path: `/pages/index/index?action=share`,
				bgImgUrl: "https://ibooktech.oss-cn-beijing.aliyuncs.com/health/preview.jpg",
				imageUrl: "https://ibooktech.oss-cn-beijing.aliyuncs.com/health/preview.jpg"
			}
		}
	}
</script>

<style>
	.banner {
		width: 100%;
		height: 250rpx;
	}

	.operation-area {
		position: fixed;
		bottom: 40rpx;
		right: 20rpx;
	}

	.circle-button {
		border-radius: 50%;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
		width: 100rpx;
		height: 65rpx;
		font-size: 27rpx;
		text-align: center;
		padding-top: 35rpx;
		margin-bottom: 15rpx;
		color: white !important;
	}

	.green {
		background-color: #b2d235;
		color: #b2d235;
	}

	.yellow {
		background-color: #F0AD4E;
		color: #F0AD4E;
	}

	.red {
		background-color: #d71345;
		color: #d71345;
	}

	.qrcode {
		position: fixed;
		z-index: 999;
		width: 80%;
		top: 20%;
		left: 7%;
		align-content: center;
		text-align: center;
		background: white;
		padding: 20rpx;
		border: #e0e0dd;
		border-width: 1px;
		border-style: solid;
		border-radius: 10rpx;
	}

	.qrcode-title {
		font-size: 40rpx;
		padding: 30rpx;
	}
	
	.qrcode-name {
		font-size: 25rpx;
		padding: 5rpx;
	}

	.qrcode-close {
		margin-top: 25rpx;
		margin-bottom: 20rpx;
	}
</style>
