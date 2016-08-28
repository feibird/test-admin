angular.module('index_area').directive('stores', function (NgTableParams) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			list: "=",
			selectlist:'='
		},
		templateUrl: 'Template/StoresSelect.html',
		link: function (scope, elem, attr) {
			for(var i in scope.list){
				scope.list[i].select=true;
				scope.list[i].status=false;
			}
			scope.selectList = new Array();
			scope.tableParams = new NgTableParams({}, { dataset: scope.list });

			//添加门店
			scope.Add = function(item){
				if(item){
					item.select=false;
					item.status=true;
					item.active=false;
					scope.selectList.push(item);
				}else{
					for(var i in scope.list){
						console.log(scope.list[i])
						if(scope.list[i].select==true){
							scope.list[i].select=false;
							scope.list[i].status=true;
							scope.list[i].active=false;
							scope.selectList.push(scope.list[i])
						}
					}
				}
				scope.tableStores = new NgTableParams({},{dataset:scope.selectList})
			}

			scope.All = function(is,item){
				console.log(is)
					switch(item){
							case "AddStore":
								for(var i in scope.list){
									if(is){
											scope.list[i].status=true;
									}else{
											scope.list[i].status=false;
									}
								}
							break;
							case "DelStore":
								for(var i in scope.selectList){
									if(is){
										scope.selectList[i].active=true;
									}else{
										scope.selectList[i].active=false;
									}
								}
							break;
					}
			}

			scope.Del = function(index){
				if(!index){
					
					for(var i in scope.selectList){
						if(scope.selectList[i].active){
							console.log(scope.selectList[i])							
							for(var j in scope.list){
								if(scope.list[j].id==scope.selectList[i].id){
									scope.list[j].status=false;
									scope.list[j].select=true;
								}
							}
							scope.selectList.splice(i,1);
						}
					}
					
				}else{
					for(var i in scope.list){
					if(scope.list[i].id==scope.selectList[index].id){
							scope.list[i].status=false;
							scope.list[i].select=true;
						}
					}
				scope.selectList.splice(index,1)
				}
				
				scope.tableStores = new NgTableParams({},{dataset:scope.selectList})
			}

			

		}
	}
})
