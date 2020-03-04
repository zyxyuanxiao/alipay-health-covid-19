<template>
	<view class="one-record">
		<text class="time">{{enter.time.substring(0,16)}}</text>
		<view class="record-item">
			<text class="title">状态: </text>
			<text class="desc">{{enter.status}}</text>
		</view>		
		<view class="record-item" v-if="showUser">
			<text class="title">姓名: </text>
			<text class="desc">{{enter.name}}</text>
		</view>
		<view class="record-item" v-if="showUser">
			<text class="title">手机号: </text>
			<text class="desc">{{enter.phone}}</text>
		</view>				
		<view class="record-item" v-if="showGroup">
			<text class="title">群组: </text>
			<text class="desc">{{enter.groupName}}</text>
		</view>
		<view class="record-item">
			<text class="title">人数: </text>
			<text class="desc">{{enter.number + '人'}}</text>
		</view>		
		<view class="record-item">
			<text class="title">体温: </text>
			<text class="desc" :class="{warn: isHigh}">{{enter.temperature ? (enter.temperature + '℃') : "无"}}</text>
		</view>		
		<view class="record-item">
			<text class="title">车牌: </text>
			<text class="desc">{{enter.carNo ? enter.carNo : '无'}}</text>
		</view>
		<view class="record-item">
			<text class="title">备注: </text>
			<text class="desc">{{enter.remark ? enter.remark : '无'}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "cell",
		props:{
			enter: Object,
			showUser: Boolean,
			showGroup: Boolean
		},
		data(){
			return {
				isHigh: this.enter.temperature && this.enter.temperature > 37.2
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
