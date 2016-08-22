angular.module('index_area').controller('OrderlistCtrl',OrderlistCtrl);
OrderlistCtrl.$inject = ['$state','$scope','PublicResource','$stateParams','$rootScope','StoresResource','OrderResource','NgTableParams'];
/***调用接口***/
function OrderlistCtrl($state,$scope,PublicResource,$stateParams,$rootScope,StoresResource,OrderResource,NgTableParams) {
    document.title ="订单管理";
    $rootScope.name="订单管理";
	$rootScope.childrenName="订单管理列表";
    var vm = this;
    vm.stores;              //门店集合
    vm.list;
    vm.get = new Object();
    vm.filerPay=[
        {title:'微信公众号',id:'WECHAT_WEB'},  
        {title:'微信支付',id:'WECHAT_APP'},  
        {title:'支付宝网页',id:'ZHIFUBAO_WEB'},  
        {title:'支付宝应用',id:'ZHIFUBAO_APP'},  
        {title:'线下支付',id:null}
    ]
    //获取sessionId
     login();
    function login(){
		vm.user=PublicResource.seid("admin");			
		if(typeof(vm.user)=="undefined"){
			layer.alert("尚未登录！",{icon:2},function(index){
				layer.close(index);
				PublicResource.Urllogin();
			})
		}else{
			vm.seid = PublicResource.seid(vm.user);
		}
	}

    vm.St_order = function(){
        list();
    }

    list();

    function list(){
        OrderResource.list(vm.seid,vm.get,0,100).then(function(data){
            vm.list = data.data.result.data;
            vm.tableParams = new NgTableParams({},{dataset:vm.list});   
            vm.pagecount =data.data.result.total;            
            console.log(data);
            for(var i in vm.list){
                vm.list[i].createDate=change_time(vm.list[i].createDate);
               if(vm.list[i].endDate!=null){
                    vm.list[i].endDate = change_time(vm.list[i].endDate)
               }
            }
            console.log(vm.list);
        })
    }

    function change_time(nS){
        return  new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, "");
    }

    function update(status,id){
        OrderResource.update(vm.seid,status,id).then(function(data){
            console.log(data);
            if(data.data.status=="OK"){
                layer.alert('修改成功',{icon:1})
            }else{
                layer.alert(data.data.message,{icon:2})
            }
            list();
        })
    }

}
