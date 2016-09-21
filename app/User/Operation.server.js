angular.module('index_area').factory('OperationResource', OperationResource);
OperationResource.$inject = ['$http', 'device', 'version'];
function OperationResource($http, device, version) {
    return {
        list: list,
        get: get,
        add: add,
        del: del
    };

    //获取操作列表
    function list(seid, skip, limit) {
        return $http.get("/api-admin/authority/operation/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
            return data
        })
    }

    //获取角色下的操作
    function get(seid, id) {
        return $http.get("/api-admin/authority/role/operation/list", { params: { "device": device, "version": version, "sessionId": seid, 'roleId': id } }).then(function (data) {
            return data
        })
    }

    function add(seid, obj) {
        return $http({
            url: "/api-admin/authority/role/operation/add",
            method: 'post',
            params: { "device": device, "version": version, "sessionId": seid, "roleId": obj.id, "operationCode": obj.code }
        })
            .then(function (data) {
                return data
            })
    }

    function del(seid, obj) {
        return $http({
            url: "/api-admin/authority/role/operation/remove",
            method: 'post',
            params: { "device": device, "version": version, "sessionId": seid, "roleId": obj.id, "operationCode": obj.code }
        })
            .then(function (data) {
                return data
            })
    }
}