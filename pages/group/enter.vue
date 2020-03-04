<template>
	<view>
		<cell v-for="enter in enters" :key="enter.id" :enter="enter" :showUser="true" :showGroup="false" />
		<uniLoadMore :status="loadMoreStatus" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多体温记录"}' />
	</view>
</template>

<script>
	import cell from '@/components/enter/cell.vue';
	
	export default {
		components:{
			cell
		},
		data() {
			return {
				groupId: "",
				enters: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false
			}			
		},
		onLoad(option){
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
						`/health/user/group/enters?groupId=${this.groupId}&from=${this.from}&size=${this.pageSize}`,
						(data) => {
							this.enters.push(...data);
							this.nextPage(data);
					});
				}
			},
			reloadData() {
				this.enters = [];
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
