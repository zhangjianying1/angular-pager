var app = angular.module('myApp', ['ui.router', 'indexCtrl', 'ngAnimate']);
//app.animation('.fade-in', function(){
//    return {
//        enter: function(ele) {
//            ele.css('opacity',.3);
//        },
//        leave: function(ele){
//            ele.css('opacity',.6);
//        }
//    }
//})
app.run(['$rootScope', function($rootScope){
    $rootScope.$on('$routeChangeStart', function($evt, $next, $curr){

    });
    $rootScope.$on('$routeChangeSuccess', function($evt, $next){
        console.log($evt)
    });
}]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider
      .state('index', {
          url: '/',
          views: {
            index: {
                templateUrl: '../views/index/index.html',
                controller: 'TestdialogCtrl'
            }
          }

      })
      .state('myusers', {
          url: '/myusers',
          templateUrl: '../views/myusers/users-index.html',
          controller: 'myusersCtrl',
          resolve: {
              data: function(){
                  return 1;
              }
          }
      })
      .state('index.a', {
          url: '/a',
          templateUrl: '../views/myusers/user-des.html'
      })
}]);
