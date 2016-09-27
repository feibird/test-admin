angular.module('index_area').factory('CouponResource', CouponResource);
CouponResource.$inject = ['$http', 'device', 'version'];
function CouponResource($http, device, version) {
    return {
        list: list,
        add: add,
        get: get,
        update: update,
        remove: remove,
        resource: resource
    };

    function list(seid, skip, limit) {
        return $http.get("/api-admin/couponTemplate/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
            return data
        })
    }

    function resource(seid, skip, limit) {
        return $http.get("/api-admin/costSource/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
            return data
        })
    }

    function get(seid, id) {
        return $http.get("/api-admin/couponTemplate/get", { params: { "device": device, "version": version, "sessionId": seid, 'id': id } }).then(function (data) {
            return data
        })
    }

    function update(seid, obj) {
        return $http({
            url: "/api-admin/couponTemplate/update",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "id": obj.id,                                    //id
                "name": obj.name,                               //名称
                "description": obj.description,                  //描述
                "startTime": obj.StratTime,                     //开始时间
                "endTime": obj.EndTime,                         //结束时间
                "storeType": obj.storeType,                     //门店类型
                "userType": obj.userType,                       //用户类型
                "specType": obj.specType,                       //商品规格类型
                "specIds": obj.goodIds,                         //商品规格列表
                "storeIds": obj.storeIds,                       //商品规格列表
                "specCountLimit": obj.specCountLimit,           //
                "exclusiveType": "EXCLUSIVE",                   //排他性
                "whiteListIds": "",                             //白名单中的优惠券模板id
                "amountLimit": obj.amountLimit,                 //优惠券金额限制
                "cutAmount": obj.cutAmount,                     //优惠券优化金额
                "isEnabled": obj.isEnabled,                     //是否启用
                "priority": obj.priority,                       //优先级
                "type": obj.type,                               //类型
                "costSources": JSON.stringify(obj.Sources)                   //承担方
            }
        })
            .then(function (data) {
                return data
            })
    }

    function add(seid, obj) {
        return $http({
            url: "/api-admin/couponTemplate/add",
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                "device": device,
                "version": version,
                "sessionId": seid,
                "name": obj.name,                               //名称
                "description": obj.description,                  //描述
                "startTime": obj.StratTime,                     //开始时间
                "endTime": obj.EndTime,                         //结束时间
                "storeType": obj.storeType,                      //门店类型
                "storeIds": obj.storeIds,
                "userType": obj.userType,                        //用户类型
                "specType": obj.specType,                        //商品规格类型
                "specIds": typeof (obj.goodIds) == 'undefined' ? '' : obj.goodIds,                          //商品规格列表
                "specCountLimit": obj.specCountLimit,            //
                "exclusiveType": "EXCLUSIVE",              //排他性
                "whiteListIds": obj.whiteListIds,                //白名单中的优惠券模板id
                "amountLimit": typeof (obj.amountLimit) == 'undefined' ? '' : obj.amountLimit,                  //优惠券金额限制
                "cutAmount": obj.cutAmount,                      //优惠券优化金额
                "isEnabled": obj.isEnabled,                      //是否启用
                "priority": obj.priority,                        //优先级
                "type": obj.type,                                //类型
                "costSources": JSON.stringify(obj.Sources)                       //承担方
            }
        })
            .then(function (data) {
                return data
            })
    }


    function remove(seid, id) {
        return $http({
            url: "/api-admin/couponTemplate/remove",
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

}