/**
 * 连锁品牌管理功能API封装
 */
angular.module('index_area').factory('BrandStoresResource', BrandStoresResource);
BrandStoresResource.$inject = ['$http', 'device', 'version'];
function BrandStoresResource($http, device, version) {
    return {
        list: list,
        add: add,
        remove: remove,
        get: get,
        update: update
    };

	/**
	 * list
	 * 获取列表
	 */
    function list(seid, skip, limit) {
        return $http.get("/api-admin/brand/list", {
            params: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "skip": skip,
                "limit": limit
            }
        }).then(function (data) {
            return data
        })
    }

    /**
     * 添加
     */
    function add(obj, seid) {
        return $http({
            url: "/api-admin/brand/add",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "name": obj.name,
                "category.id": obj.category.data.id,
                "logo": obj.imgUrl,
                "sort": obj.sort,
                "serialPrefix": obj.serialPrefix
            }
        })
            .then(function (data) {
                return data
            })
    }

    /**
     * 删除
     */
    function remove(id, seid) {
        return $http({
            url: "/api-admin/brand/" + id + "/remove",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "device": device, "version": version, "sessionId": seid, "id": id }
        })
            .then(function (data) {
                return data
            })
    }



    /**
     * 获取
     */
    function get(seid, id) {
        return $http.get("/api-admin/brand/" + id + "/get", { params: { "device": device, "version": version, "sessionId": seid, "id": id } }).then(function (data) {
            return data
        })

    }


    /**
    * 修改
    */
    function update(obj, seid) {
        return $http({
            url: "/api-admin/brand/" + obj.id + "/update",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: { "device": device, "version": version, "sessionId": seid, "name": obj.name, "logo": obj.logo, "sort": obj.sort }
        })
            .then(function (data) {
                return data
            })
    }

}