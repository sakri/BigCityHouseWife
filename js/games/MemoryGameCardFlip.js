(function (window){

	
	//topRight, topLeft, bottomRight, bottomLeft must be Points
	var MemoryGameCardFlip  =  function(flipDuration, flipFramerate){
        //console.log("MemoryGameCardFlip constructor");
        this.flipDuration = isNaN(flipDuration) ? 500 : flipDuration;
        this.flipFramerate = isNaN(flipFramerate) ? 20 : flipFramerate;
        this.unitAnimator = new UnitAnimator();
        this.transformRectangle = new TransformRectangle();
        this.simpleRect = new BCHWGeom.Rectangle;
    };

    MemoryGameCardFlip.useGradient = false;
    MemoryGameCardFlip.useSimpleFlip = false;//move into a sub class or so

	MemoryGameCardFlip.prototype.flip =  function(flipRect, context, image1, image2, updateCallBack, completeCallBack, autoClear){
        //console.log("MemoryGameCardFlip.flip()");
		this.flipRect = flipRect;
        this.context = context;
        this.image1 = image1;
        this.image2 = image2;
        this.updateCallback = updateCallBack;
        this.completeCallback = completeCallBack;

        this.autoClear = autoClear;
        var scope = this;
        this.unitAnimator.reset(this.flipDuration, this.flipFramerate, function(){scope.flipUpdateHandler()}, function(){scope.flipCompleteHandler()});
        this.unitAnimator.start();
	};


    MemoryGameCardFlip.prototype.flipUpdateHandler = function(){

        var percent = this.unitAnimator.getAnimationPercent();
        //this is the chance for the container to clear or render some background
        if(this.updateCallback){
            this.updateCallback();
        }
        if(this.autoClear){
            this.context.clearRect(this.flipRect.x, this.flipRect.y, this.flipRect.width, this.flipRect.height);
        }
        switch(percent){
            case .5:
                this.drawHalfwayLine();
                return;
            case 0:
                this.drawImage(this.image1);
                return;
            case 1:
                this.drawImage(this.image2);
                return;
        }

        if(MemoryGameCardFlip.useSimpleFlip){
            if(percent<.5){
                this.updateFlipFirstHalfSimple(percent);
            }else{
                this.updateFlipSecondHalfSimple(percent);
            }
        }else{
            if(percent<.5){
                this.updateFlipFirstHalf(percent);
            }else{
                this.updateFlipSecondHalf(percent);
            }
        }
    }


    MemoryGameCardFlip.prototype.drawImage = function(image){
        this.context.drawImage(image, this.flipRect.x, this.flipRect.y, this.flipRect.width, this.flipRect.height);
    }

    MemoryGameCardFlip.prototype.drawHalfwayLine = function(){
        this.context.lineWidth = 2;
        this.context.strokeStyle = "rgba(0,0,0,.5)";
        this.context.beginPath();
        this.context.moveTo(this.flipRect.getCenterX(), this.flipRect.y+this.flipRect.height *.25);
        this.context.lineTo(this.flipRect.getCenterX(), this.flipRect.y+this.flipRect.height *.75);
        this.context.stroke();
    }

    MemoryGameCardFlip.prototype.updateFlipFirstHalf = function(percent){
        this.transformRectangle.topLeft.y = this.flipRect.y;
        this.transformRectangle.bottomLeft.y = this.flipRect.getBottom();
        this.transformRectangle.topLeft.x = this.transformRectangle.bottomLeft.x =  this.flipRect.x + this.flipRect.width*percent;

        this.transformRectangle.topRight.x = this.transformRectangle.bottomRight.x = this.flipRect.getRight() - (this.transformRectangle.topLeft.x - this.flipRect.x);
        var y = (this.flipRect.height/2)*percent;
        this.transformRectangle.topRight.y = this.flipRect.y + y;
        this.transformRectangle.bottomRight.y = this.transformRectangle.bottomLeft.y - y;

        this.transformRectangle.renderImage(this.context, this.image1);

        if(MemoryGameCardFlip.useGradient){
            this.gradient = this.context.createLinearGradient(this.transformRectangle.topRight.x,this.transformRectangle.topLeft.y,
                this.transformRectangle.topLeft.x, this.transformRectangle.topLeft.y);

            this.drawGradient(this.getGradientAlphaForPercent(percent));
        }

    }

    MemoryGameCardFlip.prototype.updateFlipSecondHalf = function(percent){
        this.transformRectangle.topRight.y = this.flipRect.y;
        this.transformRectangle.bottomRight.y = this.flipRect.getBottom();
        this.transformRectangle.topRight.x = this.transformRectangle.bottomRight.x =  this.flipRect.x + this.flipRect.width*percent;

        this.transformRectangle.topLeft.x = this.transformRectangle.bottomLeft.x = this.flipRect.x + (this.flipRect.getRight() - this.transformRectangle.topRight.x);
        var y = (this.flipRect.height/2)*(1-percent);
        this.transformRectangle.topLeft.y = this.flipRect.y + y;
        this.transformRectangle.bottomLeft.y = this.transformRectangle.bottomRight.y - y;

        this.transformRectangle.renderImage(this.context, this.image2);

        if(MemoryGameCardFlip.useGradient){
            this.gradient = this.context.createLinearGradient(this.transformRectangle.topLeft.x, this.transformRectangle.topLeft.y,
                this.transformRectangle.topRight.x,this.transformRectangle.topLeft.y);

            this.drawGradient(this.getGradientAlphaForPercent(percent));
        }
    }


    MemoryGameCardFlip.prototype.updateFlipFirstHalfSimple = function(percent){


        var width = this.flipRect.width*percent;
        this.simpleRect.update(this.flipRect.x + width, this.flipRect.y, this.flipRect.width-width*2, this.flipRect.height);
        this.context.drawImage(this.image1, this.simpleRect.x, this.simpleRect.y, this.simpleRect.width, this.simpleRect.height);

        if(MemoryGameCardFlip.useGradient){
            this.gradient = this.context.createLinearGradient(this.simpleRect.getRight(), this.simpleRect.y,
                this.simpleRect.x, this.simpleRect.y);

            this.drawGradientSimple(this.getGradientAlphaForPercent(percent));
        }

    }

    MemoryGameCardFlip.prototype.updateFlipSecondHalfSimple = function(percent){

        var width = this.flipRect.width - this.flipRect.width*percent
        this.simpleRect.update(this.flipRect.x + width, this.flipRect.y, this.flipRect.width-width*2, this.flipRect.height);
        this.context.drawImage(this.image2, this.simpleRect.x, this.simpleRect.y, this.simpleRect.width, this.simpleRect.height);

        if(MemoryGameCardFlip.useGradient){
            this.gradient = this.context.createLinearGradient(this.simpleRect.x, this.simpleRect.y,
                this.simpleRect.getRight(), this.simpleRect.y);

            this.drawGradientSimple(this.getGradientAlphaForPercent(percent));
        }
    }

    MemoryGameCardFlip.prototype.getGradientAlphaForPercent = function(percent){
        return .5- Math.abs(.5-percent);//*2;
    }

    MemoryGameCardFlip.prototype.drawGradient = function(alpha){
        if(alpha<.1){
            return;
        }
        this.gradient.addColorStop(0, 'rgba(0,0,0,'+alpha+')');
        this.gradient.addColorStop(1, 'rgba(0,0,0,0)');
        this.context.fillStyle = this.gradient;
        this.context.beginPath();
        this.context.moveTo(this.transformRectangle.topLeft.x, this.transformRectangle.topLeft.y);
        this.context.lineTo(this.transformRectangle.topRight.x, this.transformRectangle.topRight.y);
        this.context.lineTo(this.transformRectangle.bottomRight.x, this.transformRectangle.bottomRight.y);
        this.context.lineTo(this.transformRectangle.bottomLeft.x, this.transformRectangle.bottomLeft.y);
        this.context.closePath();
        this.context.fill();
    }

    MemoryGameCardFlip.prototype.drawGradientSimple = function(alpha){
        if(alpha<.1){
            return;
        }
        this.gradient.addColorStop(0, 'rgba(0,0,0,'+alpha+')');
        this.gradient.addColorStop(1, 'rgba(0,0,0,0)');
        this.context.fillStyle = this.gradient;
        this.context.closePath();
        this.context.fillRect(this.simpleRect.x, this.simpleRect.y, this.simpleRect.width, this.simpleRect.height);
    }


    MemoryGameCardFlip.prototype.flipCompleteHandler = function(){
        if(this.completeCallback){
            this.completeCallback();
        }
    }

    MemoryGameCardFlip.prototype.stop = function(){
        this.unitAnimator.pause();
        this.updateCallback = undefined;
        this.completeCallback = undefined;
    }


	window.MemoryGameCardFlip  =  MemoryGameCardFlip;
	
}(window));