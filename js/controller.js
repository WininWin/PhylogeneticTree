var TreeControllers = angular.module('TreeControllers', ['ngMaterial', 'ngMessages']);


TreeControllers.controller('HeaderController',['$scope', '$state', '$rootScope', function($scope,$state, $rootScope) {

	//Game Select
	$scope.startparsimony = function(){
		$state.go('app.parsimony-start');
	};

	$scope.startupgma = function(){
		$state.go('app.upgma');
	};

	$scope.startneighbor = function(){
		$state.go('app.neighbor-start');
	}


	$rootScope.lettercolor = function(letter){
		if(letter === 'A'){
			return {
				'color' : 'purple'
			}
		}
		else if(letter === 'G'){
			return {
				'color' : 'green'
			}
		}
		else if(letter ==='T'){
			return {
				'color' : 'blue'
			}
		}
		else if(letter === 'C'){
			return {
				'color' : 'orange'
			}
		}
		else{
			return {
				'color' : 'lightgreen'
			}
		}
	}
}]);


TreeControllers.controller('parsimony-StartController',['$scope', '$state', '$rootScope','ParsimonyModel', function($scope,$state, $rootScope, ParsimonyModel) {


	$rootScope.refresh = function(){
		$state.go('app.parsimony-start');
		init();
	};
	//state change
	//Maximumt parsimony Method
	$scope.site_fill = function(){
		$state.go('app.parsimony-site-fill');
	};

	//parsimony-start
	function init(){
		var TreeSet = ParsimonyModel.makeSet();
	$rootScope.TreeSet = TreeSet.slice();
	$rootScope.info_set = ParsimonyModel.getInfoSet(TreeSet);
	$scope.done = false;

	var set_count = 4;
	$scope.sets = [];
	for(var i = 0; i < 4;i++){
		var random = Math.floor(Math.random()*set_count);
		($scope.sets)[i] = {
			title : TreeSet[random].title,
			DNA : TreeSet[random].DNA
		};
		TreeSet.splice(random, 1);
		set_count--;
	}

	$rootScope.drop_set = [{},{},{},{}];

	}
	
	init();


	$scope.$watch('drop_set', function(newValue, oldValue){
	
		for(var i= 0; i < 4; i++){
		
			if(newValue.includes($scope.sets[i])){
				$scope.done = true;
			}
			else{
				$scope.done = false;
				break;
			}
		}


	}, true);


}]);


TreeControllers.controller('parsimony-SiteFillController',['$scope', '$state', '$rootScope','ParsimonyModel', function($scope,$state, $rootScope, ParsimonyModel) {



	$scope.tree_fill = function(){
		$state.go('app.parsimony-tree-fill');
	};


	$scope.info = "";
	$scope.selected = [];
	$scope.site_index = ["0","1","2","3","4","5"];

	 $scope.keys = Object.keys($rootScope.info_set);

	 $scope.site_clicked=function(item, list){
	 	 var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
        	if(($scope.keys).indexOf(item) > -1){
        			$scope.fontcolor = {'color' : 'Green'}
					$scope.info = "Correct!";
        	}
        	else{
        		$scope.fontcolor = {'color' : 'Red'}
				$scope.info = "Wrong";
        	}
          list.push(item);
        }

	 };

	 $scope.site_checked= function(item, list){
	 	 return list.indexOf(item) > -1;
	 };

	 $scope.check_result = function(list_keys, list_selected){
	 	return list_keys.join("") === (list_selected.sort()).join("");
	 }




}]);

