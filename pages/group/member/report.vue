<template>
	<view>
		<view class="user-info">
			<text>{{`姓名:${name} 手机号:${phone}`}}</text>
		</view>
		<view class="measure">
			<measure :groupId="groupId" :userId="userId" :symptoms="symptoms"/>
		</view>

	</view>

</template>

<script>
	import measure from '@/components/temperature/measure.vue'
	export default {
		components:{
			measure
		},
		data() {
			return {
				"name" : "",
				"phone": "",
				"groupId": "",
				"userId": "",
				"symptoms": []
			}
		},
		methods: {
	
		},
		onLoad(option) {
			console.log(option);
			this.name = option.name;
			this.phone = option.phone;
			this.groupId = option.groupId;
			this.userId = option.userId;
			this.getWithoutToken("/health/user/symptoms", (data) => {			
					this.symptoms.push(...data);
			});
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
	.measure {
		padding-top: 70rpx;
	}
</style>
