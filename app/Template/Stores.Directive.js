angular.module('index_area').directive('stores', function (NgTableParams) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			list: "="
		},
		templateUrl: 'Template/StoresSelect.html',
		link: function (scope, elem, attr) {
			for(var i in scope.list){
				scope.list[i].select=true;
				scope.list[i].status=false;
			}
			scope.select = new Array();
			scope.tableParams = new NgTableParams({}, { dataset: scope.list });

			//添加门店
			scope.Add = function(item){
					item.select=false;
					item.status=true;
					scope.select.push(item);
					scope.tableStores = new NgTableParams({},{dataset:scope.select})
			}

			scope.All = function(is,item){
				console.log(is)
					switch(item){
							case "AddStore":
								for(var i in scope.list){
										if(is){
												scope.list[i].status=false;
										}else{
												scope.list[i].status=true;
										}
								}
							break;
							case "DelStore":

							break;
					}
			}

			scope.del = function(id){

			}

		}
	}
})