TreeControllers.controller('parsimony-TreeFillController',['$scope', '$state', '$rootScope','ParsimonyModel', function($scope,$state, $rootScope, ParsimonyModel) {


	$scope.end = function(){
		$state.go('app.parsimony-end');
	}
	
	var temp = $rootScope.info_set;
	var copy = new Object();
	
	for(var key in temp){
		var arr = temp[key].slice();
		copy[key] = arr;
	}

	var style = {
		 'border': '2px solid lightgreen',
    	'border-radius' : '25px'
	}
	var non_style ={};


		$scope.focus_event = function(i){
				switch(i){
					case 0:
						$scope.treeOne = style;
						$scope.treeTwo = non_style;
						$scope.treeThree =non_style;
						break;
					case 1:
						$scope.treeOne = non_style;
						$scope.treeTwo = style;
						$scope.treeThree =non_style;
						break;
					case 2:
						$scope.treeOne = non_style;
						$scope.treeTwo = non_style;
						$scope.treeThree = style;
						break;

					}
		}

	$scope.user = {};

	$scope.filled = false;
	$scope.info = "";
	$scope.tree_model_name = [];
	$scope.tree_names = [];
	$scope.tree_letters = [];
	for(var i = 0; i < 4; i++){
		$scope.tree_model_name.push($rootScope.TreeSet[i].title);
		$scope.tree_names.push($rootScope.TreeSet[i].title);
	}

	$scope.change_letters = function(sites){
		var letters = [];
		for(var i = 0; i < sites.length; i++){
			letters.push(sites[i]);
		}
		$scope.tree_letters = letters;
	};

	$scope.check_user_input = function(scores_arr, key, i){
		var sum = 0;
			
		for(var temp in scores_arr){
			sum = sum + (1*($scope.user)[temp][i]);
		}

		$scope.sum[i] = sum;
		if(($scope.user)[key][i] == scores_arr[key][i]){
			$scope.fontcolor = {'color' : 'Green'}
			$scope.info = "Correct!";
			($scope.right)[key][i] = true;
			($scope.wrong)[key][i] = {};
			
			
			$scope.count++;
			if($scope.count == $scope.total){
				$scope.filled = true;
				var min_index = ($scope.sum).indexOf(Math.min.apply(null, $scope.sum));
				switch(min_index){
					case 0:
						$scope.treeOne = style;
						$scope.treeTwo = non_style;
						$scope.treeThree =non_style;
						break;
					case 1:
						$scope.treeOne = non_style;
						$scope.treeTwo = style;
						$scope.treeThree =non_style;
						break;
					case 2:
						$scope.treeOne = non_style;
						$scope.treeTwo = non_style;
						$scope.treeThree = style;
						break;

					}
				$scope.info = "Minimum score : " + $scope.sum[min_index];

			}

		}

		else{
			($scope.wrong)[key][i] = {'border': '2px solid red'};
			$scope.fontcolor = {'color' : 'Red'}
			$scope.info = "Wrong";
			($scope.right)[key][i] = false;
		}


	

	}


	var scores = ParsimonyModel.getTreeScores(copy);
	$scope.scores = {};
	$scope.right = {};
	$scope.wrong = {};
	$scope.user = {};
	$scope.count = 0;
	$rootScope.sum = [0,0,0];
	$scope.total = scores.length * scores[0].length
	var keys = Object.keys($rootScope.info_set);
	for(var i= 0; i < scores.length;i++){
		$scope.scores[keys[i].toString()] = [];
		$scope.right[keys[i].toString()] = [];
		$scope.wrong[keys[i].toString()] = [];
		$scope.user[keys[i].toString()] = [];
		for(var j = 0; j< scores[0].length; j++){
			$scope.scores[keys[i].toString()].push(scores[j][i]);
			$scope.right[keys[i].toString()].push(false);
			($scope.wrong)[keys[i].toString()].push({});
			$scope.user[keys[i].toString()].push("");
		}
	}



}]);

TreeControllers.controller('parsimony-EndController',['$scope', '$state', '$rootScope','ParsimonyModel', function($scope,$state, $rootScope, ParsimonyModel) {

	$scope.min = Math.min.apply(null, $rootScope.sum);
	var user_info_set = ParsimonyModel.getInfoSet(($rootScope.drop_set).slice());

	var score = ParsimonyModel.getOneTreeScore(user_info_set);

	$scope.user_score = score.reduce(function(a, b) {
				  return a + b;
	}, 0);

	$scope.info = "";

	if($scope.min == $scope.user_score){
		$scope.fontcolor = {'color' : 'Green'}
		$scope.info = "Your guess was correct!"
	}
	else{
		$scope.fontcolor = {'color' : 'Red'}
		$scope.info = "Sorry, your guess was wrong."
	}


}]);


TreeControllers.controller('upgmaController',['$scope', '$state', '$rootScope','UPGMAModel', function($scope,$state, $rootScope, UPGMAModel) {

	$rootScope.matrix = UPGMAModel.getDistanceMatrix();
	$scope.minimum_pair = UPGMAModel.getMinimumPair($rootScope.matrix);
	$scope.selected_button = {
		'A' : false,
		'B' : false,
		'C' : false,
		'D' : false,
		count : 0
	};


	$scope.$watch('selected_button', function(newValue, oldValue){

	});

}]);

TreeControllers.controller('upgma-matrixController',['$scope', '$state', '$rootScope','UPGMAModel', function($scope,$state, $rootScope, UPGMAModel) {

	
	console.log($scope.selected_button);



}]);

TreeControllers.controller('upgma-treeController',['$scope', '$state', '$rootScope','UPGMAModel', function($scope,$state, $rootScope, UPGMAModel) {



	$scope.button_select = function(key){


	};







}]);
