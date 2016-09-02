angular.module('index_area').factory('MarketResource', MarketResource);
MarketResource.$inject = ['$http', 'device', 'version'];
function MarketResource($http, device, version) {
  return {
		  list: list,
    add: add,
    get: get,
    update: update,
    remove: remove
  };

  function list(seid, skip, limit) {
    return $http.get("/api-admin/promotion/list", { params: { "device": device, "version": version, "sessionId": seid, "skip": skip, "limit": limit } }).then(function (data) {
      return data
    })
  }

  function get(seid, id) {
    return $http.get("/api-admin/promotion/get", { params: { "device": device, "version": version, "sessionId": seid, 'id': id } }).then(function (data) {
      return data
    })
  }

  function update(seid, obj) {
    return $http({
      url: "/api-admin/promotion/update",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "id":obj.id,
        "name": obj.name,                               //活动名称
        "description": obj.description,                 //活动描述
        "startTime": obj.startTime,                     //开始时间
        "endTime": obj.endTime,                         //结束时间
        "storeType": obj.storeType,                     //门店类型
        "storeIds": obj.storeIds,                       //门店id
        "userType": obj.userType,                       //用户类型
        "timesLimitCycle": obj.timesLimitCycle,          //周期天数
        "productType": obj.productType,
        "productIds": obj.productIds,
        "timesLimitType": obj.timesLimitType,
        "timesLimit": obj.timesLimit,
        "amountLimit": obj.amountLimit,
        "extensibleCriteria": "",
        "enabled": obj.enabled,
        "exclusive": obj.exclusive,
        "priority": obj.priority,
        "type": obj.type,
        "formulaParameter": JSON.stringify(obj.formulaParameterMap)
      }
    })
      .then(function (data) {
        return data
      })
  }

  function add(seid, obj) {
    return $http({
      url: "/api-admin/promotion/add",
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "name": obj.name,
        "description": obj.description,
        "startTime": obj.startTime,
        "endTime": obj.endTime,
        "storeType": obj.storeType,
        "storeIds": obj.storesIds,
        "userType": obj.userType,
        "timesLimitCycle": obj.timesLimitCycle,
        "productType": obj.productType,
        "productIds": obj.goodsIds,
        "timesLimitType": obj.timesLimitType,
        "timesLimit": obj.timesLimit,
        "amountLimit": obj.amountLimit,
        "extensibleCriteria": "",
        "enabled": obj.enabled,
        "exclusive": obj.exclusive,
        "priority": obj.priority,
        "type": obj.type,
        "formulaParameter": JSON.stringify(obj.formulaParameter)
      }
    })
      .then(function (data) {
        return data
      })
  }


  function remove(seid, id) {
    return $http({
      url: "/api-admin/promotion/remove",
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