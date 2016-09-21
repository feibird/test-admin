/**
 * 虚拟分类API
 */
angular.module('index_area').factory('VirtualResource', VirtualResource);
VirtualResource.$inject = ['$http', 'device', 'version'];
function VirtualResource($http, device, version) {
    return {
		list: list,
		add: add,
		update: update,
		remove: remove,
		get: get
    };


	/**
	 * 虚拟分类列表
	 */
	function get(seid, storeId, id) {
		return $http.get("/api-admin/virtual/category/" + id + "/get", { params: { "device": device, "version": version, "sessionId": seid, "storeId": storeId } }).then(function (data) {
            return data
        })
	}

	/**
	 * 添加基础商品
	 */
	function add(seid, obj) {
		console.log(obj)
		var categoryId = new Object();
		categoryId.data = new Object();
		categoryId.data.id === null;
		console.log(categoryId.data.id)
		if (typeof (obj.sortId) == 'undefined' || obj.sortId == "") {
			categoryId = obj.sorts;
		} else {
			categoryId = obj.sortId;
		}
		if (categoryId == null) {
			categoryId = new Object();
			categoryId.data = new Object();
		}
		var lables = "";
		for (var i in obj.lables) {
			lables += obj.lables[i].id + ",";
		}
		lables = lables.substring(0, lables.length - 1);
		return $http({
            url: "/api-admin/virtual/category/add",
            method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"name": obj.name,
				"backgroundColor": obj.backgroundColor,
				"storeId": obj.storeid,
				"providerBrandIds": obj.providerBrandIds[0].id,
				"productCategoryIds": categoryId.data.id,
				"labelIds": lables,
				"sort": obj.sort,
				"parentId": obj.parentId,
				"showInPad": obj.showInPad
			}
        })
			.then(function (data) {
				return data
			})
	}


	function list(seid, storeid) {
		return $http.get("/api-admin/virtual/category/get", { params: { "device": device, "version": version, "sessionId": seid, "storeId": storeid } }).then(function (data) {
            return data
        })
	}

	/**
	 * 修改商品
	 */
	function update(seid, obj) {
		var labels = "";
		for (var i in obj.labels) {
			labels += obj.labels[i].id + ",";
		}
		labels = labels.substring(0, labels.length - 1);
		return $http({
            url: "/api-admin/virtual/category/" + obj.id + "/update",
            method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"name": obj.name,
				"backgroundColor": obj.backgroundColor,
				"storeId": obj.storeId,
				"providerBrandIds": obj.providerBrands[0].id,
				"productCategoryIds": obj.Categorys,
				"labelIds": labels,
				"sort": obj.sort,
				"parentId": obj.parentId,
				"showInPad": obj.showInPad
			},
        })
			.then(function (data) {
				return data
			})
	}

	/**
	 * 删除商品
	 */
	function remove(seid, id, storeid) {
		return $http({
            url: "/api-admin/virtual/category/" + id + "/remove",
            method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "device": device, "version": version, "sessionId": seid, "storeId": storeid }
        })
			.then(function (data) {
				return data
			})
	}
}
