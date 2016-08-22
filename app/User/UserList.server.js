angular.module('index_area').factory('UserResource', UserResource);
UserResource.$inject = ['$http','device','version'];
function UserResource($http,device,version) {
    return {
		list:list
    };

    function list(seid,skip,limit){
        return $http.get("/api-admin/user/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
			return data
		})
    
    }
}