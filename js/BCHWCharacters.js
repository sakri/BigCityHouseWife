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

    //strokeStyle and fillStyle must be set prior to calling this
    BCHWCharacter.prototype.renderRect = function(rect){
        this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    };

    //strokeStyle and fillStyle must be set prior to calling this
    //TODO : Move to some util
    BCHWCharacter.prototype.renderRoundedRect = function(rect, cancelFill, cancelStroke){
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
        if(!cancelFill){
            this.context.fill();
        }
        if(!cancelStroke){
            this.context.stroke();
        }
        this.context.closePath();
    };

    BCHWCharacter.prototype.renderEyes = function(){
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.eyeRectRight = new BCHWGeom.Rectangle( this.faceRect.x + this.faceRect.width/7,
            this.faceRect.y + this.faceRect.height/4,
            this.faceRect.width/4.2, this.faceRect.height/5);
        //right eye
        this.context.lineWidth = 1;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.DARK_BROWN.getCanvasColorString();
        this.renderRect(this.eyeRectRight);

        //left eye
        this.eyeRectLeft = new BCHWGeom.Rectangle(  this.faceRect.x + this.faceRect.width - this.faceRect.width/7 - this.eyeRectRight.width,
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
        this.renderRect(renderRect);

        //left pupil
        var leftPupilRect = new BCHWGeom.Rectangle(0, 0, this.pupilRect.width, this.pupilRect.height);
        leftPupilRect.x = this.eyeRectLeft.getCenterX() - this.pupilRect.getCenterX() - horizontal;
        leftPupilRect.y = this.eyeRectLeft.getCenterY() - this.pupilRect.getCenterY() - vertical;
        renderRect = BCHWGeom.RectangleUtil.getIntersectingRectangle(this.eyeRectLeft, leftPupilRect);
        this.renderRect(renderRect);

        this.context.strokeStyle = BCHWColor.BCHWColorsLib.BLACK.getCanvasColorString();
        this.context.lineWidth = 2;
    }
    
    window.BCHWCharacter = BCHWCharacter;

    
    //=============================================================
    //=========================::MOM::=============================
    //=============================================================

    var BCHWMom = function(canvas, x, y, width, height){
        BCHWCharacter.call(this, canvas, x, y, width, height);
        var shirtColor = BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
        this.shirtFillStyle = shirtColor.getCanvasColorString() ;
        this.pantsFillStyle = BCHWColor.BCHWColorsLib.getNextColorString(shirtColor);
        this.name = "mom";
    };

    //subclass extends superclass
    BCHWMom.prototype = Object.create(BCHWCharacter.prototype);
    BCHWMom.prototype.constructor = BCHWCharacter;

    BCHWMom.prototype.render = function(bounds, lineThickness){
        //console.log("BCHWMom.render()", bounds.toString());
        this.updateToRect(bounds);
        this.clear();
        this.lineThickness = lineThickness;
        this.context.lineWidth = this.lineThickness;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderHead();
        this.renderBody();
        this.renderArms();
        this.renderMouth();
        this.renderEyes();
        this.renderEyeLashes();
    };

    BCHWMom.prototype.stop = function(bounds){
        //stop all animations
    }

    BCHWMom.prototype.renderHead = function(){
        //hair
        this.context.fillStyle = BCHWColor.BCHWColorsLib.DARK_GRAY.getCanvasColorString();
        this.hairRect = new BCHWGeom.RoundedRectangle(this.x, this.y, this.width, this.height*.35, 6);
        this.renderRoundedRect(this.hairRect);

        //face
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.x + this.width/4,
                                                        this.hairRect.y+this.hairRect.height/3,
                                                        this.width/2,
                                                        this.height*.3, 8);
        this.renderRoundedRect(this.faceRect);

    }
    BCHWMom.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.RoundedRectangle(  0, this.faceRect.getBottom(),
                                                        this.faceRect.width *.95 , (this.getBottom()-this.faceRect.getBottom()) *.7, 9);
        this.bodyRect.x = (this.faceRect.x+this.faceRect.width/2)-(this.bodyRect.width/2);
        this.renderRoundedRect(this.bodyRect);

        //pants
        this.context.fillStyle = this.pantsFillStyle;
        this.pantsRect = new BCHWGeom.RoundedRectangle( this.faceRect.x, this.bodyRect.getBottom()-this.faceRect.radius,
                                                        this.faceRect.width, (this.getBottom()-this.bodyRect.getBottom()) *.95);
        this.renderRoundedRect(this.pantsRect);

        //shoes
        this.context.lineWidth = 0;
        this.shoeRect = new BCHWGeom.RoundedRectangle(this.pantsRect.x, this.pantsRect.getBottom() ,
                                                        this.pantsRect.width/2 , (this.getBottom()-this.pantsRect.getBottom()), 3);
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderRoundedRect(this.shoeRect);
        this.shoeRect.x = this.pantsRect.x + this.pantsRect.width/2;
        this.renderRoundedRect(this.shoeRect);
        this.context.lineWidth = this.lineThickness;
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

    BCHWMom.prototype.renderEyeLashes = function(){
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



    //=============================================================
    //=========================::GIRL::=============================
    //=============================================================

    var BCHWGirl = function(canvas, x, y, width, height){
        BCHWCharacter.call(this, canvas, x, y, width, height);
        var shirtColor = BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
        this.shirtFillStyle = shirtColor.getCanvasColorString() ;
        this.pantsFillStyle = BCHWColor.BCHWColorsLib.getNextColorString(shirtColor);
        this.name = "girl";
    };

    //subclass extends superclass
    BCHWGirl.prototype = Object.create(BCHWCharacter.prototype);
    BCHWGirl.prototype.constructor = BCHWCharacter;

    BCHWGirl.prototype.render = function(bounds, lineThickness){
        //console.log("BCHWGirl.render()", bounds.toString());
        this.updateToRect(bounds);
        this.clear();
        this.lineThickness = lineThickness;
        this.context.lineWidth = this.lineThickness;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderHead();
        this.renderBody();
        this.renderMouth();
        this.renderEyes();
    };

    BCHWGirl.prototype.stop = function(bounds){
        //stop all animations
    }

    BCHWGirl.prototype.renderHead = function(){
        //hair
        this.context.fillStyle = BCHWColor.BCHWColorsLib.DARK_GRAY.getCanvasColorString();
        this.hairRect = new BCHWGeom.Rectangle(this.x, this.y, this.width, this.height/5);
        var rightHairBall = new BCHWGeom.Rectangle(this.hairRect.x, this.hairRect.y, this.hairRect.width/5,this.hairRect.height);
        var leftWidth = rightHairBall.width*.8;
        var leftHeight = rightHairBall.height*.8;
        var leftHairBall = new BCHWGeom.Rectangle(  this.hairRect.getRight()-leftWidth, this.hairRect.getBottom()-leftHeight,
                                                    leftWidth, leftHeight);
        var hairHeight = this.hairRect.height/2;
        var hairRadius = (leftHairBall.width/2)*.6;

        this.context.beginPath();
        this.context.moveTo(this.hairRect.x,this.hairRect.y+hairRadius);
        this.context.arc(this.hairRect.x+hairRadius, this.hairRect.y+hairRadius, hairRadius, Math.PI, Math.PI+BCHWMathUtil.HALF_PI);
        this.context.lineTo(rightHairBall.getRight()-hairRadius, this.hairRect.y);
        this.context.arc(rightHairBall.getRight()-hairRadius, this.hairRect.y+hairRadius, hairRadius, Math.PI+BCHWMathUtil.HALF_PI, BCHWMathUtil.PI2);
        this.context.lineTo(rightHairBall.getRight(), this.hairRect.y+hairHeight);

        this.context.lineTo(leftHairBall.x, this.hairRect.y+hairHeight);
        this.context.lineTo(leftHairBall.x, leftHairBall.y+hairRadius);
        this.context.arc(leftHairBall.x+hairRadius, leftHairBall.y+hairRadius, hairRadius, Math.PI, Math.PI+BCHWMathUtil.HALF_PI);
        this.context.lineTo(leftHairBall.getRight()-hairRadius, leftHairBall.y);
        this.context.arc(leftHairBall.getRight()-hairRadius, leftHairBall.y+hairRadius, hairRadius, Math.PI+BCHWMathUtil.HALF_PI, BCHWMathUtil.PI2);
        this.context.lineTo(leftHairBall.getRight(), this.hairRect.getBottom()-hairRadius);

        this.context.arc(this.hairRect.getRight()-hairRadius, this.hairRect.getBottom()-hairRadius, hairRadius, 0, BCHWMathUtil.HALF_PI);
        this.context.lineTo(this.hairRect.x+hairRadius, this.hairRect.getBottom());
        this.context.arc(this.hairRect.x+hairRadius, this.hairRect.getBottom()-hairRadius, hairRadius, BCHWMathUtil.HALF_PI, Math.PI);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        //face
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.context.lineWidth = 0;
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.x + this.width *.15,
                                                        this.hairRect.getBottom(),
                                                        this.width *.7,
                                                        (this.height-this.hairRect.height) *.4, 5);
        this.renderRoundedRect(this.faceRect);
        this.context.lineWidth = this.lineThickness;

    }
    BCHWGirl.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.RoundedRectangle(  0, this.faceRect.getBottom(),
            this.faceRect.width *.95 , (this.getBottom()-this.faceRect.getBottom()) *.7, 4);
        this.bodyRect.x = (this.faceRect.x+this.faceRect.width/2)-(this.bodyRect.width/2);
        this.renderRoundedRect(this.bodyRect);

        //pants
        this.context.fillStyle = this.pantsFillStyle;
        this.pantsRect = new BCHWGeom.RoundedRectangle( this.faceRect.x, this.bodyRect.getBottom(),
            this.faceRect.width, this.getBottom()-this.bodyRect.getBottom(), 3);
        this.renderRoundedRect(this.pantsRect);

        this.context.moveTo(this.pantsRect.getCenterX(), this.getBottom()-this.lineThickness);
        this.context.lineTo(this.pantsRect.getCenterX(), this.pantsRect.y+this.pantsRect.height *.2);
        this.context.stroke();
    }

    BCHWGirl.prototype.renderMouth = function(){
        this.context.beginPath();
        var height = this.faceRect.height *.15;
        var mouthRect = new BCHWGeom.RoundedRectangle(  this.faceRect.x + this.faceRect.width/3, this.faceRect.y+this.faceRect.height *.7,
                                                        this.faceRect.width/3, height + Math.random()*height);
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
        this.context.lineWidth = this.lineThickness/2;
        this.context.moveTo(mouthRect.x, mouthRect.y+Math.random()*mouthRect.height);
        this.context.lineTo(mouthRect.x+mouthRect.width *.25,  mouthRect.y+Math.random()*mouthRect.height);
        this.context.lineTo(mouthRect.getRight(), mouthRect.y+Math.random()*mouthRect.height);
        this.context.stroke();
    }

    window.BCHWGirl = BCHWGirl;


    //=============================================================
    //=========================::BOY::=============================
    //=============================================================

    var BCHWBoy = function(canvas, x, y, width, height){
        BCHWCharacter.call(this, canvas, x, y, width, height);
        var shirtColor = BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
        this.shirtFillStyle = shirtColor.getCanvasColorString() ;
        this.pantsFillStyle = BCHWColor.BCHWColorsLib.getNextColorString(shirtColor);
        this.name = "boy";
    };

    //subclass extends superclass
    BCHWBoy.prototype = Object.create(BCHWCharacter.prototype);
    BCHWBoy.prototype.constructor = BCHWCharacter;

    BCHWBoy.prototype.render = function(bounds, lineThickness){
        //console.log("BCHWBoy.render()", bounds.toString());
        this.updateToRect(bounds);
        this.clear();
        this.lineThickness = lineThickness;
        this.context.lineWidth = this.lineThickness;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderHead();
        this.renderBody();
        this.renderMouth();
        this.renderEyes();
    };

    BCHWBoy.prototype.stop = function(bounds){
        //stop all animations
    }

    BCHWBoy.prototype.renderHead = function(){
        //hair
        this.context.fillStyle = BCHWColor.BCHWColorsLib.LIGHT_GRAY.getCanvasColorString();
        this.hairRect = new BCHWGeom.Rectangle(this.x, this.y, this.width, this.height/5);

        var hairRoundedRect = new BCHWGeom.RoundedRectangle(this.hairRect.x, this.hairRect.getCenterY(), this.hairRect.width, this.hairRect.height/2);
        this.renderRoundedRect(hairRoundedRect);

        var ballRadius = hairRoundedRect.height/2;
        var ballX = this.hairRect.x+this.hairRect.width * .7;
        var ballY = this.hairRect.y + ballRadius + this.lineThickness;
        this.context.moveTo(ballX,ballY);
        this.context.arc(ballX, ballY , ballRadius, 0, BCHWMathUtil.PI2 );

        var ball2Radius = ballRadius*.8;
        var ball2X = this.hairRect.x+this.hairRect.width * .6;
        var ball2Y = hairRoundedRect.y - ball2Radius + this.lineThickness;
        this.context.moveTo(ball2X,ball2Y);
        this.context.arc(ball2X, ball2Y , ball2Radius, 0, BCHWMathUtil.PI2 );

        this.context.stroke();

        //this.renderRoundedRect(hairRoundedRect);
        this.context.arc(ballX, ballY, ballRadius-this.lineThickness/2, 0, BCHWMathUtil.PI2 );
        this.context.arc(ball2X, ball2Y, ball2Radius-this.lineThickness/2, 0, BCHWMathUtil.PI2 );

        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        ball2Y = this.hairRect.getBottom();
        this.context.moveTo(ball2X,ball2Y);
        this.context.arc(ball2X, ball2Y , ballRadius, 0, BCHWMathUtil.PI2 );
        this.context.fill();

        //this.context.closePath();
        //face
        this.context.lineWidth = 0;
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.x + this.width *.05,
            this.hairRect.getBottom(),
            this.width *.9,
            (this.height-this.hairRect.height) *.4, 5);
        this.renderRoundedRect(this.faceRect);
        this.context.lineWidth = this.lineThickness;
    }
    BCHWBoy.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.RoundedRectangle(  0, this.faceRect.getBottom(),
            this.faceRect.width *.95 , (this.getBottom()-this.faceRect.getBottom()) *.7, 4);
        this.bodyRect.x = (this.faceRect.x+this.faceRect.width/2)-(this.bodyRect.width/2);
        this.renderRoundedRect(this.bodyRect);

        //pants
        this.context.fillStyle = this.pantsFillStyle;
        this.pantsRect = new BCHWGeom.RoundedRectangle( this.faceRect.x, this.bodyRect.getBottom(),
            this.faceRect.width, this.getBottom()-this.bodyRect.getBottom(), 3);
        this.renderRoundedRect(this.pantsRect);

        this.context.moveTo(this.pantsRect.getCenterX(), this.getBottom()-this.lineThickness);
        this.context.lineTo(this.pantsRect.getCenterX(), this.pantsRect.y+this.pantsRect.height *.2);
        this.context.stroke();
    }

    BCHWBoy.prototype.renderMouth = function(){
        this.context.beginPath();
        var height = this.faceRect.height *.15;
        var mouthRect = new BCHWGeom.RoundedRectangle(  this.faceRect.x + this.faceRect.width/3, this.faceRect.y+this.faceRect.height *.7,
            this.faceRect.width/3, height + Math.random()*height);
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.LIGHT_BROWN.getCanvasColorString();
        this.context.lineWidth = this.lineThickness/2;
        this.context.moveTo(mouthRect.x, mouthRect.y+Math.random()*mouthRect.height);
        this.context.lineTo(mouthRect.x+mouthRect.width *.25,  mouthRect.y+Math.random()*mouthRect.height);
        this.context.lineTo(mouthRect.getRight(), mouthRect.y+Math.random()*mouthRect.height);
        this.context.stroke();
    }

    window.BCHWBoy = BCHWBoy;


    //=============================================================
    //=========================::DAD::=============================
    //=============================================================

    var BCHWDad = function(canvas, x, y, width, height){
        BCHWCharacter.call(this, canvas, x, y, width, height);
        var shirtColor = BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
        this.shirtFillStyle = shirtColor.getCanvasColorString() ;
        this.couchFillStyle = BCHWColor.BCHWColorsLib.getNextColorString(shirtColor);
        this.name = "dad";
    };

    //subclass extends superclass
    BCHWDad.prototype = Object.create(BCHWCharacter.prototype);
    BCHWDad.prototype.constructor = BCHWCharacter;

    BCHWDad.prototype.render = function(bounds, lineThickness){
        //console.log("BCHWDad.render()", bounds.toString());
        this.updateToRect(bounds);
        this.clear();
        this.lineThickness = lineThickness;
        this.context.lineWidth = this.lineThickness;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderCouch();
        this.renderBody();
        this.renderHead();
        this.renderMouth();
    };

    BCHWDad.prototype.stop = function(bounds){
        //stop all animations
    }

    BCHWDad.prototype.renderCouch = function(){
        this.context.fillStyle = this.couchFillStyle
        this.couchRect = new BCHWGeom.RoundedRectangle(this.x+this.width *.4, this.y+this.height *.4, this.width *.6, this.height*.6, 8);
        this.renderRoundedRect(this.couchRect);
    }

    BCHWDad.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.Rectangle(  this.x + this.width *.25, this.couchRect.y,
                                                  this.width *.6 , this.couchRect.height);
        var radius = 6;//TODO must be dynamic
        this.context.beginPath();
        this.context.moveTo(this.bodyRect.x, this.bodyRect.y+radius);
        this.context.arc(this.bodyRect.x+radius, this.bodyRect.y+radius, radius, Math.PI, Math.PI+BCHWMathUtil.HALF_PI);
        this.context.lineTo(this.bodyRect.getRight()-radius, this.bodyRect.y);
        this.context.arc(this.bodyRect.getRight()-radius, this.bodyRect.y+radius, radius, Math.PI+BCHWMathUtil.HALF_PI, 0);
        this.context.lineTo(this.bodyRect.getRight(), this.bodyRect.getCenterY());
        this.context.lineTo(this.bodyRect.getCenterX()+radius, this.bodyRect.getCenterY());
        this.context.arc(this.bodyRect.getCenterX()+radius, this.bodyRect.getCenterY()+radius, radius, Math.PI+BCHWMathUtil.HALF_PI, Math.PI, true);
        this.context.lineTo(this.bodyRect.getCenterX(), this.bodyRect.getBottom()-radius);
        this.context.arc(this.bodyRect.getCenterX()-radius, this.bodyRect.getBottom()-radius, radius, 0, BCHWMathUtil.HALF_PI);
        this.context.lineTo(this.bodyRect.x+radius, this.bodyRect.getBottom());
        this.context.arc(this.bodyRect.x+radius, this.bodyRect.getBottom()-radius, radius, BCHWMathUtil.HALF_PI, Math.PI);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }

    BCHWDad.prototype.renderHead = function(){
        //face
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.bodyRect.x, this.y,
                                                        this.bodyRect.width,
                                                        this.bodyRect.y-this.y, 8);
        this.renderRoundedRect(this.faceRect, false, true);

        //hair
        this.context.fillStyle = BCHWColor.BCHWColorsLib.LIGHT_BROWN.getCanvasColorString();
        var hairHeight = this.faceRect.height /6.5;
        this.hairRect = new BCHWGeom.RoundedRectangle(this.faceRect.x, this.faceRect.y, this.faceRect.width, hairHeight, hairHeight/2.5);
        this.renderRoundedRect(this.hairRect);

        var sideBurnRect = new BCHWGeom.RoundedRectangle(   this.hairRect.getCenterX(), this.hairRect.getBottom()-this.hairRect.radius,
                                                            hairHeight, hairHeight*2, this.hairRect.radius);
        this.renderRoundedRect(sideBurnRect, false, true);

        //eye
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.eyeRect = new BCHWGeom.Rectangle(  this.faceRect.x + this.faceRect.width/7,
                                                this.faceRect.y + this.faceRect.height *.4,
                                                this.faceRect.width*.2, this.faceRect.height/6);
        this.context.lineWidth = 1;
        this.context.strokeStyle = BCHWColor.BCHWColorsLib.DARK_BROWN.getCanvasColorString();
        this.renderRect(this.eyeRect);

        this.context.lineWidth = 0;
        this.context.fillStyle = BCHWColor.BCHWColorsLib.DARK_BROWN.getCanvasColorString();
        this.pupilRect = new BCHWGeom.Rectangle(0,0,this.eyeRect.width *.6, this.eyeRect.height);

        //random eye position
        var maxVertical = this.eyeRect.height/2 ;
        var maxHorizontal = this.eyeRect.width/2 ;
        var vertical = (Math.random()*maxVertical)*(Math.random() >.5 ? 1 : -1);
        var horizontal = (Math.random()*maxHorizontal)*(Math.random() >.5 ? 1 : -1);

        //right pupil
        var pupilRect = new BCHWGeom.Rectangle(0, 0, this.pupilRect.width, this.pupilRect.height);
        pupilRect.x = this.eyeRect.getCenterX() - this.pupilRect.getCenterX() - horizontal;
        pupilRect.y = this.eyeRect.getCenterY() - this.pupilRect.getCenterY() - vertical;
        var renderRect = BCHWGeom.RectangleUtil.getIntersectingRectangle(this.eyeRect, pupilRect);
        this.renderRect(renderRect);

        this.context.strokeStyle = BCHWColor.BCHWColorsLib.BLACK.getCanvasColorString();
        this.context.lineWidth = 2;

        //eye brow
        this.context.beginPath();
        this.context.moveTo(this.eyeRect.x, this.eyeRect.y-this.eyeRect.height+Math.random()*(this.eyeRect.height *.7));
        this.context.lineTo(this.eyeRect.getCenterX(), this.eyeRect.y-this.eyeRect.height+Math.random()*(this.eyeRect.height *.7));
        this.context.lineTo(this.eyeRect.getRight(), this.eyeRect.y-this.eyeRect.height+Math.random()*(this.eyeRect.height *.7));
        this.context.stroke();
    }


    BCHWDad.prototype.renderMouth = function(){
        this.context.beginPath();
        this.context.moveTo(this.faceRect.x, this.y + this.faceRect.height *.8);
        this.context.lineTo(this.faceRect.x+this.eyeRect.width/2, this.y + this.faceRect.height *.8);
        this.context.lineTo(this.faceRect.x+this.eyeRect.width,
                            this.y + this.faceRect.height *.8 + (-this.eyeRect.height/2 + Math.random()*this.eyeRect.height));
        this.context.stroke();
    }

    window.BCHWDad = BCHWDad;

}(window));