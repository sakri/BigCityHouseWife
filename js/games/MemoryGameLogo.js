/**
 * Created by sakri on 3-12-13.
 */
//===========================================================
//===================::MEMORY GAME::=============
//==========================================================

(function (window){

    //TODO : create a logo superclass, combine BCHWLogo and this
    var MemoryGameLogo = function(canvas, x, y, width, height){
        this.logoString = "memory";
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.flipper = new MemoryGameCardFlip();
    };

    MemoryGameLogo.prototype.render = function(bounds, lineThickness){

        var maxCellWidth = bounds.width / this.logoString.length;
        var maxCellHeight = bounds.height / 3;// estimate

        var cellWithSpacerSize = Math.min(maxCellWidth, maxCellHeight);
        var spacer = cellWithSpacerSize*.1;
        this.cellSize = cellWithSpacerSize-spacer;
        var totalWidth = this.logoString.length*cellWithSpacerSize;

        var x = bounds.getCenterX()-totalWidth/2;
        this.cellRadius = this.cellSize*.08;
        this.characterMargin = this.cellSize*.2;
        var characterRect = new BCHWGeom.RoundedRectangle(this.characterMargin, this.characterMargin, this.cellSize-this.characterMargin*2, this.cellSize-this.characterMargin*2, this.cellRadius);

        this.cells = [];
        var i, cell, character, color, image;

        this.renderCanvas = document.createElement("canvas");
        this.renderCanvas.width = this.cellSize;
        this.renderCanvas.height = this.cellSize;
        this.renderContext = this.renderCanvas.getContext("2d");

        //var charMargin = this.ce
        this.characterImages = [];

        //create cells
        for(i=0;i<this.logoString.length;i++){
                color = BCHWColor.BCHWColorsLib.getNextColor(color);
                character = BCHWFontCharacter.createBCHWFontCharacter(this.logoString.charAt(i),color, BCHWColor.BCHWColorsLib.WHITE, 4, characterRect);
                image = document.createElement("img");
                character.renderToContext(this.renderContext);
                image.src = this.renderCanvas.toDataURL();
                this.characterImages[i] = image;
                cell = new BCHWMemoryGameGridCell(  x+i*cellWithSpacerSize, bounds.y,
                                                    this.cellSize, this.cellSize, this.cellRadius,
                                                    null, this.context );
                this.cells.push(cell);
                this.renderContext.clearRect(0,0,this.renderCanvas.width, this.renderCanvas.height);
        }

        this.cardPrep = new MemoryGameCardPrep();
        this.currentImagePrepIndex = 0;
        var scope = this;
        this.renderCellsTimeOutId = setTimeout(function(){scope.prepareNextLogoImage()},20);
    }

    MemoryGameLogo.prototype.prepareNextLogoImage = function(){
        //console.log("BCHWMemoryGame.prepareNextLogoImage()");
        var image = this.characterImages[this.currentImagePrepIndex];
        var scope = this;
        this.cardPrep.prepareImage(image, this.cellSize, this.cellRadius, function(cardImage){scope.nextLogoImagePrepComplete(cardImage)});
    };

    MemoryGameLogo.prototype.nextLogoImagePrepComplete = function(cardImage){
        //console.log("MemoryGameLogo.nextLogoImagePrepComplete()");
        this.cells[this.currentImagePrepIndex].image = cardImage;
        this.cells[this.currentImagePrepIndex].bgImage = cardImage;
        this.cells[this.currentImagePrepIndex].close();
        this.cells[this.currentImagePrepIndex].open(this.flipper);
        this.currentImagePrepIndex++;
        if(this.currentImagePrepIndex==this.characterImages.length){
            this.logoPreparationReady();
        }else{
            var scope = this;
            this.renderCellsTimeOutId = setTimeout(function(){scope.prepareNextLogoImage()},600);
        }
    }

    MemoryGameLogo.prototype.logoPreparationReady = function(){
        //console.log("MemoryGameLogo.logoPreparationReady()");
        this.start();
    }

    MemoryGameLogo.prototype.start = function(){
        var scope = this;
        this.flipTimeOutId = setTimeout(function(){scope.flipRandomCard()}, 1000);
    }

    MemoryGameLogo.prototype.stop = function(){
        this.flipper.stop();
        clearTimeout(this.renderCellsTimeOutId);
        clearTimeout(this.flipTimeOutId);
        this.canvas.removeEventListener("click", this.gridCellClickListener);
        this.gridCellClickListener = null;

    }

    MemoryGameLogo.prototype.destroy = function(){
        this.stop();
        //what else?!
    }

    MemoryGameLogo.prototype.flipRandomCard = function(){
        this.currentFlipCard = this.cells[Math.floor(Math.random()*this.cells.length)];
        if(this.currentFlipCard.isOpen){
            this.currentFlipCard.close(this.flipper);
        }else{
            this.currentFlipCard.open(this.flipper);
        }
        var scope = this;
        this.flipTimeOutId = setTimeout(function(){scope.flipRandomCard()}, 2000);
    };

    /*
    //subclass extends superclass
    MemoryGameLogo.prototype = Object.create(LayoutRectangle.prototype);
    MemoryGameLogo.prototype.constructor = LayoutRectangle;

    MemoryGameLogo.RENDER_CHARACTER_INTERVAL = 30;//characters are rendered one at a time with this interval between renders

    MemoryGameLogo.prototype.setRowText=function(row, text){
        var lineColor = BCHWColor.BCHWColorsLib.WHITE;
        var character,color,i,fontCharacter;
        for(i=0; i<text.length; i++){
            character = text.charAt(i);
            color = BCHWColor.BCHWColorsLib.getNextColor(color);
            fontCharacter = BCHWFontCharacter.createBCHWFontCharacter(character,color,lineColor,this.lineThickness, new BCHWGeom.RoundedRectangle());
            if(character==" "){
                fontCharacter.width = .5;
            }
            row.addCharacter(fontCharacter);
        }
    };

    MemoryGameLogo.prototype.render = function(bounds, lineThickness){
        //console.log("MemoryGameLogo.render()", bounds.toString());
        this.updateLayout(bounds);
        this.clear();
        this.zIndeces = BCHWArrayUtil.createSequentialNumericArray(this.row.characters.length);
        this.zIndeces = BCHWArrayUtil.shuffle(this.zIndeces);
        this.currentRenderIndex = 0;
        var roundedRectRadius = this.row.height / 12;
        for(var i=0; i<this.row.characters.length; i++){
            this.row.characters[i].thickness = lineThickness;
            this.row.characters[i].roundedRect.radius = roundedRectRadius;
        }
        this.renderNextCharacter();
    };

    MemoryGameLogo.prototype.stop = function(){
        clearTimeout (this.renderNextCharacterTimeoutId);
    };

    MemoryGameLogo.prototype.renderNextCharacter = function(){
        if(this.currentRenderIndex == this.row.characters.length){
            //console.log("MemoryGameLogo render complete");
            return;
        }
        var fontCharacter = this.row.characters[this.zIndeces[this.currentRenderIndex]];
        fontCharacter.renderToContext(this.context);

        var scope = this;
        this.renderNextCharacterTimeoutId = setTimeout(function(){
            scope.renderNextCharacter();
        }, MemoryGameLogo.RENDER_CHARACTER_INTERVAL );
        this.currentRenderIndex++;
    };

    MemoryGameLogo.prototype.getContentRect = function(bounds){
        //100 height is hardcoded... hmm
        var layoutRect = this.row.getContentRect(100);
        BCHWGeom.RectangleUtil.scaleRectToBestFit(bounds,layoutRect);
        return layoutRect;
    };

    MemoryGameLogo.prototype.updateLayout = function(bounds){
        //100 height is hardcoded... hmm
        var layoutRect = this.row.getContentRect(100);
        BCHWGeom.RectangleUtil.scaleRectToBestFit(bounds, layoutRect);
        BCHWGeom.RectangleUtil.horizontalAlignMiddle(bounds, layoutRect);
        layoutRect.y = bounds.getBottom()-layoutRect.height;
        this.row.updateToRect(layoutRect);
        this.row.layoutCharacters();
    };

    MemoryGameLogo.prototype.getCharacterBounds = function(rowIndex, characterIndex){
        var row = this["row"+rowIndex];
        var character = row.characters[characterIndex];
        return character.roundedRect;
    };
    */

    window.MemoryGameLogo = MemoryGameLogo;

}(window));