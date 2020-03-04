<template>
	<view class="uni-common-mt">
		<view class="uni-form-item">
			<label class="title">体温(必填，范围35℃-41℃)</label>
			<view>
				<input class="uni-input" focus="true" type="digit" v-model="data.temperature" />
				<text class="temperature-unit">℃</text>
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">症状(可多选，没有症状可不填)</label>
			<view class="uni-list">
				<checkbox-group @change="selectSymtoms">
					<view class="checkbox-item" v-for="symptom in symptoms" :key="symptom.id">
						<label class="checkbox-title">
							<checkbox :value="symptom.id" :checked="symptom.checked" />{{symptom.symptom}}
						</label>
					</view>
				</checkbox-group>
			</view>
		</view>
		<view class="uni-form-item">
			<label class="title">备注(可不填)</label>
			<textarea placeholder="" class="remark" v-model.trim="data.remark" placeholder="其他特殊情况说明" />
			</view>
		<view class="uni-form-item submit-button">
			<button type="primary" @click="submitTemperature" :disabled="disableButton">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: "measure",
		props: {
			groupId: String,
			userId: String,
			symptoms: Array,
			fromPage: String
		},
		data() {
			return {
				hasError: false,
				disableButton: false,
				data: {
					temperature: "",
					symptomIds: [],
					remark: ""
				}
			}
		},
		methods: {
			selectSymtoms(e){
				 let values = e.detail.value;
				this.data.symptomIds = values.join(",");
                let symptoms = this.symptoms;
                for (let index = 0;index < symptoms.length; index++) {
                    const symptom = symptoms[index]
                    if(values.includes(symptom.id)){
                        this.$set(symptom,'checked',true)
                    }else{
                        this.$set(symptom,'checked',false)
                    }
                }				
			},
			submitTemperature(){
				// console.log(this.data);
				if(!this.checkTemperature()){
					uni.showToast({
						title: '请填写正确的体温'
					});
				}else{
					this.disableButton = true;
					let url = "/health/user/temperature/measure";
					if(this.userId && this.groupId){
						this.data.userId = this.userId;
						this.data.groupId = this.groupId;
						url = "/health/user/group/temperature/measure";
					}
					this.postWithToken(url, this.data, () => {
						uni.showToast({
							title: '提交成功',
							complete: () => {
								if(this.fromPage == "home"){
									uni.reLaunch({
										url: "/pages/temperature/index"
									});
								}else{
									uni.navigateBack();
								}
							}
						});
					}, () => {
						this.disableButton = false;
					});
				}
			},
			resetData(){
				this.data.temperature = "";
				this.data.remark = "";
				for(let index = 0;index <this.symptoms.length; index++ ){
					this.$set(this.symptoms[index], "checked", false);
				}
				// console.log(this.symptoms)
			},
			checkTemperature(){
				const temperature = this.data.temperature;
				if(temperature.length == 0 || temperature > 41 || temperature < 35){
					return false;
				}
				return true;
			}
		}
	}
</script>

<style>
	.banner {
		width: 100%;
		height: 250rpx;
	}
	.uni-common-mt {
		margin: 0rpx 30rpx 10rpx 30rpx;
	}
	.uni-input {
		background-color: #FFFFFF;
		width: 100rpx;
	}
	.temperature-unit {
		font-size: 40rpx;
		/* padding-bottom: 10rpx; */
	}

	.uni-form-item {
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 30rpx;
		margin-bottom: 10rpx;
	}
	.uni-list {
		background-color: #FFFFFF;
		padding: 10rpx 20rpx;
	}
	.checkbox-item {
		margin-bottom: 10rpx;
	}
	.checkbox-title {
		font-size: 30rpx;
	}
	.remark {
		background-color: #FFFFFF;
		/* width: 100%; */
		height: 200rpx;
	}
	checkbox {
		width: 18px;
		height: 18px;
	}
	.submit-button {
		margin-top: 30rpx;
	}
</style>
