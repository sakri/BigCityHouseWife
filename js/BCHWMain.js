

(function (window){

	function BCHWMain(){
		this.margin=.1;
	}

    //static variables
    BCHWMain.REFRESH_AFTER_RESIZE_INTERVAL=300;//wait this long to rerender graphics after last resize
    BCHWMain.RENDER_CHARACTER_INTERVAL=30;//characters are rendered one at a time with this interval between renders
    BCHWMain.MAX_WIDTH=800;
    BCHWMain.MAX_HEIGHT=600;

    BCHWMain.prototype.init = function(demoContainer){
        console.log("BCHWMain.init()");
        this.canvas = document.createElement('canvas');
        this.demoContainer = demoContainer;
        this.context = this.canvas.getContext("2d");
        this.context.lineCap="round";
        demoContainer.appendChild(this.canvas);
        //var scope = this;
        //setTimeout(function(){scope.render();}, BCHWMain.REFRESH_AFTER_RESIZE_INTERVAL );
        this.createLogo();
        this.render();
    };


	BCHWMain.prototype.clearContext = function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	}

	//var resizeHelperDate=new Date();
	//var lastResize=date.get
	BCHWMain.prototype.resizeHandler = function(){
		this.clearContext();
		clearTimeout (this.renderTimeoutId);
		clearTimeout (this.renderCharactersTimeoutId);
		var scope = this;
		this.renderTimeoutId = setTimeout(function(){
             scope.render();
          }, BCHWMain.REFRESH_AFTER_RESIZE_INTERVAL );
	};
	
	
	BCHWMain.prototype.render = function(){
        this.canvas.width = this.demoContainer.clientWidth;
        this.canvas.height = this.demoContainer.clientHeight;
		this.clearContext();
        this.renderLogo();
	};
	
	BCHWMain.prototype.renderBG = function(){
		this.context.fillStyle=BCHWColor.BCHWColorsLib.TURQUOISE.getCanvasColorString();
		this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
	};

	BCHWMain.prototype.createLogo = function(manager,text){
		this.row1=new BCHWFontLayoutRow();
		this.setRowManagerText(this.row1,"big city");
		this.row2=new BCHWFontLayoutRow();		
		this.setRowManagerText(this.row2,"house wife");
    };

	BCHWMain.prototype.setRowManagerText=function(manager,text){
		var lineColor=BCHWColor.BCHWColorsLib.WHITE;
		var character,color,i,fontCharacter;
		for(i=0;i<text.length;i++){
			character=text.charAt(i);
			color=BCHWColor.BCHWColorsLib.getNextColor(color);
			fontCharacter=BCHWFontCharacter.createBCHWFontCharacter(character,color,lineColor,4, new BCHWGeom.RoundedRectangle());
			if(character==" ")fontCharacter.width=.5;
			manager.addCharacter(fontCharacter);
		}
	};


	
	BCHWMain.prototype.renderCharacters = function(){
		this.zIndeces=BCHWArrayUtil.createSequentialNumericArray(this.allCharacters.length);
		this.zIndeces=BCHWArrayUtil.shuffle(this.zIndeces);
		this.currentRenderIndex=0;
		this.renderNextCharacter();
	};
	
	BCHWMain.prototype.renderNextCharacter = function(){
		if(this.currentRenderIndex==this.allCharacters.length){
			return;
		}
		fontCharacter=this.allCharacters[this.zIndeces[this.currentRenderIndex]];
		fontCharacter.addRandomness(2,.01);
		fontCharacter.renderToContext(this.context);
			
		var scope=this; 
		this.renderCharactersTimeoutId = setTimeout(function(){
             scope.renderNextCharacter();
          }, BCHWMain.RENDER_CHARACTER_INTERVAL );
		this.currentRenderIndex++;
	};
	
	BCHWMain.prototype.renderLogo = function(){
		var screenRectX=this.canvas.width*this.margin;
		var screenRectY=this.canvas.height*this.margin;
		var screenRect=BCHWGeom.createRectangle(screenRectX,screenRectY,this.canvas.width-screenRectX*2,this.canvas.height-screenRectY*2);
		
		var layoutRect=BCHWGeom.RectangleUtil.getBiggerRectangle(this.row1.getSampleRect(100),this.row2.getSampleRect(100));
		BCHWGeom.RectangleUtil.scaleRectToBestFit(screenRect,layoutRect);
		BCHWGeom.RectangleUtil.horizontalAlignMiddle(screenRect,layoutRect);
				
		layoutRect.y=BCHWGeom.RectangleUtil.getCenterY(screenRect)-layoutRect.height;
		this.row1.layoutRectangle=layoutRect;
		this.row1.layoutCharacters();

		layoutRect.y=BCHWGeom.RectangleUtil.getCenterY(screenRect);
		this.row2.layoutRectangle=layoutRect;
		this.row2.layoutCharacters();
		
		this.allCharacters=this.row1.characters.concat(this.row2.characters);
		this.renderCharacters();
	};
	
	window.BCHWMain=BCHWMain;
	
}(window));