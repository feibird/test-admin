/**
 * 分类功能API封装
 */
angular.module('index_area').factory('SortResource', SortResource);
SortResource.$inject = ['$http', 'device', 'version'];
function SortResource($http, device, version) {
    return {
        list: list,
        add: add,
        remove: remove,
        get: get,
        update: update
    };

	/**
	 * list
	 * 获取分类列表
	 */
    function list(seid) {
        return $http.get("/api-admin/category/list-all", { params: { device: device, version: version, sessionId: seid } }).then(function (data) {
            return data
        })
    }

    /**
     * 添加分类
     */
    function add(seid, obj) {
        return $http({
            url: "/api-admin/category/add",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "name": obj.name, "targetId": obj.id, "device": device, "version": version, "sessionId": seid, "position": "IN" }
        })
            .then(function (data) {
                return data
            })
    }

    /**
     * 修改分类
     * @param {Object} id
     * @param {Object} seid
     * @param {Object} name
     */
    function update(seid, id, name) {
        return $http({
            url: "/api-admin/category/" + id + "/update",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "device": device, "version": version, "sessionId": seid, "id": id, "name": name }
        })
            .then(function (data) {
                return data
            })
    }

    /**
     * 删除分类
     */
    function remove(seid, id) {
        return $http({
            url: "/api-admin/category/" + id + "/remove",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'post',
            data: { "device": device, "version": version, "sessionId": seid, "id": id, "name": name }
        })
            .then(function (data) {
                return data
            })
    }

    /**
     * 获取某个分类
     */
    function get(seid, id) {
        return $http({
            url: "/api-admin/category/" + id + "/get",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "device": device, "version": version, "sessionId": seid, "id": id }
        })
            .then(function (data) {
                return data
            })
    }
}