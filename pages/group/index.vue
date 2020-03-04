<template>
	<view>
		<view v-show="!qrcode.show" class="tab">
			<view class="bar-title" :class="{active : type == 'nearby'}" @tap="selectType('nearby')">附近群组</view>
			<view class="bar-title" :class="{active : type == 'joined'}" @tap="selectType('joined')">已加群组</view>
			<view class="bar-title" :class="{active : type == 'manage'}" @tap="selectType('manage')">管理群组</view>
		</view>
		<view v-if="qrcode.show" class="qrcode">
			<view class="qrcode-name">{{qrcode.name}}</view>
			<tkiQrcode :val="qrcode.value" :size="500" :loadMake="qrcode.show" />
			<button size="mini" class="qrcode-close" @click="qrcode.show = false">关闭二维码</button>
		</view>
		<!-- <emptyDefault :show="temperatures.length == 0" text="没有群组"/> -->
		<view v-show="!qrcode.show" class="group-list">
			<cell v-for="group in groups" :group="group" :key="group.id" :type="type"></cell>
		</view>
		<view v-show="!qrcode.show">
			<uniLoadMore :status="loadMoreStatus" :contentText='{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多群组"}' />
		</view>
		<view v-show="!qrcode.show" class="operation-area">
			<view class="circle-button">
				<text>
					<navigator :url="'/pages/group/create'">创建群组</navigator>
				</text>
			</view>
			<view class="circle-button">
				<text @click="scanQrcode">
					扫码加入
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import cell from '@/components/group/cell.vue';
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	import {
		Group_Qrcode
	} from "@/common/event.js";
	
	export default {
		components: {
			cell,
			tkiQrcode
		},
		data() {
			return {
				type: "nearby",
				qrcode: {
					value: "",
					show: false,
					name: ""
				},
				groups: [],
				loadMoreStatus: "loading",
				from: 0,
				isLoadFinish: false
			}
		},
		onLoad(option) {
			//如果是扫码或者分享直接进入页面，则要先登录
			if(this.isScanOrShareEnterPage(option)){
				this.login(() => {
					this.loadData();
				});
			}else{
				this.loadData();
			}
			uni.$on(Group_Qrcode, (data) => {
				console.log(data);
				this.qrcode.value = data.qrcode;
				this.qrcode.show = true;
				this.qrcode.name = data.groupName;
			})
		},
		onShow(){
			const pages = getCurrentPages();
			const currPage = pages[pages.length-1];
			if(currPage.data.isReload){
				currPage.data.isReload = false;
				this.reloadData();
			}
		},
		onReachBottom() {
			this.loadMoreStatus = this.isLoadFinish ? "noMore" : "loading";
			this.loadData();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				const button = res.target;
				const groupId = button.dataset.groupId;
				const groupName = button.dataset.groupName;
				return {
					title: `邀请您加入${groupName}，一起战疫情!`,
					path: `/pages/group/member/join?groupId=${groupId}&groupName=${groupName}&joinOrAdd=join&action=share`,
					bgImgUrl: "https://ibooktech.oss-cn-beijing.aliyuncs.com/health/preview.jpg",
					imageUrl: "https://ibooktech.oss-cn-beijing.aliyuncs.com/health/preview.jpg"
				}
			}
			return {
				title: "体温登记，健康申报，人员出入登记",
				path: `/pages/group/index?action=share`,
				bgImgUrl: "https://ibooktech.oss-cn-beijing.aliyuncs.com/health/preview.jpg",
				imageUrl: "https://ibooktech.oss-cn-beijing.aliyuncs.com/health/preview.jpg"
			}
		},
		methods: {
			selectType(type) {
				this.type = type;
				this.reloadData();
			},
			scanQrcode() {
				uni.scanCode({
					scanType: 'qrCode',
					success(res) {
						console.log('扫码内容：' + res.result);
						const qrcode = res.result.split("page=");
						if (qrcode.length != 2) {
							uni.showToast({
								"title": "无法识别该二维码"
							})
						} else {
							const url = decodeURIComponent(qrcode[1]);
							// console.log(url);
							uni.navigateTo({
								url
							});
						}
					}
				});
			},
			loadData() {
				if(!this.isLoadFinish){
					this.getWithToken(`/health/user/groups?type=${this.type}&from=${this.from}&size=${this.pageSize}`, (data) => {
						this.groups.push(...data);
						this.nextPage(data);
					});			
				}
			},
			reloadData(){
				this.groups = [];
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
		width: 33%;
		padding: 20rpx;
		font-size: 15px;
		color: #333333;
		text-align: center;
	}

	.active {
		border-bottom: #007aff;
		border-bottom-width: 2px;
		border-bottom-style: solid;
	}

	.group-list {
		padding-top: 70rpx;
	}

	.operation-area {
		position: fixed;
		bottom: 40rpx;
		right: 20rpx;
		z-index: 999;
	}

	.circle-button {
		background-color: #007AFF;
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

	.qrcode {
		position: fixed;
		z-index: 999;
		width: 80%;
		/* height: 60%; */
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
	
	.qrcode-name {
		font-size: 38rpx;
		padding: 30rpx;
	}
	
	.qrcode-close {
		margin-top: 30rpx;
	}
</style>
