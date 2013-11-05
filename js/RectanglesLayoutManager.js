/*

Constrained to a canvas width and height

The idea is that the layoutManager can have a "default value" for horizontalLayout, in the event that all lines
are to use the same horizontalLayout.  It must however remain possible for individual rows to have their own settings.

Same goes for gap

Consider putting all 3 classes within one self excecuting function or "namespace"

*/

	//==================================================
	//===================::LAYOUT MANAGER::=============
	//==================================================

(function (window){

	LayoutManager=function(){
		this.layoutRectangle=new BCHWGeom.Rectangle();
		this.lineHeight=10;
		this.verticalAlign=LayoutManager.VERTICAL_ALIGN_MIDDLE;//should be private
		this.horizontalAlign=LayoutManager.HORIZONTAL_ALIGN_MIDDLE;//should be private
	}

	LayoutManager.VERTICAL_ALIGN_TOP="verticalAlignTop";
	LayoutManager.VERTICAL_ALIGN_MIDDLE="verticalAlignMiddle";
	LayoutManager.VERTICAL_ALIGN_BOTTOM="verticalAlignBottom";

	LayoutManager.HORIZONTAL_ALIGN_LEFT="horizontalAlignLeft";
	LayoutManager.HORIZONTAL_ALIGN_RIGHT="horizontalAlignRight";
	LayoutManager.HORIZONTAL_ALIGN_MIDDLE="horizontalAlignMiddle";
	LayoutManager.HORIZONTAL_ALIGN_JUSTIFY="horizontalAlignJustify";
	
	LayoutManager.prototype.setVerticalAlign=function(align){
		switch(align){
			case LayoutManager.VERTICAL_ALIGN_TOP:
			case LayoutManager.VERTICAL_ALIGN_MIDDLE:
			case LayoutManager.VERTICAL_ALIGN_BOTTOM:
				this.verticalAlign=align;
				break;
			default:
				this.verticalAlign=LayoutManager.VERTICAL_ALIGN_MIDDLE
				//console.log("LayoutManager setVerticalAlign ERROR: '"+align+"' is not a supported value, verticalAlign set to default : "+LayoutManager.VERTICAL_ALIGN_MIDDLE);
				break;
		}
	}

	LayoutManager.prototype.setHorizontalAlign=function(align){
		switch(align){
			case LayoutManager.HORIZONTAL_ALIGN_LEFT:
			case LayoutManager.HORIZONTAL_ALIGN_RIGHT:
			case LayoutManager.HORIZONTAL_ALIGN_MIDDLE:
			case LayoutManager.HORIZONTAL_ALIGN_JUSTIFY:
				this.horizontalAlign=align;
				break;
			default:
				this.horizontalAlign=LayoutManager.HORIZONTAL_ALIGN_MIDDLE;
				//console.log("LayoutManager setHorizontalAlign ERROR: '"+align+"' is not a supported value, horizontalAlign set to default : "+LayoutManager.HORIZONTAL_ALIGN_MIDDLE);
				break;
		}
	}
		
	window.LayoutManager=LayoutManager;
}(window));


	//==================================================
	//=============::ROWS LAYOUT MANAGER::==============
	//==================================================
	
//Manages a list of RectangleLayoutRow items layout
(function (window){

	RowsLayoutManager=function(){
		this.rows=new Array();
	}
	
	RowsLayoutManager.prototype=new LayoutManager();
		
	//should be private
	RowsLayoutManager.prototype.addRow=function(row){
		//assert correct type
		this.rows.push(row);
	}	
	
	RowsLayoutManager.prototype.layoutRows=function(){}
	
	window.RowsLayoutManager=RowsLayoutManager;
}(window));


	//==================================================
	//============::RECTANGLE LAYOUT ROW::==============
	//==================================================

