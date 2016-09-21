angular.module('index_area').controller('RecordedlistCtrl', RecordedlistCtrl);
RecordedlistCtrl.$inject = ['$state', '$scope', 'PublicResource', '$stateParams', '$rootScope', 'StoresResource', 'RecordedResource', 'NgTableParams'];
/***调用接口***/
function RecordedlistCtrl($state, $scope, PublicResource, $stateParams, $rootScope, StoresResource, RecordedResource, NgTableParams) {
  document.title = "入账管理";
  $rootScope.name = "入账管理";
  $rootScope.childrenName = "入账管理列表";
  var vm = this;
  vm.filer = new Object();
  vm.filer.storeId = "";
  vm.filer.sources = "";
  vm.filer.minTotalAmount = "";
  vm.filer.maxTotalAmount = "";
  vm.filer.takeNo = "";
  vm.filer.tradeId = "";
  vm.filer.createStartDate = "";
  vm.filer.createEndDate = ""
  vm.taskId;
  vm.pagecount;
  vm.skip = 0;
  vm.limit = 20;                                                          //分页总数
  vm.pageint = 1;

  //分页点击事件
  vm.pageChanged = function () {
    vm.skip = (vm.pageint - 1) * vm.limit;
    list(vm.seid);
  }
  login();

  //筛选查询
  vm.filerList = function () {
    vm.filer.createStartDate = GTM(false, vm.filer.createStartDate)
    vm.filer.createEndDate = GTM(true, vm.filer.createEndDate)
    console.log(vm.filer);
    list();
  }

  
  function GTM(is, data) {
    if (typeof (data) == 'undefined' || data == "" || data == null || typeof (data) == 'number') {
      return data;
    } else {
      data = chang_time(data);
      console.log(data)
      if (is) {
        data = data + "23:59:59";
      }
      return data = new Date(data).getTime();
    }

  }

  vm.clearFiler = function () {
    vm.filer.storeId = "";
    vm.filer.sources = "";
    vm.filer.minTotalAmount = "";
    vm.filer.maxTotalAmount = "";
    vm.filer.takeNo = "";
    vm.filer.tradeId = "";
    vm.filer.createStartDate = "";
    vm.filer.createEndDate = "";
  }

  //查看
  vm.open = function (item) {
    vm.info = item;
    layer.open({
      type: 1,
      title: "订单信息",
      area: ['440px', 'auto'], //宽高
      content: $(".open")
    });
  }

  vm.exel = function () {
    
    vm.filer.createStartDate = GTM(false, vm.filer.createStartDate)
    vm.filer.createEndDate = GTM(true, vm.filer.createEndDate)
    console.log(vm.filer);
    RecordedResource.exels(vm.seid, vm.filer).then(function (data) {
      vm.taskId = data.data.result;
      layer.load(1, {
        shade: [0.5,'black'],
      });
      exels();
    })
  }

  vm.excel = function () {
    vm.filer.createStartDate = GTM(false, vm.filer.createStartDate)
    vm.filer.createEndDate = GTM(true, vm.filer.createEndDate)
    var obj = new Object();
    obj.storeId = vm.filer.storeId;
    obj.endDate = vm.filer.createEndDate;
    obj.startDate = vm.filer.createStartDate;
    RecordedResource.exel(vm.seid, obj).then(function (data) {
      vm.taskId = data.data.result;
      layer.load(1, {
        shade: [0.5,'black'],
      });
      exels();
    })

  }

  function exels() {
    RecordedResource.task(vm.seid, vm.taskId).then(function (data) {
      if (data.data.result.status == 'RUNNING' || data.data.result.status == 'WAIT') {
        setTimeout(function () {
          exels();
        }, 5000);
      } else if (data.data.result.status == 'SUCCESS') {
        layer.closeAll()
        layer.confirm('任务已完成,点击确定下载exel', {
            btn: ["确定", '取消']
        }, function () {
          layer.closeAll();
            window.open('/api-admin/report/task/download?sessionId=' + vm.seid
              + "&device=" + 'pc'
              + "&version=" + '2.0.0'
              + '&taskId=' + vm.taskId)
        })
       
      }else{
        layer.msg('导出失败',{icon:2},function(){
          layer.closeAll();
        })
      }
    })
  }



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

  list();
  stores();
  //入账列表
  function list() {
    RecordedResource.list(vm.seid, vm.filer, vm.skip, vm.limit).then(function (data) {
      console.log(data.data)
      vm.list = data.data.result;
      for (var i in vm.list) {
        vm.list[i].payment.createDate = chang_time(new Date(vm.list[i].payment.createDate));
      }
      console.log(vm.list)
    })
  }

  total()
  function total() {
    RecordedResource.total(vm.seid).then(function (data) {
      vm.pagecount = data.data.result;
      console.log(vm.pagecount)
    })
  }

  //获取所有门店
  function stores() {
    StoresResource.list(vm.seid, 0, 0).then(function (data) {
      vm.store = data.data.result.data;
      console.log(vm.store)
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

}
