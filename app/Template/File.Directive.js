angular.module('index_area').directive('file', function (FileUploader, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            logoname: "@",
            returndata: '='
        },
        templateUrl: 'Template/FileSelect.html',
        link: function (scope, elem, attr) {
            scope.seid = $rootScope.seid;
            var logo = scope.img = new FileUploader({
                url: "/api-admin/attach/upload",
                formData: [{ "device": "pc", "version": "1.0.0", "sessionId": scope.seid }]
            })
            logo.onSuccessItem = function (data, status) {
                if (status.status != "OK") {
                    for (var i in scope.logo.queue) {
                        scope.logo.queue[i].isSuccess = false;
                        scope.logo.queue[i].isError = true;
                        console.log(scope.logo.queue[i])
                    }
                    layer.alert(status.message, { icon: 2 })
                } else {
                    console.log(status)
                    scope.infolist.logo = status.result;
                    scope.logo.queue[0].remove();
                }
            }
            scope.test = function(){
                console.log(scope.img)
            }
        }
    }
})
