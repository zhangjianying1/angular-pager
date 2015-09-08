# angular-pager
angular分页插件

html:
<div ng-controller="PageCtrl">
                    {{ text }}
                    <observe totalitems="204" listsizes="5" itemsperpage="10"></observe>
                </div>
js: 
ctrl.controller('PageCtrl', ['$scope', function($scope){
    $scope.showPage = function(val, args){
        $scope.text = args;
        console.log(args)
    }
    $scope.$on('pagechage', $scope.showPage);
}]);
ctrl.directive('observe', function(){
    return {
        restrice: 'EA',
        controller: function($scope, pagerConfig){
            // 共多少条
            $scope.totalItems = 0;
            $scope.page = [];
            // 偏移数
            $scope.offsetPage = 0;
            // 一页多少条
            $scope.itemsPerpage = 0;
            // 一个多少页
            $scope.totalPages = 0;
            $scope.currentPage = 0;

            $scope.$watch('totalItems', function(){
                $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerpage);

                resetPageList();
                if ($scope.page[$scope.currentPage]) {
                    $scope.page[$scope.currentPage].active = true;
                }
            });

            var resetPageList = function(){
                $scope.page = [];

                var last = Math.min(Number($scope.offsetPage) + Number($scope.listSizes), $scope.totalPages);

                for (var i = $scope.offsetPage; i < last; i ++) {
                    $scope.page.push({
                        text: i,
                        indexPage: i,
                        active: false
                    })
                }

            }
            var getOffset = function(index){
                var offset = Math.min(index, $scope.totalPages - $scope.listSizes);
                if (offset <= 0) {
                    offset = 0;
                }
                return offset;
            };
            $scope.selectPage = function(index){
                if (index < 0 || index >= $scope.totalPages) {
                    return;
                }
                if ($scope.page[$scope.currentPage-$scope.offsetPage]) {
                    $scope.page[$scope.currentPage-$scope.offsetPage].active = false;
                }
                $scope.currentPage = index;
                // 如果currentPage 小于 offsetPage 或者 currentPage 大于 offsetPage加listsizes

                if ($scope.currentPage < $scope.offsetPage || $scope.currentPage >= $scope.offsetPage + $scope.page.length) {

                    $scope.offsetPage = getOffset(index)

                    resetPageList();
                }

                if ($scope.page[$scope.currentPage-$scope.offsetPage]) {
                    $scope.page[$scope.currentPage-$scope.offsetPage].active = true;
                }
                $scope.$emit('pagechage', $scope.currentPage);
            };
            $scope.next = function(){
                if ($scope.isLast()) {
                    return;
                }
                $scope.selectPage($scope.currentPage + 1);
            };
            $scope.provie = function(){
                if ($scope.isFirst()) return
                $scope.selectPage($scope.currentPage - 1);
            }
            $scope.first = function(){
                $scope.selectPage(0);
            }
            $scope.last = function(){
                $scope.selectPage($scope.totalPages - 1);
            }
            $scope.isFirst = function(){
                return $scope.currentPage <= 0;
            };
            $scope.isLast = function(){
                return $scope.currentPage >= $scope.totalPages - 1;
            }
            $scope.getText = function(key) {
                return pagerConfig.text[key];
            };


        },
        link: function(scope, ele, attrs){

            scope.itemsPerpage = attrs.itemsperpage || 1;
            scope.listSizes = attrs.listsizes;
            attrs.$observe('totalitems', function(val){
                scope.totalItems = val;
            })
        },
        templateUrl: '../../views/modal/page.html'
    }
}).constant('pagerConfig', {
        text: {
            'first': '首页',
            'provie': '上一页',
            'next': '下一页',
            'last': '尾页',
        }
    }
);
