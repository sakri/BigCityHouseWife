

//HAS DEPENDENCY ON BCHWMathUtil

(function (window){

	BCHWColor=function(){}
	
	//==================================================
	//===================::RGBAColor::==================
	//==================================================

	BCHWColor.RGBAColor=function (){}
	
	BCHWColor.RGBAColor.prototype.red=0;
	BCHWColor.RGBAColor.prototype.green=0;
	BCHWColor.RGBAColor.prototype.blue=0;
	BCHWColor.RGBAColor.prototype.alpha=1;

	
	BCHWColor.RGBAColor.prototype.toString=function(){
		return "RGBAColor{red:"+this.red+" , green:"+this.green+" , blue:"+this.blue+" , alpha:"+this.alpha+"}";
	}
	
	//Canvas can take rgba(255,165,0,1) as a value for fillstyle and strokestyle
	BCHWColor.RGBAColor.prototype.getCanvasColorString=function(){
		return "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";
	}
	
	BCHWColor.createRGBAColor=function(red,green,blue,alpha){
		var color=new BCHWColor.RGBAColor();
		
		if(!isNaN(red)){
			color.red=BCHWMathUtil.clampRGB(red);
		}

		if(!isNaN(green)){
			color.green=BCHWMathUtil.clampRGB(green);
		}
		
		if(!isNaN(blue)){
			color.blue=BCHWMathUtil.clampRGB(blue);
		}
		
		if(!isNaN(alpha)){
			color.alpha=BCHWMathUtil.clamp(0,1,alpha);
		}	
		return color;
	}
		
	//==================================================
	//===================::BCHWColorsLib::==================
	//==================================================
		
	/*
	ORANGE:		246,160,37	F6A025
	GREEN:		167,209,101	A7D165
	RED:		222,112,111	DE706F
	PURPLE:		152,115,148	987394
	TURQUOISE:	102,204,204	66CCCC
	LIGHT BROWN:	173,134,70	AD8646
	DARK BROWN:	91,62,0		5B3E00
	BLACK:		51,51,51	333333
	DARK GRAY:	102,102,102	666666
	LIGHT GRAY:	219,203,191	DBCBBF
	*/

	//used for canvas context.fillStyle
	BCHWColor.BCHWColorsLib=function(){}

	/*
	BCHWColorsLib.ORANGE="rgb('246,160,37')";
	BCHWColorsLib.GREEN="rgb('167,209,101')";
	BCHWColorsLib.RED="rgb('222,112,111')";
	BCHWColorsLib.PURPLE="rgb('152,115,148')";
	BCHWColorsLib.TURQUOISE="rgb('102,204,204')";

	BCHWColorsLib.LIGHT_BROWN="rgb('173,134,70')";
	BCHWColorsLib.DARK_BROWN="rgb('91,62,0')";
	BCHWColorsLib.BLACK="rgb('51,51,51')";
	BCHWColorsLib.DARK_GRAY="rgb('102,102,102')";
	BCHWColorsLib.LIGHT_GRAY="rgb('219,203,191')";
	*/

	BCHWColor.BCHWColorsLib.ORANGE=BCHWColor.createRGBAColor(246,160,37);
	BCHWColor.BCHWColorsLib.GREEN=BCHWColor.createRGBAColor(167,209,101);
	BCHWColor.BCHWColorsLib.RED=BCHWColor.createRGBAColor(222,112,111);
	BCHWColor.BCHWColorsLib.PURPLE=BCHWColor.createRGBAColor(152,115,148);
	BCHWColor.BCHWColorsLib.TURQUOISE=BCHWColor.createRGBAColor(102,204,204);

	BCHWColor.BCHWColorsLib.LIGHT_BROWN=BCHWColor.createRGBAColor(173,134,70);
	BCHWColor.BCHWColorsLib.DARK_BROWN=BCHWColor.createRGBAColor(91,62,0);
	BCHWColor.BCHWColorsLib.BLACK=BCHWColor.createRGBAColor(51,51,51);
	BCHWColor.BCHWColorsLib.WHITE=BCHWColor.createRGBAColor(255,255,255);
	BCHWColor.BCHWColorsLib.DARK_GRAY=BCHWColor.createRGBAColor(102,102,102);
	BCHWColor.BCHWColorsLib.LIGHT_GRAY=BCHWColor.createRGBAColor(219,203,191);


	BCHWColor.BCHWColorsLib.fillPalette=[BCHWColor.BCHWColorsLib.ORANGE,BCHWColor.BCHWColorsLib.GREEN,BCHWColor.BCHWColorsLib.RED,BCHWColor.BCHWColorsLib.PURPLE];

	BCHWColor.BCHWColorsLib.getRandomFillPaletteColor=function(){
		return BCHWColor.BCHWColorsLib.fillPalette[Math.floor(Math.random()*BCHWColor.BCHWColorsLib.fillPalette.length)];
	}
		
	BCHWColor.BCHWColorsLib.getNextColor=function(previous){
		var color=BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
		if(previous==color)return BCHWColor.BCHWColorsLib.getNextColor(previous);
		return color;
	}
		
	window.BCHWColor=BCHWColor;
	
}(window));