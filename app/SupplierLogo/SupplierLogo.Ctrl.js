angular.module('index_area').controller('SupplierLogolistCtrl', SupplierLogolistCtrl);
SupplierLogolistCtrl.$inject = ['$scope', '$state', '$rootScope', 'NgTableParams', 'PublicResource', '$stateParams', 'SupplierLogoResource', 'SortResource', 'FileUploader'];
/***调用接口***/
function SupplierLogolistCtrl($scope, $state, $rootScope, NgTableParams, PublicResource, $stateParams, SupplierLogoResource, SortResource, FileUploader) {
    document.title = "供应商品牌";
    $rootScope.name = "供应商品牌";
    $rootScope.childrenName = "供应商品牌列表";
    var vm = this;
    vm.seid;
    vm.skip = 0;             //起始数据下标
    vm.limit = 12;            //最大数据下标
    vm.list;
    vm.getlist = new Object();
    vm.sortlist = new Object();             //分类集合
    vm.infolist = new Object();            //数据集合；  

    login();


    /**add
	 * [logo description]
	 * @type {[type]}
	 */
    var logo = vm.logo = new FileUploader({
        url: "/api-admin/attach/upload",
        formData: [{ "device": "pc", "version": "1.0.0", "sessionId": vm.seid }]
    })
    logo.onSuccessItem = function (data, status) {
        if (status.status != "OK") {
            for (var i in vm.logo.queue) {
                vm.logo.queue[i].isSuccess = false;
                vm.logo.queue[i].isError = true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message, { icon: 2 })
        } else {
            console.log(status)
            vm.infolist.logo = status.result;
            vm.logo.queue[0].remove();
        }
    }
    logo.onErrorItem = function () {
        vm.num = 5;
        var time = setInterval(function () {
            vm.num--;
            console.log(11)
            if (vm.num == 0) {
                layer.msg("请求超时,请撤销重试~", { icon: 2 }, function () {
                    clearInterval(time);
                    return false;
                });
            }
        }, 1200)
    }

    /**update
    * [logo description]
    * @type {[type]}
    */
    var logos = vm.logos = new FileUploader({
        url: "/api-admin/attach/upload",
        formData: [{ "device": "pc", "version": "1.0.0", "sessionId": vm.seid }]
    })
    logos.onSuccessItem = function (data, status) {
        if (status.status != "OK") {
            for (var i in vm.logo.queue) {
                vm.logos.queue[i].isSuccess = false;
                vm.logos.queue[i].isError = true;
                console.log(vm.logo.queue[i])
            }
            layer.alert(status.message, { icon: 2 })
        } else {
            console.log(status)
            vm.getlist.logo = status.result;
            vm.logos.queue[0].remove();
        }
    }
    logos.onErrorItem = function () {
        vm.num = 5;
        var time = setInterval(function () {
            vm.num--;
            console.log(11)
            if (vm.num == 0) {
                layer.msg("请求超时,请撤销重试~", { icon: 2 }, function () {
                    clearInterval(time);
                    return false;
                });
            }
        }, 1200)
    }


    /**
     * [opermask 开启遮罩层]
     * @param  {[type]} index [true as false 判断是修改还是新增]
     * @param  {[type]} id    [description]
     * @return {[type]}       [description]
     */
    vm.opermask = function (status, id) {
        var title;
        var ClassName;
        switch (status) {
            case "add":
                title = "新增商品信息";
                ClassName = ".add_div"
                break;
            case "update":
                title = "修改商品信息";
                ClassName = ".update_div"
                get(id);
                break;
            case "get":
                title = "商品信息";
                ClassName = ".get_div"
                get(id);
                break;


        }
        layer.open({
            type: 1,
            title: title,
            area: ['440px', "500px"], //宽高
            content: $(ClassName)
        });
    }

    vm.getBtn = function (id) {
        get(id);
        layer.open({
            type: 1,
            title: "商品信息",
            area: ['440px', "500px"], //宽高
            content: $(".getgood")
        });
    }

    /**
     * [upinfo 模态框按钮]
     * @return {[type]} [description]
     */
    vm.updateBtn = function () {
        update();
    }

    vm.addBtn = function () {
        add();
    }

    vm.delopen = function (id) {
        console.log(id)
        layer.confirm('您确定要删除数据？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            remove(id);
        });
    }


    //查询分类列表
    list(vm.seid, vm.skip, vm.limit);


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





    /**
     * [sortlist 品牌分类集合]
     * @return {[type]} [description]
     */
    function sortlist() {
        SortResource.list(vm.seid).then(function (data) {
            vm.sortlist = data.data.result.root
        })
    }

    /**
    * [infoget 查询单个品牌数据]
    * @param  {[type]} id [品牌ID]
    * @return {[type]}    [description]
    */
    function get(id) {
        SupplierLogoResource.get(vm.seid, id).then(function (data) {
            vm.getlist = data.result;
            console.log(vm.getlist)
        })
    }


    /**
     * [addinfo 新增供应商品牌]
     * @return {[type]} [description]
     */
    function add() {
        SupplierLogoResource.add(vm.seid, vm.infolist).then(function (data) {
            if (data.data.status == "OK") {
                layer.msg("保存成功~", { icon: 1 }, function () {
                    layer.closeAll();
                    //查询分类列表
                    list(vm.seid, vm.skip, vm.limit);
                });
            } else {
                layer.msg(data.data.message, { icon: 0 });
            }
        })
    }

    function remove(id) {
        SupplierLogoResource.remove(vm.seid, id).then(function (data) {
            if (data.status == "OK") {
                layer.msg("删除成功~", { icon: 1 }, function () {
                    layer.closeAll();
                    //查询分类列表
                    list(vm.seid, vm.skip, vm.limit);
                });
            } else {
                layer.msg(data.data.message, { icon: 0 });
            }
        })
    }

    /**
     * 供应商品牌集合
     * @param {Object} seid
     */
    function list() {
        SupplierLogoResource.list(vm.seid, vm.skip, vm.limit).then(function (data) {
            vm.list = data.data.result.data;
            vm.tableParams = new NgTableParams({}, { dataset: vm.list });
            vm.pagecount = data.data.result.total;
            console.log(vm.list)
        })
    }

    /**
     * [updateinfo 修改数据]
     * @return {[type]} [description]
     */
    function update() {
        SupplierLogoResource.update(vm.seid, vm.getlist).then(function (data) {
            if (data.data.status == "OK") {
                list(vm.seid, vm.skip, vm.limit);
                layer.msg("修改成功~", { icon: 1 }, function () {
                    layer.closeAll();
                });
            } else {
                layer.msg(data.data.message, { icon: 0 });
            }
        })
    }

}
