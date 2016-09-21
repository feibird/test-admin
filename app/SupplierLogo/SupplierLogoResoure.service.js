angular.module('index_area').factory('SupplierLogoResource', SupplierLogoResource);
SupplierLogoResource.$inject = ['$http', 'device', 'version'];
function SupplierLogoResource($http, device, version) {
    return {
		list: list,
		get: get,
		add: add,
		update: update,
		remove: remove
    };


	/**
	 * 基础商品列表	 
	 */
	function list(seid, skip, limit) {
		return $http.get("/api-admin/provider/brand/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
			return data
		})
	}

	/**
	 * [get 获取单个数据]
	 * @param  {[type]} seid [sessionID]
	 * @param  {[type]} id   [数据ID]
	 * @return {[type]}      [description]
	 */
	function get(seid, id) {
		return $.ajax({
			type: "get",
			url: "/api-admin/provider/brand/" + id + "/get",
			async: false,
			data: { "device": device, "version": version, "sessionId": seid, "id": id },
			dataType: "json",
			success: function (response) {
				return response.data;
			}
		});
	}

	/**
	 * 添加基础商品
	 */
	function add(seid, obj) {
		return $http({
            url: "/api-admin/provider/brand/add",
            method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"name": obj.name,
				"logo": obj.logo,
				"sort": obj.sort,
				"serialPrefix": obj.serialPrefix
			}
        })
			.then(function (data) {
				return data
			})
	}

	/**
	 * 修改商品
	 */
	function update(seid, obj) {
		console.log(obj)
		return $http({
            url: "/api-admin/provider/brand/" + obj.id + "/update",
            method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"name": obj.name,
				"logo": obj.logo,
				"sort": obj.sort,
				"serialPrefix": obj.serialPrefix
			}
        })
			.then(function (data) {
				return data
			})
	}

	/**
	 * 删除商品
	 */
	function remove(seid, id) {
		return $.ajax({
			type: "post",
			url: "/api-admin/provider/brand/" + id + "/remove",
			async: false,
			data: { "device": device, "version": version, "sessionId": seid },
			dataType: "json",
			success: function (response) {
				return response.data;
			}
		});
	}
}