<template>
	<view>
		<view v-show="!qrcode.show">
			<uni-notice-bar showIcon="true" text="右下角体温地图可以查看附近20公里内的发热人员!"></uni-notice-bar>
		</view>
		<cell v-for="temperature in temperatures" :key="temperature.id" :temperature="temperature"></cell>
		<uniLoadMore :status="loadMoreStatus" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多体温记录"}' />
		<view class="operation-area">
			<view v-for="mina in minas" :key="mina.appId" class="circle-button" @click="jumpMina(mina.appId)">
				<text>{{mina.title}}</text>
			</view>	
			<view class="circle-button">
				<text>
					<navigator :url="'/pages/temperature/map'">体温地图</navigator>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import cell from '@/components/temperature/cell.vue';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';

	export default {
		data() {
			return {
				temperatures: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false,
				minas: []
			}
		},
		components: {
			cell,
			uniNoticeBar
		},
		onLoad() {
			this.loadData();
			this.loadMinas();
		},
		onReachBottom() {
			this.loadMoreStatus = this.isLoadFinish ? "noMore" : "loading";
			this.loadData();
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
			this.reloadData();
		},
		methods: {
			loadData() {
				if (!this.isLoadFinish) {
					this.getWithToken(`/health/user/temperatures?from=${this.from}&size=${this.pageSize}`, (data) => {
						this.temperatures.push(...data);
						this.nextPage(data);
					});
				}
			},
			loadMinas() {
				this.getWithToken('/health/user/jump/minas', (data) => {
					this.minas.push(...data);
				});
			},
			jumpMina(appId){
				uni.navigateToMiniProgram({
				  appId,
				  extraData: {
				    'fromuser': 'jiankangma'
				  }
				});
			},
			reloadData() {
				this.temperatures = [];
				this.from = 0;
				this.isLoadFinish = false;
				this.loadMoreStatus = "loading";
				this.loadData();
			},
			nextPage(responseData) {
				if (responseData.length < this.pageSize) {
					this.isLoadFinish = true;
				} else {
					this.from = this.from + this.pageSize;
				}
				this.loadMoreStatus = this.isLoadFinish ? "noMore" : "more";
			}
		}
	}
</script>

<style>
	.uni-noticebar {
		margin-bottom: 0rpx !important;
	}

	.operation-area {
		position: fixed;
		bottom: 40rpx;
		right: 20rpx;
		z-index: 999;
	}

	.circle-button {
		background-color: #d71345;
		/* background: linear-gradient(to top, #000 0%,#007AFF 100%); */
		border-radius: 50%;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
		/* 		border: #007aff;
		border-width: 1px;
		border-style: solid; */
		width: 100rpx;
		height: 62rpx;
		font-size: 22rpx;
		text-align: center;
		padding-top: 38rpx;
		margin-bottom: 15rpx;
		color: white;
	}
</style>
