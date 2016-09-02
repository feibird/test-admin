angular.module('index_area').directive('goods', function (GoodResource,$rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            list: "=",
            returnlist: '='
        },
        templateUrl: 'Template/GoodsSelect.html',
        link: function (scope, elem, attr) {
            scope.list = ArryAnalysis(scope.list);
            scope.pagecount;
            scope.skip=0;
            scope.limit=10;
            scope.seid = $rootScope.seid;
            Goods();

            scope.pageChanged = function(){
                scope.skip = (scope.pageint-1)*scope.limit;
				Goods();
            }

            function Goods(){
                GoodResource.list(scope.seid,null,scope.skip,scope.limit).then(function(data){
                    scope.list = data.data.result.data;
                    scope.pagecount = data.data.result.total;
                    scope.list = ArryAnalysis(scope.list)
                    console.log(scope.list)
                })
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
                console.log(all)
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
						if (scope.returnlist[i].active) {
							for (var j in scope.list) {
								if (scope.list[j].spec.id == scope.returnlist[i].spec.id) {
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
						if(scope.list[i].spec.id==id){
                            console.log(scope.list[i])
							scope.list[i].status = true;
                            scope.list[i].active = false;
						}
					}
				}
			}

            //list转
            function ArryAnalysis(obj) {
                var good = new Object();
                var GoodSpecs = new Array();
                good.categories = new Object();
                for (var i in obj) {
                    for (var j in obj[i].specs) {
                        good.name = obj[i].name;
                        good.categories.children = obj[i].categories.children[0].data;
                        good.categories.data = obj[i].categories.data;
                        good.providerBrand = obj[i].providerBrand;
                        good.spec = obj[i].specs[j]
                        good.status = true;
                        GoodSpecs.push(good);
                        good = new Object();
                        good.categories = new Object();
                    }
                }
                return GoodSpecs;
            }
        }
    }
})