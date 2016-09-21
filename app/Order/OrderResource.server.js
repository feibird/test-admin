/**
 * 提供功能API封装
 */
angular.module('index_area').factory('OrderResource', OrderResource);
OrderResource.$inject = ['$http', 'device', 'version'];
function OrderResource($http, device, version) {
    return {
        list: list,
        get: get,
        refund: refund,
        Statuslist: Statuslist
    };


    /**
     * list
     * 获取订单列表
     */
    function list(seid, obj, skip, limit) {
        return $http.get("/api-admin/trade/list",
            {
                params: {
                    "device": device,
                    "version": version,
                    "sessionId": seid,
                    "skip": skip,
                    "limit": limit,
                    "takeNo": obj.id,
                    "status": obj.status
                }
            }).then(function (data) {
                return data
            })
    }

    /**
     * 获取某个分类
     */
    function get(seid, id) {
        return $.ajax({
            type: "get",
            url: "/api-admin/trade/" + id + "/get",
            dataType: "json",
            data: { "device": device, "version": version, "sessionId": seid },
            async: false,
            success: function (response) {
                console.log(response)
                return response.data;
            }
        });
    }

    //退款申请

    function refund(seid, id) {
        return $http({
            url: "/api-admin/trade/update-to-refund-completed",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "tradeId": id,
                "device": device,
                "version": version,
                "sessionId": seid
            }
        })
            .then(function (data) {
                return data;
            })
    }

    function Statuslist(seid, status, skip, limit) {
        return $http.get("/api-admin/trade/list",
            {
                params: {
                    "device": device,
                    "version": version,
                    "sessionId": seid,
                    "skip": skip,
                    "limit": limit,
                    "status": status
                }
            }).then(function (data) {
                return data
            })
    }
}