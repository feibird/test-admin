angular.module('index_area').directive('prems', function (PremResource,$rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            returnlist: '='
        },
        templateUrl: 'Template/PremSelect.html',
        link: function (scope, elem, attr) {
            scope.pagecount;
            scope.skip=0;
            scope.limit=10;
            scope.seid = $rootScope.seid;
            Prems();

            scope.pageChanged = function(){
                scope.skip = (scope.pageint-1)*scope.limit;
				Prems();
            }

            function Prems(){
                PremResource.list(scope.seid,scope.skip,scope.limit).then(function(data){
                    scope.list = data.data.result;
                    console.log(scope.list)
                    for(var i in scope.list){
                        scope.list[i].status=true;
                        scope.list[i].active=false;
                    }
                    vs();
                    scope.pagecount = data.data.result.total;
                })
            }

            function vs(){
                console.log(scope.list)
                console.log(scope.returnlist)
				for(var i in scope.list){
					for(var j in scope.returnlist){
						if(scope.list[i].id==scope.returnlist[j].id){
							scope.list[i].status = false;
							scope.list[i].active = true;
						}
					}
				}
			}

            //批量删除,删除
            scope.Add = function(item){
                if (item) {	
					item.status = false;
					item.active = true;
					scope.returnlist.push(item);
				} else {
					for (var i in scope.list) {
						if (scope.list[i].status == true&&scope.list[i].active==true) {
							scope.list[i].status = false;
							scope.list[i].active = true;
							scope.returnlist.push(scope.list[i])
						}
					}
				}
            }

            scope.All = function(is,all){
                switch(all){
                    case "add":
                        for(var i in scope.list){
                            scope.list[i].active=is;
                        }
                    break;
                    case "del":
                        for(var i in scope.returnlist){
                            scope.returnlist[i].check=is;
                        }
                    break;
                }
            }

            //批量删除/删除
			scope.Del = function (id,index,is) {
				if (is) {
					for (var i in scope.returnlist){
						if (scope.returnlist[i].check) {
							for (var j in scope.list) {
								if (scope.list[j].id == scope.returnlist[i].id) {
									scope.list[j].status = true;
									scope.list[j].active = false;
								}
							}
							scope.returnlist.splice(i,1);
						}
					}

				} else {
					scope.returnlist.splice(index, 1);
					for(var i in scope.list){
						if(scope.list[i].id==id){
							scope.list[i].status = true;
                            scope.list[i].active = false;
						}
					}
				}
			}
        }
    }
})
