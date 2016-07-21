angular.module('index_area').factory('PublicResource', PublicResource);
PublicResource.$inject = ['$http','device','version'];
function PublicResource($http,device,version) {
    return {
        seid:seid,
        verification:verification,
        Urllogin:Urllogin,
        navclass:navclass,
		imgUpload:imgUpload,
		getarea:getarea
    };
    
    
    /**
     *获取sessionID 
     * @param {Object} user
     * 登录用户名
     */
	function seid(user){		
		return $.session.get(user);		
	}
	
	
	/**
	 * 验证sessID是否可用
	 * seid:当前sessionID
	 */
	function verification(seid){
	return $.ajax({
			type:"get",
			url:"/api-admin/session/get-user-info",
			async:false,
			data:{"sessionId":seid,"device":device,"version":version},
			dataType:"json",
			success:function(data){
				return data
			}
		});
	}
	
	
	/**
	 * 跳转到登录页
	 */
	function Urllogin(){
		window.location.href="../User/login.html";
	}
	

	

	/**
	 * 图片上传
	 */
	function imgUpload(seid,img){		
		console.log(img)
		var fd = new FormData();
		fd.append("device",device);
		fd.append("version",version);
		fd.append("sessionId",seid);
		fd.append("upload",img);
		return $.ajax({
			type:"post",
			url:"/api-admin/attach/upload",
			async:false,
			processData: false,
			contentType: false,
			data:fd,
			dataType:"json",
			success:function(data){
				return data;
			}
		})
	}
	
	/**
	 * 地区查询
	 */
	function getarea(seid,id){
		return $.ajax({
			type:"get",
			url:"/api-admin/area/list-by-parentId",
			async:false,	
			data:{"sessionId":seid,"device":device,"version":version,"parentId":id},
			dataType:"json",
			success:function(data){
				return data;
			}
		})
	}

	function navclass(index){		
		$(".navdiv").eq(index-1).find(".navdiv-span").addClass("nav-activer");
	}
}