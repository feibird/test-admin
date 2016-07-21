angular.module('index_area').controller('SupplierLogolistCtrl',SupplierLogolistCtrl);
SupplierLogolistCtrl.$inject = ['$scope','$state','$rootScope','NgTableParams','PublicResource','$stateParams','SupplierLogoResourrce','SortResource'];
/***调用接口***/
function SupplierLogolistCtrl($scope,$state,$rootScope,NgTableParams,PublicResource,$stateParams,SupplierLogoResourrce,SortResource) {
    document.title ="供应商品牌";
    $rootScope.name="供应商品牌";
    $rootScope.childrenName="供应商品牌列表";
    var vm = this;
    vm.seid;
    vm.pagecount;
    vm.pageint=1;
    vm.skip=0;             //起始数据下标
    vm.limit=12;            //最大数据下标
    vm.list;
    vm.sortlist;             //分类集合
    vm.infolist;            //数据集合；  
    vm.if_status;  
    //获取页面坐标
    vm.index=$stateParams.index;    
    PublicResource.navclass(vm.index)
    login();
    /**
     * [opermask 开启遮罩层]
     * @param  {[type]} index [true as false 判断是修改还是新增]
     * @param  {[type]} id    [description]
     * @return {[type]}       [description]
     */
    vm.opermask = function(id){        
        sortlist();             //查询分类集合
        if(id=="yes"){
            vm.infolist=null;
            vm.if_status=0;
        }else{
            vm.if_status=1;
            infoget(id)             //查询品牌数据
        }
        layer.open({
          type: 1,
          title:false,
          area: ['440px', 'auto'], //宽高
          content:$(".info_div")
        });            
    }
    
    vm.opengood = function(id){
    	infoget(id); 
    	layer.open({
          type: 1,
          title:"商品信息",
          area: ['440px',"500px"], //宽高
          content:$(".getgood")
        }); 
    }

    /**
     * [upinfo 模态框按钮]
     * @return {[type]} [description]
     */
    vm.upinfo = function(){
        if(vm.if_status==1){
            updateinfo();
        }else{
            Addinfo();
        }
    }

    vm.delopen = function(id){
        console.log(id)
        layer.confirm('您确定要删除数据？', {
              btn: ['确定','取消'] //按钮
        }, function(){
            removeinfo(id);
        });
    }
      

     //查询分类列表
    info_list(vm.seid,vm.skip,vm.limit);

    
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
    

    /**
     * 供应商品牌集合
     * @param {Object} seid
     */
    function info_list(){
         SupplierLogoResourrce.list(vm.seid,vm.skip,vm.limit).then(function(data){            
             vm.list=data.data.result.data;
            vm.tableParams = new NgTableParams({},{dataset:vm.list});                      
            vm.pagecount = data.data.result.total;
            console.log(vm.list)
        })
    }

    /**
     * [updateinfo 修改数据]
     * @return {[type]} [description]
     */
    function updateinfo(){
        SupplierLogoResourrce.updateinfo(vm.seid,vm.infolist).then(function(data){
            if(data.status=="OK"){
                info_list(vm.seid,vm.skip,vm.limit);
                layer.msg("修改成功~",{icon:1},function(){
                     layer.closeAll();                    
                });                
            }else{
                layer.msg("修改失败~，请联系程序猿~",{icon:0});
            }
        })
    }

    /**
     * [infoget 查询单个品牌数据]
     * @param  {[type]} id [品牌ID]
     * @return {[type]}    [description]
     */
    function infoget(id){
        SupplierLogoResourrce.infoget(vm.seid,id).then(function(data){
            vm.infolist = data.result;
            console.log(vm.infolist)
        })
    }

    /**
     * [sortlist 品牌分类集合]
     * @return {[type]} [description]
     */
    function sortlist(){
        SortResource.list(vm.seid).then(function(data){
            vm.sortlist = data.data.result.root
        })
    }

    /**
     * [addinfo 新增供应商品牌]
     * @return {[type]} [description]
     */
    function Addinfo(){        
        SupplierLogoResourrce.addlist(vm.seid,vm.infolist).then(function(data){
             if(data.status=="OK"){
                layer.msg("保存成功~",{icon:1},function(){
                    layer.closeAll();
                     //查询分类列表
                    info_list(vm.seid,vm.skip,vm.limit);
                });                            
            }else{
                layer.msg('保存异常，请联系管理员~', {icon: 0});
            }
        })
    }

    /**
     *图片上传
     */
    $('.loadBtn').on('click', function() {
        var _this = $(this);
        var imgobj = ("upload",$(".Uploadinput").get(0).files[0]);        
        PublicResource.imgUpload(vm.seid,imgobj).then(function(data){            
            if(data.status=="OK"){
                layer.msg("上传成功~",{icon:1},function(){                    
                    vm.infolist.logo=data.result;
                     info_list(vm.seid,vm.skip,vm.limit);
                });            
            }else{
                layer.msg('上传异常，请联系管理员~', {icon: 0});
            }
        })
    });
    

    function removeinfo(id){
       SupplierLogoResourrce.dellist(vm.seid,id).then(function(data){
             if(data.status=="OK"){
                layer.msg("删除成功~",{icon:1},function(){
                    layer.closeAll();
                     //查询分类列表
                    info_list(vm.seid,vm.skip,vm.limit);
                });                            
            }else{
                layer.msg('删除异常，请联系管理员~', {icon: 0});
            }
        }) 
    }

}
