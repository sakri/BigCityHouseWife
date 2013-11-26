/**
 * Created by sakri on 19-11-13.
 */
//===========================================================
//===================::BIG CITY HOUSE WIFE LOGO::=============
//==========================================================

(function (window){

    var BCHWSpeechBubble = function(canvas, bubbleArrowHeight){
        LayoutRectangle.call(this, canvas);
        this.bubbleArrowHeight = bubbleArrowHeight;
        this.lineThickness = 4;
        this.animateTimeoutId = -1;
        this.padding = 10;
        this.unitAnimator = new UnitAnimator();
    };

    //subclass extends superclass
    BCHWSpeechBubble.prototype = Object.create(LayoutRectangle.prototype);
    BCHWSpeechBubble.prototype.constructor = LayoutRectangle;

    BCHWSpeechBubble.OPEN_DURATION = 600;//milliseconds
    BCHWSpeechBubble.CLOSE_DURATION = 400;//milliseconds
    BCHWSpeechBubble.ANIMATE_INTERVAL = 20;//
    BCHWSpeechBubble.STAY_OPEN_INTERVAL = 5000;//characters display a tweet at this interval

    //FOR BUG REASONS AND LAZINESS, THE SPACE CONTAINING THIS BUBBLE IS CLEARED BY OWNER CLASS
    BCHWSpeechBubble.prototype.showBubble = function(bounds, triangleX, lineThickness,
                                                     showCompleteCallback, startRemoveBubbleCallback, removeBubbleCompleteCallback){
        //console.log("BCHWSpeechBubble.render()", bounds.toString());
        this.triangleX = triangleX;
        this.showCompleteCallback =  showCompleteCallback ?  showCompleteCallback : null;
        this.startRemoveBubbleCallback =  startRemoveBubbleCallback ?  startRemoveBubbleCallback : null;
        this.removeBubbleCompleteCallback =  removeBubbleCompleteCallback ?  removeBubbleCompleteCallback : null;
        this.x = bounds.x - this.padding;
        this.y = bounds.y - this.padding;
        this.width = bounds.width + this.padding*2;
        this.height = bounds.height + this.padding*2 ;
        //hardcoded because multiline bubbles would sometimes let the content rect corners protrude
        var maxCornerRadius = 18;//(this.height-this.bubbleArrowHeight)/2;
        var minCornerRadius = 9;//(this.height-this.bubbleArrowHeight)/4;
        this.cornerRadii = [];
        for(var i=0;i<4;i++){
            this.cornerRadii[i] = BCHWMathUtil.getRandomNumberInRange(minCornerRadius, maxCornerRadius);
        }

        var scope = this;
        this.unitAnimator.reset(BCHWSpeechBubble.OPEN_DURATION, BCHWSpeechBubble.ANIMATE_INTERVAL,
                                function(){scope.unitAnimatorShowUpdateHandler()},function(){scope.unitAnimatorShowCompleteHandler()});
        this.unitAnimator.start(UnitAnimator.easeOutSine);
    };

    BCHWSpeechBubble.prototype.unitAnimatorShowUpdateHandler = function(){
        this.renderBubble(BCHWMathUtil.interpolate(this.unitAnimator.getAnimationPercent(),.4,1));
    }

    BCHWSpeechBubble.prototype.unitAnimatorShowCompleteHandler = function(){
        this.renderBubble(1);
        if(this.showCompleteCallback){
            this.showCompleteCallback();
            this.showCompleteCallback = null;
        }
        var scope = this;
        this.speechBubbleTimeout = setTimeout(function(){scope.removeBubble()}, BCHWSpeechBubble.STAY_OPEN_INTERVAL );
    }

    BCHWSpeechBubble.prototype.removeBubble = function(){
        if(this.startRemoveBubbleCallback){
            this.startRemoveBubbleCallback();
            this.startRemoveBubbleCallback = null;
        }
        var scope = this;
        this.unitAnimator.reset(BCHWSpeechBubble.CLOSE_DURATION, BCHWSpeechBubble.ANIMATE_INTERVAL,
            function(){scope.unitAnimatorRemoveUpdateHandler()},function(){scope.unitAnimatorRemoveCompleteHandler()});
        this.unitAnimator.start(UnitAnimator.easeInSine);
    }

    BCHWSpeechBubble.prototype.unitAnimatorRemoveUpdateHandler = function(){
        this.renderBubble(BCHWMathUtil.interpolate(this.unitAnimator.getAnimationPercent(),1,.4));
    }

    BCHWSpeechBubble.prototype.unitAnimatorRemoveCompleteHandler = function(){
        //console.log("BCHWSpeechBubble.unitAnimatorRemoveCompleteHandler");
        this.clear();
        if(this.removeBubbleCompleteCallback){
            this.removeBubbleCompleteCallback();
            this.removeBubbleCompleteCallback = null;
        }
    }


    BCHWSpeechBubble.prototype.renderBubble = function(percent){
        //bubble
        //console.log("BCHWSpeechBubble.renderBubble()",percent);
        this.clear();
        this.context.fillStyle = "#FFFFFF";
        this.context.lineWidth = 0;
        var rect = new BCHWGeom.Rectangle(this.x+1, this.y+1, (this.width-2)*percent, this.height - this.bubbleArrowHeight-2);// extra pixel of padding for iOs clearing issues
        this.context.beginPath();
        var radius = this.cornerRadii[0];
        this.context.moveTo(rect.x, rect.y+radius);
        this.context.arc(rect.x+radius, rect.y+radius, radius, Math.PI,Math.PI+BCHWMathUtil.HALF_PI);
        radius = this.cornerRadii[1];
        this.context.lineTo(rect.getRight()-radius, rect.y);
        this.context.arc(rect.getRight()-radius, rect.y+radius, radius, Math.PI+BCHWMathUtil.HALF_PI, BCHWMathUtil.PI2 );
        radius = this.cornerRadii[2];
        this.context.lineTo(rect.getRight(), rect.getBottom()-radius);
        this.context.arc(rect.getRight()-radius, rect.getBottom()-radius, radius, 0, BCHWMathUtil.HALF_PI );
        radius = this.cornerRadii[3];
        this.context.lineTo(rect.x+radius, rect.getBottom());
        this.context.arc(rect.x+radius, rect.getBottom()-radius, radius, BCHWMathUtil.HALF_PI, Math.PI );
        radius = this.cornerRadii[0];
        this.context.lineTo(rect.x, rect.y+radius);
        this.context.fill();
        this.context.closePath();

        //bubble arrow
        if(percent == 1){
            this.context.beginPath();
            if(this.triangleX>this.width/2){
                this.context.moveTo(this.triangleX, rect.getBottom()-2);//-2 for iOs rendering issues
                this.context.lineTo(this.triangleX, this.getBottom());
                this.context.lineTo(this.triangleX - this.padding - Math.random()*(2*this.padding),rect.getBottom()-2);
            }else{
                this.context.moveTo(this.triangleX, rect.getBottom()-2);//-2 for iOs rendering issues
                this.context.lineTo(this.triangleX, this.getBottom());
                this.context.lineTo(this.triangleX+this.padding + Math.random()*(2*this.padding),rect.getBottom()-2);
            }
            this.context.closePath();
            this.context.fill();
        }
    }


    BCHWSpeechBubble.prototype.stop = function(){
        this.clear();
        this.unitAnimator.pause();
        clearTimeout (this.speechBubbleTimeout);
    }

    window.BCHWSpeechBubble = BCHWSpeechBubble;

}(window));