angular.module('index_area').controller('UpdateMusicCtrl', UpdateMusicCtrl);
UpdateMusicCtrl.$inject = ['$rootScope', '$state', 'PublicResource', "$stateParams", 'StoresResource', 'NgTableParams', 'MusicResource'];
/***调用接口***/
function UpdateMusicCtrl($rootScope, $state, PublicResource, $stateParams, StoresResource, NgTableParams, MusicResource) {
    document.title = "语音推送管理";
    $rootScope.name = "语音推送管理";
    $rootScope.childrenName = "修改语音推送";
    var vm = this;
    vm.seid
    vm.stores;						//对象集合
    vm.getinfo;
    vm.selectList = new Array();
    vm.id = $stateParams.id;
    console.log(vm.id)
    //获取sessionId
    login()
    get(vm.id)
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


    //提交修改资料
    vm.updata = function () {
        endUpdate();
        console.log(vm.music);
        update()
    }

    function endUpdate() {
        vm.music.storeId = "";
        for (var i in vm.music.voiceDates) {
            vm.music.voiceDates[i].startDate = chang_time(new Date(vm.music.voiceDates[i].startDate));
            vm.music.voiceDates[i].endDate = chang_time(new Date(vm.music.voiceDates[i].endDate));
        }
        for (var i in vm.music.voiceDates) {
            vm.music.voiceDates[i].startDate = GTM(false, vm.music.voiceDates[i].startDate);
            vm.music.voiceDates[i].endDate = GTM(true, vm.music.voiceDates[i].endDate);
        }
        console.log(vm.music.voiceDates)
        for (var i in vm.music.store) {
            vm.music.storeId += vm.music.store[i].id + ","
        }
        vm.music.storeId = vm.music.storeId.substring(0, vm.music.storeId.length - 1);
    }

    vm.addDates = function () {
        var addlist = {
            startDate: "",
            endDate: ""
        }
        vm.music.voiceDates.push(addlist)
    }
    vm.addTimes = function () {
        var addlist = {
            startTime: "11:20",
            endTime: "12:20"
        }
        vm.music.voiceTimes.push(addlist)
    }

    function get(id) {
        MusicResource.get(vm.seid, id).then(function (data) {
            vm.music = data.data.result;
            console.log(vm.music)
        })
    }

    function GTM(is, data) {
        console.log(data)
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

    function update() {
        MusicResource.update(vm.seid, vm.music).then(function (data) {
            if (data.data.status == "OK") {
                console.log(data)
                layer.msg('保存成功~', { icon: 1 }, function () {
                    $state.go('/music/list')
                })
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
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

    function dateTime(data) {
        if (data == null || data.length < 1) {
            return false;
        }
        console.log(data)
        var date = data.split('-');
        console.log(date);
        var time = new Date(date[0], date[1] - 1, date[2]).getTime();
        return time;
    }
}
