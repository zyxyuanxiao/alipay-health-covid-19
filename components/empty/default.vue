<template>
	<view v-show="show" class="text-area">
		{{text}}
	</view>
</template>

<script>
	export default {
		name: "emptyDefault",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			text: String
		}
	}
</script>

<style>
	.text-area{
		padding-top: 100rpx;
		text-align: center;
		font-size: 32rpx;
		color: #656565;
	}
</style>
