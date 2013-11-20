//===========================================================
//===================::LAYOUT RECTANGLE::=============
//==========================================================

(function (window){

	var LayoutRectangle = function(canvas, x, y, width, height){
        BCHWGeom.Rectangle.call(this, x, y, width, height);
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
		this.horizontalAlign = LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE;
	};

    //subclass extends superclass
    LayoutRectangle.prototype = Object.create(BCHWGeom.Rectangle.prototype);
    LayoutRectangle.prototype.constructor = BCHWGeom.Rectangle;

	LayoutRectangle.VERTICAL_ALIGN_TOP = "verticalAlignTop";
	LayoutRectangle.VERTICAL_ALIGN_MIDDLE = "verticalAlignMiddle";
	LayoutRectangle.VERTICAL_ALIGN_BOTTOM = "verticalAlignBottom";

	LayoutRectangle.HORIZONTAL_ALIGN_LEFT = "horizontalAlignLeft";
	LayoutRectangle.HORIZONTAL_ALIGN_RIGHT = "horizontalAlignRight";
	LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE = "horizontalAlignMiddle";
	LayoutRectangle.HORIZONTAL_ALIGN_JUSTIFY = "horizontalAlignJustify";
	
	LayoutRectangle.prototype.setVerticalAlign = function(align){
		switch(align){
			case LayoutRectangle.VERTICAL_ALIGN_TOP:
			case LayoutRectangle.VERTICAL_ALIGN_MIDDLE:
			case LayoutRectangle.VERTICAL_ALIGN_BOTTOM:
				this.verticalAlign = align;
				break;
			default:
				this.verticalAlign = LayoutRectangle.VERTICAL_ALIGN_MIDDLE;
				//console.log("LayoutRectangle setVerticalAlign ERROR: '"+align+"' is not a supported value, verticalAlign set to default : "+LayoutRectangle.VERTICAL_ALIGN_MIDDLE);
				break;
		}
	};

	LayoutRectangle.prototype.setHorizontalAlign = function(align){
		switch(align){
			case LayoutRectangle.HORIZONTAL_ALIGN_LEFT:
			case LayoutRectangle.HORIZONTAL_ALIGN_RIGHT:
			case LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE:
			case LayoutRectangle.HORIZONTAL_ALIGN_JUSTIFY:
				this.horizontalAlign = align;
				break;
			default:
				this.horizontalAlign = LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE;
				//console.log("LayoutRectangle setHorizontalAlign ERROR: '"+align+"' is not a supported value, horizontalAlign set to default : "+LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE);
				break;
		}
	};

    LayoutRectangle.prototype.clear = function(){
        this.context.clearRect(this.x, this.y, this.width, this.height);
    }
		
	window.LayoutRectangle = LayoutRectangle;

}(window));



//==================================================
//============::BCHW FONT LAYOUT ROW::==============
//==================================================

//One horizontal row, which lays out a number of BCHWGeom.Rectangle items.
//rename, potentially this can be used to layout generic blocks instead of BCHWFont instances
(function (window){

	var BCHWFontLayoutRect = function(canvas, x, y, width, height){
        LayoutRectangle.call(this, canvas, x, y, width, height);
		this.characters = [];
	};

    //subclass extends superclass
    BCHWFontLayoutRect.prototype = Object.create(LayoutRectangle.prototype);
    BCHWFontLayoutRect.prototype.constructor = LayoutRectangle;
	
	BCHWFontLayoutRect.prototype.addCharacter = function(character){
		//assert correct type
		this.characters.push(character);
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters = function(){
		this["layoutCharacters_"+this.horizontalAlign]();
	};
	
	BCHWFontLayoutRect.prototype.getContentRect = function(rowHeight){
		var width = 0;
		var i, character;
		for(i=0; i<this.characters.length; i++){
			character = this.characters[i];
			width += rowHeight*character.width;
		}
		return new BCHWGeom.Rectangle(0, 0, width, rowHeight);
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignLeft = function(){
		console.log("layoutCharacters_horizontalAlignLeft()");
		//console.log("layoutRectangle : "+this.toString());
		var currentX=this.x+0;
		//console.log("currentX : "+currentX);
		var i,rect,character;
		for(i=0;i<this.characters.length;i++){
			character=this.characters[i];
			rect=character.roundedRect;
			rect.x=currentX;
			rect.y=this.y;
			rect.width=this.height*character.width;
			//console.log("rect.x : "+rect.x+" , rect.width : "+rect.width);
			rect.height=this.height;
			currentX+=rect.width;
			//console.log("currentX : "+currentX);
			//console.log(rect.toString());
		}
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignRight = function(){
        console.log("layoutCharacters_horizontalAlignRight()");
        //console.log("layoutRectangle : "+this.toString());
        var currentX = this.getRight();
        //console.log("currentX : "+currentX);
        var i,rect,character;
        for(i=this.characters.length-1;i>-1;i--){
            character = this.characters[i];
            rect = character.roundedRect;
            rect.width = this.height*character.width;
            rect.x = currentX - rect.width;
            rect.y = this.y;
            //console.log("rect.x : "+rect.x+" , rect.width : "+rect.width);
            rect.height = this.height;
            currentX -= rect.width;
            //console.log("currentX : "+currentX);
            //console.log(rect.toString());
        }
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignMiddle = function(){
		//console.log("layoutCharacters_horizontalAlignMiddle()");
		var i, rect, character;
		var totalWidth = 0;
		for(i=0; i<this.characters.length; i++){
			character = this.characters[i];
			rect = character.roundedRect;
			rect.y = this.y;
			rect.width = this.height*character.width;
			rect.height = this.height;
			totalWidth += rect.width;
		}
		
		var currentX = BCHWGeom.RectangleUtil.getCenterX(this)-totalWidth/2;
		
		for(i=0; i<this.characters.length; i++){
			character = this.characters[i];
			rect = character.roundedRect;
			rect.x = currentX;
			currentX += rect.width;
		}
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignJustify = function(){
		console.log("layoutCharacters_horizontalAlignJustify() NOT IMPLENTED YET");
		this.layoutCharacters_horizontalAlignLeft();
	};
	
	window.BCHWFontLayoutRect = BCHWFontLayoutRect;
	
}(window));