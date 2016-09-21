/**
 * 分类功能API封装
 */
angular.module('index_area').factory('StoresGoodResource', StoresGoodResource);
StoresGoodResource.$inject = ['$http', 'device', 'version'];
function StoresGoodResource($http, device, version) {
    return {
        update: update,
        list: list
    };


    function list(seid, storeid, skip, limit) {
        return $http.get("/api-admin/store/product/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit, "storeId": storeid } }).then(function (reponse) {
            return reponse
        })
    }

    function update(seid, specs) {
        return $http({
            url: "/api-admin/store/product/spec/update",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'post',
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "specs": JSON.stringify(specs)
            }
        })
            .then(function (data) {
                return data
            })
    }
}