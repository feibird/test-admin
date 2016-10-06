angular.module('index_area').controller('AddMusicCtrl', AddMusicCtrl);
AddMusicCtrl.$inject = ['$rootScope', '$state', 'PublicResource', "$stateParams", 'StoresResource', 'NgTableParams', 'MusicResource'];
/***调用接口***/
function AddMusicCtrl($rootScope, $state, PublicResource, $stateParams, StoresResource, NgTableParams, MusicResource) {
    document.title = "语音推送管理";
    $rootScope.name = "语音推送管理";
    $rootScope.childrenName = "语音推送管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.music = new Object();
    vm.music.dates = new Array();
    vm.music.dates[0] = {};
    vm.music.store = new Array();
    vm.music.times = new Array();
    vm.music.times[0] = new Object();
    vm.stores;
    //获取sessionId
    login()
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



    vm.add = function () {
        startAdd();
        addData();
        console.log(vm.music)
    }

    vm.addDates = function () {
        var addlist = {
            startDate: "",
            endDate: ""
        }
        vm.music.dates.push(addlist)
        console.log(vm.music.dates)
    }
    vm.addTimes = function () {
        var addlist = {
            startTime: "",
            endTime: ""
        }
        vm.music.times.push(addlist)
        console.log(vm.music.dates)
    }



    function startAdd() {
        vm.music.storeId = "";
        console.log(vm.music.dates);
        for (var i in vm.music.dates) {
            if (typeof (vm.music.dates[i].startDate) != "number") {
                vm.music.dates[i].startDate = GTM(false, chang_time(new Date(vm.music.dates[i].startDate)))
            }
            if (typeof (vm.music.dates[i].endDate) != "number") {
                vm.music.dates[i].endDate = GTM(true, chang_time(new Date(vm.music.dates[i].endDate)))
            }
        }
        console.log(vm.music.dates);
        for (var i in vm.music.storeid) {
            vm.music.storeId += vm.music.storeid[i].id + ","
        }
        vm.music.storeId = vm.music.storeId.substring(0, vm.music.storeId.length - 1);
    }

    function chang_time(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' '; //天
        var h = date.getHours() + ':'; //时
        var m = date.getMinutes() + ':'; //分
        var s = date.getSeconds();
        console.log(h.length);
        if (D.length < 3) {
            D = "0" + D;
        }
        console.log(D.length + ',' + D);
        if (m.length < 3) {
            m = "0" + m;
        }

        if (s < 9) {
            s = "0" + s;
        }
        return Y + M + D;
    }

    function GTM(is, data) {
        if (typeof (data) == 'undefined' || data == "" || data == null) {
            return null
        } else {
            data = data.replace(/-/g,'/');
            if (is) {
                data = data + "23:59:59";
            }
            return data = new Date(data).getTime();
        }

    }


    function ArryString(objs) {
        if (typeof (obj) == 'stirng' || typeof (obj) == 'undefined' || typeof (obj) == null) {
            return obj;
        } else {
            var StoreArry = "";
            for (var i in obj) {
                StoreArry += obj[i].id + ",";
            }
            StoreArry = StoreArry.substring(0, StoreArry.length - 1)
            return StoreArry
        }
    }

    function addData() {
        MusicResource.add(vm.seid, vm.music).then(function (data) {
            console.log(data)
            if (data.data.status == "OK") {
                layer.msg('保存成功~', { icon: 1 }, function () {
                    $state.go('/music/list')
                });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

}
