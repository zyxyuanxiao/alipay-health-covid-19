<template>
	<view>
		<view v-if="name" class="user-info">
			<text>{{`姓名:${name} 手机号:${phone}`}}</text>
		</view>
		<view class="enter-list">
			<cell v-for="enter in enters" :key="enter.id" :enter="enter" :showUser="false" :showGroup="false" />
		</view>
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
				userId: "",
				name: "",
				phone: "",
				enters: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false
			}
		},
		onLoad(option){
			this.name = option.name;
			this.phone = option.phone;
			this.userId = option.userId;
			this.groupId = option.groupId;
			this.loadData();			
		},
		onReachBottom() {
			this.loadMoreStatus = this.isLoadFinish ? "noMore" : "loading";
			this.loadData();
		},		
		methods: {
			loadData() {
				if(!this.isLoadFinish){
					this.getWithToken(`/health/user/group/user/enters?groupId=${this.groupId}&userId=${this.userId}&from=${this.from}&size=${this.pageSize}`, 
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
	
	.enter-list {
		/* margin-top: 40rpx; */
		padding-top: 60rpx;
	}
</style>
