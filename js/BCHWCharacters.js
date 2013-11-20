/**
 * Created by sakri on 7-11-13.
 */

//===========================================================
//===================::BIG CITY HOUSE WIFE CHARACTER::=============
//==========================================================

(function (window){

    var BCHWCharacter = function(canvas, x, y, width, height){
        LayoutRectangle.call(this, canvas, x, y, width, height);
        this.lineThickness = 4;
    };

    //subclass extends superclass
    BCHWCharacter.prototype = Object.create(LayoutRectangle.prototype);
    BCHWCharacter.prototype.constructor = LayoutRectangle;

    BCHWCharacter.prototype.render = function(bounds){
        //console.log("BCHWCharacter.render()", bounds.toString());
        this.updateLayout(bounds);
        this.clear();

    };

    BCHWCharacter.prototype.stop = function(){
        //stop all animations
    }

    BCHWCharacter.prototype.updateLayout = function(bounds){
        this.width = bounds.width;
        this.height = bounds.width*1.5;
        this.x = bounds.x;
        this.y = bounds.y + bounds.height/2 - this.height/2;
    };

    //strokeStyle and fillStyle must be set prior to calling this
    BCHWCharacter.prototype.renderRect = function(rect){
        this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    };

    //strokeStyle and fillStyle must be set prior to calling this
    //TODO : Move to some util
    BCHWCharacter.prototype.renderRoundedRect = function(rect){
        this.context.beginPath();
        this.context.moveTo(rect.x, rect.y+rect.radius);
        this.context.arc(rect.x+rect.radius, rect.y+rect.radius, rect.radius, Math.PI,Math.PI+BCHWMathUtil.HALF_PI);
        this.context.lineTo(rect.getRight()-rect.radius, rect.y);
        this.context.arc(rect.getRight()-rect.radius, rect.y+rect.radius, rect.radius, Math.PI+BCHWMathUtil.HALF_PI, BCHWMathUtil.PI2 );
        this.context.lineTo(rect.getRight(), rect.getBottom()-rect.radius);
        this.context.arc(rect.getRight()-rect.radius, rect.getBottom()-rect.radius, rect.radius, 0, BCHWMathUtil.HALF_PI );
        this.context.lineTo(rect.x+rect.radius, rect.getBottom());
        this.context.arc(rect.x+rect.radius, rect.getBottom()-rect.radius, rect.radius, BCHWMathUtil.HALF_PI, Math.PI );
        this.context.lineTo(rect.x, rect.y+rect.radius);
        this.context.fill();
        this.context.stroke();
        this.context.closePath();
    };
    
    window.BCHWCharacter = BCHWCharacter;

    
    
    //=========================::MOM::=============================

    var BCHWMom = function(canvas, x, y, width, height){
        BCHWCharacter.call(this, canvas, x, y, width, height);
        var shirtColor = BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
        this.shirtFillStyle = shirtColor.getCanvasColorString() ;
        this.pantsFillStyle = BCHWColor.BCHWColorsLib.getNextColorString(shirtColor);
    };

    //subclass extends superclass
    BCHWMom.prototype = Object.create(BCHWCharacter.prototype);
    BCHWMom.prototype.constructor = BCHWCharacter;

    BCHWMom.prototype.render = function(bounds, lineThickness){
        //console.log("BCHWMom.render()", bounds.toString());
        this.updateLayout(bounds);
        this.clear();
        this.lineThickness = lineThickness;
        this.context.lineWidth = this.lineThickness;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderHead();
        this.renderBody();
        this.renderArms();
        this.renderMouth();
        this.renderEyes();
    };

    BCHWMom.prototype.stop = function(bounds){
        //stop all animations
    }

    BCHWMom.prototype.renderHead = function(){

        //hair
        this.context.fillStyle = BCHWColor.BCHWColorsLib.DARK_GRAY.getCanvasColorString();
        this.hairRect = new BCHWGeom.RoundedRectangle(this.x, this.y, this.width, this.height*.3, 6);
        this.renderRoundedRect(this.hairRect);

        //face
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.x + this.width/4,
                                                        this.hairRect.y+this.hairRect.height/3,
                                                        this.width/2,
                                                        this.height*.26, 8);
        this.renderRoundedRect(this.faceRect);

    }
    BCHWMom.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.RoundedRectangle(  0, this.faceRect.getBottom(),
                                                        this.faceRect.width *.95 , this.height*.33, 9);
        this.bodyRect.x = (this.faceRect.x+this.faceRect.width/2)-(this.bodyRect.width/2);
        this.renderRoundedRect(this.bodyRect);

        //pants
        this.context.fillStyle = this.pantsFillStyle;
        this.pantsRect = new BCHWGeom.RoundedRectangle( this.faceRect.x, this.bodyRect.getBottom()-this.faceRect.radius,
                                                        this.faceRect.width, this.bodyRect.height/3);
        this.renderRoundedRect(this.pantsRect);

        //shoes
        this.shoeRect = new BCHWGeom.RoundedRectangle(this.pantsRect.x, this.pantsRect.getBottom(),
                                                        this.pantsRect.width/2 , this.pantsRect.height/4, 2);
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderRoundedRect(this.shoeRect);
        this.shoeRect.x = this.pantsRect.x + this.pantsRect.width/2;
        this.renderRoundedRect(this.shoeRect);

    }

    BCHWMom.prototype.renderArms = function(){
        var armY = this.bodyRect.y + this.bodyRect.height/5;
        var elbowDistance = (this.bodyRect.x - this.hairRect.x)/3;
        //right arm
        this.context.beginPath();
        this.context.moveTo(this.bodyRect.x, armY);
        this.context.lineTo(this.bodyRect.x - elbowDistance - Math.random()*elbowDistance, armY + Math.random()*(this.bodyRect.height/5));
        this.context.lineTo(this.bodyRect.x, this.bodyRect.getBottom() - this.bodyRect.height/5 -Math.random()*(this.bodyRect.height/5));
        this.context.closePath();
        this.context.stroke();

        //left arm
        this.context.beginPath();
        this.context.moveTo(this.bodyRect.getRight(), armY);
        this.context.lineTo(this.bodyRect.getRight() + elbowDistance + Math.random()*elbowDistance, armY + Math.random()*(this.bodyRect.height/5));
        this.context.lineTo(this.bodyRect.getRight(), this.bodyRect.getBottom() - this.bodyRect.height/5 -Math.random()*(this.bodyRect.height/5));
        this.context.closePath();
        this.context.stroke();
    }


    BCHWMom.mouthFunctions = ["renderTriangleMouth","renderSmileMouth","renderFrownMouth","renderOpenMouth"];
    BCHWMom.prototype.renderMouth = function(){
        this[BCHWMom.mouthFunctions[Math.floor(Math.random()*BCHWMom.mouthFunctions.length)]]();
    }

    BCHWMom.prototype.renderTriangleMouth = function(){
        this.context.beginPath();
        var height = (this.faceRect.getBottom() - this.hairRect.getBottom())/3;
        var mouthRect = new BCHWGeom.RoundedRectangle(  this.faceRect.x + this.faceRect.width/3, this.hairRect.getBottom(),
        this.faceRect.width/3, height + Math.random()*height);
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
        this.context.lineWidth = this.lineThickness/2;
        this.context.moveTo(mouthRect.x, mouthRect.y);
        this.context.lineTo(mouthRect.getRight(),  mouthRect.y + mouthRect.height/2);
        this.context.lineTo(mouthRect.x, mouthRect.getBottom());
        this.context.lineTo(mouthRect.x, mouthRect.y);
        this.context.closePath();
        this.context.stroke();
    }

    BCHWMom.prototype.renderSmileMouth = function(){
        this.context.beginPath();
        var height = (this.faceRect.getBottom() - this.hairRect.getBottom())/3;
        var mouthRect = new BCHWGeom.RoundedRectangle(  this.faceRect.x + this.faceRect.width/3, this.hairRect.getBottom(),
            this.faceRect.width/3, height + Math.random()*height);
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
        this.context.lineWidth = this.lineThickness/2;
        var leftY = mouthRect.y+Math.random() * (mouthRect.height/2);
        var rightY = mouthRect.y+Math.random() * (mouthRect.height/2);
        var topAnchor = new BCHWGeom.Point( mouthRect.x + mouthRect.width *.25 + Math.random()*(mouthRect.width/2),
                                            mouthRect.getBottom()+Math.random()*(mouthRect.height/2));
        var bottomAnchor = new BCHWGeom.Point(topAnchor.x, topAnchor.y+10+Math.random()*(mouthRect.height/2));
        this.context.moveTo(mouthRect.x, leftY);
        this.context.quadraticCurveTo(topAnchor.x, topAnchor.y, mouthRect.getRight(), rightY);
        this.context.quadraticCurveTo(bottomAnchor.x, bottomAnchor.y, mouthRect.x, leftY);
        this.context.closePath();
        this.context.stroke();
    }

    BCHWMom.prototype.renderFrownMouth = function(){
        this.context.beginPath();
        var height = (this.faceRect.getBottom() - this.hairRect.getBottom())/3;
        var mouthRect = new BCHWGeom.RoundedRectangle(  this.faceRect.x + this.faceRect.width/3, this.hairRect.getBottom(),
            this.faceRect.width/3, height + Math.random()*height);
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
        this.context.lineWidth = this.lineThickness/2;
        this.context.moveTo(mouthRect.x, mouthRect.y+Math.random()*mouthRect.height);
        this.context.lineTo(mouthRect.x+mouthRect.width *.25,  mouthRect.y+Math.random()*mouthRect.height);
        this.context.lineTo(mouthRect.getRight(), mouthRect.y+Math.random()*mouthRect.height);
        this.context.stroke();
    }

    BCHWMom.prototype.renderOpenMouth = function(){
        this.context.beginPath();
        var height = (this.faceRect.getBottom() - this.hairRect.getBottom())/3;
        var mouthRect = new BCHWGeom.RoundedRectangle(  this.faceRect.x + this.faceRect.width/3, this.hairRect.getBottom(),
            this.faceRect.width/3, height + Math.random()*height);
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
        this.context.lineWidth = this.lineThickness/2;
        this.context.arc(mouthRect.getCenterX(), mouthRect.getCenterY(),mouthRect.height/2,0,BCHWMathUtil.PI2);
        this.context.closePath();
        this.context.stroke();
    }

    BCHWMom.prototype.renderEyes = function(){
        this.eyeRectRight = new BCHWGeom.Rectangle(   this.faceRect.x + this.faceRect.width/7,
                                                this.faceRect.y + this.faceRect.height/4,
                                                this.faceRect.width/4.2, this.faceRect.height/5);
        //right eye
        this.context.lineWidth = 1;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.DARK_BROWN.getCanvasColorString();
        this.renderRect(this.eyeRectRight);

        //left eye
        this.eyeRectLeft = new BCHWGeom.Rectangle(this.faceRect.x + this.faceRect.width - this.faceRect.width/7 - this.eyeRectRight.width,
                                                    this.eyeRectRight.y, this.eyeRectRight.width, this.eyeRectRight.height);
        this.renderRect(this.eyeRectLeft);

        this.context.lineWidth = 0;
        this.context.fillStyle = BCHWColor.BCHWColorsLib.DARK_BROWN.getCanvasColorString();
        //console.log(BCHWColor.BCHWColorsLib.DARK_BROWN.getCanvasColorString());
        this.pupilRect = new BCHWGeom.Rectangle(0,0,this.eyeRectRight.width *.6, this.eyeRectRight.height);

        //random eye position
        var maxVertical = this.eyeRectRight.height/2 ;
        var maxHorizontal = this.eyeRectRight.width/2 ;
        var vertical = (Math.random()*maxVertical)*(Math.random() >.5 ? 1 : -1);
        var horizontal = (Math.random()*maxHorizontal)*(Math.random() >.5 ? 1 : -1);

        //right pupil
        var rightPupilRect = new BCHWGeom.Rectangle(0, 0, this.pupilRect.width, this.pupilRect.height);
        rightPupilRect.x = this.eyeRectRight.getCenterX() - this.pupilRect.getCenterX() - horizontal;
        rightPupilRect.y = this.eyeRectRight.getCenterY() - this.pupilRect.getCenterY() - vertical;
        var renderRect = BCHWGeom.RectangleUtil.getIntersectingRectangle(this.eyeRectRight, rightPupilRect);
        if(renderRect){
            this.renderRect(renderRect);
        }else{
            this.renderRect(rightPupilRect);
        }

        //left pupil
        var leftPupilRect = new BCHWGeom.Rectangle(0, 0, this.pupilRect.width, this.pupilRect.height);
        leftPupilRect.x = this.eyeRectLeft.getCenterX() - this.pupilRect.getCenterX() - horizontal;
        leftPupilRect.y = this.eyeRectLeft.getCenterY() - this.pupilRect.getCenterY() - vertical;
        renderRect = BCHWGeom.RectangleUtil.getIntersectingRectangle(this.eyeRectLeft, leftPupilRect);
        if(renderRect){
            this.renderRect(renderRect);
        }else{
            this.renderRect(leftPupilRect);
        }


        this.context.strokeStyle = BCHWColor.BCHWColorsLib.BLACK.getCanvasColorString();
        this.context.lineWidth = 2;

        //right eyebrow
        this.context.beginPath();
        this.context.moveTo(this.faceRect.x-this.eyeRectRight.width, this.faceRect.y);
        this.context.lineTo(this.faceRect.x-this.eyeRectRight.width/2, this.eyeRectRight.y);
        this.context.lineTo(this.eyeRectRight.x, this.eyeRectRight.y);
        this.context.stroke();
        this.context.moveTo(this.faceRect.x-this.eyeRectRight.width/2, this.faceRect.y);
        this.context.lineTo(this.faceRect.x, this.eyeRectRight.y);
        this.context.stroke();

        //left eyebrow
        this.context.beginPath();
        this.context.moveTo(this.faceRect.getRight()+this.eyeRectRight.width, this.faceRect.y);
        this.context.lineTo(this.faceRect.getRight()+this.eyeRectRight.width/2, this.eyeRectRight.y);
        this.context.lineTo(this.eyeRectLeft.getRight(), this.eyeRectRight.y);
        this.context.stroke();
        this.context.moveTo(this.faceRect.getRight()+this.eyeRectRight.width/2, this.faceRect.y);
        this.context.lineTo(this.faceRect.getRight(), this.eyeRectRight.y);
        this.context.stroke();
    }

    window.BCHWMom = BCHWMom;

}(window));