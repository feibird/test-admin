angular.module('index_area').controller('SortlistCtrl',SortlistCtrl);
SortlistCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource',"$stateParams"];
/***调用接口***/
function SortlistCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams) {
    document.title ="分类管理";
	$rootScope.name="分类管理";
	$rootScope.childrenName="分类管理列表";
    var vm = this;
	vm.seid
    vm.pagecount=60;
    vm.pageint=5;
    vm.list;						//对象集合
    vm.addinfo= new Object;			//新增分类对象
    vm.sea_info;					//搜索分类
    vm.updatename;					//修改名字
    vm.updateid;					//修改id
    vm.info_address;
    vm.show;
    //获取页面坐标
    vm.index=$stateParams.index;    
    PublicResource.navclass(vm.index)
    //分页点击事件
    vm.pageChanged = function(){
        PublicResource.Urllogin();
    }
    //获取sessionId
   	login()
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
    PublicResource.verification(vm.seid).then(function(data){
    	console.log(data)
    })
    
    //查询分类列表
   list(vm.seid);
    
    //新增子类框
	vm.openmask = function(size){				
		var modalInstance =open({			
			templateUrl:'public/modal.html',
			controller: 'ModalCtrl'			
		})
	}
	
	//关闭弹出层
	vm.closechildren = function(){		
		layer.closeAll();
	}
	
	//新增子类
	vm.childrenbtn = function(has){
		console.log(has )
		SortResource.addlist(vm.addinfo,vm.seid).then(function(data){			
			console.log(data)
			if(data.data.status=="OK"){				
				if(!has){
					layer.closeAll();
				}
				layer.alert("添加成功~",{icon:1});
				list(vm.seid);
			}else{
				layer.alert(data.data.message,{icon:2})
			}
		})
	}
	
	vm.updatebtn = function(){
		updatechildren(vm.updateid,vm.updatename);
	}
	
	//删除节点
	vm.del = function(id){
		layer.confirm('您确定要删除分类？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			remove(id)
		  
		});
	}
	
	vm.getlist = function(id){
		get(id)
	}
	
	/**
	 * 修改分类
	 * @param {Object} id
	 */
	function update(id,name){
		 SortResource.update(id,vm.seid,name).then(function(data){	    	
	    	console.log(data);
	    	if(data.data.status=="OK"){				
				layer.closeAll();
				layer.alert("修改成功~");
				list(vm.seid);
			}else{
				layer.alert(data.data.message,{icon:2})
			}
	    })
	}

	function get(id){
		SortResource.list(vm.seid,id).then(function(data){
	    	vm.list=data.result.root;	    	
	    })
	}

	//删除
	function remove(id){
		console.log(id);
		SortResource.remove(vm.seid,id).then(function(data){				
			if (data.data.status=="OK") {					
				layer.alert('删除成功~', {icon: 1});
				list(vm.seid);
			} else{
				layer.alert(data.data.message,{icon:2})
			}
			
		})
	}
	
	/**
	 * 分类集合
	 * @param {Object} seid
	 */
	function list(seid){
		 SortResource.list(vm.seid).then(function(data){
	    	vm.list=data.data.result.root;
	    	for (var item in vm.list.children) {
	    		vm.list.children[item].status=0;
	    	}
	    	console.log(vm.list)
	    })
	}
	
	/**
	 * 收起分类
	 */
	vm.hidechildren = function(){
		for (var item in vm.list.children) {
			vm.list.children[item].status=1;
		}
	}
	
	/**
	 * 展开分类
	 */
	vm.showchildren = function(item){
		if(!item){
			for (var item in vm.list.children) {
				vm.list.children[item].status=0;
			}
		}
	}

	vm.children = function(num){			
		if(num.status==0){			
			num.status=1;			
			console.log(num);
		}else{			
			num.status=0;
		}		
	}
}