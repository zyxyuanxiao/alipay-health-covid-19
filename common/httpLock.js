let object = {}

function isLock(key) {
	if (object[key]) {
		return true;
	}
	object[key] = true;
	return false;
}

function closeLock(key) {
	object[key] = false;
}

export {
	isLock,
	closeLock
};
