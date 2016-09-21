angular.module('index_area').factory('GoodResource', GoodResource);
GoodResource.$inject = ['$http', 'device', 'version'];
function GoodResource($http, device, version) {
    return {
		list: list,
		add: add,
		update: update,
		del: del,
		get: get
    };


	/**
	 * [list 查询基础商品列表]
	 * @param  {[string]} seid  [sessionId]
	 * @param  {[number]} skip  [从下标数开始]
	 * @param  {[number]} limit [从下标数结束]
	 * @return {[type]}       [json]
	 */
	function list(seid, brandId, skip, limit) {
		return $http.get("/api-admin/base/product/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
			return data
		})
	}

	/**
	 * [getlist 获取单个商品数据]
	 * @param  {[number]} id   [商品ID]
	 * @param  {[string]} seid [sessionId]
	 * @return {[type]}      [json]
	 */
	function get(seid, id) {
		return $http.get("/api-admin/base/product/" + id + "/get", { params: { "device": device, "version": version, "sessionId": seid } }).then(function (data) {
			return data
		})
	}

	/**
	 * 添加基础商品
	 */
	function add(seid, obj) {
		console.log(obj)
		var bPhotos = "";
		var cPhotos = "";
		var lables = "";
		for (var i in obj.bPhotos) {
			bPhotos += obj.bPhotos[i] + ",";
		}
		for (var i in obj.cPhotos) {
			cPhotos += obj.cPhotos[i] + ",";
		}
		for (var i in obj.lables) {
			lables += obj.lables[i].id + ","
		}
		lables = lables.substring(0, lables.length - 1);
		cPhotos = cPhotos.substring(0, cPhotos.length - 1);
		bPhotos = bPhotos.substring(0, bPhotos.length - 1);
		return $http({
			url: "/api-admin/base/product/add",
			method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"providerBrandId": obj.providerBrandId.id,
				"brandId": obj.brandId.id,
				"name": obj.name,
				"shortName": obj.shortName,
				"onSell": obj.onSell,
				"canSell": true,
				"categoryId": obj.sortId.data.id,
				"bLogo": obj.bLogo[0],
				"cLogo": obj.cLogo[0],
				"bPhotos": bPhotos,
				"cPhotos": cPhotos,
				"terse": obj.terse,
				"detail": obj.detail,
				"labelIds": lables
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
		var bPhotos = "";
		var cPhotos = "";
		var lables = "";
		for (var i in obj.bPhotos) {
			bPhotos += obj.bPhotos[i] + ",";
		}
		for (var i in obj.cPhotos) {
			cPhotos += obj.cPhotos[i] + ",";
		}
		for (var i in obj.labels) {
			lables += obj.labels[i].id + ","
		}
		lables = lables.substring(0, lables.length - 1);
		cPhotos = cPhotos.substring(0, cPhotos.length - 1);
		bPhotos = bPhotos.substring(0, bPhotos.length - 1);
		return $http({
			url: "/api-admin/base/product/" + obj.id + "/update",
			method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"providerBrandId": obj.providerBrand.id,
				"brandId": obj.brand.id,
				"name": obj.name,
				"shortName": obj.shortName,
				"onSell": obj.onSell,
				"canSell": obj.cancell,
				"categoryId": obj.categories.children[0].id,
				"bLogo": obj.bLogo,
				"cLogo": obj.cLogo,
				"bPhotos": bPhotos,
				"cPhotos": cPhotos,
				"terse": obj.terse,
				"detail": obj.detail,
				"labelIds": lables
			}
		})
			.then(function (data) {
				return data
			})
	}

	/**
	 * [dellist 删除商品]
	 * @param  {[type]} id   [商品ID]
	 * @param  {[type]} seid [sessionId]
	 * @return {[type]}      [json]
	 */
	function del(seid, id) {
		return $http({
			url: "/api-admin/base/product/" + id + "/remove",
			method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: { "device": device, "version": version, "sessionId": seid }
		})
			.then(function (data) {
				return data
			})
	}
}