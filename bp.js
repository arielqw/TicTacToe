var Logic = require("logic-solver");
var solver = new Logic.Solver();

var objects = [];
var solution = null;

function addObject(name, numOfBits){
	objects[name] = Logic.variableBits(name, numOfBits);
	return objects[name];
}

function addConstraint(constraintFormula){
	solver.require(constraintFormula);
}
function forbidConstraint(constraintFormula){
	solver.forbid(constraintFormula);
}

function getSolution(){
	if(solution == null){
		solution = solver.solve();
	}
	if(solution != null){
		return solution.getMap();
	}
	
	return {};
}

function minimizeWeightedSum(formulas, weights){
	getSolution();
	solution = solver.minimizeWeightedSum(solution, formulas, weights);
	if(solution != {}){
		return solver.solve().getMap();
	}
	
	return {};
}

function reset(){
	solver = new Logic.Solver();
	solution = null;
}

module.exports.Logic = Logic;
module.exports.addObject = addObject;
module.exports.addConstraint = addConstraint;
module.exports.getSolution = getSolution;
module.exports.reset = reset;
module.exports.minimizeWeightedSum = minimizeWeightedSum;
