<template>
	<view>
		<!-- <emptyDefault :show="temperatures.length == 0" text="无体温记录"/> -->
		<cell v-for="temperature in temperatures" :key="temperature.id" :temperature="temperature" :showUser="true" />
		<uniLoadMore :status="loadMoreStatus" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多体温记录"}' />
	</view>
</template>

<script>
	import cell from '@/components/temperature/cell.vue'
	export default {
		data() {
			return {
				groupId: "",
				temperatures: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false
			}
		},
		components: {
			cell
		},
		onLoad(option) {
			this.groupId = option.groupId;
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
			loadData() {
				if (!this.isLoadFinish) {
					this.getWithToken(
						`/health/user/group/temperatures?groupId=${this.groupId}&from=${this.from}&size=${this.pageSize}`,
						(data) => {
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

</style>
