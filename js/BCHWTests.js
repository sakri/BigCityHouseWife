
//TODO use an existing unit testing framework

//=============================================================
//==============:: BIGCITYHOUSEWIFE ASSERT ::==================
//=============================================================

(function (window){

	BCHWAssert=function(){}
	
	BCHWAssert.prototype.testsRan=0;
	BCHWAssert.prototype.testsPassed=0;
	BCHWAssert.prototype.testsFailed=new Array();
	
	BCHWAssert.prototype.assertEquals=function(value1,value2,testName){
		this.testsRan++;
		if(value1==value2){
			this.testsPassed++;
		}else{
			this.testsFailed.push(testName +" failed assertEquals with values : ( "+value1+" , "+value2+" )");
		}
	}
	
	BCHWAssert.prototype.showSummary=function(){
		console.log(" ===========:: BCHW TESTS SUMMMARY ::==========");
		console.log(" ===========:: tests ran : "+this.testsRan+" ::===============");
		console.log(" ===========:: tests passed : "+this.testsPassed+" ::============");
		if(this.testsRan==this.testsPassed){
			console.log(" ===========:: ALL TESTS PASSED! ::============");		
		}else{
			console.log(" ===========:: !!! TESTS FAILED !!!! ::============");
			for(var i=0;i<this.testsFailed.length;i++){
				console.log("     => "+this.testsFailed[i]);
			}
		}
	}
	
	window.BCHWAssert=BCHWAssert;
	
}(window));


//=============================================================
//==============:: BIGCITYHOUSEWIFE TESTS ::==================
//=============================================================

(function (window){

	BCHWTests=function(){
		this.tests=new Array();
		this.verboseTests=new Array();
	}
		
	BCHWTests.prototype.addTest=function(test,verbose){
		this.tests.push(test);
		this.verboseTests.push(verbose);
	}
	
	BCHWTests.prototype.run=function(assertions){
		for(var i=0;i<this.tests.length;i++){
			this.tests[i](assertions,this.verboseTests[i]);
		}
	}
	
	window.BCHWTests=BCHWTests;
	
}(window));


function runTests(runDataTests,runVisualTests){
	console.time("runTests");
	var assertions=new BCHWAssert();
	var tests=new BCHWTests();
	if(runDataTests)runAllDataTests(tests);
	if(runVisualTests)runAllVisualTests(tests);
	tests.run(assertions);
	assertions.showSummary();
	console.timeEnd("runTests");
}

function runAllDataTests(tests){
	tests.addTest(testRectangle,false);
	tests.addTest(testRectangleUtil,true);
	tests.addTest(testRoundedRectangle,false);
	tests.addTest(testRGBAColor,false);
	tests.addTest(testBCHWColor,false);
	tests.addTest(testArrayUtil,false);
}

function runAllVisualTests(tests){
	tests.addTest(testRectangleUtilVisualFunctions);
	//tests.addTest(testBCHWFont,true);
	tests.addTest(testLayoutManagerProperties,false);//move to data tests
	tests.addTest(testLayoutManager,false);
	//tests.addTest(testRenderBCHWFontLayoutRow,true);
}

function logTestName(name){
	console.log(" ======::RUNNING TEST::======");
	console.log("BCHWTests."+name);
}

//=============================================================
//=========:: CONVENIENCE ASSERT FUNCTIONS ::==================
//=============================================================

function assertRectangle(rect,assertions,testName,x,y,width,height,right,bottom){
	assertions.assertEquals(rect.x,x,testName);
	assertions.assertEquals(rect.y,y,testName);
	assertions.assertEquals(rect.width,width,testName);
	assertions.assertEquals(rect.height,height,testName);
	assertions.assertEquals(rect.getRight(),right,testName);
	assertions.assertEquals(rect.getBottom(),bottom,testName);
}

