angular.module('index_area').controller('RoleListCtrl', RoleListCtrl);
RoleListCtrl.$inject = ['$scope', '$rootScope', '$state', 'PublicResource', "$stateParams", 'NgTableParams', 'RoleResource', 'OperationResource'];
function RoleListCtrl($scope, $rootScope, $state, PublicResource, $stateParams, NgTableParams, RoleResource, OperationResource) {
    document.title = "角色管理";
    $rootScope.name = "角色管理"
    $rootScope.childrenName = "角色管理列表"
    var vm = this;
    vm.seid;
    vm.data = new Object();
    vm.addinfo = new Object();
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

    vm.operBtn = function (id) {
        vm.data.id = id;
        get(id);
        layer.open({
            title: '操作管理',
            type: 1,
            content: $('.operList')
        })
    }

    vm.statusBtn = function (status, code) {
        vm.data.code = code;
        console.log(vm.data)
        if (status) {
            add()
        } else {
            del()
        }
    }

    vm.upBtn = function (item) {
        console.log(item);
        vm.addinfo.name = item.name;
        vm.addinfo.id = item.id;
        vm.is = false;
        layer.open({
            title: '编辑角色',
            type: 1,
            content: $('.addRole')
        })
    }

    vm.AddRole = function () {
        vm.is = true;
        layer.open({
            title: '编辑角色',
            type: 1,
            content: $('.addRole')
        })
    }

    vm.infoBtn = function () {
        if (vm.is) {
            addRole();
        } else {
            updateRole();
        }
    }

    vm.delBtn = function (id) {
        layer.confirm('是否删除角色？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            delRole(id)
        });
    }

    function list() {
        RoleResource.list(vm.seid, 0, 0).then(function (data) {
            if (data.data.status == "OK") {
                vm.list = data.data.result;
                vm.RoleList = new NgTableParams({}, { dataset: vm.list });
                console.log(vm.list)
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })

        OperationResource.list(vm.seid, 0, 0).then(function (data) {
            if (data.data.status == "OK") {
                vm.operList = data.data.result;
                console.log(vm.operList)
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function get(id) {
        OperationResource.get(vm.seid, id).then(function (data) {
            vm.info = data.data.result;
            for (var i in vm.operList) {
                vm.operList[i].status = false;
                for (var j in vm.info) {
                    if (vm.operList[i].code == vm.info[j].code) {
                        vm.operList[i].status = true;
                    }
                }
            }
        })
    }

    function add() {
        console.log(vm.data)
        OperationResource.add(vm.seid, vm.data).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg('添加成功', { icon: 1 });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function del(id) {
        OperationResource.del(vm.seid, id).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg('删除成功', { icon: 1 });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function addRole() {
        RoleResource.add(vm.seid, vm.addinfo).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg('添加成功', { icon: 1 }, function () {
                    layer.closeAll();
                    list();
                });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function updateRole() {
        RoleResource.update(vm.seid, vm.addinfo).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg('修改成功', { icon: 1 }, function () {
                    layer.closeAll();
                    list();
                });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function delRole(id) {
        RoleResource.del(vm.seid, id).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg('删除成功', { icon: 1 }, function () {
                    layer.closeAll();
                    list();
                });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }
}