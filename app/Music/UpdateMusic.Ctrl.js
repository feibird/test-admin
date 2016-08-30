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
    stores();
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

    //选择部分门店
    vm.Addstore = function (item) {
        if (item) {
            item.select = false;
            item.status = true;
            item.active = false;
            vm.music.store.push(item);
        } else {
            for (var i in vm.stores) {
                console.log(vm.stores[i])
                if (vm.stores[i].select == true) {
                    vm.stores[i].select = false;
                    vm.stores[i].status = true;
                    vm.stores[i].active = false;
                    vm.selectList.push(vm.stores[i])
                }
            }
        }
        vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
    }


    //删除所选门店
    vm.Delstore = function (index) {
        if (!index) {
            for (var i in vm.selectList) {
                if (vm.selectList[i].active) {
                    for (var j in vm.stores) {
                        if (vm.stores[j].id == vm.selectList[i].id) {
                            vm.stores[j].status = false;
                            vm.stores[j].select = true;
                        }
                    }
                    vm.selectList.splice(i, 1);
                }
            }

        } else {
            for (var i in vm.stores) {
                if (vm.stores[i].id == vm.music.store[index].id) {
                    vm.stores[i].status = false;
                    vm.stores[i].select = true;
                }
            }
            vm.music.store.splice(index, 1)
        }

        vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
    }


    //提交修改资料
    vm.updata = function () {
        endUpdate();
        console.log(vm.music);
        update()
    }

    function endUpdate(){
        vm.music.storeId="";
        for(var i in vm.music.voiceDates){
            if(typeof(vm.music.voiceDates[i].startDate)!="number"){
                vm.music.voiceDates[i].startDate=vm.music.voiceDates[i].startDate.getTime();
            }
            if(typeof(vm.music.voiceDates[i].endDate)!="number"){
                vm.music.voiceDates[i].endDate=vm.music.voiceDates[i].endDate.getTime();
            }
        }

        for(var i in vm.music.store){
            vm.music.storeId+=vm.music.store[i].id+","
        }
        vm.music.storeId = vm.music.storeId.substring(0,vm.music.storeId.length-1);
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
            vm.selecttable = new NgTableParams({}, { dataset: vm.music.store })
        })
    }

    function stores() {
        StoresResource.list(vm.seid, 0, 0).then(function (data) {
            vm.stores = data.data.result.data;
            for (var i in vm.stores) {
                vm.stores[i].select = true;
                vm.stores[i].status = false;
            }
            vm.tableStores = new NgTableParams({}, { dataset: vm.stores });
            console.log(vm.stores);
            Ifstore(vm.stores, vm.music.store)
        })
    }

    function update() {
        MusicResource.update(vm.seid,vm.music).then(function (data) {
           if(data.data.status=="OK"){
               console.log(data)
               layer.msg('保存成功~',{icon:1},function(){
                   $state.go('/music/list')
               })
           }else{
               layer.msg(data.data.message,{icon:2})
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

    function Ifstore(a, b) {
        console.log(vm.stores);
        for (var i in a) {
            for (var j in b) {
                if (a[i].id == b[j].id) {
                    vm.stores[i].status = true;
                    vm.stores[i].active = false;
                    vm.stores[i].select = false;
                }
            }
        }
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
