/**
 * 提供功能API封装
 */
angular.module('index_area').factory('DrawResource1', DrawResource1);
DrawResource1.$inject = ['$http','device','version'];
function DrawResource1($http,device,version) {
    return {
        list:list,
        get:get,
        update:update,
        complete:complete
    };
    
    
	/**
	 * list
	 * 获取门店列表
	 */
    function list(seid,obj,skip,limit){
        console.log(obj)
        return $http.get("/api-admin/draw/list",
                {params:{"device":device,
                        "version":version,
                        "sessionId":seid,
                        "skip":skip,
                        "limit":limit,
                        'storeId':obj.id,
                        'status':obj.status
                    }}).then(function(data){
            return data
        })
    }
    
    /**
     * 修改信息
     * @param {Object} id
     * @param {Object} seid
     * @param {Object} name
     */
    function update(seid,status,id){
        return $http({
            url:"/api-admin/draw/"+id+"/update",
            method: 'post',
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                  "status":status,
                  "device":device,
                  "version":version,
                  "sessionId":seid
              }
        })
        .then(function (data) {
             return data;
        })
    }
    
    /**
     * 获取某个分类
     */
    function get(seid,id){
    	return $.ajax({
    		type:"get",
    		url:"/api-admin/draw/"+id+"/get",
    		dataType:"json",
    		data:{"device":device,"version":version,"sessionId":seid},
    		async:false,    		
    		success:function(response){
    			return response.data;
    		}
    	});
    }

    function complete(seid,id,status){
        return $.ajax({
    		type:"post",
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    		url:"/api-admin/draw/"+id+"/complete",
    		dataType:"json",
    		data:{"device":device,"version":version,"sessionId":seid,status:status},
    		async:false,    		
    		success:function(response){
                console.log(response)
    			return response.data;
                
    		}
    	});
    }
}