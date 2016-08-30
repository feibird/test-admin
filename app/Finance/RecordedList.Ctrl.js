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
  vm.pagecount;                                                           //分页总数
  vm.pageint = 1;

  //分页点击事件
  vm.pageChanged = function () {
    vm.skip = (vm.pageint - 1) * 12;
    info_list(vm.seid);
    $location.search('page', vm.pageint)
    console.log(vm.pageint)
  }
  login();

  //筛选查询
  vm.filerList = function(){
    console.log(vm.filer)
   if(typeof(vm.filer.createStartDate)!="undefined"||vm.filer.createStartDate==""){
     console.log(vm.filer.createStartDate)
     vm.filer.createStartDate = vm.filer.createStartDate.getTime();
   }
   if(typeof(vm.filer.createEndDate)!="undefined"||vm.filer.createEndDate==""){
     vm.filer.createEndDate = vm.filer.createEndDate.getTime();
   }
      list();
  }

  vm.clearFiler = function(){
    vm.filer.storeId = "";
    vm.filer.sources = "";
    vm.filer.minTotalAmount = "";
    vm.filer.maxTotalAmount = "";
    vm.filer.takeNo = "";
    vm.filer.tradeId = "";
    vm.filer.createStartDate="";
     vm.filer.createEndDate="";
  }

  //查看
  vm.open = function(item){
    vm.info = item;
    layer.open({
		  type: 1,		  
		  title:"订单信息",
		  area: ['440px', 'auto'], //宽高
		  content:$(".open")
		});
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
    RecordedResource.list(vm.seid,vm.filer, 0, 10).then(function (data) {
      console.log(data.data)
      vm.list = data.data.result;
      for (var i in vm.list) {
        vm.list[i].payment.createDate = chang_time(new Date(vm.list[i].payment.createDate));
      }
      console.log(vm.list)
    })
  }

  total()
  function total(){
    RecordedResource.total(vm.seid).then(function(data){
        vm.pagecount = data.data.result;
    })
  }

  //获取所有门店
  function stores() {
    StoresResource.list(vm.seid, 0, 0).then(function (data) {
      vm.store = data.data.result.data;
      console.log(vm.store)
    })
  }
}
