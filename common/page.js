const pageSize = 10;

function isScanOrShareEnterPage(option){
	if(!option){
		return false;
	}
	if(option.action && option.action == "share"){
		return true;
	}
	if(option.action && option.action == "scan"){
		return true;
	}
	return false;
}

export {
	pageSize,
	isScanOrShareEnterPage
};
