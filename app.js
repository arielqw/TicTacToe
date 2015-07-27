// Loading Constraint Satisfaction Problem Solver
var csp = require("csp");
var p = csp.DiscreteProblem();

// Defining board objects
var cells = [];
var cellsStrArr = [];

// Initialzing cells
for(var i = 0; i < 9; i++){
	var name = "cell"+i;
	cells[i] = {
		value: "",
		changed: false
	}

	p.addVariable(name, [
		{value:"", changed: false}, 
		{value:"", changed: true}, 
		{value:"x", changed: false}, 
		{value:"x", changed: true}, 
		{value:"o", changed: false},
		{value:"o", changed: true}
	]);
	cellsStrArr[i] = name;
}

//add lines
//

// Constraints

// Only one change
p.addConstraint(
    cellsStrArr,
    function(cell0, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9) { 
		var changedCount = 0;
		var maxChanges = 1;
		for(var i = 0; i < arguments.length; i++){
			if(arguments[i].changed){
				changedCount++;
				if(changedCount > maxChanges) return false;
			}
		}
		return changedCount == maxChanges;
    }
);

// Add max Xs
p.addConstraint(
    cellsStrArr,
    function(cell0, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9) { 
		return cell0.changed && cell0.value == "x";
    }
);

console.log(p.getSolution());

/* Usage example
var p = csp.DiscreteProblem();

p.addVariable("a", [1,2,3]);
p.addVariable("b", [4,5,6]);
p.addVariable("c", [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);

p.addConstraint(
    ["a", "b"],
    function(a, b) { return a*2 === b; }
);

p.addConstraint(
    ["b", "c"],
    function(b, c) { return b*2 === c; }
);

var one_solution = p.getSolution();
var all_solutions = p.getSolutions();

console.log(one_solution);
console.log(all_solutions);
*/