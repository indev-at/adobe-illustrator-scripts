// Createing square regmarks for selection

if ( app.selection == false ) {

	alert("Select Object/Group!");

} else {

	// GENERAL VARIABLES
	var myselection = app.selection;
	var mydoc = app.activeDocument;
	var AL = mydoc.activeLayer;
	var AD_LL = mydoc.layers.length;
	AL.name = "bg";

	//app.executeMenuCommand('group');
	// create group
	var groupSelection = mydoc.groupItems.add();
	groupSelection.name = "content";
	// add all path items to group
	for (i = 0; i < myselection.length; i++) {
		myselection[i].moveToEnd(groupSelection);
	}	

	// CONVERSION UNITS | 1mm = 2.834645 pt
	var mm = 2.834645;
	var markSize = 5*mm;

	var markSize = prompt("Mark-Size in mm: ", 5) * mm;

	// GET PERIMETER DATA
	function getPerimeter(){
		var i = 0, max = myselection.length;
		var x1, x2, y1, y2;
		var allminX = [];
		var allmaxX = [];
		var allminY = [];
		var allmaxY = [];

		for ( i; i < max; i++ ){
			allminX.push( selection[i].position[0] );
			allmaxX.push( selection[i].position[0] + selection[i].width );
			allminY.push( selection[i].position[1] );
			allmaxY.push( selection[i].position[1] - selection[i].height );
		}

		allminX.sort(function(a,b){return a-b;});
		allmaxX.sort(function(a,b){return a-b;});
		allminY.sort(function(a,b){return a-b;});
		allmaxY.sort(function(a,b){return a-b;});
		x1 = allminX[0];
		x2 = allmaxX[allmaxX.length - 1];
		y1 = allminY[allminY.length - 1];
		y2 = allmaxY[0];
		var bleed = 0; // add bleed if needed
		// now return top, left, width, height
		return [y1+bleed, x1-bleed, x2-x1+2*bleed, -(y2-y1)+2*bleed]
	}

	// MAKE MARKS
	function setMarks(perimeter){
		// top    perimeter[0]
		// left   perimeter[1]
		// width  perimeter[2]
		// height perimeter[3]
		var groupMarks = AL.groupItems.add(); 
		groupMarks.name = "marks";

		// calculate the number of horizontal regmarks needed
		//var regmarksInterval = 1000;
		var numHorizontalRegmarks = 2; // Math.ceil(perimeter[2]/regmarksInterval +1);

		//placement of top line of regmarks
		var topHorXpos = perimeter[1] - 1.5*markSize;
		var topHorYpos = perimeter[0] + 1.5*markSize;
		var botHorYpos = (perimeter[3] - perimeter[0])*-1 - markSize/2;

		// calculate horizontal gap between regmarks;
		var horGap = perimeter[2]/(numHorizontalRegmarks - 1) + 2*markSize;

		function makeRegmark (_ypos, _xpos){
			var marks = groupMarks.pathItems.rectangle(_ypos, _xpos, markSize, markSize),
			markColor = new CMYKColor;
			marks.name = "mark";
			markColor.magenta = 100;
			marks.stroked = false;
			marks.filled = true;
			marks.fillColor = markColor;
		}

		function makeHorRegmarks(){
			for (var i = 0; i < numHorizontalRegmarks; i++){
				makeRegmark (topHorYpos, topHorXpos);
				makeRegmark (botHorYpos, topHorXpos);
				topHorXpos += horGap;
			};

		}
		makeHorRegmarks();

		// calculate the number of vertical regmarks needed
		var numVerticalRegmarks = 2; //Math.ceil(perimeter[3]/regmarksInterval)-1;
		var verGap = perimeter[3]/(numVerticalRegmarks + 1) - markSize;
		var verYpos = perimeter[0] - verGap;
		var leftVerXpos = (perimeter[1]);
		var rightVerXpos = (perimeter[1] + perimeter[2]);

		function makeVerRegmarks(){
			for (var n = 0; n<numVerticalRegmarks; n++){
				makeRegmark (verYpos, leftVerXpos);
				makeRegmark (verYpos, rightVerXpos);
				verYpos -= verGap;
			}
		}
		//makeVerRegmarks();

		// GROUP EVERYTHING
		var groupAll = mydoc.groupItems.add();
		groupAll.name = "all";

		groupMarks.moveToEnd(groupAll);
		groupSelection.moveToEnd(groupAll);
		groupAll.selected = true;	

	}
	var p = getPerimeter();
	setMarks(p);

}