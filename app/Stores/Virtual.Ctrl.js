angular.module('index_area').controller('VirtualCtrl',VirtualCtrl);
VirtualCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource','$stateParams','VirtualResourrce','NgTableParams'];
/***调用接口***/
function VirtualCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams,VirtualResourrce,NgTableParams) {
    document.title ="虚拟分类管理";
	$rootScope.name="门店管理";
	$rootScope.childrenName="虚拟分类管理列表";
    var vm = this;
    vm.storename="";
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.list;
    vm.info;
    //获取页面坐标
    vm.storeid = $stateParams.id;
    
    
    vm.delbtn = function(id,storeID){
        layer.confirm('您确定要删除分类？', {
              btn: ['确定','取消'] //按钮
        }, function(){
             remove(id,storeID)
        });
    }
    //获取sessionId
    login();
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
    
    
   list(vm.storeid);
    
    function list(storeid){
    	VirtualResourrce.list(vm.seid,storeid,0,0).then(function(data){
            vm.list = data.data.result;
            vm.tableParams = new NgTableParams({},{dataset:vm.list.virtualCategories});
            console.log(vm.list.virtualCategories)
        })
    }
     
    function remove(id,storeid){    	
    	VirtualResourrce.remove(vm.seid,id).then(function(data){
            console.log(data)
        })
    }
}
