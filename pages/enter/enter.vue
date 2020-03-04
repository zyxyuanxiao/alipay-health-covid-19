<template>
	<view class="uni-common-mt">
		<view class="uni-form-item">
			<label class="title">{{'群组: ' + enter.groupName}}</label>
		</view>
		<view class="uni-form-item">
			<label class="title">{{'状态: ' + enter.status}}</label>
		</view>
		<view class="uni-form-item">
			<label class="title">人数(必填)</label>
			<view>
				<input focus="true" maxlength="3" type="number" class="uni-input short-length" v-model.trim="enter.number" />
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">体温(可不填，范围35℃-41℃)</label>
			<view>
				<input maxlength="4" class="uni-input short-length" type="digit" v-model="enter.temperature" />
				<text class="temperature-unit">℃</text>
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">车牌(没开车，可不填)</label>
			<view>
				<input maxlength="10" class="uni-input" v-model.trim="enter.carNo" />
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">备注(可不填)</label>
			<textarea placeholder="" class="remark" placeholder="其他特殊情况说明" v-model="enter.remark" />
			</view>
		<view class="uni-form-item submit-button">
			<button type="primary" :disabled="disableButton" @click="submitForm">提交</button>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				enter: {
					groupId: "",
					groupName: "",
					status: "",
					number: 1,
					temperature: "",
					carNo: "",
					remark: ""
				},
				disableButton: false
			}
		},
		onLoad(option){
			this.enter.groupId = option.groupId;
			this.enter.groupName = option.groupName;
			this.enter.status = option.status;
			this.getWithToken(`/health/user/group/isJoin?groupId=${option.groupId}`, (data) => {
				if(data.isJoin == 0){
					uni.showToast({
						"title": "请先加入群组"
					});
					uni.navigateTo({
						url: `/pages/group/member/join?groupId=${option.groupId}&groupName=${option.groupName}&joinOrAdd=join`
					});
				}
			});			
		},
		methods: {
			submitForm(){
				if(this.checkForm()){
					this.disableButton = true;
					this.postWithToken("/health/user/enter", this.enter, () => {
						uni.showToast({
							title: '提交成功',
							complete: () => {
								uni.reLaunch({
									url: "/pages/enter/index"
								});
							}
						});
					}, () => {
						this.disableButton = false;
					});
				}
			},
			checkForm(){
				if(this.enter.number < 1){
					uni.showToast({
						"title": "人数必须大于0"
					});
					return false;
				}
				const temperature = this.enter.temperature;
				if(temperature.length > 0 && (temperature > 41 || temperature < 35)){
					uni.showToast({
						title: '请填写正确的体温'
					});					
					return false;
				}
				return true;
			}
		}
	}
</script>

<style>
	.uni-common-mt {
		/* margin: 0rpx 30rpx; */
		padding: 30rpx;
	}
	
	.uni-input {
		background-color: #FFFFFF;
		width: 97%;
	}
	
	.short-length {
		width: 100rpx!important;
	}

	.uni-form-item {
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 30rpx;
	}	
	.remark {
		background-color: #FFFFFF;
		/* width: 100%; */
		height: 200rpx;
	}
	.submit-button {
		margin-top: 30rpx;
	}
	
	.temperature-unit {
		font-size: 40rpx;
		/* padding-bottom: 10rpx; */
	}
</style>
