angular.module('index_area').controller('StoresGoodCtrl', StoresGoodCtrl);
StoresGoodCtrl.$inject = ['$scope', '$rootScope', '$state', 'StoresResource', 'PublicResource', '$stateParams', 'VirtualResource','GoodResource','StoresGoodResource'];
/***调用接口***/
function StoresGoodCtrl($scope, $rootScope, $state, StoresResource, PublicResource, $stateParams, VirtualResource,GoodResource,StoresGoodResource) {
    document.title = "虚拟分类管理";
    $rootScope.name = "门店管理";
    $rootScope.childrenName = "虚拟分类管理列表";
    var vm = this;
    vm.skip = 0;				//起始数据下标
    vm.limit = 12;			//最大数据下标
    vm.list;
    vm.info;
    vm.storeid = $stateParams.id;
    vm.storeName = $stateParams.name;
    vm.brand = $stateParams.brand;

     //分页点击事件
  vm.pageChanged = function () {
    vm.skip = (vm.pageint - 1) * vm.limit;
    get();
  }


    vm.delbtn = function (id, storeID) {
        layer.confirm('您确定要删除分类？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            remove(id, storeID)
        });
    }
    //获取sessionId
    login();
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
    get();
    function get() {
        StoresGoodResource.list(vm.seid,vm.storeid,vm.skip, vm.limit).then(function (data) {
            console.log(data)
            vm.list = data.data.result.data;
            vm.pagecount = data.data.result.total;
            console.log(vm.pagecount)
            console.log(vm.list)
        })
    }

    vm.upbtn = function(){
        var all=[];
        var obj={}
        console.log(vm.specs)
        for(var i in vm.specs){
            obj.id = vm.specs[i].id;
            obj.price = vm.specs[i].price;
            all.push(obj);
            obj={}
        }
        StoresGoodResource.update(vm.seid,all).then(function(data){
    		console.log(data)
    		if(data.data.status=="OK"){
                layer.alert("修改成功",{icon:1},function(){
                    layer.closeAll();
                    get();
                })
    		}else{
    			layer.alert(data.data.message,{icon:2})
    		}
    	})
    }

    vm.opera_layer = function(item){
        console.log(item)
        vm.specs =item.specs;
        vm.name = item.baseProduct.name;
        layer.open({
            title:'商品规格',
            area:['400px','500px'],
            type:1,
            content:$('.get_layer') 
        })
    }

}
