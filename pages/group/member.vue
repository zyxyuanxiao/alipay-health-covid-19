<template>
	<view>
		<view class="tab">
			<view class="bar-title" :class="{active : status == 2}" @tap="changeStatus(2)">
				<text class="title-badge">已加入<uni-badge :text="userNumber.joined" type="primary" size="small"></uni-badge></text>
			</view>
			<view class="bar-title" :class="{active : status == 1}" @tap="changeStatus(1)">
				<text class="title-badge">待审核<uni-badge :text="userNumber.joining" type="error" size="small"></uni-badge></text>
			</view>
		</view>
		<!-- <emptyDefault :show="members.length == 0" text="无人员记录"/> -->
		<view class="member-list">
			<cell v-for="member in members" :key="member.userId" :member="member" :status="status" :groupId="groupId"></cell>
		</view>
		<uniLoadMore :status="loadMoreStatus" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多人员"}' />
		<view class="operation-area">
			<view class="circle-button">
				<navigator :url="`/pages/group/member/join?groupId=${groupId}&groupName=${groupName}&joinOrAdd=add`">
					<text>
						新增人员
					</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import cell from '@/components/member/cell.vue';
	import uniBadge from "@/components/uni-badge/uni-badge.vue";
	import {
		Approve_User,
		Remove_User
	} from "@/common/event.js";

	export default {
		components: {
			cell,
			uniBadge
		},
		data() {
			return {
				status: 2,
				groupId: "",
				groupName: "",
				members: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false,
				userNumber: {
					joined: "0",
					joining: "0"
				}
			}
		},
		onLoad(option) {
			console.log("member onload");
			this.groupId = option.groupId;
			this.groupName = option.groupName;
			this.status = option.status;
			this.getUserNumber();
			this.loadData();
		},
		onShow() {
			const pages = getCurrentPages();
			const currPage = pages[pages.length - 1];
			if (currPage.data.isReload) {
				currPage.data.isReload = false;
				this.reloadData();
			}
		},
		onReachBottom() {
			this.loadMoreStatus = this.isLoadFinish ? "noMore" : "loading";
			this.loadData();
		},
		methods: {
			changeStatus(status) {
				this.status = status;
				this.reloadData();
			},
			loadData() {
				if (!this.isLoadFinish) {
					this.getWithToken(
						`/health/user/group/members?groupId=${this.groupId}&status=${this.status}&from=${this.from}&size=${this.pageSize}`,
						(data) => {
							// console.log(data);
							this.members.push(...data);
							this.nextPage(data);
						});
				}

			},
			getUserNumber() {
				this.getWithToken(`/health/user/group/user/number?groupId=${this.groupId}`, (data) => {
					this.userNumber.joined = data.joinedNumber + "";
					this.userNumber.joining = data.joiningNumber + "";
				})
			},
			reloadData() {
				this.members = [];
				this.from = 0;
				this.isLoadFinish = false;
				this.loadMoreStatus = "loading";
				this.getUserNumber();
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
	.tab {
		display: flex;
		direction: row;
		border-bottom: #e0e0dd;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		background-color: white;
		position: fixed;
		width: 100%;
		z-index: 999;
		top: 0rpx;
	}

	.bar-title {
		width: 50%;
		padding: 20rpx;
		font-size: 15px;
		color: #333333;
		text-align: center;
		align-content: center;
	}

	.title-badge {
		display: flex;
		direction: row;
		align-items: center;
		width: 100%;
		margin-left: 30%;
	}

	.active {
		border-bottom: #007aff;
		border-bottom-width: 2px;
		border-bottom-style: solid;
	}

	.member-list {
		padding-top: 70rpx;
	}

	.operation-area {
		position: fixed;
		bottom: 40rpx;
		right: 20rpx;
	}

	.circle-button {
		background-color: #007AFF;
		border-radius: 50%;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
		/* 		border: #007aff;
		border-width: 1px;
		border-style: solid; */
		width: 100rpx;
		height: 62rpx;
		font-size: 21rpx;
		text-align: center;
		padding-top: 38rpx;
		margin-bottom: 15rpx;
		color: white;
	}
</style>
