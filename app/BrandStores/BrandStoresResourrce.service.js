/**
 * 连锁品牌管理功能API封装
 */
angular.module('index_area').factory('BrandStoresResourrce', BrandStoresResourrce);
BrandStoresResourrce.$inject = ['$http','device','version'];
function BrandStoresResourrce($http,device,version) {
    return {
        list:list,
        addlist:addlist,
        removelist:removelist,
        getlist:getlist,
        updateinfo:updateinfo
    };
    
	/**
	 * list
	 * 获取列表
	 */
    function list(seid,skip,limit){    	

        /*return $.ajax({
        	type:"get",
        	url:"/api-admin/brand/list",
        	async:false,
        	dataType:"json",
        	data:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit},
        	success:function(response){
        		return response.data;
        	}
        });*/
        return $http.get("/api-admin/brand/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
            return data
        })
    }    
    
    /**
     * 添加分类
     */
    function addlist(obj,seid){  
    /*console.log(obj)  	
    	return $.ajax({            
    		type:"post",
    		url:"/api-admin/brand/add",
    		async:false,
    		dataType:"json",
    		data:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "name":obj.name,
                "category.id":obj.category.data.id,
                "logo":obj.imgUrl,
                "sort":obj.sort,
                "serialPrefix":obj.serialPrefix},
    		success:function(response){
    			return response.data;
    		}
    	});*/
        return $http({
            url:"/api-admin/brand/add",
            method: 'post',
            params:{
                "device":device,
                "version":version,
                "sessionId":seid,
                "name":obj.name,
                "category.id":obj.category.data.id,
                "logo":obj.imgUrl,
                "sort":obj.sort,
                "serialPrefix":obj.serialPrefix}
        })
        .then(function (data) {
             return data
        })
    }
    
    /**
     * 删除分类
     */
    function removelist(id,seid){
    	/*return $.ajax({
    		type:"post",
    		url:"/api-admin/brand/"+id+"/remove",
    		dataType:"json",
    		data:{"device":device,"version":version,"sessionId":seid,"id":id},
    		async:false,    		
    		success:function(response){
    			return response.data;
    		}
    	});*/
        return $http({
            url:"/api-admin/brand/"+id+"/remove",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"id":id}
        })
        .then(function (data) {
             return data
        })
    }
    
    
    
    /**
     * 获取某个分类
     */
    function getlist(id,seid){    	     	
    	/*return $.ajax({
            type:"get",
            url:"/api-admin/brand/"+id+"/get",
            dataType:"json",
            data:{"device":device,"version":version,"sessionId":seid,"id":id},
            async:false,            
            success:function(response){
                return response.data;
            }
        });*/
         return $http.get("/api-admin/brand/"+id+"/get",{params:{"device":device,"version":version,"sessionId":seid,"id":id}}).then(function(data){
            return data
        })
        
    }
   

     /**
     * 修改分类
     */
    function updateinfo(obj,seid){        
       /* return $.ajax({
            type:"post",
            url:"/api-admin/brand/"+obj.id+"/update",
            dataType:"json",
            data:{"device":device,"version":version,"sessionId":seid,"name":obj.name,"category.id":obj.category.data.id,"logo":obj.imgUrl,"sort":obj.sort},
            async:false,            
            success:function(response){
                return response.data;
            }
        });*/
         return $http({
            url:"/api-admin/brand/"+obj.id+"/update",
            method: 'post',
            params:{"device":device,"version":version,"sessionId":seid,"name":obj.name,"category.id":obj.category.data.id,"logo":obj.imgUrl,"sort":obj.sort}
        })
        .then(function (data) {
             return data
        })
    }

}