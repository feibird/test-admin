angular.module('index_area').controller('AddMusicCtrl', AddMusicCtrl);
AddMusicCtrl.$inject = ['$rootScope', '$state', 'PublicResource', "$stateParams", 'StoresResource', 'NgTableParams','MusicResource'];
/***调用接口***/
function AddMusicCtrl($rootScope, $state, PublicResource, $stateParams, StoresResource, NgTableParams,MusicResource) {
    document.title = "语音推送管理";
    $rootScope.name = "语音推送管理";
    $rootScope.childrenName = "语音推送管理列表";
    var vm = this;
    vm.seid
    vm.list;						//对象集合
    vm.music = new Object();
    vm.music.dates = new Array();
    vm.music.store = new Array();
    vm.music.times = new Array();
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


    Stores();
    function Stores() {
        StoresResource.list(vm.seid, 0, 0).then(function (data) {
            vm.stores = data.data.result.data;
            for (var i in vm.stores) {
                vm.stores[i].select = true;
                vm.stores[i].status = false;
            }
            vm.tableStores = new NgTableParams({}, { dataset: vm.stores });
        })
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
            startTime: "11:20",
            endTime: "12:20"
        }
        vm.music.times.push(addlist)
        console.log(vm.music.dates)
    }

    function startAdd(){
        vm.music.storeId="";
        for(var i in vm.music.dates){
            if(typeof(vm.music.dates[i].startDate)!="number"){
                vm.music.dates[i].startDate=vm.music.dates[i].startDate.getTime();
            }
            if(typeof(vm.music.dates[i].endDate)!="number"){
                vm.music.dates[i].endDate=vm.music.dates[i].endDate.getTime();
            }
        }

        for(var i in vm.music.store){
            vm.music.storeId+=vm.music.store[i].id+","
        }
        vm.music.storeId = vm.music.storeId.substring(0,vm.music.storeId.length-1);
    }

    function addData(){
        MusicResource.add(vm.seid,vm.music).then(function(data){
            console.log(data)
            if(data.data.status=="OK"){
                layer.msg('保存成功~',{incon:1},function(){
                    $state.go('/music/list')
                });                
            }else{
                layer.msg(data.data.message,{icom:2})
            }
        })
    }

}
