var ctrl = angular.module('indexCtrl', []);

ctrl.controller('indexCtrl', ['$scope', function($scope){

}])


ctrl.factory('hintServ', function($http, $document, $rootScope, $compile){
    $rootScope.bb = 44;
    return {
        hint: function(param, url){
            $http.get(url || '../../views/modal/alert.html').then(function(data){
                var hint = angular.element(data.data);
                var mask = angular.element('<div id="mask"></div>');

                if ($document.find('#alert')){
                    $document.find('body').prepend(hint)
                    $document.find('body').prepend(mask)
                }

                var scope = angular.extend($rootScope.$new(),
                    param,
                    {confirm: function(){
                        hint.remove();
                        mask.remove();
                    }
                    });
                $compile(hint)(scope)
            })
        }
    }
});
ctrl.service('DialogServ', function($http, $rootScope, $document, $compile){
    var dialogMap = {};
    return {
        modal: function(param, data){
           $http.get(param.url).then(function(result){
                var confirm = angular.element(result.data);
                var mask = angular.element('<div id="mask"></div>');
                var newScope = $rootScope.$new();
                angular.extend(newScope, data);
               $document.find('body').append(confirm);
               $document.find('body').append(mask);
               $compile(confirm)(newScope);
               dialogMap[param.key] = param;

               dialogMap[param.key].confirm = confirm;
               dialogMap[param.key].mask = mask;
           });
        },
        accept: function(key, result){
            this.dismiss(key);
            if (dialogMap[key].accept) {
                dialogMap[key].accept(result);
            }
        },
        dismiss: function(key){
            dialogMap[key].confirm.remove();
            dialogMap[key].mask.remove();
        }
    }
})
ctrl.controller('alertCtrl', ['$scope', 'hintServ', function($scope, hintServ){
    $scope.opactions = '输入结果';
    $scope.hint = function(){
        hintServ.hint({title: $scope.opactions});
    }
    $scope.$on('bb', function(str){
        $scope.opactions = 'fdfsdf';
        console.log(str)
    })
}]);
ctrl.controller('TestdialogCtrl', ['$scope', 'DialogServ', function($scope, DialogServ){
    $scope.result = '';
    $scope.dialog = function(){
        $scope.$broadcast('bb', '33')
        DialogServ.modal({
            key: 'ng.confirm',
            url: '../../views/modal/confirm.html',
            accept: function(result){
                $scope.result = result;
            }
        }, {name: '输入'})
    }

}]);
ctrl.controller('DialogCtrl', ['$scope', 'DialogServ', function($scope, DialogServ){
    $scope.name = '';
    $scope.accept = function(){
        DialogServ.accept('ng.confirm', $scope.name);
    }
    $scope.cancel = function(){
        DialogServ.dismiss('ng.confirm');
    }
    $scope.close = function(){
        DialogServ.dismiss('ng.confirm');
    }
}])
ctrl.controller('TestListCtrl', ['$scope', function($scope){
    $scope.students = [
        {name: "Tom",age:15, gender: 'man'},
        {name: "lily",age:15, gender: 'woman'},
        {name: "Meik",age:15, gender: 'man'}
    ];
    $scope.itemMenu = function(student){
        var arrMenu = [
            {
                title: 'greet',
                action: function(){
                    alert('I am' + student.name)
                }
            },
            {
                title: 'smoke',
                action: function(){
                    alert('I am' + student.name + ', I can smoke');
                }
            }
        ];

        if (student.name == 'Meik') {
            arrMenu.push({
                title: 'make up',
                action: function(){
                    alert('I am a girl, am i beautiful')
                }
            })
        }
        return arrMenu;
    }
}]);
ctrl.directive('contextMenu', function($http, $compile, $rootScope, $document){
    var contextMenu;

    return {
        restrict: 'AE',
        link: function(scope, ele, attrs){
            $http.get('../../views/modal/menu.html').then(function(result){
                var menu = angular.element(result.data);
                $compile(menu)(angular.extend($rootScope.$new(),{
                    items: scope.$eval(attrs['contextMenu'])
                }));

                ele.on('contextmenu', function(evt){
                    var target = evt.target;

                    $document.find('body').append(menu);

                    var top = evt.clientY + 'px';
                    var left = evt.clientX + 'px';

                    menu.css({ left: left, top: top, display: 'block'})
                    if (contextMenu && contextMenu != menu) {
                        contextMenu.css('display', 'none');
                    }
                    contextMenu = menu;
                    evt.preventDefault();
                    evt.stopPropagation();
                })
                $document.on('click', function(){
                    menu.css('display', 'none')
                })
            })

        }
    }
})
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