angular.module('index_area').controller('BrandStoreslistCtrl',BrandStoreslistCtrl);
BrandStoreslistCtrl.$inject = ['$state','$scope','$rootScope','NgTableParams','PublicResource','BrandStoresResourrce','SortResource','$stateParams'];
/***调用接口***/
function BrandStoreslistCtrl($state,$scope,$rootScope,NgTableParams,PublicResource,BrandStoresResourrce,SortResource,$stateParams) {
    document.title ="连锁品牌管理";
	$rootScope.name="连锁品牌管理";
	$rootScope.childrenName="连锁品牌管理列表";
    var vm = this;
	vm.seid
    vm.pagecount;															//分页总数
    vm.pageint=1;															//当前分页导航
    vm.skip=0																//从第几个开始
    vm.limit=12;															//从第几个结束
	vm.addinfo;																//添加数据对象
	vm.list;																//数据列表集合
	vm.sortlist;															//分类列表集合
	vm.seletedId;															
	vm.updateinfo;															//修改数据对象
    vm.pageChanged = function(){       
       vm.skip = (vm.pageint-1)*12;
       vm.limit = vm.skip+12;
       info_list(vm.seid);
    }
    
    //获取页面坐标
    vm.index=$stateParams.index;    
    PublicResource.navclass(vm.index)
    /**
     * 删除
     */
    vm.delinfo = function(id){
    	console.log(id)
    	layer.confirm('您确定要删除品牌？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			BrandStoresResourrce.removelist(id,vm.seid).then(function(data){
				console.log(data);
				if (data.data.status=="OK") {					
					layer.alert('删除成功~',{icon: 1});					
				} else{
					layer.alert(data.data.message.data,{icon: 0});
				}
				info_list(vm.seid);
			})
		  
		});
    }
	
	//获取sessionId
	login();
	sortlist();
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
    
    //查询分类列表
   info_list(vm.seid);
    
    //开启模态框
	vm.openmask = function(index){		
			$scope.$apply();
			
		/*console.log(index);
		vm.addinfo.id=index;*/
		layer.open({
		  type: 1,
		  title:false,
		  area: ['440px', '515px'], //宽高
		  content:$(".info_add")
		});
		SortResource.list(vm.seid).then(function(data){
			vm.sortlist = data.data.result.root
			console.log(vm.sortlist)
		})
	}
	
	//关闭弹出层
	vm.closechildren = function(){		
		layer.closeAll();
	}
	
	//新增子类
	vm.childrenbtn = function(has){		
		BrandStoresResourrce.addlist(vm.addinfo,vm.seid).then(function(data){			
			console.log(data.status)
			if(data.data.status=="OK"){				
				if(!has){
					layer.closeAll();
				}
				layer.msg("添加成功~");
				info_list(vm.seid);
			}
		})
	}
	
	//获取单个数据
	vm.updateinfo = function(list){
		vm.updateinfo = list;
		layer.open({
		  type: 1,
		  title:false,
		  area: ['440px', '515px'], //宽高
		  content:$(".info_update")
		});

	}
	
	
	/**
	 * 连锁品牌集合
	 * @param {Object} seid
	 */
	function info_list(){
		 BrandStoresResourrce.list(vm.seid,vm.skip,vm.limit).then(function(data){
	    	vm.list=data.data.result;
			vm.tableParams = new NgTableParams({},{dataset:vm.list.data});
	    	vm.pagecount = data.data.result.total
	    	console.log(data)
	    })
	}

	function sortlist(){
		SortResource.list(vm.seid).then(function(data){
		 vm.sortlist = data.data.result.root
		 console.log(vm.sortlist)
		 })
	}

	/**
	 *图片上传
	 */
	$('.loadBtn').on('click', function() {
		var imgobj = ("upload",$(".Uploadinput").get(0).files[0]);
		PublicResource.imgUpload(vm.seid,imgobj).then(function(data){			
			if(data.status=="OK"){
				console.log(data)
				layer.alert("上传成功~",{icon:1});
				$("#upform .uploadimg").attr("src",data.result);
				vm.addinfo.imgUrl= data.result;
			}else{
				layer.msg('删除异常，请联系管理员~',{icon: 0});
			}
		})
	});


	vm.addlist = function(){		
		BrandStoresResourrce.addlist(vm.addinfo,vm.seid).then(function(data){
			console.log(data)
			if (data.data.status=="OK") {
				layer.alert("上传成功~",{icon:1},function(){
					layer.closeAll();
				});
				info_list(vm.seid);
			}else{
				layer.alert(data.message,{icon:0});
			}
		})
	}

	//修改数据
	vm.upinfo = function(){		
		console.log(vm.updateinfo)
		BrandStoresResourrce.updateinfo(vm.updateinfo,vm.seid).then(function(data){
			if (data.data.status=="OK") {
				layer.msg("修改成功~",{icon:1},function(){
					layer.closeAll();
				});
				info_list(vm.seid);
			}else{
				layer.msg("修改异常~请联系程序员",{icon:0});
			}
		})
	}
}
