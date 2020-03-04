<template>
	<view>
		<view v-if="name" class="user-info">
			<text>{{`姓名:${name} 手机号:${phone}`}}</text>
		</view>
		<view v-if="healthStatusDesc" class="user-info" :class="healthStatusColor">
			<text>{{healthStatusDesc}}</text>
		</view>
		<!-- <emptyDefault :show="temperatures.length == 0" text="无体温记录"/> -->
		<view class="temperature-list">
			<cell v-for="temperature in temperatures" :key="temperature.id" :temperature="temperature"></cell>
		</view>
		<uniLoadMore :status="loadMoreStatus" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多体温记录"}' />
	</view>
</template>

<script>
	import cell from '@/components/temperature/cell.vue'
	export default {
		data() {
			return {
				groupId: "",
				userId: "",
				name: "",
				phone: "",
				temperatures: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false,
				healthStatusDesc: "",
				healthStatusColor: "yellow"
			}
		},
		components: {
			cell
		},
		onLoad(option) {
			//如果是扫码进来的，则要先登录再请求数据
			if (this.isScanOrShareEnterPage(option)) {
				this.userId = option.userId;
				this.login(() => {
					this.getWithToken(`/health/user/status?otherUserId=${this.userId}`, (data) => {
						// console.log(data);
						this.healthStatusDesc = data.desc;
						this.healthStatusColor = data.status == 1 ? 'red' : (data.status == 3 ? 'green' : 'yellow');
					});
					this.loadData();
				});
			} else {
				this.name = option.name;
				this.phone = option.phone;
				this.userId = option.userId;
				this.groupId = option.groupId;
				this.loadData();
			}
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
					let url = this.name ?
						`/health/user/group/user/temperatures?groupId=${this.groupId}&userId=${this.userId}&from=${this.from}&size=${this.pageSize}` :
						`/health/user/temperatures?otherUserId=${this.userId}&from=${this.from}&size=${this.pageSize}`;
					this.getWithToken(url, (data) => {
						this.temperatures.push(...data);
						this.nextPage(data);
					});
				}
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
	.user-info {
		width: 100%;
		text-align: center;
		padding: 15rpx;
		font-size: 28rpx;
		color: white;
		background-color: #F0AD4E;
		position: fixed;
		z-index: 999;
	}

	.temperature-list {
		/* margin-top: 40rpx; */
		padding-top: 60rpx;
	}

	.green {
		background-color: #b2d235;
	}

	.yellow {
		background-color: #F0AD4E;
	}

	.red {
		background-color: #d71345;
	}
</style>
