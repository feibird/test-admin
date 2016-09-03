angular.module('index_area').directive('stores', function (StoresResource,$rootScope) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			returnlist: '='
		},
		templateUrl: 'Template/StoresSelect.html',
		link: function (scope, elem, attr) {
			scope.seid = $rootScope.seid;
			scope.skip = 0;
			scope.limit = 10;

			scope.returnlist = new Array();
			
			scope.pageChanged = function(){
				scope.skip = (scope.pageint-1)*scope.limit;
				store();
			}
			store()
			function store(){
				StoresResource.list(scope.seid,scope.skip,scope.limit).then(function(data){
					scope.list = data.data.result.data;
					for (var i in scope.list) {
							scope.list[i].select = true;
							scope.list[i].status = false;
						}

					scope.pagecount=data.data.result.total;
				})
			}

			scope.All = function(is,all){
                switch(all){
                    case "add":
                        for(var i in scope.list){
                            scope.list[i].status=is;
                        }
                    break;
                    case "del":
                        for(var i in scope.returnlist){
                            scope.returnlist[i].active=is;
                        }
                    break;
                }
            }

			//添加门店
			scope.Add = function (item) {
				
				if (item) {
					item.select = false;
					item.status = true;
					item.active = false;
					scope.returnlist.push(item);
				} else {
					for (var i in scope.list) {
						if (scope.list[i].status == true&&scope.list[i].select==true) {
							scope.list[i].select = false;
							scope.list[i].status = true;
							scope.list[i].active = false;
							scope.returnlist.push(scope.list[i])
						}
					}
				}
			}

			
			//批量删除/删除
			scope.Del = function (id,index,is) {
				if (is) {
					for (var i in scope.returnlist) {
						if (scope.returnlist[i].active) {
							for (var j in scope.list) {
								if (scope.list[j].id == scope.returnlist[i].id) {
									scope.list[j].status = false;
									scope.list[j].select = true;
								}
							}
							scope.returnlist.splice(i,1);
						}
					}

				} else {
					scope.returnlist.splice(index, 1);
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
