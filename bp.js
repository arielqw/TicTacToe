var Logic = require("logic-solver");
var solver = new Logic.Solver();

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
	var solution = solver.solve();
	if(solution != null){
		return solver.solve().getMap();
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