function assertRoundedRectangle(roundedRect,assertions,testName,x,y,width,height,radius,right,bottom){
	assertions.assertEquals(roundedRect.x,x,testName);
	assertions.assertEquals(roundedRect.y,y,testName);
	assertions.assertEquals(roundedRect.width,width,testName);
	assertions.assertEquals(roundedRect.height,height,testName);
	assertions.assertEquals(roundedRect.radius,radius,testName);
	assertions.assertEquals(roundedRect.getRight(),right,testName);
	assertions.assertEquals(roundedRect.getBottom(),bottom,testName);
}

function assertRGBAColor(color,assertions,testName,red,green,blue,alpha){
	assertions.assertEquals(color.red,red,testName);
	assertions.assertEquals(color.green,green,testName);
	assertions.assertEquals(color.blue,blue,testName);
	assertions.assertEquals(color.alpha,alpha,testName);
}


//=============================================================
//====================:: ALL DATA UNIT TESTS ::==================
//=============================================================
function testRectangle(assertions,verbose){
	var testName="testRectangle()";
	if(verbose)logTestName(testName);
				
	var rect=BCHWGeom.createRectangle();
	if(verbose)console.log(rect.toString());
	assertRectangle(rect,assertions,testName,0,0,0,0,0,0);
	
	rect=BCHWGeom.createRectangle(100,600,20,30);
	if(verbose)console.log(rect.toString());
	assertRectangle(rect,assertions,testName,100,600,20,30,120,630);
	
	rect=BCHWGeom.createRectangle(100,100,100,100);
	assertions.assertEquals(rect.isSquare(rect),true,testName);
	assertions.assertEquals(rect.isLandscape(rect),false,testName);
	assertions.assertEquals(rect.isPortrait(rect),false,testName);
	
	rect.width=200;
	assertions.assertEquals(rect.isSquare(rect),false,testName);
	assertions.assertEquals(rect.isLandscape(rect),true,testName);
	assertions.assertEquals(rect.isPortrait(rect),false,testName);
	
	rect.width=50;
	assertions.assertEquals(rect.isSquare(rect),false,testName);
	assertions.assertEquals(rect.isLandscape(rect),false,testName);
	assertions.assertEquals(rect.isPortrait(rect),true,testName);
	
	assertions.assertEquals(rect.getSmallerSide(rect),50,testName);
	assertions.assertEquals(rect.getBiggerSide(rect),100,testName);
	
	rect=BCHWGeom.createRectangle(100.123,600.123,20.678,30.678);
	var decimalRect=rect.clone();
	decimalRect.floor();
	assertRectangle(decimalRect,assertions,testName,100,600,20,30,120,630);	
	
	decimalRect=rect.clone();
	decimalRect.ceil();
	assertRectangle(decimalRect,assertions,testName,101,601,21,31,122,632);	
	
	decimalRect=rect.clone();
	decimalRect.round();
	assertRectangle(decimalRect,assertions,testName,100,600,21,31,121,631);	
}

function testRoundedRectangle(assertions,verbose){	
	var testName="testRoundedRectangle()";
	if(verbose)logTestName(testName);
	var rect=BCHWGeom.createRoundedRectangle();
	if(verbose)console.log(rect.toString());
	assertRoundedRectangle(rect,assertions,testName,0,0,0,0,5,0,0);
		
	rect=BCHWGeom.createRoundedRectangle(200,800,600,30,10);
	if(verbose)console.log(rect.toString());
	assertRoundedRectangle(rect,assertions,testName,200,800,600,30,10,800,830);
}

