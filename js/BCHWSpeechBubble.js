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
    };

    //subclass extends superclass
    BCHWSpeechBubble.prototype = Object.create(LayoutRectangle.prototype);
    BCHWSpeechBubble.prototype.constructor = LayoutRectangle;

    BCHWSpeechBubble.ANIMATE_INTERVAL = 20;//

    //FOR BUG REASONS AND LAZYNESS, THE SPACE CONTAINING THIS BUBBLE IS CLEARED BY OWNER CLASS
    BCHWSpeechBubble.prototype.render = function(bounds, triangleX, lineThickness, completeCallback){
        //console.log("BCHWSpeechBubble.render()", bounds.toString());
        this.triangleX = triangleX;
        this.completeCallback = completeCallback ? completeCallback : null;
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
        this.animationPercent = .4;
        this.nextAnimationStep();
    };

    BCHWSpeechBubble.prototype.renderBubble = function(percent){
        //bubble
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
        //this.context.stroke();
        this.context.closePath();
        //bubble arrow
        if(percent == 1){
            this.context.beginPath();
            this.context.moveTo(this.triangleX, rect.getBottom()-2);//-2 for iOs rendering issues
            this.context.lineTo(this.triangleX, this.getBottom());
            this.context.lineTo(this.triangleX+this.padding + Math.random()*(2*this.padding),rect.getBottom()-2);
            this.context.closePath();
            this.context.fill();
        }
    }

    BCHWSpeechBubble.prototype.nextAnimationStep = function(){
        this.animationPercent = BCHWMathUtil.clamp(0,1,(this.animationPercent+.05));
        this.renderBubble(this.animationPercent);
        var scope = this;
        if(this.animationPercent<1){
            this.animateTimeoutId = setTimeout(function(){
                scope.nextAnimationStep();
            }, BCHWSpeechBubble.ANIMATE_INTERVAL );
        }else{
            if(this.completeCallback){
                this.completeCallback();
                this.completeCallback = null;
            }
        }

    }

    BCHWSpeechBubble.prototype.stop = function(){
        this.clear();
        clearTimeout (this.animateTimeoutId);
    }

    window.BCHWSpeechBubble = BCHWSpeechBubble;

}(window));