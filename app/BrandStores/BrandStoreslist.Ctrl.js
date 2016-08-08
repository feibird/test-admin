angular.module('index_area').controller('BrandStoreslistCtrl',BrandStoreslistCtrl);
BrandStoreslistCtrl.$inject = ['$state','$scope','$rootScope','NgTableParams','PublicResource','BrandStoresResource','SortResource','$stateParams','FileUploader'];
/***调用接口***/
function BrandStoreslistCtrl($state,$scope,$rootScope,NgTableParams,PublicResource,BrandStoresResource,SortResource,$stateParams,FileUploader) {
    document.title ="连锁品牌管理";
	$rootScope.name="连锁品牌管理";
	$rootScope.childrenName="连锁品牌管理列表";
    var vm = this;
	vm.skip = 0;
	vm.limit = 12;
	vm.seid
	vm.addinfo;																//添加数据对象
	vm.list;																//数据列表集合
	vm.sortlist;															//分类列表集合															
	vm.getlist = new Object();															//修改数据对象
    //获取页面坐标
    vm.index=$stateParams.index;    
    PublicResource.navclass(vm.index)
    /**
     * 删除
     */
    vm.delBtn = function(id){
    	console.log(id)
    	layer.confirm('您确定要删除品牌？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			remove(id)
		});
    }

	vm.updateBtn = function(){
		update();
	}
	
	//获取sessionId
	login();
	sortlist();
	function login(){
		vm.user=PublicResource.seid("admin");			
		if(typeof(vm.user)=="undefined"){
			layer.alert("尚未登录！",{icon:2},function(index){
				layer.close(index);
				PublicResource.Urllogin();
			})
		}else{
			vm.seid = PublicResource.seid(vm.user);
		}
	}	
    
     //当前用户状态
   /* PublicResource.verification(vm.seid).then(function(data){
    	console.log(data)
    })*/
    
    //查询分类列表
   list(vm.seid);
    
    //开启模态框
	vm.openmask = function(status,id){
		var calssName;
		var title;
		switch(status){
			case 'add':
				calssName = '.info_add'
				title = '新增连锁品牌'
			break;
			case 'update':
				calssName=".info_update"
				title = '修改连锁品牌'
				get(id)
			break;
			case 'get':
				calssName='.info_get'
				title = '连锁品牌信息'
				get(id)
			break;
		}
		layer.open({
		  type: 1,
		  title:title,
		  area: ['440px', '515px'], //宽高
		  content:$(calssName)
		});
		
	}
	
	//关闭弹出层
	vm.closechildren = function(){		
		layer.closeAll();
	}
	
	/**
	 * 连锁品牌集合
	 * @param {Object} seid
	 */
	function list(){
		 BrandStoresResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
	    	vm.list=data.data.result;
			vm.tableParams = new NgTableParams({},{dataset:vm.list.data});
	    	vm.pagecount = data.data.result.total
	    	console.log(data)
	    })
	}

	function update(){
		console.log(vm.getlist)
		BrandStoresResource.update(vm.getlist,vm.seid).then(function(data){
			if (data.data.status=="OK") {
				layer.msg("修改成功~",{icon:1},function(){
					layer.closeAll();
				});
				list(vm.seid);
			}else{
				layer.msg("修改异常~请联系程序员",{icon:0});
			}
		})
	}

	function add(){
		BrandStoresResource.add(vm.addinfo,vm.seid).then(function(data){
			console.log(data)
			if (data.data.status=="OK") {
				layer.alert("上传成功~",{icon:1},function(){
					layer.closeAll();
				});
				list(vm.seid);
			}else{
				layer.alert(data.message,{icon:0});
			}
		})
	}

	function get(id){
		BrandStoresResource.get(vm.seid,id).then(function(data){
			vm.getlist = data.data.result;
			console.log(data)
		})
	}

	function remove(id){
		BrandStoresResource.remove(id,vm.seid).then(function(data){
			console.log(data);
			if (data.data.status=="OK") {					
				layer.alert('删除成功~',{icon: 1});					
			} else{
				layer.alert(data.data.message.data,{icon: 0});
			}
			list(vm.seid);
		})
	}

	function sortlist(){
		SortResource.list(vm.seid).then(function(data){
			vm.sortlist = data.data.result.root
			console.log(vm.sortlist)
		})
	}

	var logo = vm.logo = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	logo.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.logo.queue) {
				vm.logo.queue[i].isSuccess=false;
				vm.logo.queue[i].isError=true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.getlist.logo=status.result;
             vm.logo.queue[0].remove();
        }
	}
	logo.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}

	     /**update
	 * [logo description]
	 * @type {[type]}
	 */
	var logos = vm.logos = new FileUploader({
		url:"/api-admin/attach/upload",			
		formData:[{"device":"pc","version":"1.0.0","sessionId":vm.seid}]		
	})
	logos.onSuccessItem = function(data,status){
		if(status.status!="OK"){
            for (var i in vm.logos.queue) {
				vm.logos.queue[i].isSuccess=false;
				vm.logos.queue[i].isError=true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message,{icon:2})
        }else {
            console.log(status)            
             vm.getlist.logo=status.result;
             vm.logos.queue[0].remove();
        }
	}
	logo.onErrorItem= function(){
		vm.num = 5;
		var time =setInterval(function () {
			vm.num--;
			console.log(11)
			if(vm.num==0){
				layer.msg("请求超时,请撤销重试~",{icon:2},function () {
					clearInterval(time);
					return false;
				});
			}
		},1200)
	}
}
