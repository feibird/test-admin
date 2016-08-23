angular.module('index_area').factory('RoleResource', RoleResource);
RoleResource.$inject = ['$http','device','version'];
function RoleResource($http,device,version) {
    return {
		list:list,
        get:get,
        add:add,
        update:update
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

    function add(seid,obj){
        return $http({
            url:"/api-admin/authority/role/add",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,'name':obj.name}
        })
        .then(function (data) {
             return data
        })
    }

    function update(seid,obj){
        return $http({
            url:"/api-admin/authority/role/update",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,'name':obj.name,'roleId':obj.id}
        })
        .then(function (data) {
             return data
        })
    }
}