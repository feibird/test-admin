angular.module('index_area').directive('stores', function (NgTableParams) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			list: "=",
			returnlist: '='
		},
		templateUrl: 'Template/StoresSelect.html',
		link: function (scope, elem, attr) {
			for (var i in scope.list) {
				scope.list[i].select = true;
				scope.list[i].status = false;
			}

			scope.select = new Array();
			
			//添加门店
			scope.Add = function (item) {
				if (item) {
					item.select = false;
					item.status = true;
					item.active = false;
					scope.select.push(item);
				} else {
					for (var i in scope.list) {
						console.log(scope.list[i])
						if (scope.list[i].select == true) {
							scope.list[i].select = false;
							scope.list[i].status = true;
							scope.list[i].active = false;
							scope.select.push(scope.list[i])
						}
					}
				}
			}

			scope.All = function (is, item) {
				console.log(is)
				switch (item) {
					case "AddStore":
						for (var i in scope.list) {
							if (is) {
								scope.list[i].status = true;
							} else {
								scope.list[i].status = false;
							}
						}
						break;
					case "DelStore":
						for (var i in scope.select) {
							if (is) {
								scope.select[i].active = true;
							} else {
								scope.select[i].active = false;
							}
						}
						break;
				}
			}

			scope.Del = function (id,index) {
				if (false) {
					for (var i in scope.select) {
						if (scope.select[i].active) {
							console.log(scope.select[i])
							for (var j in scope.list) {
								if (scope.list[j].id == scope.select[i].id) {
									scope.list[j].status = false;
									scope.list[j].select = true;
								}
							}
							scope.select.splice(i,1);
						}
					}

				} else {
					scope.select.splice(index, 1);
					for(var i in scope.list){
						if(scope.list[i].id==id){
							scope.list[i].status=false;
							scope.list[i].select=true;
						}
					}
				}
			}

		}
	}
})
