angular.module('index_area').controller('LabellistCtrl', LabellistCtrl);
LabellistCtrl.$inject = ['$scope', '$state', '$rootScope', 'PublicResource', 'LabelResource', '$stateParams', 'BrandStoresResource', 'NgTableParams'];
/***调用接口***/
function LabellistCtrl($scope, $state, $rootScope, PublicResource, LabelResource, $stateParams, BrandStoresResource, NgTableParams) {
    document.title = "标签管理";
	$rootScope.name = "标签管理";
	$rootScope.childrenName = "标签管理列表";
    var vm = this;
	vm.skip = 0
	vm.limit = 12;
	vm.seid
    vm.pageint = 1;															//当前分页导航
	vm.list;

	//获取sessionId
	login()
	function login() {
		vm.user = PublicResource.seid("admin");
		if (typeof (vm.user) == "undefined") {
			layer.msg("尚未登录！", { icon: 2 }, function (index) {
				layer.close(index);
				PublicResource.Urllogin();
			})
		} else {
			vm.seid = PublicResource.seid(vm.user);
		}
	}

	//当前用户状态
	/* PublicResource.verification(vm.seid).then(function(data){
		 console.log(data)
	 })*/

	vm.updateBtn = function (data) {
		console.log(data)
		if (data.status) {
			data.status = false;
			if (update(data)) {
				data.status = false;
			}
		} else {

			data.status = true;
		}
	}

	vm.addBtn = function (list) {
		console.log(list)
		add(list);
	}

	vm.delBtn = function (id) {
		layer.confirm('您确定要删除标签？', {
			btn: ['确定', '取消'] //按钮
		},
			function () {
				del(id)
			})
	}

    //查询标签列表
	list(vm.seid);
	logo()

	/**
	 * 标签集合
	 * @param {Object} seid
	 */
	function list() {
		LabelResource.list(vm.seid, vm.skip, vm.limit).then(function (data) {
			vm.list = data.data.result.data;
			for (var i in vm.list) {
				vm.list[i].status = false;
			}
			console.log(vm.list);
			vm.tableParams = new NgTableParams({}, { dataset: vm.list });
		})
	}

	/*
	 *获取连锁品牌
	 */
	function logo() {
		BrandStoresResource.list(vm.seid, 0, 0).then(function (data) {
			vm.logolist = data.data.result.data;
			console.log(vm.logolist)
		})
	}

	/**
	 * 获取单个数据
	 * @param {Object} seid
	 */
	function get(id) {
		LabelResource.get(vm.seid, id).then(function (data) {
			vm.info = data.data.result;
			console.log(vm.info)
		})
	}
	function add(info) {
		console.log(info)
		LabelResource.add(vm.seid, info).then(function (data) {
			if (data.data.status = "OK") {
				layer.msg("添加成功~", { icon: 1 }, function (index) {
					list(vm.seid);
					layer.closeAll();
				})
			} else {
				layer.msg(data.data.message, { icon: 2 })
			}
			console.log(vm.info)
		})
	}

	function update(info) {
		LabelResource.update(vm.seid, info).then(function (data) {
			if (data.data.status == "OK") {
				layer.msg('编辑成功~', { icon: 1 }, function (index) {
					list(vm.seid);
					layer.closeAll();
				})
				return true;
			} else {
				layer.msg(data.data.message, { icon: 2 })
				return false;
			}
		})
	}

	function del(id) {
		LabelResource.remove(vm.seid, id).then(function (data) {
			if (data.data.status == "OK") {
				layer.msg('删除成功~', { icon: 1 }, function (index) {
					list(vm.seid);
					layer.closeAll();
				})
			} else {
				layer.msg(data.data.message, { icon: 2 })
			}
		})
	}
}
