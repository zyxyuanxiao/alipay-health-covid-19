import {
	Errcode,
	App,
	Server,
	StorageKey
} from "./config.js";

import {
	isLock,
	closeLock
} from "./httpLock.js";

function proccessReponse(response, successCallback, failedCallback) {
	// console.log(response);
	response = response.data;
	if (response.errcode == Errcode.success) {
		let data = response.data;
		if (data) {
			successCallback(data);
		} else {
			if (successCallback) {
				successCallback();
			}
		}
	} else {
		if (response.isSilence == 0) {
			uni.showToast({
				title: response.errmsg,
				duration: 2000,
				complete() {
					if (failedCallback) {
						failedCallback();
					}
				}
			});
		} else {
			if (failedCallback) {
				failedCallback();
			}
		}
	}
}

function uploadLocation() {
	uni.getLocation({
		type: 'wgs84',
		success: function(res) {
			console.log('当前位置的经度：' + res.longitude);
			console.log('当前位置的纬度：' + res.latitude);
			postWithToken("/health/user/location/upload",
				`lng=${res.longitude}&lat=${res.latitude}`);
		}
	});
}

function login(callback) {
	uni.login({
		success(authResponse) {
			console.log(authResponse);
			const code = authResponse.code ? authResponse.code : authResponse.authCode;
			postWithoutToken("/health/user/login",
				`code=${code}&appId=${App.appId}`, (response) => {
					uni.setStorageSync(StorageKey.token, response.token);
					uni.setStorageSync(StorageKey.userId, response.userId);
					uploadLocation();
					callback();
				})
		}
	});
}

function getWithToken(url, successCallback, failedCallback) {
	if (isLock(url)) {
		return;
	}
	uni.request({
		url: Server.host + url,
		method: "GET",
		header: {
			"Access-Token": uni.getStorageSync("token")
		},
		success(response) {
			proccessReponse(response, successCallback, failedCallback);
		},
		complete() {
			closeLock(url);
		}
	});
}

function getWithoutToken(url, successCallback, failedCallback) {
	if (isLock(url)) {
		return;
	}
	uni.request({
		url: Server.host + url,
		method: "GET",
		success: (response) => {
			proccessReponse(response, successCallback, failedCallback);
		},
		complete() {
			closeLock(url);
		}
	});
}

function postWithToken(url, data, successCallback, failedCallback) {
	if (isLock(url)) {
		return;
	}
	uni.request({
		url: Server.host + url,
		method: "POST",
		data,
		header: {
			"Access-Token": uni.getStorageSync("token"),
			"Content-Type": "application/x-www-form-urlencoded"
		},
		success(response) {
			proccessReponse(response, successCallback, failedCallback);
		},
		complete() {
			closeLock(url);
		}
	});
}

function postWithoutToken(url, data, successCallback, failedCallback) {
	if (isLock(url)) {
		return;
	}
	uni.request({
		url: Server.host + url,
		method: "POST",
		data,
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		success(response) {
			proccessReponse(response, successCallback, failedCallback);
		},
		complete() {
			closeLock(url);
		}
	});
}

export {
	login,
	getWithToken,
	getWithoutToken,
	postWithToken,
	postWithoutToken
};
