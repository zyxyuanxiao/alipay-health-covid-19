<template>
	<view>
		<!-- 		<view class="tab">
			<view class="bar-title" :class="{active : selected == '基本信息'}" @click="selected='基本信息'">基本信息</view>
			<view class="bar-title" :class="{active : selected == '管理员'}" @click="selected='管理员'">管理员</view>
		</view> -->
		<view class="info">
			<info v-if="groupId.length > 0" :groupId="groupId" buttonText="保存" createOrSetting="setting"/>
		</view>
	</view>
</template>

<script>
	import info from "@/components/group/info.vue"

	export default {
		components: {
			info
		},
		data() {
			return {
				selected: "基本信息",
				groupId: ""
			}
		},
		onLoad(option) {
			this.groupId = option.groupId;
		},
		methods: {
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
		width: 50%;
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

	.info {
		padding-top: 10rpx;
	}
</style>
