<template>
	<view class="cell">
		<text class="time">{{member.time.substring(0,16)}}</text>
		<view v-for="field in fields" :key="key.name" class="member-item">
			<text class="title">{{field.name + ': '}}</text>
			<text class="desc">{{field.value}}</text>
		</view>
		<view v-show="status == 1" class="submit-button">
			<view class="agree-button">
				<button type="primary" @click="approve('1')" size="mini">通过</button>
			</view>
			<view class="reject-button">
				<button type="warn" @click="approve('0')" size="mini">拒绝</button>
			</view>
		</view>
		<view class="footer">
			<view class="footer-button">
				<navigator :url="`/pages/group/member/temperature?groupId=${groupId}&userId=${member.userId}&name=${name}&phone=${phone}`">
					体温记录
				</navigator>
			</view>
			<view class="footer-button">
				<navigator :url="`/pages/group/member/enter?groupId=${groupId}&userId=${member.userId}&name=${name}&phone=${phone}`">
					出入记录
				</navigator>
			</view>			
			<view v-show="status == 2" class="footer-button">
				<navigator :url="`/pages/group/member/report?groupId=${groupId}&userId=${member.userId}&name=${name}&phone=${phone}`">
					健康申报
				</navigator>
			</view>
			<view v-show="status == 2" class="footer-button" @click="removeUser">删除人员</view>
		</view>
	</view>
</template>

<script>
	import {
		Approve_User,
		Remove_User
	} from "@/common/event.js";
	export default {
		name: "cell",
		props: {
			member: Object,
			status: Number,
			groupId: String
		},
		data() {
			return {
				fields: [],
				name: "",
				phone: ""
			}
		},
		mounted() {
			const infoFieldsJson = JSON.parse(this.member.infoFieldsJson);
			for (let key in infoFieldsJson) {
				if (key == "姓名") {
					this.name = infoFieldsJson[key];
				}
				if (key == "手机号") {
					this.phone = infoFieldsJson[key];
				}
				this.fields.push({
					"name": key,
					"value": infoFieldsJson[key]
				});
			}
		},
		methods: {
			approve(isAgree) {
				this.postWithToken(
					"/health/user/group/approve", `groupId=${this.groupId}&userId=${this.member.userId}&isAgree=${isAgree}`, () => {
						uni.showToast({
							title: "操作成功",
							complete() {
								
							}
						});
						this.redirectPage();
					});
			},
			removeUser() {
				this.postWithToken(
					"/health/user/group/user/remove", `groupId=${this.groupId}&userId=${this.member.userId}`, () => {
						uni.showToast({
							title: "删除成功",
							complete(){
								
							}
						});
						this.redirectPage();
					});
			},
			redirectPage(){
				const pages = getCurrentPages();
				const currPage = pages[pages.length - 1]; //当前页面
				console.log(currPage);
				const data = currPage.data;
				uni.redirectTo({
					url: `/pages/group/member?groupId=${data.groupId}&groupName=${data.groupName}&status=${data.status}`
				});				
			}
		}
	}
</script>

<style>
	.cell {
		margin: 10px;
		padding: 10px;
		background-color: white;
		border: #e0e0dd;
		border-width: 1px;
		border-style: solid;
		border-radius: 10rpx;
	}

	.title {
		font-size: 30rpx;
		color: #999999;
	}

	.desc {
		font-size: 30rpx;
		color: #333333;
	}

	.time {
		float: right;
		color: #999999;
		font-size: 25rpx;
	}

	.member-item {
		padding-bottom: 10rpx;
		width: 70%;
	}

	.footer {
		display: flex;
		direction: row;
	}

	.footer-button {
		margin-right: 25rpx;
		font-size: 25rpx;
		margin-top: 20rpx;
		color: #007aff;
	}

	.submit-button {
		display: flex;
		direction: row;
		float: right;
		margin-top: -10rpx;
	}

	.agree-button {
		margin-right: 10rpx;
	}
</style>
