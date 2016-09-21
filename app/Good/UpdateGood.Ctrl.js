angular.module('index_area').controller('UpdateGoodCtrl', UpdateGoodCtrl);
UpdateGoodCtrl.$inject = ['$state', '$rootScope', 'PublicResource', '$stateParams', 'FormatResource', 'GoodResource', 'FileUploader', "SortResource", "SupplierLogoResource", "LabelResource", "BrandStoresResource"];
/***调用接口***/
function UpdateGoodCtrl($state, $rootScope, PublicResource, $stateParams, FormatResource, GoodResource, FileUploader, SortResource, SupplierLogoResource, LabelResource, BrandStoresResource) {
    document.title = "商品详情";
    $rootScope.name = "商品管理";
    $rootScope.childrenName = "商品详情";
    var vm = this;
    vm.skip = 0;				//起始数据下标
    vm.limit = 12;			//最大数据下标
    vm.data;                //规格;

    vm.test = { name: "测试", id: 1, sic: { name: 1, id: 2 } }

    //获取商品id
    vm.id = $stateParams.id;
    console.log(vm.id)

    //获取sessionId

    vm.updateBtn = function () {
        console.log(vm.data)
        update();
    }

    login();
    init();
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

    gooddetail(vm.id)

    /*
     * 基本商品
     */
    function gooddetail(id) {
        GoodResource.get(vm.seid, id).then(function (data) {
            if (data.data.status != "OK") {
                layer.msg(data.data.message, { icon: 1 })
            } else {
                vm.data = data.data.result;
                arrayImage(vm.data)
            }
            console.log(vm.data)
        })
    }

    function arrayImage(data) {
        vm.data.cPhotos = data.cPhotos.split(",");
        vm.data.bPhotos = data.bPhotos.split(",");
        console.log(vm.data)
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

    function update() {
        GoodResource.update(vm.seid, vm.data).then(function (data) {
            console.log(data);
            if (data.data.status == "OK") {
                layer.msg('修改成功~', { icon: 1 });
            } else {
                layer.msg(data.data.message, { icon: 2 })
            }
        })
    }

    function init() {
        SortResource.list(vm.seid, 0, 0).then(function (data) {
            vm.sortlist = data.data.result;
            console.log(vm.sortlist)
        })

        SupplierLogoResource.list(vm.seid, 0, 0).then(function (data) {
            vm.brandlist = data.data.result;
            console.log(vm.brandlist)
        })

        BrandStoresResource.list(vm.seid, 0, 0).then(function (data) {
            vm.providerBrandlist = data.data.result;
            console.log(vm.providerBrandlist)
        })

        LabelResource.list(vm.seid).then(function (data) {
            vm.labellist = data.data.result;
            console.log(vm.labellist)
        })
    }
}