/**
 * Created by sakri on 19-12-13.
 */

(function (window){

    var BCHWMemoryGameGridCell = function(x, y , width, height, radius, image, context, bgImage, color){
        BCHWGeom.RoundedRectangle.call(this, x, y, width, height, radius);
        this.image = image;
        this.context = context;
        this.isOpen = false;
        this.bgImage = bgImage;
        this.image = image;
        //this.color = color;
        //this.bgColor = BCHWColor.BCHWColorsLib.GREEN.getCanvasColorString(); //HARDCODED!!!
        //console.log("BCHWMemoryGameGridCell constructor, ", this.bgImage, this.color);
    };

    //subclass extends superclass
    BCHWMemoryGameGridCell.prototype = Object.create(BCHWGeom.RoundedRectangle.prototype);
    BCHWMemoryGameGridCell.prototype.constructor = BCHWGeom.RoundedRectangle;

    BCHWMemoryGameGridCell.borderWidth = 6;
    BCHWMemoryGameGridCell.borderRect = new BCHWGeom.RoundedRectangle;

    BCHWMemoryGameGridCell.prototype.open = function(flipper){
        if(this.image.src == this.bgImage.src){
            console.log("BCHWMemoryGameGridCell.open() MUTHFAFUCKA WHAT?! this.image == this.bgImage");
        }else{
            console.log("BCHWMemoryGameGridCell.open() this.image != this.bgImage");
        }
        if(flipper){
            flipper.flip(this, this.context, this.bgImage, this.image, undefined, undefined, true);
            this.isOpen = true;
        }else{
            this.renderImage();
        }

    };

    BCHWMemoryGameGridCell.prototype.close = function(flipper){
        if(flipper){
            flipper.flip(this, this.context, this.image, this.bgImage, undefined, undefined, true);
            this.isOpen = false;
        }else{
            this.renderBackgroundImage();
        }
    };

    BCHWMemoryGameGridCell.prototype.renderBackgroundImage = function(){
        this.context.clearRect(this.x, this.y, this.width, this.height);
        if(this.bgColor){
            this.context.fillStyle = this.bgColor;
            this.drawPathToContext(this.context);
            this.context.fill();
        }
        this.context.drawImage(this.bgImage, this.x, this.y, this.width, this.height);
    };

    BCHWMemoryGameGridCell.prototype.renderImage = function(){
        this.context.clearRect(this.x, this.y, this.width, this.height);
        if(this.color){
            this.context.fillStyle = this.color;
            this.drawPathToContext(this.context);
            this.context.fill();
        }
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    };

    BCHWMemoryGameGridCell.prototype.prepareBorderRect = function(){
        var offset = Math.ceil(BCHWMemoryGameGridCell.borderWidth/2);
        BCHWMemoryGameGridCell.borderRect.updateToRect(this);
        BCHWMemoryGameGridCell.borderRect.radius = this.radius;
        BCHWMemoryGameGridCell.borderRect.x+=offset;
        BCHWMemoryGameGridCell.borderRect.y+=offset;
        BCHWMemoryGameGridCell.borderRect.width-=offset*2;
        BCHWMemoryGameGridCell.borderRect.height-=offset*2;
    }

    BCHWMemoryGameGridCell.prototype.showMismatch = function(){
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
        this.context.lineWidth = BCHWMemoryGameGridCell.borderWidth;
        this.prepareBorderRect();
        BCHWMemoryGameGridCell.borderRect.drawPathToContext(this.context);
        this.context.stroke();
        //this.context.strokeRect(this.x+half, this.y + half, this.width-lineWidth, this.height-lineWidth);
    };

    BCHWMemoryGameGridCell.prototype.showMatch = function(){
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.ORANGE.getCanvasColorString();
        var lineWidth = BCHWMemoryGameGridCell.borderWidth;
        var half = lineWidth/2;
        this.context.lineWidth = lineWidth;
        //this.context.strokeRect(this.x+half, this.y + half, this.width-lineWidth, this.height-lineWidth);
        this.prepareBorderRect();
        BCHWMemoryGameGridCell.borderRect.drawPathToContext(this.context);
        this.context.stroke();
        var scope = this;
        this.animationTimeOut = setTimeout(function(){scope.renderImage()}, 500);
    };

    BCHWMemoryGameGridCell.prototype.stop = function(){

    };

    //stop all animations
    BCHWMemoryGameGridCell.prototype.stop = function(){
        clearTimeout(this.animationTimeOut);
    };


    window.BCHWMemoryGameGridCell = BCHWMemoryGameGridCell;

}(window));