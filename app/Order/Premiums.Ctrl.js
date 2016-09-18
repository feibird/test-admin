angular.module('index_area').controller('PremlistCtrl',PremlistCtrl);
PremlistCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','PremResource','GoodResource'];
/***调用接口***/
function PremlistCtrl($state,$scope,PublicResource,$stateParams,$rootScope,PremResource,GoodResource) {
    document.title ="运营管理";
    $rootScope.name="运营管理";
	$rootScope.childrenName="赠品列表";
    var vm = this;
    vm.list;
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

    vm.addlayer = function(){
        layer.open({
            type:1,
            title:"新增赠品",
            area:["400px",'300px'],
            content:$(".add_operk")
        })
    }

    vm.delBtn = function(id){
        layer.confirm('是否删除赠品',{
            btn:['确定','删除'],
        },function(){
            remove(id);
        })
    }

     vm.updatelayer = function(id){
         get(id);
        layer.open({
            type:1,
            title:"修改赠品",
            area:["400px",'300px'],
            content:$(".update_operk")
        })
    }

    vm.updateBtn = function(){
        console.log(vm.data);
        Update();
    }

    vm.addBtn = function(){
        console.log(vm.addinfo)
        Add();
    }
    list();
    good();
    function list(){
        PremResource.list(vm.seid,0,100).then(function(data){
            console.log(data.data.result)
            vm.list = data.data.result;
        })
    }

    function good(){
        GoodResource.list(vm.seid,null,0,0).then(function(data){
            vm.goods = data.data.result.data;
            console.log(vm.goods)
        })
    }

    function Add(){
        PremResource.add(vm.seid,vm.addinfo).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('添加成功',{icon:1},function(){
                    layer.closeAll();
                    list();
                })
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function get(id){
        PremResource.get(vm.seid,id).then(function(data){
            console.log(data.data.result)
            vm.data = data.data.result;
        })
    }

    function remove(id){
        PremResource.remove(vm.seid,id).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('删除成功',{icon:1},function(){
                    layer.closeAll();
                    list();
                })
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function Update(){
        PremResource.update(vm.seid,vm.data).then(function(data){
            if(data.data.status=="OK"){
                layer.msg('修改成功',{icon:1},function(){
                    layer.closeAll();
                    list();
                })
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

}
