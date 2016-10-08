angular.module('index_area').controller('FormatCtrl', FormatCtrl);
FormatCtrl.$inject = ['$state', '$rootScope', 'PublicResource', '$stateParams', 'FormatResource'];
/***调用接口***/
function FormatCtrl($state, $rootScope, PublicResource, $stateParams, FormatResource) {
    document.title = "商品详情";
    $rootScope.name = "商品管理";
    $rootScope.childrenName = "添加基础商品";
    var vm = this;
    vm.Addinfo = new Object();
    vm.seid;
    vm.id = $stateParams.id;

    vm.addBtn = function () {
        console.log(vm.Addinfo)
        add();
    }

    vm.delBtn = function (id) {
        layer.confirm('是否确认删除此规格？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            remove(id)
            layer.closeAll()

        });
    }

    vm.updateBtn = function (data) {
        if (data.status) {
            if (update(data)) {
                layer.msg('修改成功！', { icon: 1 });
                layer.closeAll();
                data.status = false;
            }
        } else {
            data.status = true;
        }
    }

    login();
    list();
    function login() {
        vm.user = PublicResource.seid("admin");
        if (typeof (vm.user) == "undefined") {
            layer.alert("尚未登录！", { icon: 2 }, function (index) {
                layer.close(index);
                PublicResource.Urllogin();
            })
        } else {
            vm.seid = PublicResource.seid(vm.user);
        }
    }

    function add() {
        FormatResource.add(vm.seid, vm.id, vm.Addinfo).then(function (data) {
            console.log(data);
            if (data.data.status == "OK") {
                layer.msg('添加成功~', { icon: 1 });
                list(vm.seid, vm.id)
            } else {
                layer.msg(data.data.message)
            }
        })
    }

    function update(info) {
        FormatResource.update(vm.seid, vm.id, info).then(function (data) {
            console.log(data);
            if (data.data.status == "OK") {
                layer.msg('添加成功~', { icon: 1 });
                list(vm.seid, vm.id)
            } else {
                layer.msg(data.data.message)
            }
        })
    }

    function remove(id) {
        FormatResource.remove(vm.seid, id).then(function (data) {
            console.log(data);
            if (data.data.status == "OK") {
                layer.msg('删除成功', { icon: 1 });
                list(vm.seid, vm.id)
            } else {

            }
        })
    }

    function list() {
        FormatResource.list(vm.seid, vm.id).then(function (data) {
            console.log(data);
            if (data.data.status != "OK") {
                layer.msg(data.data.message, { icon: 2 });
            }
            vm.list = data.data.result;
            for (var i in vm.list) {
                vm.list[i].status = false;
            }
        })
    }
}