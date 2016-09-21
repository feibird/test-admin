angular.module('index_area').controller('UserListCtrl', UserListCtrl);
UserListCtrl.$inject = ['$rootScope', 'PublicResource', 'NgTableParams', 'RoleResource', '$http'];
function UserListCtrl($rootScope, PublicResource, NgTableParams, RoleResource, $http) {
    document.title = "角色管理";
    $rootScope.name = "角色管理"
    $rootScope.childrenName = "角色管理列表"
    var vm = this;
    vm.skip = 0;
    vm.limit = 50;
    vm.seid;

    vm.get = function (userId) {
        vm.userId = userId;
        for (var i in vm.Rolelist) {
            vm.Rolelist[i].status = false;
        }
        get(userId);
        layer.open({
            title: '权限管理',
            type: 1,
            content: $('.RoleDiv')
        })
    }

    vm.upBtn = function () {
        update();
    };

    login();
    list();
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", {
                icon: 2
            }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            });
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }
    vm.statusBtn = function (status, id) {
        if (status) {
            addUser(vm.userId, id);
        } else {
            delUser(vm.userId, id);
        }
    }

    function list() {
        /* UserResource.list(vm.seid,vm.skip,vm.limit).then(function(data){
             if(data.data.status=="OK"){
                 vm.list = data.data.result;
                 vm.TableList = new NgTableParams({},{dataset:vm.list});
                 console.log(vm.list)
             }else{
                 layer.msg(data.data.message,{icon:2})
             }
         })*/
        vm.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 10, // count per page
            per_page: 10
        }, {
                filterDelay: 300,
                getData: function (info) {
                    return $http.get("/api-admin/user/list", { params: { "device": '2.0.0', "version": 'PC', "sessionId": vm.seid, "skip": vm.skip, "limit": 0 } }).then(function (data) {
                        console.log(data.data.result);
                        vm.skip += vm.limit;
                        info.per_page = 10;
                        info.total(1000);
                        return data.data.result
                    })
                }
            });

        RoleResource.list(vm.seid, 0, 0).then(function (data) {
            vm.Rolelist = data.data.result;
            console.log(vm.Rolelist)
        })

    }

    function get(id) {
        RoleResource.get(vm.seid, id).then(function (data) {
            vm.info = data.data.result;
            for (var i in vm.Rolelist) {
                for (var j in vm.info) {
                    if (vm.Rolelist[i].id == vm.info[j].id) {
                        vm.Rolelist[i].status = true;
                    }
                }
            }

        })
    }

    function delUser(userId, roleId) {
        RoleResource.delUser(vm.seid, userId, roleId).then(function (data) {
            console.log(data)
            if (data.data.status == "OK") {
                layer.msg('修改成功', { icon: 1 })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function addUser(userId, roleId) {
        console.log(userId);
        console.log(roleId)
        RoleResource.addUser(vm.seid, userId, roleId).then(function (data) {
            console.log(data)
            if (data.data.status == "OK") {
                layer.msg('添加成功', { icon: 1 })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }
}