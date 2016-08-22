angular.module('index_area').factory('RoleResource', RoleResourcee);
RoleResourcee.$inject = ['$http','device','version'];
function RoleResourcee($http,device,version) {
    return {
		list:list,
        get:get,
        add:add,
        del:del
    };

    function list(seid,skip,limit){
        return $http.get("/api-admin/authority/role/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
			return data
		})
    }

    function get(seid,id){
        return $http.get("/api-admin/authority/user/roles",{params:{"device":device,"version":version,"sessionId":seid,"userId":id}}).then(function(data){
			return data
		})
    }

    function add(seid,userId,roleId){
        return $http({
            url:"/api-admin/authority/role/user/add",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,'userId':userId,"roleId":roleId}
        })
        .then(function (data) {
             return data
        })
    }

    function del(seid,userId,roleId){
        return $http({
            url:"/api-admin/authority/role/user/remove",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,'userId':userId,"roleId":roleId}
        })
        .then(function (data) {
             return data
        })
    }
}