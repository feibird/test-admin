/**
 * 提供功能API封装
 */
angular.module('index_area').factory('RecordedResource', RecordedResource);
RecordedResource.$inject = ['$http', 'device', 'version'];

function RecordedResource($http, device, version) {
  return {
    list: list,
    get: get
  };


  /**
   * list
   * 获取门店列表
   */
  function list(seid, obj, skip, limit) {
    return $http.get("/api-admin/journal/list", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        "storeId":"641286e9-2d5b-40b5-8938-c673ae5f02e5"
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


}