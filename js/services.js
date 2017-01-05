var TreeServices = angular.module('TreeServices', []);

var setA_name = ['Human', 'Chimpanzee','Horse'];
var setA = ['CTGGCC', 'ATACCT','AAGAGT'];
var setB_name = ['Dog', 'Mouse','Cow'];
var setB = ['CTAGCC', 'ATAACT','AAGCGT'];
	
var setC_name = ['Mushroom', 'Sunflower','Lizard'];
var setC = ['CTGGAG','ATGACC','AGATAT'];
var setD_name = ['Tulip', 'Rose', 'Crocodile'];
var setD = ['TTAGAG', 'ATGCCC','AGAGAT'];

//Tree leaf is fixed to 4 
TreeServices.factory('ParsimonyModel', function(){


	function calculate_tree_score(items){
		var len = items.length;
		var score = 0;
		var q = [];
		for(var i = 0; i < len; i++){
			var item = items.shift();
			var item_set = new Set([item]);
			
			q.push(item_set);
		}

		while(q.length !== 1){
			var item1 = q.shift();
			var item2 = q.shift();

			var intersec = item1.intersection(item2);
			var union = item1.union(item2);

			if(intersec.size){
				q.push(intersec);
			}
			else{
				score = score + 1;
				q.push(union);
			}	


		}

		return score; 

	}

	Set.prototype.union = function(setB) {
	    var union = new Set(this);
	    for (var elem of setB) {
	        union.add(elem);
	    }
	    	return union;
	}

	Set.prototype.intersection = function(setB) {
	    var intersection = new Set();
	    for (var elem of setB) {
	        if (this.has(elem)) {
	            intersection.add(elem);
	        }
	    }
	    return intersection;
	}

	


	function generate_Tree_sets(){
		var random = Math.round(Math.random()*2);

		var TreeSet = [
		{"title" : setA_name[random], "DNA" : setA[random]},
		{"title" : setB_name[random], "DNA" : setB[random]},
		{"title" : setC_name[random], "DNA" : setC[random]},
		{"title" : setD_name[random], "DNA" : setD[random]}
		];

		return TreeSet;

	}

	function get_informative_set(Treeset){
		var seqs = [];
		seqs.push(Treeset[0].DNA);
		seqs.push(Treeset[1].DNA);
		seqs.push(Treeset[2].DNA);
		seqs.push(Treeset[3].DNA);
		var info_set = {};
		for(var i = 0; i < seqs[0].length; i++){
			var checker = {};
			info_set[i] = [];
			for(var j = 0; j < 4;j++){
				info_set[i].push(seqs[j].charAt(i));
				if(checker[seqs[j].charAt(i)]){
					checker[seqs[j].charAt(i)]++;
				}
				else{
					checker[seqs[j].charAt(i)] = 1;
				}
			}
			for(var key in checker){
				if(checker[key]!==2){
					delete info_set[i];
					break;
				}
			}

		}

		return info_set;
	}

	function generate_all_scores(sites){

		var scores = [
			[],
			[],
			[]
		];


		for(var key in sites){
			var arr = (sites[key]).slice();
			var temp = arr[1];

			scores[0].push(calculate_tree_score(arr));
			
			
			sites[key][1] = sites[key][2];
			sites[key][2] = temp;
		}

		for( var key in sites){
			var arr = (sites[key]).slice();
			var temp = arr[1];

			scores[1].push(calculate_tree_score(arr));
			
			sites[key][1] = sites[key][3];
			sites[key][3] = temp;
		}

		for(var key in sites){
			var arr = (sites[key]).slice();
			
			scores[2].push(calculate_tree_score(arr));
		}

		return scores;

	}

	function generate_one_tree_score(sites){
		var scores = [];
		for(var key in sites){
			var arr = (sites[key]).slice();
			
			scores.push(calculate_tree_score(arr));
		}

		return scores;
	}




	

	return {
		makeSet : function(){
			return generate_Tree_sets();
		},
		getInfoSet : function(Treeset){
			return get_informative_set(Treeset);
		},
		getTreeScores : function(sites){
			return generate_all_scores(sites);
		},
		getOneTreeScore : function(sites){
			return generate_one_tree_score(sites);
		}

	};

});


TreeServices.factory('UPGMAModel', function(){

	function gen_random(start, range){
		return Math.floor(Math.random() * range) + start;
	}

	function generate_Matrix(){
		var random = Math.round(Math.random()*2);
		var matrix = {
			
		};
		
			matrix['A'] = {
				name : setA_name[random],
				DNA : setA[random],
				'A' : 0,
				'B' : gen_random(3,5),
				'C' : gen_random(8,5),
				'D' : gen_random(8,5)
			};

			matrix['B'] = {
				name : setB_name[random],
				DNA : setB[random],
				'A' : 0,
				'B' : 0,
				'C' : gen_random(8,5),
				'D' : gen_random(8,5)
			};

			matrix['C'] = {
				name : setC_name[random],
				DNA : setC[random],
				'A' : 0,
				'B' : 0,
				'C' : 0,
				'D' : gen_random(3,5)
			};

			matrix['D'] ={
				name : setD_name[random],
				DNA : setD[random],
				'A' : 0,
				'B' : 0,
				'C' : 0,
				'D' : 0
			};

		

		for(var key in matrix){

			for(var innerkey in matrix[key]){
				if(innerkey==='name' || innerkey==='DNA' || key === innerkey){
					continue;
				}
				else if(matrix[innerkey][key]){
					matrix[key][innerkey] = matrix[innerkey][key];
				}
			}

		}

		return matrix;


	}

	function find_minumum_set(matrix){
		var min = Number.MAX_VALUE;
		var set = [];
		for(var key in matrix){

			for(var innerkey in matrix[key]){
				if(innerkey==='name' || innerkey==='DNA' || key === innerkey){
					continue;
				}
				else{
					if(min > matrix[key][innerkey]){
						set = [];
						min = matrix[key][innerkey];
						set.push(key + innerkey);
					}
					else if(min === matrix[key][innerkey]){
						set.push(key + innerkey);
					}
				}
			}

		}

		return set;
	}

	function matrix_update(matrix, itemOne, itemTwo){

		var new_name = '(' + itemOne.name  +',' + itemTwo.name + ')';
		var new_DNA = itemOne.DNA + itemTwo.DNA;
		var newkey = '';
		var keys=[];
		for(var key in matrix){
			if(matrix[key] === itemOne || matrix[key] == itemTwo){
				newkey = newkey + key;
				keys.push(key);
				delete matrix[key];
			}
		}


		//calculate
		matrix[newkey] = { name : new_name,
							DNA : new_DNA};
		

		for(var key in matrix){
			if(key !== newkey){
				matrix[key][newkey] = 0;
				for(var innerkey in matrix[key]){
					if(keys.indexOf(innerkey) !== -1 ){
						matrix[key][newkey] = matrix[key][newkey] + (matrix[key][innerkey]/2);
						matrix[newkey][key] = matrix[key][newkey];
						delete matrix[key][innerkey];
					}

				}
			}
		}

		matrix[newkey][newkey] = 0;
	


		return matrix;
	}


	return {
		getDistanceMatrix : function(){
			return generate_Matrix();
		},

		getMinimumPair : function(matrix){
			return find_minumum_set(matrix);
		},

		updateMatrix : function(matrix, itemOne, itemTwo){
			return matrix_update(matrix, itemOne, itemTwo);
		}
	};


});