function testRectangleUtil(assertions,verbose){
	var testName="testRectangleUtil()";
	if(verbose)logTestName(testName);
	var rect=BCHWGeom.createRectangle(100,100,100,100);
	var rect2=BCHWGeom.createRectangle(100,100,200,200);

	assertions.assertEquals(BCHWGeom.RectangleUtil.getBiggerRectangle(rect,rect2),rect2,testName);	
	assertions.assertEquals(BCHWGeom.RectangleUtil.getSmallerRectangle(rect,rect2),rect,testName);	
	
	assertions.assertEquals(BCHWGeom.RectangleUtil.isBiggerThan(rect2,rect),true,testName);
	assertions.assertEquals(BCHWGeom.RectangleUtil.isBiggerThan(rect,rect2),false,testName);
	
	assertions.assertEquals(BCHWGeom.RectangleUtil.isSmallerThan(rect,rect2),true,testName);
	assertions.assertEquals(BCHWGeom.RectangleUtil.isSmallerThan(rect2,rect),false,testName);
	
	assertions.assertEquals(BCHWGeom.RectangleUtil.isBiggerThanOrEqual(rect2,rect),true,testName);	
	assertions.assertEquals(BCHWGeom.RectangleUtil.isSmallerThanOrEqual(rect,rect2),true,testName);	

	assertions.assertEquals(BCHWGeom.RectangleUtil.isEqual(rect,rect2),false,testName);	
	assertions.assertEquals(BCHWGeom.RectangleUtil.hasEqualArea(rect,rect2),false,testName);	
	
	rect.width=200;
	rect.height=200;
	
	assertions.assertEquals(BCHWGeom.RectangleUtil.isBiggerThanOrEqual(rect2,rect),true,testName);	
	assertions.assertEquals(BCHWGeom.RectangleUtil.isSmallerThanOrEqual(rect,rect2),true,testName);	
	assertions.assertEquals(BCHWGeom.RectangleUtil.isEqual(rect,rect2),true,testName);	
	assertions.assertEquals(BCHWGeom.RectangleUtil.hasEqualArea(rect,rect2),true,testName);	
	
	rect=BCHWGeom.createRectangle(100,100,100,100);
	assertions.assertEquals(BCHWGeom.RectangleUtil.getCenterX(rect),150,testName);
	assertions.assertEquals(BCHWGeom.RectangleUtil.getCenterY(rect),150,testName);

}


function testRGBAColor(assertions,verbose){
	var testName="testCanvasColor()";
	if(verbose)logTestName(testName);
	var color=new BCHWColor.createRGBAColor();
	if(verbose)console.log(color.toString());
	assertRGBAColor(color,assertions,testName,0,0,0,1);
	
	color=new BCHWColor.createRGBAColor(10,255,120);
	if(verbose)console.log(color.toString());
	assertRGBAColor(color,assertions,testName,10,255,120,1);
	
	color=new BCHWColor.createRGBAColor(10,255,120,.5);
	if(verbose)console.log(color.toString());
	assertRGBAColor(color,assertions,testName,10,255,120,.5);
}


function testBCHWColor(assertions,verbose){
	var testName="testBCHWColor()";
	if(verbose)logTestName(testName);
	for(var i=0;i<5;i++){
		if(verbose)console.log(BCHWColor.BCHWColorsLib.getRandomFillPaletteColor().toString());
	}
}

function testArrayUtil(assertions,verbose){
	var testName="testArrayUtil()";
	if(verbose)logTestName(testName);
	var array;//=[0,1,2,3,4,5,6];
	for(var i=0;i<10;i++){
		array=[0,1,2,3,4,5,6];
		array=BCHWArrayUtil.shuffle(array);
		if(verbose)console.log(array);	
	}
}


//=============================================================
//====================:: ALL VISUAL UNIT TESTS ::==================
//=============================================================




function renderRectangle(rect,context){
	context.beginPath();
	context.lineWidth=1;

	context.fillStyle=BCHWColor.BCHWColorsLib.getRandomFillPaletteColor().getCanvasColorString();
	context.strokeStyle=BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
		
	context.moveTo(rect.x,rect.y);
	context.lineTo(rect.getRight(),rect.y);
	context.lineTo(rect.getRight(),rect.getBottom());
	context.lineTo(rect.x,rect.getBottom());
	context.lineTo(rect.x,rect.y);
		
	context.fill();
	context.stroke(); 
}


function testRectangleUtilVisualFunctions(assertions,verbose){
	var canvas=document.querySelector("canvas");
	var context=canvas.getContext("2d");
	//drawRandomRectangles(canvas,context);
	//alignRectangles(canvas,context);
	//scaleRectangles(canvas,context);
	//scaleRectangles2(canvas,context);
	scaleRectangleInto(canvas,context);
}

