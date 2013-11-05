
(function (window){

	var BCHWFontCharacter = function (){
		this.width=1;//rename to width percent?!
		this.color=new BCHWColor.createRGBAColor();
		this.thickness=1;
		this.roundedRect;//TODO reconsider naming roundedRectangle? just rectangle? bounds?	
	};
	
	BCHWFontCharacter.prototype.renderFunction = function(context,character){
		//BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
	};

	BCHWFontCharacter.prototype.renderToContext = function(context){
		this.renderFunction(context,this);
	};
	
	BCHWFontCharacter.prototype.addRandomness=function(maxPos,maxScale){
		this.roundedRect.x+=BCHWMathUtil.getRandomNumberInRange(-maxPos,maxPos);
		this.roundedRect.y+=BCHWMathUtil.getRandomNumberInRange(-maxPos,maxPos);
		this.roundedRect.scaleX(1+BCHWMathUtil.getRandomNumberInRange(-maxScale,maxScale));
		this.roundedRect.scaleY(1+BCHWMathUtil.getRandomNumberInRange(-maxScale,maxScale));
	};

	
	BCHWFontCharacter.createBCHWFontCharacter=function (character,color,lineColor,thickness,roundedRect){
		//TODO add Failsafes!
		var fontCharacter=new BCHWFontCharacter();
		fontCharacter.color=color;
		fontCharacter.lineColor=lineColor;
		fontCharacter.thickness=thickness;
		fontCharacter.roundedRect=roundedRect;
		var renderFunction=BCHWFontCharacterRenderer.getRenderFunction(character);
		if(renderFunction){
            fontCharacter.renderFunction=renderFunction;
        }
		fontCharacter.width=BCHWFontCharacterRenderer.getCharacterWidthPercent(character);
		//console.log("BCHWFontCharacter.createBCHWFontCharacter width : "+fontCharacter.width);
		return fontCharacter;
	};
	
	window.BCHWFontCharacter=BCHWFontCharacter;
}(window));


