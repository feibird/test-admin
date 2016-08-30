/**
 * 提供功能API封装
 */
angular.module('index_area').factory('RecordedResource', RecordedResource);
RecordedResource.$inject = ['$http', 'device', 'version'];

function RecordedResource($http, device, version) {
  return {
    list: list,
    get: get,
    total:total
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
        "storeId":obj.storeId,
        "sources":obj.sources,
        "maxTotalAmount":obj.maxTotalAmount,
        "minTotalAmount":obj.minTotalAmount
      }
    }).then(function (data) {
      return data
    })
  }

  function total(seid){
      return $http.get('/api-admin/journal/count',{
        params:{
          "device": device,
        "version": version,
        "sessionId": seid
        }
      }).then(function(data){
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