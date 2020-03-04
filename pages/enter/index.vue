<template>
	<view>
		<uni-notice-bar showIcon="true" text="进入扫码或者离开扫码,请扫群组的二维码,如果没有群组,可在群防群控中免费创建!"></uni-notice-bar>
		<view>
			<cell v-for="enter in enters" :key="enter.id" :enter="enter" :showUser="false" :showGroup="true" />
		</view>
		<uniLoadMore :status="loadMoreStatus" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多出入记录"}' />
		<view class="operation-area">
			<view class="circle-button" @click="scanQrcode('进入')">
				<text>
					进入扫码
				</text>
			</view>
			<view class="circle-button" @click="scanQrcode('离开')">
				<text>
					离开扫码
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import cell from '@/components/enter/cell.vue'
	
	export default {
		components: {
			cell
		},
		data() {
			return {
				enters: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false
			}
		},
		onLoad(){
			this.loadData();
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
			loadData(){
				if(!this.isLoadFinish){
					this.getWithToken(`/health/user/enters?from=${this.from}&size=${this.pageSize}`, 
					(data) => {
						this.enters.push(...data);
						this.nextPage(data);
					});
				}
			},
			scanQrcode(status){
				uni.scanCode({
					scanType: 'qrCode',
					onlyFromCamera: true,
					success(res) {
						console.log('扫码内容：' + res.result);
						const qrcode = decodeURIComponent(res.result).split("/pages/group/member/join");
						if (qrcode.length != 2) {
							uni.showToast({
								"title": "无法识别该二维码"
							});
						} else {
							const url = `/pages/enter/enter${qrcode[1]}&status=${status}`;
							console.log(url);
							uni.navigateTo({
								url
							});
						}						
					}
				})
			},
			reloadData(){
				this.enters = [];
				this.from = 0;
				this.isLoadFinish = false;
				this.loadMoreStatus = "loading";
				this.loadData();
			},
			nextPage(responseData){
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
		margin-bottom: 0rpx!important;
	}
	
	.operation-area {
		position: fixed;
		bottom: 40rpx;
		right: 20rpx;
		z-index: 999;
	}

	.circle-button {
		background-color: #007AFF;
		border-radius: 50%;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
		width: 100rpx;
		height: 62rpx;
		font-size: 22rpx;
		text-align: center;
		padding-top: 38rpx;
		margin-bottom: 15rpx;
		color: white;
	}
</style>