//One horizontal row, which lays out a number of BCHWGeom.Rectangle items.
(function (window){

	RectangleLayoutRow=function(){
		this.rectangles=new Array();
	}
	
	RectangleLayoutRow.prototype=new LayoutManager();
	
	RectangleLayoutRow.prototype.addRectangle=function(rect){
		this.rectangles.push(rect);
	}
	
	RectangleLayoutRow.prototype.layoutRectangles=function(){
		console.log("RectangleLayoutRow.prototype.layoutRectangles() ");
		console.log("layoutRectangle : "+this.layoutRectangle.toString());
		var currentX=this.layoutRectangle.x;
		var i,rect;
		for(i=0;i<this.rectangles.length;i++){
			rect=this.rectangles[i];
			rect.x=currentX;
			rect.y=this.layoutRectangle.y;
			rect.width=this.layoutRectangle.height;
			rect.height=this.layoutRectangle.height;
			currentX+=this.layoutRectangle.height;
			console.log("currentX : "+currentX);
			console.log(rect.toString());
		}
	}
	
	window.RectangleLayoutRow=RectangleLayoutRow;
	
}(window));



	//==================================================
	//============::RECTANGLE LAYOUT ROW::==============
	//==================================================

//One horizontal row, which lays out a number of BCHWGeom.Rectangle items.
(function (window){

	BCHWFontLayoutRow=function(){
		this.characters=new Array();
	}
	
	BCHWFontLayoutRow.prototype=new LayoutManager();
	
	BCHWFontLayoutRow.prototype.addCharacter=function(character){
		//assert correct type
		this.characters.push(character);
	}
	
	BCHWFontLayoutRow.prototype.layoutCharacters=function(){
		this["layoutCharacters_"+this.horizontalAlign]();
	}
	
	BCHWFontLayoutRow.prototype.getSampleRect=function(sampleHeight){
		var width=0;
		var i,character;
		for(i=0;i<this.characters.length;i++){
			character=this.characters[i];
			width+=sampleHeight*character.width;
		}
		return BCHWGeom.createRectangle(0,0,width,sampleHeight);
	}
	
	BCHWFontLayoutRow.prototype.layoutCharacters_horizontalAlignLeft=function(){
		console.log("layoutCharacters_horizontalAlignLeft()");
		//console.log("layoutRectangle : "+this.layoutRectangle.toString());
		var currentX=this.layoutRectangle.x+0;
		//console.log("currentX : "+currentX);
		var i,rect,character;
		for(i=0;i<this.characters.length;i++){
			character=this.characters[i];
			rect=character.roundedRect;
			rect.x=currentX;
			rect.y=this.layoutRectangle.y;
			rect.width=this.layoutRectangle.height*character.width;
			//console.log("rect.x : "+rect.x+" , rect.width : "+rect.width);
			rect.height=this.layoutRectangle.height;
			currentX+=rect.width;
			//console.log("currentX : "+currentX);
			//console.log(rect.toString());
		}
	}
	
	BCHWFontLayoutRow.prototype.layoutCharacters_horizontalAlignRight=function(){
		console.log("layoutCharacters_horizontalAlignRight() NOT IMPLENTED YET");
		this.layoutCharacters_horizontalAlignLeft();
	}
	
	BCHWFontLayoutRow.prototype.layoutCharacters_horizontalAlignMiddle=function(){
		//console.log("layoutCharacters_horizontalAlignMiddle()");
		var i,rect,character;
		var totalWidth=0;
		for(i=0;i<this.characters.length;i++){
			character=this.characters[i];
			rect=character.roundedRect;
			rect.y=this.layoutRectangle.y;
			rect.width=this.layoutRectangle.height*character.width;
			rect.height=this.layoutRectangle.height;
			totalWidth+=rect.width;
		}
		

		var currentX=BCHWGeom.RectangleUtil.getCenterX(this.layoutRectangle)-totalWidth/2;
		
		for(i=0;i<this.characters.length;i++){
			character=this.characters[i];
			rect=character.roundedRect;
			rect.x=currentX;
			currentX+=rect.width;
		}
	}
	
	BCHWFontLayoutRow.prototype.layoutCharacters_horizontalAlignJustify=function(){
		console.log("layoutCharacters_horizontalAlignJustify() NOT IMPLENTED YET");
		this.layoutCharacters_horizontalAlignLeft();
	}
	
	window.BCHWFontLayoutRow=BCHWFontLayoutRow;
	
}(window));