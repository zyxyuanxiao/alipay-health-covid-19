<template>
	<view class="cell">
		<view class="share">{{group.distance/1000 + 'km'}}</view>
		<view class="title">{{group.name}}<text class="type">{{group.type}}</text></view>
		<view v-if="type == 'nearby'" class="submit-button">
			<navigator v-if="group.status == 3" :url="`/pages/group/member/join?groupId=${group.id}&groupName=${group.name}&joinOrAdd=join`">
				<button size="mini" plain="true">加入</button>
			</navigator>
			<!-- <button v-else-if="group.status == 1" size="mini" plain="true" :disabled="true">审核中</button> -->
			<text v-else-if="group.status == 1" class="joining">审核中</text>
			<!-- <button v-else size="mini" plain="true" :disabled="true">已加入</button> -->
			<text v-else class="joined">已加入</text>
		</view>
		<view v-else-if="type == 'joined'" class="submit-button">
			<!-- <button size="mini" plain="true" :disabled="true">已加入</button> -->
			<text class="joined">已加入</text>
		</view>
		<view v-else class="submit-button">
			<navigator :url="`/pages/group/setting?groupId=${group.id}`">
				<button size="mini" plain="true">设置</button>
			</navigator>
		</view>
		<view class="introduce">{{group.notice}}</view>
		<view class="footer">
			<view class="footer-button"><button type="primary" size="mini" open-type="share" class="text-button" :data-groupId="group.id"
				 :data-groupName="group.name">邀请好友</button></view>
			<view class="footer-button"><button type="primary" size="mini" class="text-button" @click="showQrcode">二维码</button></view>
			<view v-show="type == 'manage' && group.isAdmin == 1" class="footer-button">
				<navigator :url="`/pages/group/member?groupId=${group.id}&groupName=${group.name}&status=2`">
					<button type="primary" size="mini" class="text-button">所有人员</button>
				</navigator>
			</view>
			<view v-show="type == 'manage' && group.isAdmin == 1" class="footer-button">
				<navigator :url="`/pages/group/temperature?groupId=${group.id}`">
					<button type="primary" size="mini" class="text-button">体温记录</button>
				</navigator>				
			</view>
			<view v-show="type == 'manage' && group.isAdmin == 1" class="footer-button">
				<navigator :url="`/pages/group/enter?groupId=${group.id}`">
					<button type="primary" size="mini" class="text-button">出入记录</button>
				</navigator>				
			</view>			
		</view>
	</view>
</template>

<script>
	import {
		Group_Qrcode
	} from "@/common/event.js";
	export default {
		name: "cell",
		data() {
			return {}
		},
		props: {
			group: Object,
			type: String
		},
		methods: {
			showQrcode() {
				console.log("显示二维码");
				uni.$emit(Group_Qrcode, {
					"qrcode": this.group.qrcode,
					"groupName": this.group.name
				});
			}
		}
	}
</script>

<style>
	.type {
		color: white;
		background-color: #F0AD4E;
		font-size: 20rpx;
		padding: 5rpx;
		margin-left: 3rpx;
	}
	.cell {
		margin: 10px;
		padding: 10px;
		background-color: white;
		border: #e0e0dd;
		border-width: 1px;
		border-style: solid;
		border-radius: 10rpx;
	}

	.share {
		float: right;
		font-size: 30rpx;
		padding-bottom: 5rpx;
		color: #999;
	}

	.title {
		font-size: 38rpx;
		color: #333;
		padding-bottom: 10rpx;
	}

	.introduce {
		font-size: 30rpx;
		color: #999;
		padding-top: 5rpx;
		padding-bottom: 20rpx;
		width: 80%;
	}

	.footer {
		display: flex;
		direction: row;
	}

	.footer-button {
		margin-right: 25rpx;
		font-size: 25rpx;
		margin-top: 5rpx;
		color: #007aff;
	}

	.submit-button {
		float: right;
		font-size: 21rpx;
		margin-top: 8rpx;
	}

	.text-button {
		font-size: 25rpx;
		border: none;
		padding: 0rpx;
		margin: 0rpx;
		background-color: white;
		color: #007aff;
		height: 35rpx;
	}

	.joining {
		font-size: 28rpx;
		color: red;
		padding-right: 3rpx;
	}

	.joined {
		font-size: 28rpx;
		color: #999;
		padding-right: 3rpx;
	}
</style>
