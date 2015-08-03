var Logic = require("logic-solver");
var solver = new Logic.Solver();
var solution;

var objects = [];

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
	solution = solver.solve();
	if(solution != null){
		return solution.getMap();
	}
	
	return {};
}

function getFormula(){
	if(solution != null){
	console.log(solution.getFormula());
		return solution.getFormula();
	}
	return {};
}

function reset(){
	solver = new Logic.Solver();
}

module.exports.Logic = Logic;
module.exports.addObject = addObject;
module.exports.addConstraint = addConstraint;
module.exports.getSolution = getSolution;
module.exports.reset = reset;
module.exports.getFormula = getFormula;
