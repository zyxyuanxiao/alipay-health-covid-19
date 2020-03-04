<template>
	<view class="content">
		<view class="group-info">
			<text v-if="joinOrAdd == 'join'">{{`欢迎加入${groupName}，一起战疫情!`}}</text>
			<text v-else>{{`${groupName}新增人员，一起战疫情!`}}</text>
		</view>
		<view class="uni-common-mt">
			<view v-for="field in fields" :key="field.id" class="uni-form-item">
				<view v-if="field.type == 'string'">
					<label class="title">{{field.name + '(必填)'}}</label>
					<view>
						<input maxlength="30" class="uni-input" :placeholder="field.placeholder" v-model.trim="infoFieldsJson[field.name]" />
					</view>
				</view>
				<view v-if="field.type == 'phone'">
					<label class="title">{{field.name + '(必填)'}}</label>
					<view>
						<input type="number" maxlength="11" class="uni-input" :placeholder="field.placeholder" v-model.trim="infoFieldsJson[field.name]" />
					</view>
				</view>
				<view v-if="field.type == 'idCard'">
					<label class="title">{{field.name + '(必填)'}}</label>
					<view>
						<input maxlength="18" class="uni-input" :placeholder="field.placeholder" v-model.trim="infoFieldsJson[field.name]" />
					</view>
				</view>
				<view v-if="field.type == 'number'">
					<label class="title">{{field.name + '(必填)'}}</label>
					<view>
						<input type="number" class="uni-input" :placeholder="field.placeholder" v-model.trim="infoFieldsJson[field.name]" />
					</view>
				</view>
				<view v-if="field.type == 'select'">
					<label class="title">{{field.name + '(必填)'}}</label>
					<view class="select-area">
						<radio-group @change="selectChange">
							<label v-for="value in field.defaultValues.split(',')" class="radio">
								<radio :value="field.name + ':' + value" :checked="false" />{{value}}</label>
						</radio-group>
					</view>
				</view>
			</view>
			<view class="uni-form-item">
				<label class="title">备注(可不填)</label>
				<textarea placeholder="" class="remark" placeholder="其他特殊情况说明" v-model="infoFieldsJson['备注']" />
				</view>
			<view class="uni-form-item submit-button">
				<button type="primary" :disabled="disableButton" @click="submitForm">{{joinOrAdd == 'join' ? '加入' : '新增'}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fields: [],
				groupId: "",
				groupName: "",
				infoFieldsJson: {},
				disableButton: false,
				joinOrAdd: "join"
			}
		},
		methods: {
			selectChange(event){
				const keyValue = event.target.value.split(":");
				this.infoFieldsJson[keyValue[0]] = keyValue[1];
			},
			submitForm(){
				console.log(this.infoFieldsJson);
				if(this.checkForm()){
					this.disableButton = true;
					const url = this.joinOrAdd == "join" ? "/health/user/group/join" : "/health/user/group/user/add";
					this.postWithToken(url,
					`groupId=${this.groupId}&infoFieldsJson=${JSON.stringify(this.infoFieldsJson)}`, () => {
						if(this.joinOrAdd == "join"){
							uni.showToast({
								"title": `加入成功`,
								complete(){
									const pages = getCurrentPages();
									if(pages.length < 2){
										uni.reLaunch({
											url:"/pages/group/index",											
										});
									}else{
										const prevPage = pages[pages.length - 2]; //上一个页面
										prevPage.setData({
											isReload: true
										});
										uni.navigateBack();										
									}
								}
							})
						}else{
							uni.showToast({
								"title": `新增成功`,
								complete(){
									const pages = getCurrentPages();
									const prevPage = pages[pages.length - 2]; //上一个页面
									prevPage.setData({
										isReload: true
									});									
								}
							});
							this.cleanForm();
							this.disableButton = false;
						}
					}, () => {
							this.disableButton = false;
					});
				}
			},
			checkForm(){
				const infoFieldsJson = this.infoFieldsJson;
				for(let key in infoFieldsJson){
					console.log(key);
					if(key != "备注" && (!infoFieldsJson[key] || infoFieldsJson[key].length == 0)){
						uni.showToast({
							"title": `请填写${key}`
						});
						return false;
					}
				}
				return true;
			},
			cleanForm(){
				this.infoFieldsJson["姓名"] = "";
				this.infoFieldsJson["手机号"] = "";
			},
			loadData(){
				this.getWithToken(`/health/user/group/user/fields?groupId=${this.groupId}`, (data) => {
					this.fields = data;
					this.fields.forEach((field) => {
						console.log(field);
						this.infoFieldsJson[field.name] = "";
					})
					console.log(data);
				});				
			}
		},
		onLoad(option) {
			this.groupId = option.groupId;
			this.groupName = option.groupName;
			this.joinOrAdd = option.joinOrAdd;
			//如果是扫码进来的，则要先登录再请求数据
			if(this.isScanOrShareEnterPage(option)){
				this.login(() => {
					this.loadData();
				});				
			}else{
				this.loadData();
			}
		}
	}
</script>

<style>
	.group-info {
		width: 100%;
		text-align: center;
		padding: 15rpx;
		font-size: 28rpx;
		color: white;
		background-color: #F0AD4E;
		position: fixed;
		z-index: 999;
	}	
	.uni-common-mt {
		/* margin: 0rpx 30rpx; */
		padding: 70rpx 30rpx 30rpx 30rpx;
	}
	.uni-input {
		background-color: #FFFFFF;
		width: 97%;
	}

	.uni-form-item {
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 30rpx;
	}
	
	.radio {
		margin: 5rpx 40rpx 5rpx 10rpx;
	}
	
    .select-area {
		background-color: white;
	}
	
	.remark {
		background-color: #FFFFFF;
		/* width: 100%; */
		height: 200rpx;
	}
	.submit-button {
		margin-top: 30rpx;
	}
</style>
