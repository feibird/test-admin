angular.module('index_area').config(config).controller('DrawlistCtrl', DrawlistCtrl);

function config($stateProvider) {
  $stateProvider
    .state("detail", {
      url: "/finance/drawdetail/{id:string}",
      templateUrl: "Finance/DrawDetail.html",
      controller: 'DrawDetailCtrl as DrawDetailCtrl'
    })
    .state("recordedlist", {
      url: "/finance/recordedlist",
      templateUrl: "Finance/Recordedlist.html",
      controller: 'RecordedlistCtrl as RecordedlistCtrl'
    })
    .state("wallet", {
      url: "/finance/wallet",
      templateUrl: "Finance/Wallet.html",
      controller: 'WalletCtrl as WalletCtrl'
    })
}
DrawlistCtrl.$inject = ['$state', '$scope', 'PublicResource', '$stateParams', '$rootScope', 'StoresResource', 'DrawResource', 'NgTableParams', '$http', "device", "version"];
/***调用接口***/
function DrawlistCtrl($state, $scope, PublicResource, $stateParams, $rootScope, StoresResource, DrawResource, NgTableParams, $http, device, version) {
  document.title = "提现管理";
  $rootScope.name = "提现管理";
  $rootScope.childrenName = "提现管理列表";
  var vm = this;
  vm.skip = 0; //起始数据下标
  vm.limit = 10; //最大数据下标
  vm.stores; //门店集合
  vm.list;
  vm.get = new Object();
  vm.get.status = "";
  vm.get.id = "";
  vm.fusName;
  vm.oper;
  vm.updateinfo = new Object();
  vm.updateinfo.serialNumber = "";
  vm.updateinfo.storeId = "";
  vm.updateinfo.applyStartDate = "";
  vm.updateinfo.applyEndDate = "";
  vm.updateinfo.completeStartDate = "";
  vm.updateinfo.completeEndDate = "";
  vm.updateinfo.status = "";
  vm.updateinfo.ids = new Array();
  vm.filer = new Object();
  //获取sessionId
  login();
  1
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

  PublicResource.user(vm.seid).then(function (data) {
    vm.Role = data.result;
    console.log(vm.Role)
  })

  PublicResource.RoleUser(vm.seid, vm.Role.id).then(function (data) {
    vm.UserOper = data.result;
    console.log(vm.UserOper)
    for (var i in vm.UserOper) {
      if (vm.UserOper[i].name == '财务管理员') {
        vm.oper = 1;
      } else if (vm.UserOper[i].name == '运营管理员') {
        vm.oper = 2;
      } else if (vm.UserOper[i].name == '后台管理员') {
        vm.oper = 3;
      }
    }
    console.log(vm.oper)
  })

  //财务审核成功
  function FinanOk() {
    DrawResource.FinanOk(vm.seid, vm.updateinfo).then(function (data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //财务审核失败
  function FinanNo() {
    DrawResource.FinanNo(vm.seid, vm.updateinfo).then(function (data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //运营审核成功
  function operaOk() {
    DrawResource.operaOk(vm.seid, vm.updateinfo, 0, 100).then(function (data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //运营审核失败
  function operaNo() {
    DrawResource.operaNo(vm.seid, vm.updateinfo, 0, 100).then(function (data) {
      layer.msg(data.data.result)
      list();
    })
  }

  //汇总统计
  function count() {
    DrawResource.count(vm.seid, vm.updateinfo, 0, 100).then(function (data) {
      vm.count = data.data.result;
    })
  }

  //导出表格
  function exel() {
    var applyStartDate = dateTime(vm.updateinfo.applyStartDate) ? dateTime(vm.updateinfo.applyStartDate) : "";
    var applyEndDate = dateTime(vm.updateinfo.applyEndDate) ? dateTime(vm.updateinfo.applyEndDate) : "";
    var completetStartDate = dateTime(vm.updateinfo.completetStartDate) ? dateTime(vm.updateinfo.completetStartDate) : "";
    var completeEndDate = dateTime(vm.updateinfo.completeEndDate) ? dateTime(vm.updateinfo.completeEndDate) : "";
    window.open("/api-admin/report/draw/excel?sessionId=" + vm.seid
      + "&device=" + 'pc'
      + "&version=" + '2.0.0'
      + "&status=" + vm.updateinfo.status
      + "&serialNumber=" + vm.updateinfo.serialNumber
      + "&storeId=" + vm.updateinfo.storeId
      + "&applyStartDate=" + applyStartDate
      + "&applyEndDate=" + applyEndDate
      + "&completetStartDate=" + completetStartDate
      + "&completeEndDate=" + completeEndDate
    )
  }

  //确认打款
  function complete() {
    DrawResource.complete(vm.seid, vm.updateinfo, 0, 100).then(function (data) {
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

  vm.statusBtn = function (fusName, id) {
    vm.updateinfo.ids = [];
    vm.fusName = fusName;
    vm.updateinfo.ids.push(id);
    console.log(vm.updateinfo)
    layer.open({
      type: 1,
      title: "信息",
      area: ['450px', "330px"], //宽高
      content: $('.alertDiv')
    });
  };

  vm.Get = function () {
    vm.updateinfo.completeEndDate = GTM(true, vm.updateinfo.completeEndDate)
    vm.updateinfo.completeStartDate = GTM(false, vm.updateinfo.completeStartDate)
    vm.updateinfo.applyStartDate = GTM(false, vm.updateinfo.applyStartDate)
    vm.updateinfo.applyEndDate = GTM(true, vm.updateinfo.applyEndDate)
    list();
  };


  //为结束时间的时分秒修改为23:59:59
  function GTM(is, data) {
    console.log(data)
    if (typeof (data) == 'undefined' || data == "" || data == null) {
      return null
    } else {
      data = chang_time(data);
      if (is) {
        data = data + "23:59:59";
      }
      return data = new Date(data).getTime();
    }

  }


  vm.exel = function () {
    exel()
  }


  vm.countBtn = function () {
    layer.open({
      type: 1,
      title: '详情',
      area: ['700px', "550px"], //宽高
      content: $('.count')
    })
    count();
  }

  vm.Credential = function (id) {
    get(id)
    layer.open({
      type: 1,
      title: '提现详情',
      area: ['700px', "550px"], //宽高
      content: $('.credential')
    })
  }

  vm.count_detailBtn = function () {
    layer.open({
      type: 1,
      title: '详情',
      area: ['1000px', "550px"], //宽高
      content: $('.count-detail')
    })
    count_list();
  }

  vm.alertBtn = function () {
    console.log(vm.updateinfo);
    switch (vm.fusName) {
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
    layer.closeAll();
  }
  var num = true;
  vm.All = function () {
    for (var i in vm.list) {
      if (num) {
        vm.list[i].active = true;
      } else {
        vm.list[i].active = false;
      }
    }
    num = !num;
  }

  vm.operaBtn = function (status, fusName) {
    vm.updateinfo.ids = [];
    var x = 0;
    for (var i in vm.list) {
      if (vm.list[i].active == true) {
        if (vm.list[i].status == status) {
          vm.updateinfo.ids.push(vm.list[i].id)
        } else {
          x += 1;
        }
      } else {

      }
    }
    if (x != 0) {
      layer.msg("有" + x + "条数据状态不符合,请先筛选订单状态！", {
        icon: 2
      })
      return false;
    }

    switch (fusName) {
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

  function initialize() {
    store();
    list();
  }

  function store() {
    StoresResource.list(vm.seid, 0, 0).then(function (data) {
      vm.stores = data.data.result.data;
      console.log(vm.stores);
    });
  }

  function list() {

    vm.tableParams = new NgTableParams({
      page: 1, // show first page
      count: 10, // count per page
      per_page: 10
    }, {
        filterDelay: 300,
        getData: function (info) {
          vm.skip = vm.limit * (info.page() - 1);
          return $http.get("/api-admin/draw/list", {
            params: {
              "device": device,
              "version": version,
              "sessionId": vm.seid,
              "skip": vm.skip,
              "limit": vm.limit,
              'storeId': vm.updateinfo.storeId,
              'status': vm.updateinfo.status,
              "applyStartDate": vm.updateinfo.applyStartDate,
              "applyEndDate": vm.updateinfo.applyEndDate,
              "completeStartDate": vm.updateinfo.completeStartDate,
              "completeEndDate": vm.updateinfo.completeEndDate,
              "serialNumber": vm.updateinfo.serialNumber
            }
          }).then(function (data) {
            console.log(info.page())
            info.total(data.data.result.total);
            info.per_page = 10;
            for (var i in data.data.result.data) {
              data.data.result.data[i].createDate = chang_time(new Date(data.data.result.data[i].createDate))
              data.data.result.data[i].endDate = chang_time(new Date(data.data.result.data[i].endDate))
            }
            return data.data.result.data;
          })
        }
      });
  }

  function get(id) {
    DrawResource.get(vm.seid, id).then(function (data) {
      vm.credential = data.data.result;
      console.log(vm.credential);
      vm.credential.createDate = chang_time(new Date(vm.credential.createDate));
      if (vm.credential.endDate != null) {
        vm.credential.endDate = chang_time(new Date(vm.credential.endDate));
      }
    })
  }

  function count_list() {
    DrawResource.list(vm.seid, vm.updateinfo, 0, 100).then(function (data) {
      vm.count_detail = data.data.result.data;
      for (var i in vm.list) {
        vm.count_detail[i].active = false;
        vm.count_detail[i].createDate = chang_time(new Date(vm.count_detail[i].createDate));
        if (vm.count_detail[i].endDate != null) {
          vm.count_detail[i].endDate = chang_time(new Date(vm.count_detail[i].endDate));
        }
      }
      console.log(vm.count_detail);
    });
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

    if (h.length < 3) {
      h = "0" + h;
    }
    return Y + M + D;
  }

  //修改时间格式(时间戳转换)
  function dateTime(data) {
    if (data == null || data.length < 1) {
      return false;
    }
    console.log(data)
    var date = data.split('-');
    var time = new Date(date[0], date[1] - 1, date[2]).getTime();
    console.log(time)
    return time;
  }

  function update(status, id) {
    DrawResource.update(vm.seid, status, id).then(function (data) {
      console.log(data);
      if (data.data.status == "OK") {
        layer.alert('修改成功', {
          icon: 1
        });
      } else {
        layer.alert(data.data.message, {
          icon: 2
        });
      }
      list();
    });
  }

  $(function () {
    $(".printBtn").click(function () {
      var ClassName = $(this).attr('name');
      console.log(ClassName);
      $(this).hide();
      $(ClassName).jqprint();
      $(this).show();
    })
  })

}