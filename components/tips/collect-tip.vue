<template>
	<view :animation="animationData" class="tip">
		<!-- #ifdef MP-ALIPAY -->
		<view class="arrow"></view>
		<view class="text">
			<!-- <icon type="info" size="18"/> -->
			<text>收藏小程序，做好健康管理</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: "collect-tip",
		data(){
			return {
				animationData: {}
			}
		},
		mounted(){
			var animation = uni.createAnimation({
				duration: 5000,
				timingFunction: 'ease-in-out',
			})
			this.animation = animation
			animation.opacity(0).scale(1.2,1.2).step()
			this.animationData = animation.export()			
		}
	}
</script>

<style>
	.tip {
		position: fixed;
		top: -10rpx;
		right: 45rpx;
		/* opacity:0.8; */
	}
	.arrow {
		border: 6px solid transparent;
		border-bottom-color: #000;
		width: 0;
		height: 0;
		margin-left: 175rpx;
	}
	.text {
		background: black;
		padding: 15rpx;
		font-size: 30rpx;
		border-radius:10rpx;
		color: white;		
	}
</style>