function drawRandomRectangles(canvas,context){
	var container=BCHWGeom.createRectangle(50,50,canvas.width-100,canvas.height-100);
	renderRectangle(container,context);
	for(var i=0;i<20;i++){
		rect=BCHWGeom.RectangleUtil.createRandomIntegerRectangleIn(container);
		renderRectangle(rect,context);
	}
}

function alignRectangles(canvas,context){
	var staticRect=BCHWGeom.createRectangle(50,50,200,200);
	renderRectangle(staticRect,context);

	var rectToAlign=BCHWGeom.createRectangle(0,0,20,20);
	//TOP LEFT CORNER
	BCHWGeom.RectangleUtil.verticalAlignTop(staticRect,rectToAlign);
	BCHWGeom.RectangleUtil.horizontalAlignLeft(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);
	
	//TOP MIDDLE
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);

	//TOP RIGHT	
	BCHWGeom.RectangleUtil.horizontalAlignRight(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);

	//MIDDLE LEFT
	BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect,rectToAlign);
	BCHWGeom.RectangleUtil.horizontalAlignLeft(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);

	//MIDDLE MIDDLE
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);
	
	//MIDDLE RIGHT
	BCHWGeom.RectangleUtil.horizontalAlignRight(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);

	//BOTTOM LEFT
	BCHWGeom.RectangleUtil.verticalAlignBottom(staticRect,rectToAlign);
	BCHWGeom.RectangleUtil.horizontalAlignLeft(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);
	
	//BOTTOM MIDDLE
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);
	
	//BOTTOM RIGHT
	BCHWGeom.RectangleUtil.horizontalAlignRight(staticRect,rectToAlign);
	renderRectangle(rectToAlign,context);
}

function scaleRectangles(canvas,context){
	var bigRect=BCHWGeom.createRectangle(0,0,400,400);
	var staticRect1=BCHWGeom.createRectangle(50,50,200,200);
	renderRectangle(staticRect1,context);
	var staticRect2=BCHWGeom.createRectangle(300,50,200,200);
	renderRectangle(staticRect2,context);
	
	var rect=BCHWGeom.RectangleUtil.createRandomIntegerRectangleIn(bigRect);
	BCHWGeom.RectangleUtil.scaleRectToPortraitFit(staticRect1,rect);
	BCHWGeom.RectangleUtil.verticalAlignTop(staticRect1,rect);
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect1,rect);
	renderRectangle(rect,context);

	rect=BCHWGeom.RectangleUtil.createRandomIntegerRectangleIn(bigRect);
	BCHWGeom.RectangleUtil.scaleRectToLandscapeFit(staticRect2,rect);
	BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect2,rect);
	BCHWGeom.RectangleUtil.horizontalAlignLeft(staticRect2,rect);
	renderRectangle(rect,context);
	
}

function scaleRectangles2(canvas,context){
	
	var staticRect=BCHWGeom.createRectangle(50,50,200,200);
	renderRectangle(staticRect,context);
	var rect=BCHWGeom.createRectangle(0,0,10,10);
	BCHWGeom.RectangleUtil.scaleRectToPortraitFit(staticRect,rect);
	BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect,rect);
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rect);
	renderRectangle(rect,context);

	staticRect.update(300);
	renderRectangle(staticRect,context);
	rect=BCHWGeom.createRectangle(0,0,10,10);
	BCHWGeom.RectangleUtil.scaleRectToLandscapeFit(staticRect,rect);
	BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect,rect);
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rect);
	renderRectangle(rect,context);
	
	staticRect.update(50,300);
	renderRectangle(staticRect,context);
	rect=BCHWGeom.createRectangle(0,0,20,10);
	BCHWGeom.RectangleUtil.scaleRectToLandscapeFit(staticRect,rect);
	BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect,rect);
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rect);
	renderRectangle(rect,context);
	
	staticRect.update(300,300);
	renderRectangle(staticRect,context);
	rect=BCHWGeom.createRectangle(0,0,10,20);
	BCHWGeom.RectangleUtil.scaleRectToPortraitFit(staticRect,rect);
	BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect,rect);
	BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rect);
	renderRectangle(rect,context);
	
}

