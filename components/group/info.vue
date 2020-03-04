<template>
	<view class="uni-common-mt">
		<view class="uni-form-item">
			<label class="title">群组名称(必填)</label>
			<view>
				<input class="uni-input" focus placeholder="15个字以内" v-model.trim="group.name" />
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">所属单位(可不填)</label>
			<view>
				<input class="uni-input" placeholder="20个字以内" v-model.trim="group.company" />
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">类型(必填)</label>
			<!-- 			<picker :value="typeIndex" :range-key="id" :range="types" @change="typeChange">
				<view class="uni-input picker">{{types[typeIndex].type}}</view>
			</picker> -->
			<view class="radio-list">
				<radio-group @change="typeChange">
					<label v-for="type in types" class="radio">
						<radio :value="type.id" :checked="group.typeId == type.id" />{{type.type}}</label>
				</radio-group>
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">联系人/联系方式(可不填)</label>
			<view>
				<input class="uni-input" v-model.trim="group.contacts" placeholder="姓名1/手机号1,姓名2/手机号2" />
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">所在地区(必填)</label>
			<view class="content" @click="openAddress">
				<input class="uni-input" disabled="true" v-model.trim="area" placeholder="请选择省市区" />
				<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007aff'></simple-address>
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">详细地址(必填)</label>
			<view>
				<input class="uni-input" v-model.trim="group.address" placeholder="街道、楼牌号" />
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">公告(必填)</label>
			<textarea placeholder="相关的注意事项或者疫情防控要求" class="remark" v-model.trim="group.notice" />
			</view>
		<view class="uni-form-item">
			<label class="title">是否公开</label>
			<view class="radio-list">
				<radio-group @change="isPublicChange">
					<label class="radio"><radio value="1" :checked="group.isPublic == 1" />公开</label>
					<label class="radio"><radio value="0" :checked="group.isPublic == 0"/>不公开</label>
				</radio-group>
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">加入审核</label>
			<view class="radio-list">
				<radio-group @change="isApproveChange">
					<label class="radio"><radio value="0" :checked="group.isApprove == 0" />不需要审核</label>
					<label class="radio"><radio value="1" :checked="group.isApprove == 1"/>需要审核</label>
				</radio-group>
			</view>
		</view>	
		<view class="uni-form-item">
			<label class="title">人员登记信息</label>
			<view class="field-list">
				<checkbox-group @change="selectFields">
					<label v-for="field in fields" class="checkbox-title">
						<checkbox :value="field.id" :disabled="field.required == 1"  
						:checked="field.required == 1 || group.userFieldIds.split(',').includes(field.id)" />{{field.name}}</label>
				</checkbox-group>
			</view>
		</view>					
		<view class="uni-form-item submit-button">
			<button type="primary" @click="submitForm" :disabled="disableButton">{{buttonText}}</button>
		</view>
	</view>
</template>

