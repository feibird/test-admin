angular.module('index_area').directive('sort', function (SortResource, $rootScope) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      returnlist: '='
    },
    templateUrl: 'Template/SortSelect.html',
    link: function (scope, elem, attr) {
      scope.seid = $rootScope.seid;

      sort();

      scope.Status = function (data) {
        console.log(data)
        if (data.status) {
          scope.returnlist.push(data)
        } else {
          for (var i in scope.returnlist) {
            if (scope.returnlist[i].data.id == data.data.id) {
              scope.returnlist.splice(i, 1);
            }
          }
        }
        for (var i in data.children) {
          if (data.status) {
            data.children[i].status = true;
          } else {
            data.children[i].status = false;
          }
        }
        console.log(scope.returnlist);
      }

      function sort() {
        SortResource.list(scope.seid).then(function (data) {
          scope.list = data.data.result.root.children;
          for (var i in scope.list) {
            scope.list[i].status = false;
            for (var j in scope.list[i].children) {
              scope.list[i].children[j].status = false;
            }
          }
          console.log(scope.list);
        })
      }
    }
  }
})
