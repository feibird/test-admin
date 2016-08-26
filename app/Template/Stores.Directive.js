angular.module('index_area').directive('stores', function () {
    return {
		restrict: 'E',
		replace: true,
		scope: {
			list:"="
		},
		templateUrl: 'Template/StoresSelect.html',
		link: function (scope, elem, attr) {
			console.log(scope.list)
		}
    }
})