function scaleRectangleInto(canvas,context){
	var bigRect=BCHWGeom.createRectangle(0,0,400,400);
	var staticRect=BCHWGeom.createRectangle(50,50,200,200);
	renderRectangle(staticRect,context);
	rect=BCHWGeom.RectangleUtil.createRandomIntegerRectangleIn(bigRect);
	BCHWGeom.RectangleUtil.scaleRectInto(staticRect,rect);
	renderRectangle(rect,context);
}


function testBCHWFont(assertions,verbose){
	var testName="testBCHWFont()";
	if(verbose)logTestName(testName);
	for(var i=0;i<50;i++){
		testDrawRandomCharacter(assertions,verbose);
	}
}

function testDrawRandomCharacter(assertions,verbose){
	var canvas=document.querySelector("canvas");
	var context=canvas.getContext("2d");
	
	var color=BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
	var lineColor=BCHWColor.BCHWColorsLib.WHITE;
	
	var hmargin=canvas.width*.1;
	var vmargin=canvas.height*.1;
	var maxWidth=Math.floor(canvas.width*.8);
	var maxHeight=Math.floor(canvas.height*.8);
	
	var cx=hmargin+Math.floor(Math.random()*maxWidth);
	var cy=vmargin+Math.floor(Math.random()*maxHeight);
	
	var cw=Math.floor(Math.random()*(canvas.width-hmargin-cx));
	var ch=Math.floor(Math.random()*(canvas.height-vmargin-cy));
	
	if(cw<40)cw=40;
	if(ch<40)ch=40;
	
	var roundedRect=BCHWGeom.createRoundedRectangle(cx,cy,cw,ch,8);
	var stri="bcefghiostuwy";
	var selectedCharacter=stri.charAt(Math.floor(Math.random()*stri.length));
	var character=BCHWFontCharacter.createBCHWFontCharacter(selectedCharacter,color,lineColor,4,roundedRect);
	character.renderToContext(context);	
}

//move to data tests

//must receive a new instance of a LayoutManager
function testLayoutManagerLayoutProperties(assertions,testName,manager){
	
	//check default align
	assertions.assertEquals(manager.verticalAlign,LayoutManager.VERTICAL_ALIGN_MIDDLE,testName);
	assertions.assertEquals(manager.horizontalAlign,LayoutManager.HORIZONTAL_ALIGN_MIDDLE,testName);
	
	//check align setting
	//vertical align
	manager.setVerticalAlign(LayoutManager.VERTICAL_ALIGN_BOTTOM);
	assertions.assertEquals(manager.verticalAlign,LayoutManager.VERTICAL_ALIGN_BOTTOM,testName);
	
	manager.setVerticalAlign(LayoutManager.VERTICAL_ALIGN_TOP);
	assertions.assertEquals(manager.verticalAlign,LayoutManager.VERTICAL_ALIGN_TOP,testName);
	
	manager.setVerticalAlign(LayoutManager.VERTICAL_ALIGN_MIDDLE);
	assertions.assertEquals(manager.verticalAlign,LayoutManager.VERTICAL_ALIGN_MIDDLE,testName);
	
	manager.setVerticalAlign("nonExistingAlign");
	assertions.assertEquals(manager.verticalAlign,LayoutManager.VERTICAL_ALIGN_MIDDLE,testName);

	//horizontal align	
	manager.setHorizontalAlign(LayoutManager.HORIZONTAL_ALIGN_LEFT);
	assertions.assertEquals(manager.horizontalAlign,LayoutManager.HORIZONTAL_ALIGN_LEFT,testName);	
	
	manager.setHorizontalAlign(LayoutManager.HORIZONTAL_ALIGN_RIGHT);
	assertions.assertEquals(manager.horizontalAlign,LayoutManager.HORIZONTAL_ALIGN_RIGHT,testName);	

	manager.setHorizontalAlign(LayoutManager.HORIZONTAL_ALIGN_MIDDLE);
	assertions.assertEquals(manager.horizontalAlign,LayoutManager.HORIZONTAL_ALIGN_MIDDLE,testName);	
	
	manager.setHorizontalAlign(LayoutManager.HORIZONTAL_ALIGN_JUSTIFY);
	assertions.assertEquals(manager.horizontalAlign,LayoutManager.HORIZONTAL_ALIGN_JUSTIFY,testName);	
	
	manager.setHorizontalAlign("nonExistingAlign");
	assertions.assertEquals(manager.horizontalAlign,LayoutManager.HORIZONTAL_ALIGN_MIDDLE,testName);	
	
	return manager;
}

