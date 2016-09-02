angular.module('index_area').controller('SortlistCtrl',SortlistCtrl);
SortlistCtrl.$inject = ['$scope','$rootScope','$state','SortResource','PublicResource',"$stateParams"];
/***调用接口***/
function SortlistCtrl($scope,$rootScope,$state,SortResource,PublicResource,$stateParams) {
    document.title ="分类管理";
	$rootScope.name="分类管理";
	$rootScope.childrenName="分类管理列表";
    var vm = this;
	vm.seid
    vm.pagecount=60;
    vm.pageint=5;
    vm.list;						//对象集合
    vm.addinfo= new Object;			//新增分类对象
	vm.addinfo.id=1;
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
    
    //查询分类列表
   list(vm.seid);
    
	
	//关闭弹出层
	vm.closechildren = function(){		
		layer.closeAll();
	}
	
	//新增子类
	vm.childrenbtn = function(has){
		console.log(has )
		SortResource.addlist(vm.addinfo,vm.seid).then(function(data){			
			console.log(data)
			if(data.data.status=="OK"){				
				if(!has){
					layer.closeAll();
				}
				layer.alert("添加成功~",{icon:1});
				list(vm.seid);
			}else{
				layer.alert(data.data.message,{icon:2})
			}
		})
	}
	
	vm.updatebtn = function(){
		updatechildren(vm.updateid,vm.updatename);
	}
	
	//删除节点
	vm.del = function(id){
		layer.confirm('您确定要删除分类？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			remove(id)
		  
		});
	}
	
	vm.getlist = function(id){
		get(id)
	}
	
	
	/**
	 * 收起分类
	 */
	vm.hidechildren = function(){
		for (var item in vm.list.children) {
			vm.list.children[item].status=1;
		}
	}
	
	/**
	 * 展开分类
	 */
	vm.toggle = function(item){
		console.log(item);
		if(item.status==1){
			item.status=0;
			vm.open=true;
		}else{
			item.status=1;
		}
	}

	vm.addbtn = function(data,is){	
		console.log(data);
		add(data)
	}

	/**
	 * 编辑
	 */
	vm.edit = function(data){
		if(data.isedit){
			data.isedit=false;
			data.btnName="编辑";
			update(data.data.id,data.data.name)
		}else{
			data.isedit=true;
			data.btnName="保存";
		}
	}

	/**
	 * 添加
	 */
	function add(datainfo){		
		console.log(datainfo)
		SortResource.add(vm.seid,datainfo).then(function(data){
			if(data.data.status=="OK"){
				layer.msg('添加成功',{icon:1});
			}else{
				layer.msg(data.data.message,{icon:2});
			}
			list(vm.seid);
		})
	}

	/**
	 * 修改
	 */
	function update(id,name){
		SortResource.update(vm.seid,id,name).then(function(data){
			console.log(data.data.result);
			if(data.data.status=="OK"){
				layer.msg("修改成功",{icon:1});
			}else{
				layer.msg(data.data.message,{icon:2});
			}
			list(vm.seid);
		})
	}

	/**
	 * 分类集合
	 * @param {Object} seid
	 */
	function list(seid){
		 SortResource.list(vm.seid).then(function(data){
	    	vm.list=data.data.result.root;
	    	for (var item in vm.list.children) {
	    		vm.list.children[item].status=0;
				vm.list.children[item].isedit=false;
				vm.list.children[item].btnName="编辑";
				for(var list in vm.list.children[item].children){
					vm.list.children[item].children[list].isedit=false;
					vm.list.children[item].children[list].btnName="编辑";
				}
	    	}
	    	console.log(vm.list)
	    })
	}

	/**
	 * 删除
	 */
	function remove(id){
		console.log(id);
		SortResource.remove(vm.seid,id).then(function(data){				
			if (data.data.status=="OK") {					
				layer.alert('删除成功~', {icon: 1});
				list(vm.seid);
			} else{
				layer.alert(data.data.message,{icon:2})
			}
			
		})
	}
	
	
}