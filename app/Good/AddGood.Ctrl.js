angular.module('index_area').controller('AddGoodCtrl', AddGoodCtrl);
AddGoodCtrl.$inject = ['$state', '$rootScope', 'PublicResource', '$stateParams', 'GoodResource', "SortResource", "SupplierLogoResource", "LabelResource", "BrandStoresResource", 'FileUploader'];
/***调用接口***/
function AddGoodCtrl($state, $rootScope, PublicResource, $stateParams, GoodResource, SortResource, SupplierLogoResource, LabelResource, BrandStoresResource, FileUploader) {
    document.title = "添加规格";
    $rootScope.name = "商品管理";
    $rootScope.childrenName = "添加规格";
    var vm = this;
    vm.skip = 0;				//起始数据下标FileUploader
    vm.limit = 12;			//最大数据下标
    vm.cLogo;
    vm.bLogo;
    vm.cPhotos;
    vm.bPhotos;
    vm.info = new Object();
    vm.info.cLogo = [];
    vm.info.bLogo = [];
    vm.info.cPhotos = [];
    vm.info.bPhotos = [];
    vm.info.name = "";
    vm.info.detail = "";
    vm.info.shortName = "";
    vm.id = $stateParams.id;
    console.log(vm.id)

    //获取sessionId


    login();

    inital();
    function inital() {
        sortlist();
        brandlist();
        labellist();
        logolist();
    }

    vm.addBtn = function () {
        console.log(vm.info);
        add();
    }



    /**
	 * [bPhotos description]
	 * @type {[type]}
	 */
    var bPhotos = vm.bPhotos = new FileUploader({
        url: "/api-admin/attach/upload",
        formData: [{ "device": "pc", "version": "1.0.0", "sessionId": vm.seid }]
    })
    bPhotos.onSuccessItem = function (data, status) {
        if (status.status != "OK") {
            for (var i in vm.bPhotos.queue) {
                vm.bPhotos.queue[i].isSuccess = false;
                vm.bPhotos.queue[i].isError = true;
                console.log(vm.bPhotos.queue[i])
            }
            layer.alert(status.message, { icon: 2 })
        } else {
            console.log(status)
            vm.info.bPhotos.push(status.result);
            vm.bPhotos.queue[0].remove();
        }
    }
    bPhotos.onErrorItem = function () {
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
	 * [cPhotos description]
	 * @type {[type]}
	 */
    var cPhoto = vm.cPhotos = new FileUploader({
        url: "/api-admin/attach/upload",
        formData: [{ "device": "pc", "version": "1.0.0", "sessionId": vm.seid }]
    })

    cPhoto.onSuccessItem = function (data, status) {
        if (status.status != "OK") {
            for (var i in vm.cPhotos.queue) {
                vm.cPhotos.queue[i].isSuccess = false;
                vm.cPhotos.queue[i].isError = true;
                console.log(vm.cPhotos.queue[i])
            }
            layer.alert(status.message, { icon: 2 })
        } else {
            console.log(status)
            vm.info.cPhotos.push(status.result);
            vm.cPhotos.queue[0].remove();
        }
    }
    cPhoto.onErrorItem = function () {
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
	 * bLogo
	 */
    var bLogo = vm.bLogo = new FileUploader({
        url: "/api-admin/attach/upload",
        formData: [{ "device": "pc", "version": "1.0.0", "sessionId": vm.seid }],
        queueLimit: 1
    })
    bLogo.onSuccessItem = function (data, status) {
        if (status.status != "OK") {
            for (var i in vm.bLogo.queue) {
                vm.bLogo.queue[i].isSuccess = false;
                vm.bLogo.queue[i].isError = true;
                console.log(vm.bLogo.queue[i])
            }
            layer.alert(status.message, { icon: 2 })
        } else {
            console.log(status)
            vm.info.bLogo[0] = status.result;
            vm.bLogo.queue[0].remove();
        }
    }
    bLogo.onErrorItem = function () {
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
	 * cLogo
	 */
    var cLogo = vm.cLogo = new FileUploader({
        url: "/api-admin/attach/upload",
        formData: [{ "device": "pc", "version": "1.0.0", "sessionId": vm.seid }],
        queueLimit: 1
    })
    cLogo.onSuccessItem = function (data, status) {
        if (status.status != "OK") {
            for (var i in vm.cLogo.queue) {
                vm.cLogo.queue[i].isSuccess = false;
                vm.cLogo.queue[i].isError = true;
                console.log(vm.cLogo.queue[i])
            }
            layer.alert(status.message, { icon: 2 })
        } else {
            console.log(status)
            vm.info.cLogo[0] = status.result;
            vm.cLogo.queue[0].remove();
        }
    }
    cLogo.onErrorItem = function () {
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
    function add() {
        GoodResource.add(vm.seid, vm.info).then(function (data) {
            console.log(data)
            if (data.data.status == "OK") {
                layer.confirm('商品添加成功~是否添加商品规格？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.closeAll()
                    $state.go('format', { id: data.data.result })
                });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }
    function arrayImage(data) {
        vm.data.cPhotos = data.cPhotos.split(",");
        vm.data.bPhotos = data.bPhotos.split(",");
        console.log(vm.data)
    }

    function sortlist() {
        SortResource.list(vm.seid, 0, 0).then(function (data) {
            console.log(data.data.result);
            vm.sortlist = data.data.result;
        })
    }

    function brandlist() {
        BrandStoresResource.list(vm.seid, 0, 0).then(function (data) {
            console.log(data.data.result);
            vm.brandlist = data.data.result;
        })
    }


    function logolist() {
        SupplierLogoResource.list(vm.seid, 0, 0).then(function (data) {
            console.log(data.data.result);
            vm.logolist = data.data.result;
        })
    }


    function labellist() {
        LabelResource.list(vm.seid, 0, 0).then(function (data) {
            console.log(data.data.result);
            vm.labellist = data.data.result;
        })
    }

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
}