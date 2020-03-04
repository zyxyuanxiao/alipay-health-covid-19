import Vue from 'vue'
import App from './App'
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";

// Vue.component('emptyDefault', emptyDefault);
Vue.component('uniLoadMore', uniLoadMore);

import {
	login,
	getWithToken,
	getWithoutToken,
	postWithToken,
	postWithoutToken
} from './common/request.js'

import {
	pageSize,
	isScanOrShareEnterPage
} from "./common/page.js"

import './common/common.css'

Vue.config.productionTip = false
Vue.prototype.login = login
Vue.prototype.getWithToken = getWithToken
Vue.prototype.getWithoutToken = getWithoutToken
Vue.prototype.postWithToken = postWithToken

Vue.prototype.pageSize = pageSize
Vue.prototype.isScanOrShareEnterPage = isScanOrShareEnterPage

App.mpType = 'app';

const app = new Vue({
	...App
})
app.$mount()
