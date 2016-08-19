angular.module('index_area').factory('MarketResource', MarketResource);
MarketResource.$inject = ['$http','device','version'];
function MarketResource($http,device,version) {
    return {
		list:list
    };

    function list(seid,skip,limit){
        return $http.get("/api-admin/promotion/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
			return data
		})
    }
}