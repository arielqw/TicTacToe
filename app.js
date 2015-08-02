var _ = require('underscore');
var bp = require('./bp.js');
var Logic = bp.Logic;

var lastState = { 
  'cell-1$1': false,
  'cell-1$2': false,
  'cell-1$0': true,
  'cell-2$1': false,
  'cell-2$2': false,
  'cell-2$0': true,
  'cell-3$1': false,
  'cell-3$2': false,
  'cell-3$0': true,
  'cell-4$1': false,
  'cell-4$2': false,
  'cell-4$0': true,
  'cell-5$1': false,
  'cell-5$2': false,
  'cell-5$0': true,
  'cell-6$1': false,
  'cell-6$2': false,
  'cell-6$0': true,
  'cell-7$1': false,
  'cell-7$2': false,
  'cell-7$0': true,
  'cell-8$1': false,
  'cell-8$2': false,
  'cell-8$0': true,
  'cell-9$1': false,
  'cell-9$2': false,
  'cell-9$0': true };


// Create objects
var cells = [];
for(var i = 1; i <= 9; i++){
	/* each cell is a 3bit number <B0,B1,B2>
		Bit 0 - true => cell empty false => cell marked
		Bit 1 - true => contains "x", false => doesnt contain "x"
		Bit 2 - true => contains "o", false => doesnt contain "o"
	*/
	var tmpCell = bp.addObject("cell-"+i, 3);
	cells[i] = {
		empty: tmpCell.bits[0],
		x: tmpCell.bits[1],
		o: tmpCell.bits[2]
	}
}

var lines = []
// each line has 9 bits, each is true or false if a cell i is attached to line i=<1,...,9>
lines['horizontal-line-1'] 	= ['cell-1', 'cell-2', 'cell-3'];
lines['horizontal-line-2'] 	= ['cell-4', 'cell-5', 'cell-6'];
lines['horizontal-line-3'] 	= ['cell-7', 'cell-8', 'cell-9'];

lines['vertical-line-1'] 	= ['cell-1', 'cell-4', 'cell-7'];
lines['vertical-line-2']	= ['cell-2', 'cell-5', 'cell-8'];
lines['vertical-line-3'] 	= ['cell-3', 'cell-6', 'cell-9'];

lines['xross-line-1'] 		= ['cell-1', 'cell-5', 'cell-9'];
lines['xross-line-2'] 		= ['cell-3', 'cell-5', 'cell-7'];

//adding Constraints

// Constraint: only x/o/empty in each cell
function onlyOneValueInACell(){	
	for(var i = 1; i<= 9; i++){
		var constraint = Logic.exactlyOne(cells[i].x, cells[i].o, cells[i].empty);
		bp.addConstraint(constraint);
	}
}


// Constraint: what marked stay marked
function markedStayMarked(){
	var constraints = [];
	for(var i = 1; i <= 9; i++){
		var name = "cell-"+i;
		//if marked
		if(!lastState[name+"$0"]){
			constraints.push(
				// Cell changed from un-marked to marked
				Logic.and(
					Logic.equiv(name+"$0", (lastState[name+"$0"] ? Logic.TRUE : Logic.FALSE) ),
					Logic.equiv(name+"$1", (lastState[name+"$1"] ? Logic.TRUE : Logic.FALSE) ),
					Logic.equiv(name+"$2", (lastState[name+"$2"] ? Logic.TRUE : Logic.FALSE) )
				)
			);
		}
	}

	var constraint = Logic.and.apply(Logic.and, constraints);
	bp.addConstraint(constraint);
}

// Constraint: only one change from previous state	
function onlyOneChangeFromLastState(){
	var constraints = [];
	for(var i = 1; i <= 9; i++){
		var name = "cell-"+i;

		constraints.push(
			// Cell changed from un-marked to marked
			Logic.and(
				// was empty
				Logic.equiv(Logic.TRUE, (lastState[name+"$0"] ? Logic.TRUE : Logic.FALSE) ),
				// now marked
				Logic.equiv(Logic.FALSE, name+"$0")
			)
		);
	}

	var constraint = Logic.exactlyOne.apply(Logic.exactlyOne, constraints);
	bp.addConstraint(constraint);
}

function onlyAddingXs(){
	var constraints = [];
	for(var i = 1; i <= 9; i++){
		var name = "cell-"+i;

		// no X There
		if(!lastState[name+"$1"]){
			//so add X
			constraints.push( 
				Logic.equiv(Logic.TRUE, name+"$1") 
			);
		}
	}

	var constraint = Logic.or.apply(Logic.or, constraints);
	bp.addConstraint(constraint);
}

function onlyAddingOs(){
	var constraints = [];
	for(var i = 1; i <= 9; i++){
		var name = "cell-"+i;

		// no X There
		if(!lastState[name+"$2"]){
			//so add X
			constraints.push( 
				Logic.equiv(Logic.TRUE, name+"$2") 
			);
		}
	}

	var constraint = Logic.or.apply(Logic.or, constraints);
	bp.addConstraint(constraint);
}

function checkError(cellName){
	var empty = lastState[cellName+"$0"];
	var x = lastState[cellName+"$1"];
	var o = lastState[cellName+"$2"];

	var count = (empty ? 1 : 0) + (x ? 1 : 0) + (o ? 1 : 0);
	if(count != 1){
		console.error("invalid value in "+ cellName);
		return true;
	}
	return false;
}

function cellToString(cellName){
	var empty = lastState[cellName+"$0"];
	var x = lastState[cellName+"$1"];
	var o = lastState[cellName+"$2"];
	if(empty){
		return("-");
	}
	if(x){
		return("X");
	}
	if(o){
		return("O");
	}
}

function printBoard(){
	var str = "";
	for(var i = 1; i <= 9; i++){
		var cellName = "cell-"+i;
		if( checkError(cellName) ) return;
		str += cellToString(cellName);
		if(i % 3 == 0){
			str += ("\n");
		}
		else{
			str += (" ");
		}
	}

	console.log(str);
}

function checkWin(){
	for(var linekey in lines) {
		if(lines.hasOwnProperty(linekey)){
			var xWin = true;
			var oWin = true;
			_.each(lines[linekey], function(cell){
				xWin = xWin && lastState[cell+"$1"];
				oWin = oWin && lastState[cell+"$2"];
			});
			if(xWin){
				console.log("player X won!");
				return true;
			}
			if(oWin){
				console.log("player O won!");
				return true;
			}
		}
	}
	
	return false;
}

for(var i = 0; i < 9; i++){
	console.log("Iteration: "+i);
	// game rules
	onlyOneValueInACell();
	onlyOneChangeFromLastState();
	markedStayMarked();

	// player turn
	if(i%2 == 0){
		onlyAddingXs();
	}
	else{
		onlyAddingOs();
	}

	var sol = bp.getSolution();
	lastState = sol;
	bp.reset();

	printBoard();
	if(checkWin()) break;
}
