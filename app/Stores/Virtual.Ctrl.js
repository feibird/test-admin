angular.module('index_area').controller('VirtualCtrl',VirtualCtrl);
VirtualCtrl.$inject = ['$scope','$rootScope','$state','PublicResource','$stateParams','VirtualResource'];
/***调用接口***/
function VirtualCtrl($scope,$rootScope,$state,PublicResource,$stateParams,VirtualResource) {
    document.title ="虚拟分类管理";
	$rootScope.name="门店管理";
	$rootScope.childrenName="虚拟分类管理列表";
    var vm = this;
    vm.storename="";
    vm.list;
    vm.info={};
    vm.info.categorys=[]
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

  vm.open_layer = function () {
      layer.open({
        title:'新增虚拟分类',
        type:1,
        area:['400px','500px'],
        content:$('.add_layer')
      })
  }


   list(vm.storeid);

    function list(storeid){
    	VirtualResource.list(vm.seid,storeid).then(function(data){
            vm.list = data.data.result;
            console.log(vm.list);
        })
    }

    function remove(id,storeid){
    	VirtualResourrce.remove(vm.seid,id).then(function(data){
            console.log(data)
        })
    }
}
