/**
 * Created by sakri on 6-11-13.
 */
//===========================================================
//===================::BIG CITY HOUSE WIFE LOGO::=============
//==========================================================

(function (window){

    var BCHWLogo = function(canvas, x, y, width, height){
        LayoutRectangle.call(this, canvas, x, y, width, height);
        this.lineThickness = 4;
        this.row1 = new BCHWFontLayoutRect(canvas);
        this.row1.setHorizontalAlign(LayoutRectangle.HORIZONTAL_ALIGN_RIGHT);
        this.setRowText(this.row1,"big city");
        this.row2 = new BCHWFontLayoutRect(canvas);
        this.setRowText(this.row2,"house wife");
        this.renderNextCharacterTimeoutId = -1;
    };

    //subclass extends superclass
    BCHWLogo.prototype = Object.create(LayoutRectangle.prototype);
    BCHWLogo.prototype.constructor = LayoutRectangle;

    BCHWLogo.RENDER_CHARACTER_INTERVAL = 30;//characters are rendered one at a time with this interval between renders

    BCHWLogo.prototype.setRowText=function(row, text){
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

    BCHWLogo.prototype.render = function(bounds, lineThickness){
        //console.log("BCHWLogo.render()", bounds.toString());
        this.updateLayout(bounds);
        this.clear();
        this.zIndeces = BCHWArrayUtil.createSequentialNumericArray(this.allCharacters.length);
        this.zIndeces = BCHWArrayUtil.shuffle(this.zIndeces);
        this.currentRenderIndex = 0;
        for(var i=0; i<this.allCharacters.length; i++){
            this.allCharacters[i].thickness = lineThickness;
        }
        this.renderNextCharacter();
    };

    BCHWLogo.prototype.stop = function(bounds){
        clearTimeout (this.renderNextCharacterTimeoutId);
    }

    BCHWLogo.prototype.renderNextCharacter = function(){
        if(this.currentRenderIndex == this.allCharacters.length){
            //console.log("BCHWLogo render complete");
            return;
        }
        var fontCharacter = this.allCharacters[this.zIndeces[this.currentRenderIndex]];
        fontCharacter.addRandomness(2,.01);
        fontCharacter.renderToContext(this.context);

        var scope = this;
        this.renderNextCharacterTimeoutId = setTimeout(function(){
            scope.renderNextCharacter();
        }, BCHWLogo.RENDER_CHARACTER_INTERVAL );
        this.currentRenderIndex++;
    };

    BCHWLogo.prototype.getContentRect = function(bounds){
        //100 height is hardcoded... hmm
        var layoutRect = BCHWGeom.RectangleUtil.getBiggerRectangle(this.row1.getContentRect(100), this.row2.getContentRect(100));
        BCHWGeom.RectangleUtil.scaleRectToBestFit(bounds,layoutRect);
        return layoutRect;
    }

    BCHWLogo.prototype.updateLayout = function(bounds){
        //100 height is hardcoded... hmm
        var layoutRect = BCHWGeom.RectangleUtil.getBiggerRectangle(this.row1.getContentRect(100), this.row2.getContentRect(100));
        BCHWGeom.RectangleUtil.scaleRectToBestFit(bounds, layoutRect);
        BCHWGeom.RectangleUtil.horizontalAlignMiddle(bounds, layoutRect);
        layoutRect.y = bounds.getBottom()-layoutRect.height;
        this.row2.updateToRect(layoutRect);
        this.row2.layoutCharacters();

        layoutRect.y -= layoutRect.height;
        this.row1.updateToRect(layoutRect);
        this.row1.layoutCharacters();

        this.allCharacters = this.row1.characters.concat(this.row2.characters);
    };

    BCHWLogo.prototype.getCharacterBounds = function(rowIndex, characterIndex){
        var row = this["row"+rowIndex];
        var character = row.characters[characterIndex];
        return character.roundedRect;
    }

    window.BCHWLogo = BCHWLogo;

}(window));