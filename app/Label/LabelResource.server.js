/**
 * 标签管理功能API封装
 */
angular.module('index_area').factory('LabelResource', LabelResource);
LabelResource.$inject = ['$http', 'device', 'version'];
function LabelResource($http, device, version) {
    return {
        list: list,
        get: get,
        update: update,
        remove: remove,
        add: add
    };

    /**
	 * list
	 * 获取列表
	 */
    function list(seid, skip, limit, brandId) {
        return $http.get("/api-admin/label/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit, "brandId": brandId } }).then(function (data) {
            return data
        })
    }

    function get(seid, id) {
        return $http.get("/api-admin/label/" + id + "/get", { params: { "device": device, "version": version, "sessionId": seid } }).then(function (data) {
            return data
        })
    }

    function update(seid, info) {
        return $http({
            url: "/api-admin/label/" + info.id + "/update",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "device": device, "version": version, "sessionId": seid, "name": info.name, brandId: info.brand.id }
        })
            .then(function (data) {
                return data
            })
    }

    function remove(seid, id) {
        return $http({
            url: "/api-admin/label/" + id + "/remove",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "device": device, "version": version, "sessionId": seid }
        })
            .then(function (data) {
                return data
            })
    }

    function add(seid, info) {
        console.log(info)
        return $http({
            url: "/api-admin/label/add",
            method: 'post',
            params: { "device": device, "version": version, "sessionId": seid, "name": info.name, "brandId": info.brand.id }
        })
            .then(function (data) {
                return data
            })
    }
}