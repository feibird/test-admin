angular.module('index_area').controller('UpdateGoodCtrl',UpdateGoodCtrl);
UpdateGoodCtrl.$inject = ['$state','$rootScope','PublicResource','$stateParams','formatGoodResource','GoodResource'];
/***调用接口***/
function UpdateGoodCtrl($state,$rootScope,PublicResource,$stateParams,formatGoodResource,GoodResource) {
    document.title ="商品详情";
    $rootScope.name="商品管理";
    $rootScope.childrenName="商品详情";
    var vm = this;
    vm.skip=0;				//起始数据下标
    vm.limit=12;			//最大数据下标
    vm.pagecount=60;
    vm.data;                //规格
    vm.updata=new Object();
    vm.matlist=new Array();

    //获取商品id
    vm.id=$stateParams.id;
    console.log(vm.id)

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

    gooddetail(vm.id)

    /*
     * 基本商品
     */
    function gooddetail(id){
        GoodResource.get(vm.seid,id).then(function(data){
            if(data.data.status!="OK"){
                layer.open(data.data.message,{icon:1})
            }else{
                vm.data = data.data.result;
                arrayImage(vm.data)
            }
            console.log(vm.data)
        })
    }



    function arrayImage (data) {
        vm.data.cPhotos =data.cPhotos.split(",");
        vm.data.bPhotos =data.bPhotos.split(",");
        console.log(vm.data)
    }
}