function testLayoutManagerProperties(assertions,verbose){
	var testName="testLayoutManagerProperties()";
	if(verbose)logTestName(testName);
	var canvas=document.querySelector("canvas");
	var context=canvas.getContext("2d");
	var rowsManager=testLayoutManagerLayoutProperties(assertions,testName,new RowsLayoutManager());
	var i,row;
	for(i=0;i<4;i++){
		row=testLayoutManagerLayoutProperties(assertions,testName,new RectangleLayoutRow());
		rowsManager.addRow(row);
	}
	assertions.assertEquals(rowsManager.rows.length,4,testName);
}

function renderBCHWFontLayoutRow(manager,text,context){
	
	var fontCharacters=new Array();
	var lineColor=BCHWColor.BCHWColorsLib.WHITE;
	var character,color,i,fontCharacter;
	for(i=0;i<text.length;i++){
		character=text.charAt(i);
		color=BCHWColor.BCHWColorsLib.getNextColor(color);
		fontCharacter=BCHWFontCharacter.createBCHWFontCharacter(character,color,lineColor,4, new BCHWGeom.RoundedRectangle());
		if(character==" ")fontCharacter.width=.5;
		manager.addCharacter(fontCharacter);
		fontCharacters[i]=fontCharacter;
	}
	
	manager.layoutCharacters();
	
	for(i=0;i<fontCharacters.length;i++){
		fontCharacter=fontCharacters[i];
		fontCharacter.renderToContext(context);	
	}
}

function testRenderBCHWFontLayoutRow(assertions,verbose){
	var testName="testRenderBCHWFontLayoutRow()";
	if(verbose)logTestName(testName);

	var canvas=document.querySelector("canvas");
	var context=canvas.getContext("2d");

	var rowManager=new BCHWFontLayoutRow();
	var layoutRectangle=BCHWGeom.createRectangle(canvas.width*.1,canvas.height*.1,800,80);
	rowManager.layoutRectangle=layoutRectangle;
	if(verbose)console.log("rowManager.layoutRectangle.toString() : "+rowManager.layoutRectangle.toString());

	renderBCHWFontLayoutRow(rowManager,"big city",context);
	
	rowManager=new BCHWFontLayoutRow();
	layoutRectangle=BCHWGeom.createRectangle(canvas.width*.1,canvas.height*.1+80,800,80);
	rowManager.layoutRectangle=layoutRectangle;
	if(verbose)console.log("rowManager.layoutRectangle.toString() : "+rowManager.layoutRectangle.toString());
	renderBCHWFontLayoutRow(rowManager,"house wife",context);

}

function testLayoutManager(assertions,verbose){
	var testName="testLayoutManager()";
	if(verbose)logTestName(testName);
	var canvas=document.querySelector("canvas");
	var context=canvas.getContext("2d");
	var rowsManager=new RowsLayoutManager(context);
	var i,row;
	for(i=0;i<4;i++){
		row=new RectangleLayoutRow();
		rowsManager.addRow(row);
	}
	assertions.assertEquals(rowsManager.rows.length,4,testName);
}
