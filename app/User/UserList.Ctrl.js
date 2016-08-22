angular.module('index_area').controller('UserListCtrl',UserListCtrl);
UserListCtrl.$inject = ['$scope','$rootScope','$state','PublicResource',"$stateParams",'NgTableParams','UserResource','RoleResource'];
function UserListCtrl($scope,$rootScope,$state,PublicResource,$stateParams,NgTableParams,UserResource,RoleResource){
    document.title ="角色管理";
    $rootScope.name="角色管理"
    $rootScope.childrenName="角色管理列表"
    var vm = this;
    vm.seid;

    vm.get = function(userId){
        vm.userId = userId;
        get(userId);
        layer.open({
            title:'权限管理',
            type:1,
		    content:$('.RoleDiv')
        })
    }

    vm.upBtn=function(){
        update();
};

    login();
    list();
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof(vm.user) == "undefined") {
        layer.alert("尚未登录！", {
            icon: 2
        }, function(index) {
            layer.close(index);
            PublicResource.Urllogin();
        });
        } else {
        vm.seid = PublicResource.seid(vm.user);
        }
    }
    vm.statusBtn = function(status,id){
        if(status){
            add(vm.userId,id);
        }else{
            del(vm.userId,id);
        }
    }

    function list(){
        UserResource.list(vm.seid,0,0).then(function(data){
            vm.list = data.data.result;
            vm.TableList = new NgTableParams({},{dataset:vm.list});
            console.log(vm.list)
        })

        RoleResource.list(vm.seid,0,0).then(function(data){
            vm.Rolelist = data.data.result;
            console.log(vm.Rolelist)
        })

    }

    function get(id){
         RoleResource.get(vm.seid,id).then(function(data){
            vm.info = data.data.result;
            console.log(vm.info)
        })
    }

    function del(userId,roleId){
        RoleResource.del(vm.seid,userId,roleId).then(function(data){
            console.log(data)
            if(data.data.status=="OK"){
                layer.msg('修改成功',{icon:1})
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }

    function add(userId,roleId){
        RoleResource.add(vm.seid,userId,roleId).then(function(data){
            console.log(data)
            if(data.data.status=="OK"){
                layer.msg('添加成功',{icon:1})
            }else{
                layer.msg(data.data.message,{icon:2})
            }
        })
    }
}