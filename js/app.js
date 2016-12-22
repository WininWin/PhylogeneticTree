var app = angular.module('PhylogeneticTree',['TreeControllers','TreeServices','ui.router', 'ngMaterial','ngDragDrop', 'md.data.table']);

app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

$mdThemingProvider.theme('default')
    .primaryPalette('light-green', {
      'default': '400',
      'hue-1': '900',
      'hue-2' : '600'
    })
    .accentPalette('light-blue', {
      'default': '800',
      'hue-1': '400'
    })
    .warnPalette('red', {
      'default': '600'
    })
    .backgroundPalette('grey', {
      'default': 'A100'
    });


$urlRouterProvider.otherwise('/');
 
  $stateProvider
	  .state('app',{
	    url: '/',
	    views: {
	      'header': {
	        templateUrl: 'partials/header.html'
	      },
	      'main': {
	        templateUrl: 'partials/main-view.html' 
	      },
	      'footer': {
	        templateUrl: 'partials/footer.html'
	      }
	    }
	  })

	  //maximum parsimony method
	  .state('app.parsimony-start', {
	  	url: 'parsimony',
	  	views:{
	  		'main@' : {
	  			templateUrl: 'partials/parsimony-start.html'
	  		}
	  	}

	  })

	  .state('app.parsimony-site-fill', {
	  	url: 'parsimony',
	  	views : {
	  		'main@' : {
	  			templateUrl: 'partials/parsimony-site-fill.html'
	  		}
	  	}
	  })

	  .state('app.parsimony-tree-fill', {
	  	url: 'parsimony',
	  	views : {
	  		'main@' : {
	  			templateUrl: 'partials/parsimony-tree-fill.html'
	  		}
	  	}
	  })

	  .state('app.parsimony-end', {
	  	url: 'parsimony',
	  	views: {
	  		'main@' : {
	  			templateUrl: 'partials/parsimony-end.html'
	  		}
	  	}
	  })


	  .state('app.upgma', {
	  	url : 'upgma',
	  	views: {
	  		'main@' : {
	  			templateUrl: 'partials/upgma-main.html'
	  		},
	  		'matrix@app.upgma' :{
	  			templateUrl: 'partials/upgma-matrix.html'
	  		},
	  		'tree@app.upgma' : {
	  			templateUrl: 'partials/upgma-tree.html'
	  		}

	  	}
	  });
	 

}]);

app.directive('ngX', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngX', function(x) {
                elem.attr('cx', x);
            });
        };
    })
    .directive('ngY', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngY', function(y) {
                elem.attr('cy', y);
            });
        };
    });