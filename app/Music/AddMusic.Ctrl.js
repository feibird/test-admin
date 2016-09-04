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

        for(var i in vm.music.storeid){
            vm.music.storeId+=vm.music.storeid[i].id+","
        }
        vm.music.storeId = vm.music.storeId.substring(0,vm.music.storeId.length-1);
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
