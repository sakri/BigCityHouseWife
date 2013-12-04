/**
 * Created by sakri on 3-12-13.
 */
//===========================================================
//===================::MEMORY GAME::=============
//==========================================================

(function (window){

    //TODO : create a logo superclass, combine BCHWLogo and this
    var MemoryGameLogo = function(canvas, x, y, width, height){
        LayoutRectangle.call(this, canvas, x, y, width, height);
        this.lineThickness = 4;
        this.row = new BCHWFontLayoutRect(canvas);
        this.row.setHorizontalAlign(LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE);
        this.setRowText(this.row,"memory");
    };

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

    window.MemoryGameLogo = MemoryGameLogo;

}(window));