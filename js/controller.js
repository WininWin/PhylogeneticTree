var TreeControllers = angular.module('TreeControllers', ['ngMaterial', 'ngMessages']);


TreeControllers.controller('HeaderController',['$scope', '$state', '$rootScope', function($scope,$state, $rootScope) {

	//Game Select
	$scope.startparsimony = function(){
		angular.element(document.getElementsByClassName('main-game-box')).css('width', "750px");

		$state.go('app.parsimony-start');
	};

	$scope.startupgma = function(){
		angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");

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

	angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");

	$scope.init_start_point_y = 310;

	$scope.upgmarefresh = function(){
		$state.go('app.upgma');

		angular.element(document.getElementsByClassName('add-line')).remove();
		angular.element(document.getElementsByClassName('node-circle')).remove();

		init();
			$rootScope.matrix_is_sovled ={};
	$rootScope.user_input = {};

	for(var key in $rootScope.matrix){
		$rootScope.matrix_is_sovled[key]= {};
		$rootScope.user_input[key] = {};
		for(var in_key in $rootScope.matrix[key]){
			if(in_key==='name' || in_key==='DNA'){
				continue;
			}

			$rootScope.matrix_is_sovled[key][in_key] = true;
		}
	}

		

			$rootScope.tempmodel = {};

	for(var key in $rootScope.matrix){
		$rootScope.tempmodel[key] = $rootScope.matrix[key];
	}


	};

	var bts = function button_select(key){

		if(!($rootScope.upgma_done)){
			$scope.selected_style[key] = {
			'border' : '3px solid Blue',
			'fill' : 'blue'
			}

			$rootScope.button_count++;
			if($rootScope.button_count > 2){
				$rootScope.button_count = 2;
			}


			$scope.selected_button[key] = true;
		}

		

	};


	$scope.button_select = bts;
	
	function makeSVG(tag, attrs) {
            var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs){
                el.setAttribute(k, attrs[k]);
            }
            return el;
        }

	function init(){
			$rootScope.matrix = UPGMAModel.getDistanceMatrix();
	$scope.minimum_pair = UPGMAModel.getMinimumPair($rootScope.matrix);
	$rootScope.button_count = 0;
	$scope.tree_info = "";

	$rootScope.old_matrix = {};
	$rootScope.need_ori = false;
	$scope.height_info = "";

	$scope.selected_button = {
		'A' : false,
		'B' : false,
		'C' : false,
		'D' : false
	};

	$scope.selected_style = {
		'A' : {},
		'B' : {},
		'C' : {},
		'D' : {}
	};

	$scope.init_points = {
		'A' : [100, 310],
		'B' : [280, 310],
		'C' : [460, 310],
		'D' : [640, 310]
	};

	$scope.points = {
		'A' : [100, 310],
		'B' : [280, 310],
		'C' : [460, 310],
		'D' : [640, 310]
	};



	$scope.height = 0;
	$rootScope.is_solved = true;
	$scope.max_height = 0;
	$rootScope.upgma_done = 0;

	$scope.upgmaInst = "Step 1 : find the pair of clusters that minimizes distance";
	$scope.subInst = "You can click Species below the tree";
	angular.element(document.getElementById('tree-view')).addClass("upgma-curr-step");

	$scope.$watch('is_solved', function(newValue, oldValue){
		var keys = Object.keys($rootScope.matrix);
		if(keys.length !== 1){
			if(newValue){
				$scope.equation = "";
				$scope.upgmaInst = "Step 1 : find the pair of clusters that minimizes distance";
				$scope.subInst = "You can click Species or Green node circle";
				$scope.subInstTwo = "";
				angular.element(document.getElementById('tree-view')).addClass("upgma-curr-step");
				angular.element(document.getElementById('matrix-view')).removeClass("upgma-curr-step");
			}
			else{
				$scope.upgmaInst = "Step 2 : Fill out the new distance matrix";
				$scope.subInst = "Calculate: ";
				$scope.equation = "\\quad d_{k,l} \\quad \\text{for all} \\quad l, \\text{where} \\quad d_{i,j} = \\frac{1}{|C_{i}||C_{j}|} \\sum_{p \\in C_{i},q \\in C_{j}} d_{pg}";
				$scope.subInstTwo = "Push Enter key for checking the distance";
				angular.element(document.getElementById('tree-view')).removeClass("upgma-curr-step");
				angular.element(document.getElementById('matrix-view')).addClass("upgma-curr-step");
			}
		}
		else{
			$scope.upgmaInst = "UPGMA tree for " + $rootScope.matrix[keys[0]].name;
			angular.element(document.getElementById('tree-view')).removeClass("upgma-curr-step");
			angular.element(document.getElementById('matrix-view')).removeClass("upgma-curr-step");
			$rootScope.upgma_done = 1;
		}
			
	}, true);

	$scope.$watch('selected_button', function(newValue, oldValue){

		//	var is_solved = true;
		//$rootScope.old_matrix = {};

		
		
		var check_key = "";
		var keys = [];
		var not_selected_keys = [];

		if($rootScope.button_count === 2){
			

			for(var key in newValue){
				if(newValue[key]){
					keys.push(key);

				}
				else{
					not_selected_keys.push(key);
				}
			}

			check_key = keys.join('');

			if(($scope.minimum_pair).indexOf(check_key)!== -1 && $rootScope.is_solved){

				for(var copykey in $rootScope.matrix){
				$rootScope.old_matrix[copykey] = {};
				for(var incopykey in $rootScope.matrix[copykey]){
					$rootScope.old_matrix[copykey][incopykey] = $rootScope.matrix[copykey][incopykey];
				}
				}

				$scope.height = $rootScope.matrix[keys[0]][keys[1]]/2;

				
				UPGMAModel.updateMatrix($rootScope.matrix, $rootScope.matrix[keys[0]], $rootScope.matrix[keys[1]]);
			
				$scope.height_info = "Height for " + $rootScope.matrix[check_key].name + ": " + $scope.height;

				for(var i = 0; i < keys.length; i++){
					newValue[keys[i]] = false;
					$scope.selected_style[keys[i]] = {};
					delete $rootScope.matrix_is_sovled[keys[i]];
					delete $scope.selected_button[keys[i]];
				}

				$rootScope.matrix_is_sovled[check_key] = {};
				$rootScope.user_input[check_key] = {};
				for(var j = 0; j < not_selected_keys.length;j++){

					if($rootScope.matrix_is_sovled[not_selected_keys[j]]){
						$rootScope.matrix_is_sovled[not_selected_keys[j]][check_key] = false;
						$rootScope.matrix_is_sovled[check_key][not_selected_keys[j]] = false;
					}
					
				}

				$rootScope.matrix_is_sovled[check_key][check_key] = true;
				$scope.selected_button[check_key] = false;

				var diff = Math.abs($scope.points[keys[0]][0] - $scope.points[keys[1]][0]);
				var startpoint = $scope.points[keys[0]][0] > $scope.points[keys[1]][0]?$scope.points[keys[1]][0]:$scope.points[keys[0]][0];

				var line_one = makeSVG("line", {x1 : $scope.points[keys[0]][0], x2 : $scope.points[keys[0]][0], y1 : ($scope.init_start_point_y - ($scope.height*30)), y2: $scope.points[keys[0]][1], 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
				var line_two = makeSVG("line", {x1 : $scope.points[keys[1]][0], x2 : $scope.points[keys[1]][0], y1 : ($scope.init_start_point_y - ($scope.height*30)), y2: $scope.points[keys[1]][1], 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
				var line_three = makeSVG("line", {x1 : $scope.points[keys[0]][0], x2 : $scope.points[keys[1]][0], y1 : ($scope.init_start_point_y - ($scope.height*30)), y2 : ($scope.init_start_point_y - ($scope.height*30)), 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
				var circle = makeSVG("circle", {"cx" : (startpoint+diff/2), "cy" : ($scope.init_start_point_y - ($scope.height*30)) , r:"8" , fill:"green", class : "node-circle"});
				
				$scope.points[check_key] = [(startpoint+diff/2), ($scope.points[keys[1]][1] - ($scope.height*30))];

				angular.element(document.getElementById('svg-layout')).append(line_one, line_two, line_three, circle);


				 circle.onclick= function() {
				 	if($rootScope.is_solved){
				 		this.setAttribute('fill', 'blue');
				 	}
				 		
			           bts(check_key);
			           $scope.$apply();
			      };
				$scope.selected_style[check_key] = {};
				$scope.tree_info = "";
				$rootScope.button_count = 0;
				$scope.minimum_pair = UPGMAModel.getMinimumPair($rootScope.matrix);
				$rootScope.is_solved = false;

				
				$rootScope.need_ori = true;
				if($scope.height > $scope.max_height){
					$scope.max_height = $scope.height;
				}

			}

			else{
				for(var i = 0; i < keys.length; i++){
					newValue[keys[i]] = false;
					$scope.selected_style[keys[i]] = {};
				}
				$rootScope.button_count = 0;
				if(!$rootScope.is_solved){
					$scope.tree_info = "You did not solve the distance matrix!";
				}
				else{
					$scope.tree_info = "You did not select minimum pair!";
					angular.element(document.getElementsByClassName('node-circle')).attr('fill', 'green');
					}
				
			}


		}

	}, true);
	}

	init();

}]);

TreeControllers.controller('upgma-matrixController',['$scope', '$state', '$rootScope','UPGMAModel','$timeout' , function($scope,$state, $rootScope, UPGMAModel,$timeout) {

	
	$rootScope.matrix_is_sovled ={};
	$rootScope.user_input = {};
	
	$scope.info = "";
	$scope.hidden = true;
	$scope.ori_matrix = {};
	for(var key in $rootScope.matrix){
		$rootScope.matrix_is_sovled[key]= {};
		$scope.ori_matrix[key] = {};
		$rootScope.user_input[key] = {};
		for(var in_key in $rootScope.matrix[key]){
			$scope.ori_matrix[key][in_key] = $rootScope.matrix[key][in_key];
			if(in_key==='name' || in_key==='DNA'){
				
				continue;
			}

		
			$rootScope.matrix_is_sovled[key][in_key] = true;
		}
	}

	

	$scope.input_check = function(outkey, key){

		
		  $scope.hidden = false;
		if($rootScope.user_input[outkey][key] == $rootScope.matrix[outkey][key]){
			 $scope.startFade = true;
			$scope.fontcolor = {'color' : 'Green'}
			$scope.info = "Correct!";
			$timeout(function(){
			 $scope.startFade = false;
            $scope.hidden = true;
       			 }, 2000);
			$rootScope.matrix_is_sovled[outkey][key] = true;
			$rootScope.matrix_is_sovled[key][outkey] = true;
			$rootScope.is_solved = true;
			//check that the table is solved
			for(var k in $rootScope.matrix_is_sovled){
				for(var ik in $rootScope.matrix_is_sovled){
					if(!$rootScope.matrix_is_sovled[k][ik]){
				
						$rootScope.is_solved = false;
					}
				}
			}

			if($rootScope.is_solved){
				$rootScope.old_matrix = {};
			}
		}	

		else{
			 $scope.startFade = true;
			$scope.fontcolor = {'color' : 'Red'}
			$scope.info = "Wrong";
			$timeout(function(){
			 $scope.startFade = false;
            $scope.hidden = true;
       			 }, 2000);
			
		}

		
        
	}





}]);

TreeControllers.controller('upgma-treeController',['$scope', '$state', '$rootScope','UPGMAModel', function($scope,$state, $rootScope, UPGMAModel) {

	$rootScope.tempmodel = {};

	for(var key in $rootScope.matrix){
		$rootScope.tempmodel[key] = $rootScope.matrix[key];
	}




}]);
