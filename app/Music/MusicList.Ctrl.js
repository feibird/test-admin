angular.module('index_area').config(config).controller('MusicListCtrl', MusicListCtrl);
config.$inject = ['$stateProvider'];
function config($stateProvider) {
    $stateProvider
        .state("mucadd", {
            url: "/music/addmusic",
            templateUrl: "Music/AddMusic.html",
            controller: 'AddMusicCtrl as AddMusicCtrl'
        })
        .state("mucupdate", {
            url: "/music/updatemusic/{id:string}",
            templateUrl: "Music/UpdateMusic.html",
            controller: 'UpdateMusicCtrl as UpdateMusicCtrl'
        })
}
MusicListCtrl.$inject = ['$rootScope', '$state', 'PublicResource', "$stateParams", 'StoresResource', 'NgTableParams', 'MusicResource'];
/***调用接口***/
function MusicListCtrl($rootScope, $state, PublicResource, $stateParams, StoresResource, NgTableParams, MusicResource) {
    document.title = "语音推送管理";
    $rootScope.name = "语音推送管理";
    $rootScope.childrenName = "语音推送管理列表";
    var vm = this;
    vm.seid;
    vm.skip = 0;
    vm.limit = 10;
    vm.list;						//对象集合
    vm.getinfo;

    //获取sessionId
    login()
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


    vm.layer = function (id) {
        get(id)
        layer.open({
            title: '语音详情',
            area: ['400px', '500px'],
            type: 1,
            content: $('.oper')
        })
    }

    vm.is_effective = function (item) {
        vm.status = new Object();
        vm.status.ids = item.id;
        layer.confirm('是否修改语音状态？', {
            btn: ['启用', '禁用']
        }, function () {
            vm.status.status = true;
            MusicResource.status(vm.seid, vm.status).then(function (data) {
                if (data.data.status == "OK") {
                    layer.msg('修改成功', { icon: 1 });
                } else {
                    layer.msg(data.data.message, { icon: 2 });
                }
                list();
            })
        }, function () {
            vm.status.status = false;
            MusicResource.status(vm.seid, vm.status).then(function (data) {
                if (data.data.status == "OK") {
                    layer.msg('修改成功', { icon: 1 });
                } else {
                    layer.msg(data.data.message, { icon: 2 });
                }
                list();
            })
        })
    }

    vm.delBtn = function (id) {
        layer.confirm('您确定要删除语音？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            del(id);
        });
    }

    function get(id) {
        MusicResource.get(vm.seid, id).then(function (data) {
            vm.info = data.data.result;
            for (var j in vm.info.voiceDates) {
                vm.info.voiceDates[j].endDate = chang_time(new Date(vm.info.voiceDates[j].endDate));
                vm.info.voiceDates[j].startDate = chang_time(new Date(vm.info.voiceDates[j].startDate));
            }
            console.log(vm.info)
        })
    }

    count();
    function count() {
        MusicResource.count(vm.seid).then(function (data) {
            vm.count = data.data.result;
            console.log(data)
        })
    }

    function list() {
        MusicResource.list(vm.seid, vm.skip, vm.limit).then(function (data) {
            vm.list = data.data.result.data;
            for (var i in vm.list) {
                for (var j in vm.list[i].voiceDates) {
                    vm.list[i].voiceDates[j].endDate = chang_time(new Date(vm.list[i].voiceDates[j].endDate));
                    vm.list[i].voiceDates[j].startDate = chang_time(new Date(vm.list[i].voiceDates[j].startDate));
                }
            }
            console.log(vm.list)
        })
    }

    function chang_time(date) {
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        if (D.length < 3) {
            D = "0" + D;
        }
        if (m.length < 3) {
            m = "0" + m;
        }

        if (s < 9) {
            s = "0" + s;
        }
        return Y + M + D;
    }

    function del(id) {
        MusicResource.remove(vm.seid, id).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg('删除成功', { icon: 1 });
                list();
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

}
