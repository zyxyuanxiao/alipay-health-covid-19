<template>
	<view class="one-record">
		<text class="time">{{temperature.time.substring(0,16)}}</text>
		<view v-show="showUser" class="record-item" v-if="showUser">
			<text class="title">姓名: </text>
			<text class="desc">{{temperature.name}}</text>
		</view>
		<view v-show="showUser" class="record-item" v-if="showUser">
			<text class="title">手机号: </text>
			<text class="desc">{{temperature.phone}}</text>
		</view>				
		<view class="record-item">
			<text class="title">体温: </text>
			<text class="desc" :class="{warn: isHigh}">{{temperature.temperature + '℃' + (isHigh ? '（有发热症状）' : '')}}</text>
		</view>
		<view class="record-item">
			<text class="title">症状: </text>
			<text class="desc">{{temperature.symptoms ? temperature.symptoms: "无"}}</text>
		</view>
		<view class="record-item">
			<text class="title">备注: </text>
			<text class="desc">{{temperature.remark ? temperature.remark : "无"}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "cell",
		props:{
			temperature: Object,
			showUser: false
		},
		data(){
			return {
				isHigh: this.temperature.temperature > 37.2
			}
		},
		components: {}
	}
</script>

<style>
	.title {
		font-size: 30rpx;
		color: #999999;
	}

	.desc {
		font-size: 30rpx;
		color: #333333;
	}

	.one-record {
		padding: 15rpx 35rpx;
		border-bottom: #e0e0dd;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		background-color: white;
	}

	.time {
		float: right;
		color: #999999;
		font-size: 25rpx;
	}

	.record-item {
		padding-bottom: 10rpx;
	}
	
	.warn {
		color: red;
		font-weight: bold;
	}
</style>