(function (window){

	var BCHWFontCharacterRenderer = function (){};

	//THIS SHOULD BE IN A geom JS File or so
	BCHWFontCharacterRenderer.renderRoundedRectToContext = function(context,character){
		context.beginPath();
		context.lineWidth=character.thickness;
		context.fillStyle=character.color.getCanvasColorString();
		context.strokeStyle=character.lineColor.getCanvasColorString();
			
		context.moveTo(character.roundedRect.x,character.roundedRect.y+character.roundedRect.radius);  
		context.lineTo(character.roundedRect.x,character.roundedRect.y+character.roundedRect.height-character.roundedRect.radius);  
		context.quadraticCurveTo(character.roundedRect.x,character.roundedRect.y+character.roundedRect.height,character.roundedRect.x+character.roundedRect.radius,character.roundedRect.y+character.roundedRect.height);  
		context.lineTo(character.roundedRect.x+character.roundedRect.width-character.roundedRect.radius,character.roundedRect.y+character.roundedRect.height);  
		context.quadraticCurveTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.height,character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.height-character.roundedRect.radius);  
		context.lineTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.radius);  
		context.quadraticCurveTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y,character.roundedRect.x+character.roundedRect.width-character.roundedRect.radius,character.roundedRect.y);  
		context.lineTo(character.roundedRect.x+character.roundedRect.radius,character.roundedRect.y);  
		context.quadraticCurveTo(character.roundedRect.x,character.roundedRect.y,character.roundedRect.x,character.roundedRect.y+character.roundedRect.radius);  
		context.fill();
		context.stroke();  
	};

	
	
	//bcefghiostuwy
	BCHWFontCharacterRenderer.getRenderFunction = function(character){
		if(!character || character==undefined){
            return null;
        }
		switch(character.toLowerCase()){
			case "b":
			case "c":
			case "e":
			case "f":
			case "g":
			case "h":
			case "i":
			case "o":
			case "s":
			case "t":
			case "u":
			case "w":
			case "y":
				return BCHWFontCharacterRenderer["render"+character.toUpperCase()];
				break;
		}
		return null;
	};
	
	//bcefghiostuwy
	BCHWFontCharacterRenderer.getCharacterWidthPercent = function(character){
		var percent = 1;
		if(!character || character==undefined){
            return percent;
        }
		switch(character.toLowerCase()){
			case "b":
				percent=1;
				break;
			case "c":
				percent=.9;
				break;
			case "e":
				percent=.8;
				break;
			case "f":
				percent=.8;
				break;
			case "g":
				percent=.9;
				break;
			case "h":
				percent=.9;
				break;
			case "i":
				percent=.5;
				break;
			case "o":
				percent=.9;
				break;
			case "s":
				percent=.8;
				break;
			case "t":
				percent=1;
				break;
			case "u":
				percent=.9;
				break;
			case "w":
				percent=1.2;
				break;
			case "y":
				percent=1;
				break;
		}
		return percent;
	};

	BCHWFontCharacterRenderer.renderB = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var right = character.roundedRect.x+character.roundedRect.width;
		var yMiddle = character.roundedRect.y+character.roundedRect.height/2;
		context.moveTo(right, yMiddle);
		context.lineTo(right-character.roundedRect.width/4,yMiddle);
		
		var fourthHeight=character.roundedRect.height/4;
		context.moveTo(character.roundedRect.x+character.roundedRect.width/2,character.roundedRect.y+fourthHeight);
		context.lineTo(character.roundedRect.x+character.roundedRect.width/2+character.roundedRect.width/4,character.roundedRect.y+fourthHeight);
		
		context.moveTo(character.roundedRect.x+character.roundedRect.width/2,character.roundedRect.y+fourthHeight*3);
		context.lineTo(character.roundedRect.x+character.roundedRect.width/2+character.roundedRect.width/4,character.roundedRect.y+fourthHeight*3);
		
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderC=function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var right=character.roundedRect.x+character.roundedRect.width;
		var yMiddle=character.roundedRect.y+character.roundedRect.height/2;
		var xMiddle=character.roundedRect.x+character.roundedRect.width/2;
		context.moveTo(right,yMiddle);
		context.lineTo(xMiddle,yMiddle);
		
		var fourthHeight=character.roundedRect.height/4;
		context.moveTo(xMiddle,character.roundedRect.y+fourthHeight);
		context.lineTo(xMiddle,character.roundedRect.y+fourthHeight*3);
			
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderE = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var right=character.roundedRect.x+character.roundedRect.width;
		var fourthWidth=character.roundedRect.width/4;
		var thirdHeight=character.roundedRect.height/3;
		context.moveTo(right,character.roundedRect.y+thirdHeight);
		context.lineTo(right-fourthWidth,character.roundedRect.y+thirdHeight);
		
		context.moveTo(right,character.roundedRect.y+thirdHeight*2);
		context.lineTo(right-fourthWidth,character.roundedRect.y+thirdHeight*2);
			
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderF = function(context,character){
		context.beginPath();
		context.lineWidth=character.thickness;
		context.fillStyle=character.color.getCanvasColorString();
		context.strokeStyle=character.lineColor.getCanvasColorString();
						
		var thirdWidth=character.roundedRect.width/3;
		var thirdHeight=character.roundedRect.height/3;
		var right=character.roundedRect.x+character.roundedRect.width;
		var bottom=character.roundedRect.y+character.roundedRect.height;
		
		context.moveTo(character.roundedRect.x,character.roundedRect.y+character.roundedRect.radius);  
		context.lineTo(character.roundedRect.x,bottom-character.roundedRect.radius);  
		context.quadraticCurveTo(character.roundedRect.x,bottom,character.roundedRect.x+character.roundedRect.radius,character.roundedRect.y+character.roundedRect.height);  
		
		context.lineTo(character.roundedRect.x+thirdWidth*2-character.roundedRect.radius,bottom);  
		context.quadraticCurveTo(character.roundedRect.x+thirdWidth*2,bottom,character.roundedRect.x+thirdWidth*2,bottom-character.roundedRect.radius);  
		
		context.lineTo(character.roundedRect.x+thirdWidth*2,bottom-thirdHeight);  	
		context.lineTo(right-character.roundedRect.radius,bottom-thirdHeight);
		context.quadraticCurveTo(right,bottom-thirdHeight,right,bottom-thirdHeight-character.roundedRect.radius);
		
		context.lineTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.radius);  
		context.quadraticCurveTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y,character.roundedRect.x+character.roundedRect.width-character.roundedRect.radius,character.roundedRect.y);  
		context.lineTo(character.roundedRect.x+character.roundedRect.radius,character.roundedRect.y);  
		context.quadraticCurveTo(character.roundedRect.x,character.roundedRect.y,character.roundedRect.x,character.roundedRect.y+character.roundedRect.radius);  

		context.fill();
		context.stroke();

		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();

		context.moveTo(right,character.roundedRect.y+thirdHeight);
		context.lineTo(right-thirdWidth,character.roundedRect.y+thirdHeight);
		
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderG = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var right=character.roundedRect.x+character.roundedRect.width;
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var halfY=character.roundedRect.y+character.roundedRect.height/1.8;
		var fourthWidth=character.roundedRect.width/4;
		var fourthHeight=character.roundedRect.height/4;
		
		context.moveTo(right,halfY);
		context.lineTo(halfX,halfY);
		context.lineTo(halfX,halfY+fourthHeight);
		context.lineTo(halfX+fourthWidth,halfY+fourthHeight);

		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderH = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var fourthHeight=character.roundedRect.height/4;
		
		context.moveTo(halfX,character.roundedRect.y);
		context.lineTo(halfX,character.roundedRect.y+fourthHeight);
		
		context.moveTo(halfX,character.roundedRect.y+character.roundedRect.height);
		context.lineTo(halfX,character.roundedRect.y+character.roundedRect.height-fourthHeight);

		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderI = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
	};
	
	BCHWFontCharacterRenderer.renderO = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var thirdHeight=character.roundedRect.height/3;
		
		context.moveTo(halfX,character.roundedRect.y+thirdHeight);
		context.lineTo(halfX,character.roundedRect.y+thirdHeight*2);

		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderS = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();

		var right=character.roundedRect.x+character.roundedRect.width;	
		var thirdWidth=character.roundedRect.width/3;
		var thirdHeight=character.roundedRect.height/3;
		
		context.moveTo(right,character.roundedRect.y+thirdHeight);
		context.lineTo(right-thirdWidth,character.roundedRect.y+thirdHeight);

		context.moveTo(character.roundedRect.x,character.roundedRect.y+thirdHeight*2);
		context.lineTo(character.roundedRect.x+thirdWidth,character.roundedRect.y+thirdHeight*2);

		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderT = function(context,character){

		context.beginPath();
		context.lineWidth=character.thickness;
		context.fillStyle=character.color.getCanvasColorString();
		context.strokeStyle=character.lineColor.getCanvasColorString();

		var rect=character.roundedRect;	
		var radius=character.roundedRect.radius;

		var thirdWidth=rect.width/3;
		var thirdHeight=rect.height/3;
		var right=rect.x+rect.width;
		var bottom=rect.y+rect.height;
		
		
		context.moveTo(rect.x,rect.y+radius);  
		context.lineTo(rect.x,bottom-thirdHeight-radius);
		context.quadraticCurveTo(rect.x,bottom-thirdHeight,rect.x+radius,bottom-thirdHeight);
		context.lineTo(rect.x+thirdWidth-radius,bottom-thirdHeight);  
		context.quadraticCurveTo(rect.x+thirdWidth,bottom-thirdHeight,rect.x+thirdWidth,bottom-thirdHeight+radius);  

		context.lineTo(rect.x+thirdWidth,bottom-radius);
		context.quadraticCurveTo(rect.x+thirdWidth,bottom,rect.x+thirdWidth+radius,bottom);
		context.lineTo(rect.x+thirdWidth*2-radius,bottom);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom,rect.x+thirdWidth*2,bottom-radius);
		context.lineTo(rect.x+thirdWidth*2,bottom-thirdHeight+radius);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom-thirdHeight,rect.x+thirdWidth*2+radius,bottom-thirdHeight);
		context.lineTo(right-radius,bottom-thirdHeight);
		context.quadraticCurveTo(right,bottom-thirdHeight,right,bottom-thirdHeight-radius);
		
		context.lineTo(right,rect.y+radius);  
		context.quadraticCurveTo(right,rect.y,right-radius,rect.y);  
		context.lineTo(rect.x+radius,rect.y);  
		context.quadraticCurveTo(rect.x,rect.y,rect.x,rect.y+radius);  

		context.fill();
		context.stroke();

	};

	BCHWFontCharacterRenderer.renderU = function(context,character){

		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var fourthHeight=character.roundedRect.height/4;
		
		context.moveTo(halfX,character.roundedRect.y);
		context.lineTo(halfX,character.roundedRect.y+fourthHeight);
		
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderW = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var thirdHeight=character.roundedRect.height/3;
		var thirdWidth=character.roundedRect.width/3;
		context.moveTo(character.roundedRect.x+thirdWidth,character.roundedRect.y);
		context.lineTo(character.roundedRect.x+thirdWidth,character.roundedRect.y+thirdHeight);
		
		context.moveTo(character.roundedRect.x+thirdWidth*2,character.roundedRect.y);
		context.lineTo(character.roundedRect.x+thirdWidth*2,character.roundedRect.y+thirdHeight);

			
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderY = function(context,character){

		context.beginPath();
		context.lineWidth=character.thickness;
		context.fillStyle=character.color.getCanvasColorString();
		context.strokeStyle=character.lineColor.getCanvasColorString();

		var rect=character.roundedRect;	
		var radius=character.roundedRect.radius;

		var thirdWidth=rect.width/3;
		var thirdHeight=rect.height/3;
		var right=rect.x+rect.width;
		var bottom=rect.y+rect.height;
		
		
		context.moveTo(rect.x,rect.y+radius);  
		context.lineTo(rect.x,bottom-thirdHeight-radius);
		context.quadraticCurveTo(rect.x,bottom-thirdHeight,rect.x+radius,bottom-thirdHeight);
		context.lineTo(rect.x+thirdWidth-radius,bottom-thirdHeight);  
		context.quadraticCurveTo(rect.x+thirdWidth,bottom-thirdHeight,rect.x+thirdWidth,bottom-thirdHeight+radius);  

		context.lineTo(rect.x+thirdWidth,bottom-radius);
		context.quadraticCurveTo(rect.x+thirdWidth,bottom,rect.x+thirdWidth+radius,bottom);
		context.lineTo(rect.x+thirdWidth*2-radius,bottom);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom,rect.x+thirdWidth*2,bottom-radius);
		context.lineTo(rect.x+thirdWidth*2,bottom-thirdHeight+radius);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom-thirdHeight,rect.x+thirdWidth*2+radius,bottom-thirdHeight);
		context.lineTo(right-radius,bottom-thirdHeight);
		context.quadraticCurveTo(right,bottom-thirdHeight,right,bottom-thirdHeight-radius);
		
		context.lineTo(right,rect.y+radius);  
		context.quadraticCurveTo(right,rect.y,right-radius,rect.y);  
		context.lineTo(rect.x+radius,rect.y);  
		context.quadraticCurveTo(rect.x,rect.y,rect.x,rect.y+radius);  

		context.fill();
		context.stroke();
		
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX = rect.x+rect.width/2;
		var fourthHeight = rect.height/4;
		
		context.moveTo(halfX,rect.y);
		context.lineTo(halfX,rect.y+fourthHeight);
		
		context.stroke(); 

	};
	
	window.BCHWFontCharacterRenderer = BCHWFontCharacterRenderer;

}(window));