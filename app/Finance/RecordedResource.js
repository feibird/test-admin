/**
 * 提供功能API封装
 */
angular.module('index_area').factory('RecordedResource', RecordedResource);
RecordedResource.$inject = ['$http', 'device', 'version'];

function RecordedResource($http, device, version) {
  return {
    list: list,
    get: get,
    total: total,
    exel: exel,
    exels: exels,
    task: task
  };


  /**
   * list
   * 获取入账列表
   */
  function list(seid, obj, skip, limit) {
    return $http.get("/api-admin/journal/list", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        "storeId": obj.storeId,
        "sources": obj.sources,
        "maxTotalAmount": obj.maxTotalAmount,
        "minTotalAmount": obj.minTotalAmount,
        "takeNo": obj.takeNo,
        "tradeId": obj.tradeId,
        "createStartDate": obj.createStartDate,
        "createEndDate": obj.createEndDate
      }
    }).then(function (data) {
      return data
    })
  }

  function total(seid) {
    return $http.get('/api-admin/journal/count', {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid
      }
    }).then(function (data) {
      return data
    })
  }


  /**
   * 获取某个订单
   */
  function get(seid, id) {
    return $http.get("/api-admin/draw/" + id + "/get", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid
      }
    }).then(function (data) {
      return data
    })
  }

  function exel(seid, obj) {
    console.log(obj)
    return $http.get("/api-admin/report/trade/product/excel", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "storeId": obj.storeId,
        "endDate": obj.endDate,
        "startDate": obj.startDate
      }
    }).then(function (data) {
      return data
    })
  }

  function exels(seid, obj) {
    console.log(obj)
    return $http.get("/api-admin/report/trade/detail/excel", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "storeId": obj.storeId,
        "endDate": obj.endDate,
        "startDate": obj.startDate,
        "source": obj.sources,
        'detail': obj.detail,
        'completeEndDate': obj.createEndDate,
        "completeStartDate": obj.createStartDate,
      }
    }).then(function (data) {
      return data
    })
  }

  function task(seid, task) {
    return $http.get("/api-admin/report/task/state/", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        'taskId': task
      }
    }).then(function (data) {
      return data
    })
  }



}