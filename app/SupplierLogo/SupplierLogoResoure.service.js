angular.module('index_area').factory('SupplierLogoResourrce',SupplierLogoResourrce);
SupplierLogoResourrce.$inject = ['$http','device','version'];
function SupplierLogoResourrce($http,device,version) {
    return {
		list:list,
		infoget:infoget,
		addlist:addlist,
		updateinfo:updateinfo,
		dellist:dellist
    };
    
	
	/**
	 * 基础商品列表	 
	 */
	function list(seid,skip,limit){		
		return $http.get("/api-admin/provider/brand/list",{params:{"device":device,"version":version,"sessionId":seid,"skip":skip,"limit":limit}}).then(function(data){
			return data
		})
	}

	/**
	 * [infoget 获取单个数据]
	 * @param  {[type]} seid [sessionID]
	 * @param  {[type]} id   [数据ID]
	 * @return {[type]}      [description]
	 */
	function infoget(seid,id){		
		return $.ajax({
				type:"get",
				url:"/api-admin/provider/brand/"+id+"/get",
				async:false,
				data:{"device":device,"version":version,"sessionId":seid,"id":id},
				dataType:"json",
				success:function(response){
					return response.data;
				}
		});
	}
	
	/**
	 * 添加基础商品
	 */
	function addlist(seid,obj){
		return $.ajax({
				type:"get",
				url:"/api-admin/provider/brand/add",
				async:false,
				data:{
					"device":device,
					"version":version,
					"sessionId":seid,
					"name":obj.name,
					"category.id":obj.category.data.id,
					"logo":obj.logo,
					"sort":obj.sort,
					"serialPrefix":obj.serialPrefix
				},
				dataType:"json",
				success:function(response){
					return response.data;
				}
		});
	}
	
	/**
	 * 修改商品
	 */
	function updateinfo(seid,obj){
		
		return $.ajax({
				type:"post",
				url:"/api-admin/provider/brand/"+obj.id+"/update",
				async:false,
				data:{
					"device":device,
					"version":version,
					"sessionId":seid,
					"name":obj.name,
					"category.id":obj.category.data.id,
					"logo":obj.logo,
					"sort":obj.sort,
					"serialPrefix":obj.serialPrefix
				},
				dataType:"json",
				success:function(response){
					return response.data;
				}
		});
	}
	
	/**
	 * 删除商品
	 */
	function dellist(seid,id){
		return $.ajax({
			type:"post",
			url:"/api-admin/provider/brand/"+id+"/remove",
			async:false,
			data:{"device":device,"version":version,"sessionId":seid},
			dataType:"json",
			success:function(response){
				return response.data;
			}
		});
	}
}