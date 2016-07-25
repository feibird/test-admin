angular.module('index_area').controller('LabellistCtrl',LabellistCtrl);
LabellistCtrl.$inject = ['$scope','$state','$rootScope','PublicResource','LabelResourrce','$stateParams','BrandStoresResourrce','NgTableParams'];
/***调用接口***/
function LabellistCtrl($scope,$state,$rootScope,PublicResource,LabelResourrce,$stateParams,BrandStoresResourrce,NgTableParams) {
    document.title ="标签管理";
	$rootScope.name="标签管理";
	$rootScope.childrenName="标签管理列表";
    var vm = this;
	vm.seid
    vm.pagecount;															//分页总数
    vm.pageint=1;															//当前分页导航
	vm.list;
    
	//获取sessionId
	login()
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
    
     //当前用户状态
   /* PublicResource.verification(vm.seid).then(function(data){
    	console.log(data)
    })*/
    
    //查询标签列表
   list(vm.seid);
    
 
	/**
	 * 标签集合
	 * @param {Object} seid
	 */
	function list(){
		 LabelResourrce.list(vm.seid,vm.skip,vm.limit).then(function(data){
	    	vm.list=data.data.result;	  
	    	console.log(vm.list);
	    	vm.tableParams = new NgTableParams({},{dataset:vm.list});  	
	    })
	}

	/*
	 *获取连锁品牌
	 */
	function logo () {
		 BrandStoresResourrce.list(vm.seid,0,0).then(function (data) {
		 	vm.logolist = data.data.result.data;

		 	 console.log(data)
		 }) 
	}

	/**
	 * 获取单个数据
	 * @param {Object} seid
	 */
	function get(id){		
		LabelResourrce.get(vm.seid,id).then(function(data){			
			vm.info = data.data.result;
			console.log(vm.info)
		})
	}
	function add (info) {
		 LabelResourrce.add(vm.seid,vm.info).then(function(data){			
			if(data.data.status="OK"){
				layer.alert("添加成功~",{icon:1},function (index) {
					 info_list(vm.seid);
					 layer.closeAll();
				})
			}else {
				layer.alert(data.data.message,{icon:2})
			}
			console.log(vm.info)
		})  
	}

	function update (info) {
		  LabelResourrce.update(vm.seid,vm.info).then(function(data){			
			if (data.data.status=="OK") {
				layer.alert('编辑成功~',{icon:1},function (index) {
					  info_list(vm.seid);
					  layer.closeAll();
				})
			}else {
				layer.alert(data.data.message,{icon:2})
			}
		})  
	}

	function del(id) {
		  LabelResourrce.remove(vm.seid,id).then(function(data){			
			if (data.data.status=="OK") {
				layer.alert('删除成功~',{icon:1},function (index) {
					  info_list(vm.seid);
					  layer.closeAll();
				})
			}else {
				layer.alert(data.data.message,{icon:2})
			}
		})  
	}
}