<script>
	import simpleAddress from "@/components/simple-address/simple-address.nvue";

	export default {
		name: "info",
		components:{
			simpleAddress
		},
		props:{
			groupId: String,
			createOrSetting: {
				type: String,
				default: "create"
			},
			buttonText: {
				type: String,
				default: "保存"
			}
		},
		data() {
			return {
				types: [],
				typeIndex: 0,
				fields: [],
                cityPickerValueDefault: [0, 0, 1],
				group: {
					name: "",
					company: "",
					typeId: "",
					contacts: "",
					province: "",
					city: "",
					district: "",
					address: "",
					notice: "",
					isPublic: 1,
					isApprove: 0,
					userFieldIds: "",
					groupId: ""
				},
				area: "",
				disableButton: false
			}
		},
		methods: {
			openAddress() {
			    this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
			    this.area = e.label;
				let addresses = this.area.split("-");
				this.group.province = addresses[0];
				this.group.city = addresses[1];
				this.group.district = addresses[2];
			},
			isPublicChange(event){
				console.log("isPublic:" + event.target.value);
				this.group.isPublic = event.target.value;
			},
			isApproveChange(event){
				console.log("isApprove:" + event.target.value);
				this.group.isApprove = event.target.value;
			},
			typeChange(event){
				console.log(event.target.value);
				this.group.typeId = event.target.value;
			},
			selectFields(e){
				console.log(e.detail.value);
				this.group.userFieldIds = e.detail.value.join(",");
			},
			checkForm(){
				const group = this.group;
				if(group.name.length == 0){
					uni.showToast({title: "请填写群组名称"});
					return false;
				}
				if(group.name.length < 3){
					uni.showToast({title: "请认真填写群组名称"});
					return false;
				}
				if(group.name.length > 30){
					uni.showToast({title: "群组名称不超过15个字"});
					return false;
				}
				if(group.company.length > 40){
					uni.showToast({title: "单位名称不超过20个字"});
					return false;
				}
				if(group.typeId.length == 0){
					uni.showToast({title: "请选择类型"});
					return false;
				}
				if(group.province.length == 0){
					uni.showToast({title: "请填写所在地区"});
					return false;
				}
				if(group.address.length == 0){
					uni.showToast({title: "请填写详细地址"});
					return false;
				}
				if(group.notice.length == 0){
					uni.showToast({title: "请填写公告"});
					return false;
				}
				if(group.notice.length < 5){
					uni.showToast({title: "请认真填写公告"});
					return false;
				}
				return true;
			},
			submitForm(){
				if(this.checkForm()){
					this.disableButton = true;
					const isSetting = this.createOrSetting == "setting";
					const url = isSetting ? "/health/user/group/modify" : "/health/user/group/create";
					this.postWithToken(url,this.group, () => {
						uni.showToast({
							"title": isSetting ? "修改成功" :"创建群组成功" ,
							complete(){
								// isSetting ? uni.navigateBack() : uni.reLaunch({url: '/pages/group/index'});
								const pages = getCurrentPages();
								// var currPage = pages[pages.length - 1]; //当前页面
								const prevPage = pages[pages.length - 2]; //上一个页面
								prevPage.setData({
									isReload: true
								});
								uni.navigateBack();
							}
						});
					}, () => {
						this.disableButton = false;
					})								
				}
			}
		},
		mounted() {
			this.getWithToken("/health/user/group/types", (data) => {
				this.types = data;
			});
			this.getWithToken("/health/user/group/fields", (data) => {
				this.fields = data;
				if(this.group.userFieldIds.length == 0){
					this.group.userFieldIds =
						this.fields.filter((field) => field.required == 1)
						.reduce((prev, next) => {
							return prev.id + "," + next.id;
						});
				}
			});
			console.log(this.createOrSetting);
			if(this.createOrSetting == "setting"){
				this.getWithToken(`/health/user/group/info?groupId=${this.groupId}`, (data) => {
					this.group = data;
					this.group.groupId = this.groupId;
					this.area = `${data.province}-${data.city}-${data.district}`;
					// console.log(this.group);
				});				
			}
		}
	}
</script>

<style>
	.uni-common-mt {
		padding: 10rpx 30rpx;	
	}
	.uni-input {
		background-color: #FFFFFF;
		width: 97%;
	}

	.uni-form-item {
		margin-bottom: 10rpx;
	}

	.title {
		font-size: 30rpx;
	}
	
	.picker{
		width: 96%;
		padding: 15rpx;
	}
	.remark {
		background-color: #FFFFFF;
		/* width: 100%; */
		height: 200rpx;
	}
	.submit-button {
		margin-top: 30rpx;
	}
	.radio {
		margin: 5rpx 40rpx 5rpx 0rpx;
	}
	.field-list {
		background-color: #FFFFFF;
		padding: 10rpx 20rpx;
	}
	checkbox {
		width: 18px;
		height: 18px;
	}
	.radio-list {
		background-color: #FFFFFF;
		padding: 10rpx 20rpx;
	}
	.checkbox-title {
		width: 33%;
	}
</style>
