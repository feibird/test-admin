angular.module('index_area').factory('MarketResource', MarketResource);
MarketResource.$inject = ['$http','device','version'];
function MarketResource($http,device,version) {
    return {
		  list:list,
      add:add
    };

      function list(seid,skip,limit){
          return $http.get("/api-admin/promotion/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
        return data
      })
      }

      function add(seid,obj){
           return $http({
            url:"/api-admin/promotion/add",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "name":obj.name,
                "description":obj.description,
                "startTime":obj.startTime,
                "endTime":obj.endTime,
                "storeType":obj.storeType,
                "storeIds":obj.storeIds,
                "userType":obj.userType,
                "productType":obj.productType,
                "productIds":obj.productIds,
                "timesLimitType":obj.timesLimitType,
                "timesLimit":obj.timesLimit,
                "amountLimit":obj.amountLimit,
                "extensibleCriteria":"",
                "enabled":obj.enabled,
                "exclusive":obj.exclusive,
                "priority":obj.priority,
                "type":obj.type,
                "formulaParameter":obj.formulaParameter
              }
        })
        .then(function (data) {
            return data
        })
      }
    
}