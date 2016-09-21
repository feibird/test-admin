angular.module('index_area').controller('DrawDetailCtrl',DrawDetailCtrl);
DrawDetailCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','StoresResource','DrawResource','NgTableParams'];
/***调用接口***/
function DrawDetailCtrl($state,$scope,PublicResource,$stateParams,$rootScope,StoresResource,DrawResource,NgTableParams) {
    document.title ="提现管理";
    $rootScope.name="提现管理";
	$rootScope.childrenName="提现管理列表";
    var vm = this;
    vm.id = $stateParams.id;
    
    login();
    get();
   

   function get(){
   	DrawResource.get(vm.seid,vm.id).then(function(data){
   		vm.info = data.data.result;
   		console.log(vm.info);
   		vm.info.createDate = chang_time(new Date(vm.info.createDate));
   		if (vm.info.endDate != null) {
          vm.info.endDate = chang_time(new Date(vm.info.endDate));
        }
      })
   }

   vm.status = function(status){
      switch(status){
        case 'complete':
        layer.confirm('是否打款？', {
            btn: ['确定','取消'] //按钮
            }, function(){
                complete()
            });
           
        break;
        case 'operaOk':
        layer.confirm('是否通过？', {
            btn: ['确定','取消'] //按钮
            }, function(){
                operaOk();
            });
            
        break;
        case 'FinanOk':
        layer.confirm('是否通过？', {
            btn: ['确定','取消'] //按钮
            }, function(){
                FinanOk();
            });
        break;
      }
   }

 //确认打款
  function complete() {
    DrawResource.complete(vm.seid, vm.info).then(function(data) {
      console.log(data);
      if (data.data.status == "OK") {
        layer.msg("操作成功~", {
          icon: 1
        });
      } else {
        layer.msg(data.data.message, {
          icon: 2
        });
      }
      list();
    });
  }

  //财务审核成功
  function FinanOk() {
    DrawResource.FinanOk(vm.seid, vm.info).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //运营审核成功
  function operaOk() {
    DrawResource.operaOk(vm.seid, vm.info).then(function(data) {
      layer.msg(data.data.result)
      list();
    })
  }

  function login() {
    vm.user = PublicResource.seid("admin");
    if (typeof(vm.user) == "undefined") {
      layer.alert("尚未登录！", {
        icon: 2
      }, function(index) {
        layer.close(index);
        PublicResource.Urllogin();
      });
    } else {
      vm.seid = PublicResource.seid(vm.user);
    }
  }


  //时间戳转换2008-08-08:00:00:00格式
  function chang_time(date) {
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
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
        return Y + M + D + h + m + s;
    }
}
