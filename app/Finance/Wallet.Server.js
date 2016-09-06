/**
 * 提供功能API封装
 */
angular.module('index_area').factory('WalletResource', WalletResource);
WalletResource.$inject = ['$http', 'device', 'version'];

function WalletResource($http, device, version) {
  return {
    list: list,
    total:total
  };


  /**
   * list
   * 获取余额列表
   */
  function list(seid,name, skip, limit) {
    return $http.get("/api-admin/store/wallet/list", {
      params: {
        "device": device,
        "version": version,
        "sessionId": seid,
        "skip": skip,
        "limit": limit,
        "name":name
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

}