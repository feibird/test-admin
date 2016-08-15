angular.module('index_area').config(config).controller('DrawlistCtrl',DrawlistCtrl);
function config($stateProvider){
    $stateProvider
    .state("detail", {
        url: "/finance/drawdetail{id:string}",
        templateUrl: "Finance/DrawDetail.html",
        controller: 'DrawDetailCtrl as DrawDetailCtrl'
    })
}
DrawlistCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','StoresResource','DrawResource','NgTableParams'];
/***调用接口***/
function DrawlistCtrl($state,$scope,PublicResource,$stateParams,$rootScope,StoresResource,DrawResource,NgTableParams) {
    document.title ="提现管理";
    $rootScope.name="提现管理";
	  $rootScope.childrenName="提现管理列表";
    var vm = this;
    vm.skip=0;              //起始数据下标
    vm.limit=12;            //最大数据下标
    vm.stores;              //门店集合
    vm.list;
    vm.get = new Object();
    vm.get.status="";
    vm.get.id="";
    vm.fusName;
    vm.updateinfo=new Object();
    vm.updateinfo.serialNumber="";
    vm.updateinfo.storeId="";
    vm.updateinfo.applyStartDate=null;
    vm.updateinfo.applyEndDate=null;
    vm.updateinfo.completetStartDate="";
    vm.updateinfo.completeEndDate="";
    vm.updateinfo.ids = new Array();
    vm.filer = new Object();
    //获取sessionId
     login();
    function login(){
		vm.user=PublicResource.seid("admin");
		if(typeof(vm.user)=="undefined"){
			layer.alert("尚未登录！",{icon:2},function(index){
				layer.close(index);
				PublicResource.Urllogin();
			});
		}else{
			vm.seid = PublicResource.seid(vm.user);
		}
	}


    //财务审核成功
    function FinanOk(){
        DrawResource.FinanOk(vm.seid,vm.updateinfo).then(function(data) {
            layer.msg(data.data.result)
            list();
        })
    }

    //财务审核失败
    function FinanNo(){
        DrawResource.FinanNo(vm.seid,vm.updateinfo).then(function(data) {
            layer.msg(data.data.result)
            list();
        })
    }

    //运营审核成功
    function operaOk(){
        DrawResource.operaOk(vm.seid,vm.updateinfo,0,100).then(function(data) {
            layer.msg(data.data.result)
            list();
        })
    }

    //运营审核失败
    function operaNo(){
        DrawResource.operaNo(vm.seid,vm.updateinfom0,100).then(function(data) {
          layer.msg(data.data.result)
          list();
        })
    }


    //确认打款
    function complete(){
        DrawResource.complete(vm.seid,vm.updateinfo,0,100).then(function (data) {
           console.log(data);
           if(data.status=="OK"){
               layer.alert("操作成功~",{icon:1});
           }else{
               layer.alert(data.message,{icon:2});
           }
        });
    }

    vm.statusBtn = function(fusName,id) {
        vm.updateinfo.ids=[];
        vm.fusName=fusName;
        vm.updateinfo.ids.push(id);
        console.log(vm.updateinfo)
        layer.open({
            type: 1,
            title:"信息",
            area: ['450px',"330px"], //宽高
            content:$('.alertDiv')
        });
    };

    vm.Get =function(){
        list();
};

    vm.alertBtn = function() {
      console.log(vm.updateinfo);
        switch (vm.fusName) {
          case "operaNo":
              operaNo();
          break;
          case "operaOk":
              operaOk();
          break;
          case "complete":
              complete();
          break;
        }
        layer.closeAll();
    }
    var num=true;
    vm.All = function(){
        for(var i in vm.list){
            if(num){
                 vm.list[i].active=true;
            }else{
                 vm.list[i].active=false;
            }
        }
         num=!num;
    }

    vm.operaBtn=function(status,fusName){
        vm.updateinfo.ids=[];
        var x = 0;
      for(var i in vm.list){
          if(vm.list[i].active==true){
                if(vm.list[i].status==status){
                    vm.updateinfo.ids.push(vm.list[i].id)
                }else{
                     x+=1;
                }
          }else{
             
          }
      }
      if(x!=0){
          layer.msg("有"+x+"条数据状态不符合,请先筛选订单状态！",{icon:2})
          return false;
      }

      switch(fusName){
          case "operaNo":
                operaNo();
          break;
          case "operaOk":
                operaOk();
          break;
          case "FinanNo":
                FinanNo();
          break;
          case "FinanOk":
                FinanOk();
          break;
          case "complete":
                complete();
          break;
      }


    }

    /**
     * 初始化
     */
    initialize();
    function initialize(){
        store();
        list();
    }

    function store(){
        StoresResource.list(vm.seid,0,0).then(function (data) {
            vm.stores = data.data.result.data;
            console.log(vm.stores);
        });
    }

    function list(){
        DrawResource.list(vm.seid,vm.updateinfo,0,100).then(function(data){
            vm.list = data.data.result.data;
            for(var i in vm.list){
                vm.list[i].active=false;
                vm.list[i].createDate=chang_time(new Date(vm.list[i].createDate));
               if(vm.list[i].endDate!=null){
                    vm.list[i].endDate = chang_time(new Date(vm.list[i].endDate));
               }
            }
            vm.tableParams = new NgTableParams({},{dataset:vm.list});
            console.log(vm.list);
        });
    }


    function chang_time (date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        if(m.length<3){
            m="0"+m;
        }
        if(s<9){
            s="0"+s;
        }
        return Y+M+D+h+m+s;
    }

    function update(status,id){
        DrawResource.update(vm.seid,status,id).then(function(data){
            console.log(data);
            if(data.data.status=="OK"){
                layer.alert('修改成功',{icon:1});
            }else{
                layer.alert(data.data.message,{icon:2});
            }
            list();
        });
    }

    $(".cr_date").click(function(){
        console.log($('.date').length)
        for(var i in $('.date')){
            // vm.updateinfo[$('.date').eq(i).name]=$(".date").eq(i).val();
            if(typeof($('.date').eq(i).val())=='undefined' || $('.date').eq(i).val()==""){
                return false;
            }else{
                vm.updateinfo[$('.date').eq(i).attr('name')]=$('.date').eq(i).val()
            }
        }
        console.log(vm.updateinfo)
    })
}
