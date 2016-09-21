//规格API
angular.module('index_area').factory('FormatResource', FormatResource);
FormatResource.$inject = ['$http', 'device', 'version'];
function FormatResource($http, device, version) {
    return {
		add: add,
		list: list,
		remove: remove,
		get: get,
		update: update
    };


	function add(seid, id, obj) {
		return $http({
			url: "/api-admin/base/product/spec/add",
			method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"name": obj.name,
				"costPrice": obj.costPrice,
				"advicePrice": obj.advicePrice,
				"tradePrice": obj.tradePrice,
				"spec": obj.spec,
				"specUnit": obj.specUnit,
				"baseProductId": id
			}
		})
			.then(function (data) {
				return data
			})
	}

	function update(seid, id, obj) {
		return $http({
            url: "/api-admin/base/product/spec/" + obj.id + "/update",
            method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"name": obj.name,
				"costPrice": obj.costPrice,
				"advicePrice": obj.advicePrice,
				"tradePrice": obj.tradePrice,
				"spec": obj.spec,
				"specUnit": obj.specUnit,
				"baseProductId": id
			}
        })
			.then(function (data) {
				return data
			})
	}

	function list(seid, id) {
		return $http.get("/api-admin/base/product/spec/list", {
			params: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"baseProductId": id
			}
		}).then(function (data) {
			return data
		})
	}

	function remove(seid, id) {
		return $http({
            url: "/api-admin/base/product/spec/" + id + "/remove",
            method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"id": id
			}
        })
			.then(function (data) {
				return data
			})
	}
	function get(seid, id) {
		return $http.get("/api-admin/base/product/spec/" + id + "/get", {
			params: {
				"device": device,
				"version": version,
				"sessionId": seid,
				"id": id
			}
		}).then(function (data) {
			return data
		})
	}
}