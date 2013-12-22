(function (window){

	var BCHWMathUtil = function(){};
	
	//used for radiansToDegrees and degreesToRadians
	BCHWMathUtil.PI_180 = Math.PI/180;
	BCHWMathUtil.ONE80_PI = 180/Math.PI;
	
	//precalculations for values of 90, 270 and 360 in radians
	BCHWMathUtil.PI2 = Math.PI*2;
	BCHWMathUtil.HALF_PI = Math.PI/2;
	BCHWMathUtil.NEGATIVE_HALF_PI = -Math.PI/2;
	
	BCHWMathUtil.clamp = function(min,max,value){
		if(value<min)return min;
		if(value>max)return max;
		return value;
	};
	
	BCHWMathUtil.clampRGB = function(value){
		return BCHWMathUtil.clamp(0,255,value);
	};
	
	//return number between 1 and 0
	BCHWMathUtil.normalize = function(value, minimum, maximum){
		return (value - minimum) / (maximum - minimum);
	};

	//map normalized number to values
	BCHWMathUtil.interpolate = function(normValue, minimum, maximum){
		return minimum + (maximum - minimum) * normValue;
	};

	//map a value from one set to another
	BCHWMathUtil.map = function(value, min1, max1, min2, max2){
		return BCHWMathUtil.interpolate( BCHWMathUtil.normalize(value, min1, max1), min2, max2);
	};


	//keep degrees between 0 and 360
	BCHWMathUtil.constrainDegreeTo360 = function(degree){
		return (360+degree%360)%360;//hmmm... looks a bit weird?!
	};

	BCHWMathUtil.constrainRadianTo2PI = function(rad){
		return (BCHWMathUtil.PI2+rad%BCHWMathUtil.PI2)%BCHWMathUtil.PI2;//equally so...
	};

	BCHWMathUtil.radiansToDegrees = function(rad){
		return rad*BCHWMathUtil.ONE80_PI;
	};

	BCHWMathUtil.degreesToRadians = function(degree){
		return degree*BCHWMathUtil.PI_180;
	};
	
	BCHWMathUtil.getRandomNumberInRange = function(min,max){
		return min+Math.random()*(max-min);
	};
	
	BCHWMathUtil.getRandomIntegerInRange = function(min,max){
		return Math.round(BCHWMathUtil.getRandomNumberInRange(min,max));
	};
	
	BCHWMathUtil.getCircumferenceOfEllipse = function(width,height){
		return ((Math.sqrt(.5 * ((width * width) + (height * height)))) * (Math.PI * 2)) / 2;
	};
	
	
	window.BCHWMathUtil = BCHWMathUtil;
	
}(window));
(function (window){

	var BCHWGeom = function(){};

    //==================================================
    //=====================::POINT::====================
    //==================================================

    BCHWGeom.Point = function (x,y){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    };

    BCHWGeom.Point.prototype.clone = function(){
        return new BCHWGeom.Point(this.x,this.y);
    };

    BCHWGeom.Point.prototype.equals = function(point){
        return this.x==point.x && this.y==point.y;
    };

    BCHWGeom.Point.prototype.toString = function(){
        return "{x:"+this.x+" , y:"+this.y+"}";
    };

    BCHWGeom.distanceBetweenTwoPoints = function( point1, point2 ){
        //console.log("Math.pow(point2.x - point1.x,2) : ",Math.pow(point2.x - point1.x,2));
        return Math.sqrt( Math.pow(point2.x - point1.x,2) + Math.pow(point2.y - point1.y,2) );
    };

    BCHWGeom.angleBetweenTwoPoints = function(p1,p2){
        return Math.atan2(p1.y-p2.y, p1.x-p2.x);
    };

    BCHWGeom.mirrorPointInRectangle = function(point,rect){
        return new BCHWGeom.Point(rect.width-point.x,rect.height-point.y);
    };

    BCHWGeom.randomizePoint = function(point,randomValue){
        return new BCHWGeom.Point(-randomValue+Math.random()*randomValue+point.x,-randomValue+Math.random()*randomValue+point.y);
    };


    //==================================================
    //=====================::TRIANGLE::====================
    //==================================================

    BCHWGeom.Triangle = function (a,b,c){
        this.a = a ? a : new BCHWGeom.Point(0,0);
        this.b = b ? b : new BCHWGeom.Point(0,0);
        this.c = c ? c : new BCHWGeom.Point(0,0);
    };

    BCHWGeom.Triangle.prototype.equals = function(triangle){
        return this.a.equals(triangle.a) && this.b.equals(triangle.b) && this.c.equals(triangle.c);
    };

    BCHWGeom.Triangle.prototype.clone = function(){
        return new BCHWGeom.Triangle(new BCHWGeom.Point(this.a.x,this.a.y),new BCHWGeom.Point(this.b.x,this.b.y),new BCHWGeom.Point(this.c.x,this.c.y));
    };

    BCHWGeom.Triangle.prototype.getSmallestX = function(){
        return Math.min(this.a.x,this.b.x,this.c.x);
    };
    BCHWGeom.Triangle.prototype.getSmallestY = function(){
        return Math.min(this.a.y,this.b.y,this.c.y);
    };

    BCHWGeom.Triangle.prototype.getBiggestX = function(){
        return Math.max(this.a.x,this.b.x,this.c.x);
    };
    BCHWGeom.Triangle.prototype.getBiggestY = function(){
        return Math.max(this.a.y,this.b.y,this.c.y);
    };

    BCHWGeom.Triangle.prototype.containsVertex = function(point){
        //console.log("BCHWGeom.Triangle.containsVertex",this.toString(),point.toString());
        return (this.a.x==point.x && this.a.y==point.y) || (this.b.x==point.x && this.b.y==point.y) || (this.c.x==point.x && this.c.y==point.y);
    };

    BCHWGeom.Triangle.prototype.toString = function(){
        return "toString() Triangle{a:"+this.a+" , b:"+this.b+" , c:"+this.c+"}";
    };

    BCHWGeom.Triangle.prototype.containsVertex = function(point){
        return (this.a.x==point.x && this.a.y==point.y) || (this.b.x==point.x && this.b.y==point.y) || (this.c.x==point.x && this.c.y==point.y);
    };

    BCHWGeom.Triangle.prototype.sharesEdge = function(triangle){
        //console.log("BCHWGeom.Triangle.sharesEdge",this.toString(),triangle.toString());
        var sharedPoints=0;
        if(this.containsVertex(triangle.a)){
            sharedPoints++;
        }
        if(this.containsVertex(triangle.b)){
            sharedPoints++;
        }
        if(this.containsVertex(triangle.c)){
            sharedPoints++;
        }
        //console.log("sharesEdge()",sharedPoints);
        return sharedPoints==2;
    };
    
	//==================================================
	//===================::RECTANGLE::==================
	//==================================================

	BCHWGeom.Rectangle = function (x, y, width, height){
		this.update(x, y, width, height);
	};
	
	BCHWGeom.Rectangle.prototype.update = function(x, y, width, height){
		this.x = isNaN(x) ? 0 : x;
		this.y = isNaN(y) ? 0 : y;
		this.width = isNaN(width) ? 0 : width;
		this.height = isNaN(height) ? 0 : height;
	};
	
	BCHWGeom.Rectangle.prototype.updateToRect = function(rect){
		this.x = rect.x;
		this.y = rect.y;
		this.width = rect.width;
		this.height = rect.height;
	};
	
	BCHWGeom.Rectangle.prototype.scaleX = function(scaleBy){
		this.width *= scaleBy;
	};
	
	BCHWGeom.Rectangle.prototype.scaleY = function(scaleBy){
		this.height *= scaleBy;
	};
	
	BCHWGeom.Rectangle.prototype.scale = function(scaleBy){
		this.scaleX(scaleBy);
		this.scaleY(scaleBy);
	};

	BCHWGeom.Rectangle.prototype.getRight = function(){
		return this.x + this.width;
	};
	
	BCHWGeom.Rectangle.prototype.getBottom = function(){
		return this.y + this.height;
	};

    BCHWGeom.Rectangle.prototype.getCenterX = function(){
        return this.x + this.width/2;
    };

    BCHWGeom.Rectangle.prototype.containsPoint = function(x, y){
        return x >= this.x && y >= this.y && x <= this.getRight() && y <= this.getBottom();
    };
    BCHWGeom.Rectangle.prototype.containsRect = function(rect){
        return this.containsPoint(rect.x, rect.y) && this.containsPoint(rect.getRight(), rect.getBottom());
    };
    //questionable... center should not be relative to canvas itself...
    BCHWGeom.Rectangle.prototype.getCenter = function(){
        return new BCHWGeom.Point(this.x+this.width/2,this.y+this.height/2);
    };

    BCHWGeom.Rectangle.prototype.getCenterY=function(){
        return this.y + this.height/2;
    };
	BCHWGeom.Rectangle.prototype.isSquare = function(){
		return this.width == this.height;
	};

	BCHWGeom.Rectangle.prototype.isLandscape = function(){
		return this.width > this.height;
	};

	BCHWGeom.Rectangle.prototype.isPortrait = function(){
		return this.width < this.height;
	};
	
	BCHWGeom.Rectangle.prototype.getSmallerSide = function(){
		return Math.min(this.width, this.height);
	};
	
	BCHWGeom.Rectangle.prototype.getBiggerSide = function(){
		return Math.max(this.width,this.height);
	};
	
	BCHWGeom.Rectangle.prototype.getArea = function(){
		return this.width * this.height;
	};
	
	BCHWGeom.Rectangle.prototype.floor = function(){
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.width = Math.floor(this.width);
		this.height = Math.floor(this.height);
	};
	
	BCHWGeom.Rectangle.prototype.ceil = function(){
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.width = Math.ceil(this.width);
		this.height = Math.ceil(this.height);
	};

	BCHWGeom.Rectangle.prototype.round = function(){
		this.x=Math.round(this.x);
		this.y=Math.round(this.y);
		this.width=Math.round(this.width);
		this.height=Math.round(this.height);
	};

	BCHWGeom.Rectangle.prototype.roundIn = function(){
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.width = Math.floor(this.width);
		this.height = Math.floor(this.height);
	};

	BCHWGeom.Rectangle.prototype.roundOut = function(){
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.width = Math.ceil(this.width);
		this.height = Math.ceil(this.height);
	};
	
	BCHWGeom.Rectangle.prototype.clone = function(){
		return new BCHWGeom.Rectangle(this.x, this.y, this.width, this.height);
	};
	
	BCHWGeom.Rectangle.prototype.toString = function(){
		return "Rectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+"}";
	};
	
	//==================================================
	//===========::ROUNDED RECTANGLE::==================
	//==================================================	

	BCHWGeom.RoundedRectangle = function (x, y , width, height, radius){
        BCHWGeom.Rectangle.call(this, x, y, width, height);
		this.radius = isNaN(radius) ? 5 : radius;
	};

    //subclass extends superclass
    BCHWGeom.RoundedRectangle.prototype = Object.create(BCHWGeom.Rectangle.prototype);
    BCHWGeom.RoundedRectangle.prototype.constructor = BCHWGeom.Rectangle;

    BCHWGeom.RoundedRectangle.prototype.drawPathToContext = function(context){
        context.beginPath();
        context.moveTo(this.x, this.y+this.radius);
        context.arc(this.x+this.radius, this.y+this.radius, this.radius, Math.PI,Math.PI+BCHWMathUtil.HALF_PI);
        context.lineTo(this.getRight()-this.radius, this.y);
        context.arc(this.getRight()-this.radius, this.y+this.radius, this.radius, Math.PI+BCHWMathUtil.HALF_PI, BCHWMathUtil.PI2 );
        context.lineTo(this.getRight(), this.getBottom()-this.radius);
        context.arc(this.getRight()-this.radius, this.getBottom()-this.radius, this.radius, 0, BCHWMathUtil.HALF_PI );
        context.lineTo(this.x+this.radius, this.getBottom());
        context.arc(this.x+this.radius, this.getBottom()-this.radius, this.radius, BCHWMathUtil.HALF_PI, Math.PI );
        context.lineTo(this.x, this.y+this.radius);
        context.closePath();
    }

	BCHWGeom.RoundedRectangle.prototype.toString = function(){
		return "RoundedRectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+" , radius:"+this.radius+"}";
	};
	
	BCHWGeom.RoundedRectangle.prototype.clone = function(){
		return new BCHWGeom.RoundedRectangle(this.x,this.y,this.width,this.height,this.radius);
	};
	

	//==================================================
	//==============::RECTANGLE UTIL::==================
	//==================================================
	
	BCHWGeom.RectangleUtil=function (){};
	
	BCHWGeom.RectangleUtil.getBiggerRectangle = function(rectA, rectB){
		return rectA.getArea() > rectB.getArea() ? rectA : rectB;
	};
	
	BCHWGeom.RectangleUtil.getSmallerRectangle = function(rectA, rectB){
		return (rectA.getArea() < rectB.getArea() ? rectA : rectB);
	};
	
	BCHWGeom.RectangleUtil.isBiggerThan = function(rectA, rectB){
		return rectA.getArea() > rectB.getArea();
	};
	
	BCHWGeom.RectangleUtil.isBiggerThanOrEqual = function(rectA, rectB){
		return rectA.getArea() >= rectB.getArea();
	};
		
	BCHWGeom.RectangleUtil.isSmallerThan = function(rectA, rectB){
		return rectA.getArea() < rectB.getArea();
	};
	
	BCHWGeom.RectangleUtil.isSmallerThanOrEqual = function(rectA, rectB){
		return rectA.getArea() <= rectB.getArea();
	};
	
	BCHWGeom.RectangleUtil.isEqual = function(rectA, rectB){
		return BCHWGeom.RectangleUtil.hasEqualPosition(rectA,rectB) && BCHWGeom.RectangleUtil.hasEqualSides(rectA,rectB);
	};
	
	BCHWGeom.RectangleUtil.hasEqualPosition = function(rectA, rectB){
		return rectA.x==rectB.x && rectA.y==rectB.y;
	};
	
	BCHWGeom.RectangleUtil.hasEqualSides = function(rectA, rectB){
		return rectA.width==rectB.width && rectA.height==rectB.height;
	};
	
	BCHWGeom.RectangleUtil.hasEqualArea = function(rectA,rectB){
		return rectA.getArea() == rectB.getArea();
	};
	
	BCHWGeom.RectangleUtil.getCenterX = function(rect){
		return rect.x+rect.width/2;
	};
	
	BCHWGeom.RectangleUtil.getCenterY=function(rect){
		return rect.y+rect.height/2;
	};

	BCHWGeom.RectangleUtil.createRandomXIn = function(rect){
		return BCHWMathUtil.getRandomNumberInRange(rect.x, rect.getRight());
	};

	BCHWGeom.RectangleUtil.createRandomYIn = function(rect){
		return BCHWMathUtil.getRandomNumberInRange(rect.y,rect.getBottom());
	};

    BCHWGeom.RectangleUtil.rectanglesIntersect = function(rectA, rectB){
        return  rectA.containsPoint(rectB.x, rectB.y) ||
                rectA.containsPoint(rectB.getRight(), rectB.y) ||
                rectA.containsPoint(rectB.getRight(), rectB.getBottom()) ||
                rectA.containsPoint(rectB.x, rectB.getBottom());
    };

    BCHWGeom.RectangleUtil.getIntersectingRectangle = function(rectA, rectB){
        //console.log("BCHWGeom.RectangleUtil.getIntersectingRectangle()", rectA.toString(), rectB.toString());
        if(!BCHWGeom.RectangleUtil.rectanglesIntersect(rectA,rectB)){
            console.log("\tno intersection found");
            return null;
        }
        if(rectA.containsRect(rectB)){
            return rectB;
        }
        if(rectB.containsRect(rectA)){
            return rectA;
        }

        var x1 = Math.max(rectA.x, rectB.x),
            y1 = Math.max(rectA.y, rectB.y),
            x2 = Math.min(rectA.getRight(), rectB.getRight()),
            y2 = Math.min(rectA.getBottom(), rectB.getBottom());
        return new BCHWGeom.Rectangle(x1, y1, x2 - x1, y2 - y1);
    };
	
	BCHWGeom.RectangleUtil.createRandomRectangleIn = function(rect){
		var w = Math.random()*rect.width;
		var h = Math.random()*rect.height;
		var x = Math.random()*(rect.width-w);
		var y = Math.random()*(rect.height-h);
		return new BCHWGeom.Rectangle(rect.x+x,rect.y+y,w,h);
	};
	
	BCHWGeom.RectangleUtil.createRandomIntegerRectangleIn = function(rect){
		var randomRect = BCHWGeom.RectangleUtil.createRandomRectangleIn(rect);
        randomRect.round();
		return randomRect;
	};

	BCHWGeom.RectangleUtil.horizontalAlignLeft = function(staticRect,rectToAlign){
		rectToAlign.x = staticRect.x;
	};

	BCHWGeom.RectangleUtil.horizontalAlignMiddle = function(staticRect, rectToAlign){
		rectToAlign.x = BCHWGeom.RectangleUtil.getCenterX(staticRect) - rectToAlign.width/2;
	};

	BCHWGeom.RectangleUtil.horizontalAlignRight = function(staticRect,rectToAlign){
		rectToAlign.x = staticRect.getRight() - rectToAlign.width;
	};
	
	BCHWGeom.RectangleUtil.verticalAlignTop = function(staticRect, rectToAlign){
		rectToAlign.y = staticRect.y;
	};

	BCHWGeom.RectangleUtil.verticalAlignMiddle = function(staticRect, rectToAlign){
		rectToAlign.y = BCHWGeom.RectangleUtil.getCenterY(staticRect) - rectToAlign.height/2;
	};

	BCHWGeom.RectangleUtil.verticalAlignBottom = function(staticRect, rectToAlign){
		rectToAlign.y = staticRect.getBottom() - rectToAlign.height;
	};

	BCHWGeom.RectangleUtil.scaleRectToPortraitFit = function(staticRect, rectToScale){
		BCHWGeom.RectangleUtil.scaleRectToHeight(rectToScale, staticRect.height);
	};
	
	BCHWGeom.RectangleUtil.scaleRectToLandscapeFit = function(staticRect, rectToScale){
		BCHWGeom.RectangleUtil.scaleRectToWidth(rectToScale, staticRect.width);
	};
	
	BCHWGeom.RectangleUtil.scaleRectToHeight = function(rect, height){
		rect.width *= (height/rect.height);
		rect.height = height;
	};
	
	BCHWGeom.RectangleUtil.scaleRectToWidth = function(rect, width){
		rect.height *= (width/rect.width);
		rect.width = width;
	};
	
	BCHWGeom.RectangleUtil.scaleRectToBestFit = function(staticRect, rectToScale){
		var copy = rectToScale.clone();
		BCHWGeom.RectangleUtil.scaleRectToPortraitFit(staticRect, copy);
		if(copy.width > staticRect.width){
			BCHWGeom.RectangleUtil.scaleRectToLandscapeFit(staticRect, rectToScale);
		}else{
			rectToScale.updateToRect(copy);
		}
	};
	
	BCHWGeom.RectangleUtil.scaleRectInto = function(staticRect,rectToScale){
		BCHWGeom.RectangleUtil.scaleRectToBestFit(staticRect,rectToScale);
		BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect,rectToScale);
		BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rectToScale);
	};


    //==================================================
    //=====================::TRANSFORM::===================
    //==================================================

    BCHWGeom.setIdentityMatrixToContext = function(context){
        context.setTransform(1,0,0,1,0,0);
    };

    //(1,0,0,1,0,0);
    BCHWGeom.Transform = function (scaleX, skewX, skewY, scaleY, tx, ty){
        this.update(isNaN(scaleX) ? 1 : scaleX, isNaN(skewX) ? 0 : skewX, isNaN(skewY) ? 0 : skewY,
            isNaN(scaleY) ? 1 : scaleY, isNaN( tx) ?  0 : tx, isNaN(ty) ? 0 : ty);
    };

    BCHWGeom.Transform.prototype.update = function (scaleX, skewX, skewY, scaleY, tx, ty){
        this.scaleX = scaleX;
        this.skewX = skewX;
        this.skewY = skewY;
        this.scaleY = scaleY;
        this.tx = tx;
        this.ty = ty;
    };

    BCHWGeom.Transform.prototype.toString = function() {
        return "SimpleGeometry.Transform{scaleX:"+this.scaleX+" ,skewX:"+this.skewX+" ,skewY:"+this.skewY+" ,scaleY:"+this.scaleY+" ,tx:"+this.tx+" ,ty:"+this.ty+"}";
    };





	window.BCHWGeom = BCHWGeom;

	
}(window));

//=========================::UNIT ANIMATOR::===============================

//animates a number from 0-1 (with optional easing) for a given duration and a framerate
//this is used to animate or tweeen visuals which are set up using interpolation

(function (window){

	//constructor, duration and framerate must be in milliseconds
	UnitAnimator=function(duration, framerate, updateCallBack, completeCallBack){
        this.easingFunction = UnitAnimator.easeLinear;//default
		this.reset(duration, framerate, updateCallBack, completeCallBack);
	};

	//t is "time" this.millisecondsAnimated
	//b is the "beginning" value
	//c is "change" or the difference of end-start value
	//d is this.duration
	
	//classic Robert Penner easing functions
	//http://www.robertpenner.com/easing/
	
	
	UnitAnimator.easeLinear = function(t, b, c, d){
		return c * (t / d) + b;
	};
	
	//SINE
	UnitAnimator.easeInSine = function (t, b, c, d){
		return -c * Math.cos(t/d * BCHWMathUtil.HALF_PI) + c + b;
	};
	UnitAnimator.easeOutSine = function (t, b, c, d){
		return c * Math.sin(t/d * BCHWMathUtil.HALF_PI) + b;
	};
	UnitAnimator.easeInOutSine = function (t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};
	
	
	//BOUNCE
	UnitAnimator.easeInBounce = function(t, b, c, d){
		return c - UnitAnimator.easeOutBounce (d-t, 0, c, d) + b;
	};
	UnitAnimator.easeOutBounce = function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	};
	UnitAnimator.easeInOutBounce = function (t, b, c, d){
		if (t < d/2){
			return UnitAnimator.easeInBounce (t*2, 0, c, d) * .5 + b;
		}
		return UnitAnimator.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	};
	
	//ELASTIC
	UnitAnimator.easeInElastic = function(t, b, c, d, a, p){
		var s;
		if (t==0){
			return b; 
		}
		if ((t/=d)==1){
			return b+c;
		}
		if (!p){
			p=d*.3;
		}
		if (!a || a < Math.abs(c)) {
			a=c; s=p/4; 
		}else{
			s = p/BCHWMathUtil.PI2 * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*BCHWMathUtil.PI2/p )) + b;
	};
	UnitAnimator.easeOutElastic = function(t, b, c, d, a, p){
		var s;
		if (t==0){
			return b;
		}
		if ((t/=d)==1){
			return b+c;
		}
		if (!p){
			p=d*.3;
		}
		if (!a || a < Math.abs(c)) {
			a=c; s=p/4; 
		}else{
			s = p/BCHWMathUtil.PI2 * Math.asin (c/a);
		}
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*BCHWMathUtil.PI2/p ) + c + b);
	};
	UnitAnimator.easeInOutElastic = function(t, b, c, d, a, p){
		var s;
		if (t==0){
			return b;
		}
		if ((t/=d/2)==2){
			return b+c;
		}
		if (!p){
			p=d*(.3*1.5);
		}
		if (!a || a < Math.abs(c)) {
			a=c; s=p/4; 
		}else{
			s = p/BCHWMathUtil.PI2 * Math.asin (c/a);
		}
		if (t < 1){
			return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*BCHWMathUtil.PI2/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*BCHWMathUtil.PI2/p )*.5 + c + b;
	};
	
	UnitAnimator.easingFunctions = [UnitAnimator.easeLinear,
                                    UnitAnimator.easeInSine, UnitAnimator.easeOutSine, UnitAnimator.easeInOutSine,
                                    UnitAnimator.easeInBounce, UnitAnimator.easeOutBounce, UnitAnimator.easeInOutBounce,
                                    UnitAnimator.easeInElastic, UnitAnimator.easeOutElastic, UnitAnimator.easeInOutElastic
                                    ];
	
	UnitAnimator.getRandomEasingFunction = function(){
		return UnitAnimator.easingFunctions[Math.floor( Math.random()*UnitAnimator.easingFunctions.length )];
	};
	
	UnitAnimator.prototype.setRandomEasingFunction = function(){
		this.easingFunction = UnitAnimator.getRandomEasingFunction();
	};
	
	UnitAnimator.prototype.setEasingFunction = function(easingFunction){
		if(UnitAnimator.easingFunctions.indexOf(easingFunction) > -1){
			this.easingFunction = easingFunction;
		}
	};
	
	//easing (t, b, c, d)
	//@t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever � as long as the unit is the same as is used for the total time [3].
	//@b is the beginning value of the property.
	//@c is the change between the beginning and destination value of the property.
	//@d is the total time of the tween.
	UnitAnimator.prototype.getAnimationPercent = function(){
		return this.easingFunction(BCHWMathUtil.normalize(this.millisecondsAnimated,0,this.duration),0,1,1);
	};
	
	UnitAnimator.prototype.isAnimating = function(){
		return !isNaN(this.intervalId);
	};
	
	UnitAnimator.prototype.reset = function(duration,framerate,updateCallBack,completeCallBack){
		this.duration = duration;
		this.framerate = framerate;
		if(framerate > duration){
			//throw error?!
		}
		this.updateCallBack = updateCallBack;
		this.completeCallBack = completeCallBack;
		this.millisecondsAnimated = 0;//keeps track of how long the animation has been running
	};
	
	UnitAnimator.prototype.start = function(easingFunction){
		//console.log("UnitAnimator.start()");
		if(easingFunction){
			this.setEasingFunction(easingFunction);
		}
		var _this = this;
		this.intervalId = setInterval(function(){_this.update();}, this.framerate);//TODO : find easier to explain solution
	};
	
	UnitAnimator.prototype.pause = function(){
		if(!isNaN(this.intervalId)){
			clearInterval(this.intervalId);
		}
		delete this.intervalId;
	};

	//refactor, make private
	UnitAnimator.prototype.update = function(){
		//console.log("UnitAnimator.update()",this.getAnimationPercent());
		this.millisecondsAnimated += this.framerate;
		if(this.millisecondsAnimated >= this.duration){
			//console.log("UnitAnimator.update() animation complete");
			this.pause();
			this.millisecondsAnimated = this.duration;
			this.dispatchUpdate();
			this.dispatchComplete();
			return;
		}
		this.dispatchUpdate();
	};
	
	UnitAnimator.prototype.dispatchUpdate = function(){
		if(this.updateCallBack){
			//console.log("UnitAnimator.dispatchUpdate()",this.getAnimationPercent());
			this.updateCallBack();
		}
	};
	UnitAnimator.prototype.dispatchComplete = function(){
		if(this.completeCallBack){
			this.completeCallBack();
		}
	};
	
	window.UnitAnimator = UnitAnimator;
	
}(window));
(function (window){

	var BCHWArrayUtil=function(){};
	
	BCHWArrayUtil.shuffle = function(array){
		//console.log("BCHWArrayUtil.shuffle : "+array);
		var copy=[];
		while(array.length>0){
			var num=array.splice(Math.floor(Math.random()*array.length),1);
			copy.push(num[0]);
		}
		//console.log("copy : "+copy);
		return copy;
	};
	
	BCHWArrayUtil.createSequentialNumericArray = function(length){
		var array=[];
		for(var i=0;i<length;i++){
			array[i]=i;
		}
		return array;
	};
	
	
	window.BCHWArrayUtil=BCHWArrayUtil;
	
}(window));
(function (window){


	var BCHWImageStore = function(){};
		
	BCHWImageStore.prototype.loadImages = function(urls, completeCallback, updateCallback){
		this.urls = urls;
		this.completeCallback = completeCallback;
		this.updateCallback = updateCallback != undefined ? updateCallback : undefined;
		this.images = [];
		this.currentLoadIndex = 0;
		this.loadNextImage();
	};

	BCHWImageStore.prototype.stop = function(){
		this.completeCallback = undefined;
		this.updateCallback = undefined;
		this.urls = [];
	};
	
	BCHWImageStore.prototype.getProgressPercent = function(){
		return BCHWMathUtil.normalize(this.currentLoadIndex, 0, this.urls.length);
	};
	
	BCHWImageStore.prototype.getProgressString = function(){
		return this.currentLoadIndex+" / "+this.urls.length;
	};

	BCHWImageStore.prototype.loadNextImage = function(){
		if(this.currentLoadIndex >= this.urls.length){
			//console.log("all images loaded");
			this.completeCallback();
			return;
		}
		//console.log("BCHWImageStore.prototype.loadNextImage(", this.currentLoadIndex, "/", this.urls.length,") : ",this.urls[this.currentLoadIndex]);
		var image = new Image();
		var _this = this;
		image.onload = function(){
			_this.imageLoadComplete();
		};

		var url = this.urls[this.currentLoadIndex];
        console.log("BCHWImageStore.loadNextImage()", url );
		image.onerror = function(){
			alert("BCHWImageStore ERROR : "+url+" could not be loaded.");
		};
		image.src = this.urls[this.currentLoadIndex];
		this.images.push(image);
		this.currentLoadIndex++;
	};
	
	BCHWImageStore.prototype.imageLoadComplete = function(){
		//console.log("BCHWImageStore.imageLoadComplete()");
		for(var i=0; i<this.images.length; i++){
			this.images[i].onload = undefined;
		}
		if(this.updateCallback != undefined){
			this.updateCallback();
		}
		this.loadNextImage();
	};

	window.BCHWImageStore = BCHWImageStore;
	
}(window));


//HAS DEPENDENCY ON BCHWMathUtil

(function (window){

	var BCHWColor = function(){};
	
	//==================================================
	//===================::RGBAColor::==================
	//==================================================

	BCHWColor.RGBAColor = function (){
        this.red=0;
        this.green=0;
        this.blue=0;
        this.alpha=1;
    };

	
	BCHWColor.RGBAColor.prototype.toString = function(){
		return "RGBAColor{red:"+this.red+" , green:"+this.green+" , blue:"+this.blue+" , alpha:"+this.alpha+"}";
	};
	
	//Canvas can take rgba(255,165,0,1) as a value for fillstyle and strokestyle
	BCHWColor.RGBAColor.prototype.getCanvasColorString = function(){
		return "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";
	};
	
	BCHWColor.createRGBAColor = function(red ,green, blue, alpha){
		var color = new BCHWColor.RGBAColor();
		
		if(!isNaN(red)){
			color.red = BCHWMathUtil.clampRGB(red);
		}

		if(!isNaN(green)){
			color.green = BCHWMathUtil.clampRGB(green);
		}
		
		if(!isNaN(blue)){
			color.blue = BCHWMathUtil.clampRGB(blue);
		}
		
		if(!isNaN(alpha)){
			color.alpha =BCHWMathUtil.clamp(0, 1, alpha);
		}	
		return color;
	};
		
	//==================================================
	//===================::BCHWColorsLib::==================
	//==================================================
		
	/*
	ORANGE:		246,160,37	F6A025
	GREEN:		167,209,101	A7D165
	RED:		222,112,111	9d0b0e
	PURPLE:		152,115,148	987394
	TURQUOISE:	102,204,204	66CCCC
	LIGHT BROWN:	173,134,70	AD8646
	DARK BROWN:	91,62,0		5B3E00
	BLACK:		51,51,51	333333
	DARK GRAY:	102,102,102	666666
	LIGHT GRAY:	219,203,191	DBCBBF
	*/

	//used for canvas context.fillStyle
	BCHWColor.BCHWColorsLib = function(){};

	/*
	BCHWColorsLib.ORANGE="rgb('246,160,37')";
	BCHWColorsLib.GREEN="rgb('167,209,101')";
	BCHWColorsLib.RED="rgb('222,112,111')";
	BCHWColorsLib.PURPLE="rgb('152,115,148')";
	BCHWColorsLib.TURQUOISE="rgb('102,204,204')";

	BCHWColorsLib.LIGHT_BROWN="rgb('173,134,70')";
	BCHWColorsLib.DARK_BROWN="rgb('91,62,0')";
	BCHWColorsLib.BLACK="rgb('51,51,51')";
	BCHWColorsLib.DARK_GRAY="rgb('102,102,102')";
	BCHWColorsLib.LIGHT_GRAY="rgb('219,203,191')";
	*/

	BCHWColor.BCHWColorsLib.ORANGE = BCHWColor.createRGBAColor(246, 160 , 37);
	BCHWColor.BCHWColorsLib.GREEN = BCHWColor.createRGBAColor(65, 161, 113);
	BCHWColor.BCHWColorsLib.RED = BCHWColor.createRGBAColor(157, 11, 14);
	BCHWColor.BCHWColorsLib.PURPLE = BCHWColor.createRGBAColor(217, 135, 139);
	BCHWColor.BCHWColorsLib.TURQUOISE = BCHWColor.createRGBAColor(116, 193, 178);

	BCHWColor.BCHWColorsLib.LIGHT_BROWN = BCHWColor.createRGBAColor(173,134,70);
	BCHWColor.BCHWColorsLib.DARK_BROWN = BCHWColor.createRGBAColor(91,62,0);
	BCHWColor.BCHWColorsLib.BLACK = BCHWColor.createRGBAColor(51,51,51);
	BCHWColor.BCHWColorsLib.WHITE = BCHWColor.createRGBAColor(255,255,255);
	BCHWColor.BCHWColorsLib.DARK_GRAY = BCHWColor.createRGBAColor(102,102,102);
	BCHWColor.BCHWColorsLib.LIGHT_GRAY = BCHWColor.createRGBAColor(219,203,191);


	BCHWColor.BCHWColorsLib.fillPalette = [BCHWColor.BCHWColorsLib.ORANGE,BCHWColor.BCHWColorsLib.GREEN,BCHWColor.BCHWColorsLib.RED,BCHWColor.BCHWColorsLib.PURPLE];

	BCHWColor.BCHWColorsLib.getRandomFillPaletteColor = function(){
		return BCHWColor.BCHWColorsLib.fillPalette[Math.floor(Math.random()*BCHWColor.BCHWColorsLib.fillPalette.length)];
	};

    BCHWColor.BCHWColorsLib.getRandomFillPaletteColorString = function(){
        var color = BCHWColor.BCHWColorsLib.fillPalette[Math.floor(Math.random()*BCHWColor.BCHWColorsLib.fillPalette.length)];
        return color.getCanvasColorString();
    };
		
	BCHWColor.BCHWColorsLib.getNextColor = function(previous){
		var color = BCHWColor.BCHWColorsLib.getRandomFillPaletteColor();
		if(previous==color){
            return BCHWColor.BCHWColorsLib.getNextColor(previous);
        }
		return color;
	};

    BCHWColor.BCHWColorsLib.getNextColorString = function(previous){
        var color = BCHWColor.BCHWColorsLib.getNextColor(previous);
        return color.getCanvasColorString();
    };
		
	window.BCHWColor = BCHWColor;
	
}(window));
(function (window){

	
	//topRight, topLeft, bottomRight, bottomLeft must be Points
	var TransformRectangle  =  function(topLeft, topRight, bottomRight, bottomLeft){
		
		this.topLeft  =  new BCHWGeom.Point();
		this.topRight  =  new BCHWGeom.Point();
		this.bottomRight  =  new BCHWGeom.Point();
		this.bottomLeft  =  new BCHWGeom.Point();
		if(topLeft){
			this.updatePoints(topLeft, topRight, bottomRight, bottomLeft);
		}
		this.triangleA  =  new BCHWGeom.Triangle(this.topLeft, this.topRight, this.bottomLeft);
		this.triangleB  =  new BCHWGeom.Triangle(this.bottomRight, this.bottomLeft, this.topRight);
		this.transform = new BCHWGeom.Transform();
		this.imageTriangle = new BCHWGeom.Triangle();
		//console.log(this.topLeft.toString(),this.topRight.toString(), this.bottomRight.toString(), this.bottomLeft.toString() );
	};

	TransformRectangle.prototype.updatePoints =  function(topLeft, topRight, bottomRight, bottomLeft){
		this.topLeft.x  =  topLeft.x;
		this.topLeft.y  =  topLeft.y;
		this.topRight.x  =  topRight.x;
		this.topRight.y  =  topRight.y;
		this.bottomRight.x  =  bottomRight.x;
		this.bottomRight.y  =  bottomRight.y;
		this.bottomLeft.x  =  bottomLeft.x;
		this.bottomLeft.y  =  bottomLeft.y;
	};
	
	TransformRectangle.prototype.updatePointsToTransformRectangle =  function(rect){
		this.updatePoints(rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft);
	};
	
	TransformRectangle.prototype.clone = function(){
		return new TransformRectangle(	new BCHWGeom.Point(this.topLeft.x,this.topLeft.y),
										new BCHWGeom.Point(this.topRight.x,this.topRight.y),
										new BCHWGeom.Point(this.bottomRight.x,this.bottomRight.y),
										new BCHWGeom.Point(this.bottomLeft.x,this.bottomLeft.y)
										);
	};

	TransformRectangle.prototype.render  =  function(context2d, image){
		if(image){
			this.renderImage(context2d, image);
		}
		//this.renderOutline(context2d);
		
	};
	
	TransformRectangle.prototype.renderImage  =  function(context2d, image){
		BCHWGeom.setIdentityMatrixToContext(context2d);
		context2d.fillStyle  =  context2d.createPattern(image,'no-repeat');
		
		//TOP TRIANGLE
		this.imageTriangle.a.x = this.imageTriangle.a.y = this.imageTriangle.b.y = this.imageTriangle.c.x = 0;
		this.imageTriangle.b.x = image.width;
		this.imageTriangle.c.y = image.height;

		this.updateTriangleTransform(this.imageTriangle, this.triangleA );
		this.transform.tx = this.triangleA.a.x;
		this.transform.ty = this.triangleA.a.y;
		context2d.setTransform(	this.transform.scaleX, this.transform.skewX, this.transform.skewY, 
								this.transform.scaleY, this.transform.tx, this.transform.ty);
		//console.log(this.transform.toString());
		context2d.beginPath();
		context2d.moveTo(0,0);
		context2d.lineTo(image.width, 0);
		context2d.lineTo(0,image.height);
		context2d.moveTo(0,0);
		context2d.fill();
		context2d.closePath();
		BCHWGeom.setIdentityMatrixToContext(context2d);

		//BOTTOM TRIANGLE
		this.imageTriangle.b.x = this.imageTriangle.c.y = 0;
		this.imageTriangle.a.x = this.imageTriangle.c.x = image.width;
		this.imageTriangle.a.y = image.height;
		this.imageTriangle.b.y = image.height;
		
		this.updateTriangleTransform(this.imageTriangle, this.triangleB);
		this.transform.ty = this.triangleA.a.y + (this.triangleA.b.y-this.triangleA.a.y)*2;
		context2d.setTransform(	this.transform.scaleX, this.transform.skewX, this.transform.skewY,
								this.transform.scaleY, this.transform.tx, this.transform.ty);
		//console.log(this.transform.toString());
		context2d.beginPath();	
		context2d.moveTo(image.width, image.height);
		context2d.lineTo(0, image.height);
		context2d.lineTo(0, image.height-1);
		context2d.lineTo(image.width-1, 0);
		context2d.lineTo(image.width, 0);
		context2d.lineTo(image.width, image.height);
		context2d.fill();
		context2d.closePath();
		
		BCHWGeom.setIdentityMatrixToContext(context2d);
	};
	
	TransformRectangle.prototype.updateTriangleTransform = function (sourceTriangle,transformedTriangle){
		
		var xAngle = BCHWGeom.angleBetweenTwoPoints( transformedTriangle.b,transformedTriangle.a );
		var yAngle = BCHWGeom.angleBetweenTwoPoints( transformedTriangle.c,transformedTriangle.a );
		
		var transformedWidth = BCHWGeom.distanceBetweenTwoPoints(transformedTriangle.a,transformedTriangle.b);
		var transformedHeight = BCHWGeom.distanceBetweenTwoPoints( transformedTriangle.a,transformedTriangle.c );

		var xScale = transformedWidth/(sourceTriangle.b.x-sourceTriangle.a.x);
		var yScale = transformedHeight/(sourceTriangle.c.y-sourceTriangle.a.y);
	
		this.transform.scaleX = Math.cos(xAngle)*xScale;
		this.transform.scaleY = Math.sin(yAngle)*yScale;
		
		this.transform.skewX = Math.sin(xAngle)*xScale;
		this.transform.skewY = Math.cos(yAngle)*yScale;
	};
	
	TransformRectangle.prototype.renderOutline  =  function(context2d){
		context2d.strokeStyle  =  "#FF0000";
		context2d.lineWidth  =  1;
		context2d.beginPath();
		context2d.moveTo(this.triangleA.a.x,this.triangleA.a.y);
		context2d.lineTo(this.triangleA.b.x,this.triangleA.b.y);
		context2d.lineTo(this.triangleA.c.x,this.triangleA.c.y);
		context2d.lineTo(this.triangleA.a.x,this.triangleA.a.y);		
		context2d.stroke();
		context2d.closePath();
		
		context2d.beginPath();
		context2d.moveTo(this.triangleB.a.x,this.triangleB.a.y);
		context2d.lineTo(this.triangleB.b.x,this.triangleB.b.y);
		context2d.lineTo(this.triangleB.c.x,this.triangleB.c.y);
		context2d.lineTo(this.triangleB.a.x,this.triangleB.a.y);
		context2d.stroke();
		context2d.closePath();
	};
	
	window.TransformRectangle  =  TransformRectangle;
	
}(window));
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
/**
 * Created by sakri on 19-12-13.
 */

(function (window){


    var MemoryGameCardPrep = function(){
        this.images =[];
        this.preparationCanvas = document.createElement('canvas');
        this.context = this.preparationCanvas.getContext("2d");
        this.preparedImages = [];
    };

    MemoryGameCardPrep.getImageForSrcPath = function(path){
        for(var i=0;i<BCHWMemoryGameGridCell.preparedImages.length;i++){
            if(BCHWMemoryGameGridCell.preparedImages[i].src = path){
                return BCHWMemoryGameGridCell.preparedImages[i].preparedImage;
            }
        }
        return undefined;//or new Image() ?
    }


    MemoryGameCardPrep.prototype.prepareImage = function(img, size, radius, completeHandler){
        /*for(var i=0;i<this.preparedImages.length;i++){
            if(this.preparedImages[i].src = img.src){
                console.log("MemoryGameCardPrep.prepareImage() skipping, already prepared ", this.preparedImages[i].src , img.src);
                completeHandler( this.preparedImages[i].preparedImage);
                return;
            }
        }
        if(img.src.indexOf("memoryGame")==-1){
            console.log("MemoryGameCardPrep.prepareImage() skipping, already prepared ", this.preparedImages[i].src , img.src);
            completeHandler( this.preparedImages[i].preparedImage);
            return;
        }*/
        var image = new MemoryGameCardImage(img);

        //this.preparedImages.push(image);

        this.preparationCanvas.width = size;
        this.preparationCanvas.height = size;

        //first resize image
        //console.log("prepareImage()", image.src);
        //console.log(image.sourceImage.width, image.sourceImage.height, size, size);
        this.context.drawImage(image.sourceImage, 0, 0, image.sourceImage.width, image.sourceImage.height, 0, 0, size, size);
        image.preparedImage.src = this.preparationCanvas.toDataURL();

        var scope = this;
        setTimeout(function(){scope.prepareImage2(image, size, radius, completeHandler)},20);

    }

    MemoryGameCardPrep.prototype.prepareImage2 = function(image, size, radius, completeHandler){
        //clear
        this.context.clearRect(0, 0, this.preparationCanvas.width, this.preparationCanvas.height);

        //then draw with rounded corners
        var renderMargin = 1;
        var rect = new BCHWGeom.RoundedRectangle(renderMargin, renderMargin, size-renderMargin*2, size-renderMargin*2, radius);
        this.context.fillStyle = "#CCCCCC";
        rect.drawPathToContext(this.context);
        this.context.fill();

        var pattern = this.context.createPattern(image.preparedImage, "no-repeat");
        rect.drawPathToContext(this.context);
        this.context.fillStyle = pattern;
        this.context.fill();
        image.preparedImage.src = this.preparationCanvas.toDataURL();

        this.context.clearRect(0,0,this.preparationCanvas.width, this.preparationCanvas.height);
        if(completeHandler){
            completeHandler(image.preparedImage);
        }
    };

    window.MemoryGameCardPrep = MemoryGameCardPrep;

    //===============================::CardImage::==========================

    var MemoryGameCardImage = function(image){
        this.sourceImage = image;
        this.src = image.src;
        this.preparedImage = document.createElement("img");
        //console.log("MemoryGameCardImage constructor : ", this.src);
    };
    window.MemoryGameCardImage = MemoryGameCardImage;

}(window));
//===========================================================
//===================::LAYOUT RECTANGLE::=============
//==========================================================

(function (window){

	var LayoutRectangle = function(canvas, x, y, width, height){
        BCHWGeom.Rectangle.call(this, x, y, width, height);
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
		this.horizontalAlign = LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE;
	};

    //subclass extends superclass
    LayoutRectangle.prototype = Object.create(BCHWGeom.Rectangle.prototype);
    LayoutRectangle.prototype.constructor = BCHWGeom.Rectangle;

	LayoutRectangle.VERTICAL_ALIGN_TOP = "verticalAlignTop";
	LayoutRectangle.VERTICAL_ALIGN_MIDDLE = "verticalAlignMiddle";
	LayoutRectangle.VERTICAL_ALIGN_BOTTOM = "verticalAlignBottom";

	LayoutRectangle.HORIZONTAL_ALIGN_LEFT = "horizontalAlignLeft";
	LayoutRectangle.HORIZONTAL_ALIGN_RIGHT = "horizontalAlignRight";
	LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE = "horizontalAlignMiddle";
	LayoutRectangle.HORIZONTAL_ALIGN_JUSTIFY = "horizontalAlignJustify";
	
	LayoutRectangle.prototype.setVerticalAlign = function(align){
		switch(align){
			case LayoutRectangle.VERTICAL_ALIGN_TOP:
			case LayoutRectangle.VERTICAL_ALIGN_MIDDLE:
			case LayoutRectangle.VERTICAL_ALIGN_BOTTOM:
				this.verticalAlign = align;
				break;
			default:
				this.verticalAlign = LayoutRectangle.VERTICAL_ALIGN_MIDDLE;
				//console.log("LayoutRectangle setVerticalAlign ERROR: '"+align+"' is not a supported value, verticalAlign set to default : "+LayoutRectangle.VERTICAL_ALIGN_MIDDLE);
				break;
		}
	};

	LayoutRectangle.prototype.setHorizontalAlign = function(align){
		switch(align){
			case LayoutRectangle.HORIZONTAL_ALIGN_LEFT:
			case LayoutRectangle.HORIZONTAL_ALIGN_RIGHT:
			case LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE:
			case LayoutRectangle.HORIZONTAL_ALIGN_JUSTIFY:
				this.horizontalAlign = align;
				break;
			default:
				this.horizontalAlign = LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE;
				//console.log("LayoutRectangle setHorizontalAlign ERROR: '"+align+"' is not a supported value, horizontalAlign set to default : "+LayoutRectangle.HORIZONTAL_ALIGN_MIDDLE);
				break;
		}
	};

    LayoutRectangle.prototype.clear = function(){
        this.context.clearRect(this.x, this.y, this.width, this.height);
    }
		
	window.LayoutRectangle = LayoutRectangle;

}(window));



//==================================================
//============::BCHW FONT LAYOUT ROW::==============
//==================================================

//One horizontal row, which lays out a number of BCHWGeom.Rectangle items.
//rename, potentially this can be used to layout generic blocks instead of BCHWFont instances
(function (window){

	var BCHWFontLayoutRect = function(canvas, x, y, width, height){
        LayoutRectangle.call(this, canvas, x, y, width, height);
		this.characters = [];
	};

    //subclass extends superclass
    BCHWFontLayoutRect.prototype = Object.create(LayoutRectangle.prototype);
    BCHWFontLayoutRect.prototype.constructor = LayoutRectangle;
	
	BCHWFontLayoutRect.prototype.addCharacter = function(character){
		//assert correct type
		this.characters.push(character);
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters = function(){
		this["layoutCharacters_"+this.horizontalAlign]();
	};
	
	BCHWFontLayoutRect.prototype.getContentRect = function(rowHeight){
		var width = 0;
		var i, character;
		for(i=0; i<this.characters.length; i++){
			character = this.characters[i];
			width += rowHeight*character.width;
		}
		return new BCHWGeom.Rectangle(0, 0, width, rowHeight);
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignLeft = function(){
		//console.log("layoutCharacters_horizontalAlignLeft()");
		//console.log("layoutRectangle : "+this.toString());
		var currentX=this.x+0;
		//console.log("currentX : "+currentX);
		var i,rect,character;
		for(i=0;i<this.characters.length;i++){
			character=this.characters[i];
			rect=character.roundedRect;
			rect.x=currentX;
			rect.y=this.y;
			rect.width=this.height*character.width;
			//console.log("rect.x : "+rect.x+" , rect.width : "+rect.width);
			rect.height=this.height;
			currentX+=rect.width;
			//console.log("currentX : "+currentX);
			//console.log(rect.toString());
		}
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignRight = function(){
        //console.log("layoutCharacters_horizontalAlignRight()");
        //console.log("layoutRectangle : "+this.toString());
        var currentX = this.getRight();
        //console.log("currentX : "+currentX);
        var i,rect,character;
        for(i=this.characters.length-1;i>-1;i--){
            character = this.characters[i];
            rect = character.roundedRect;
            rect.width = this.height*character.width;
            rect.x = currentX - rect.width;
            rect.y = this.y;
            //console.log("rect.x : "+rect.x+" , rect.width : "+rect.width);
            rect.height = this.height;
            currentX -= rect.width;
            //console.log("currentX : "+currentX);
            //console.log(rect.toString());
        }
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignMiddle = function(){
		//console.log("layoutCharacters_horizontalAlignMiddle()");
		var i, rect, character;
		var totalWidth = 0;
		for(i=0; i<this.characters.length; i++){
			character = this.characters[i];
			rect = character.roundedRect;
			rect.y = this.y;
			rect.width = this.height*character.width;
			rect.height = this.height;
			totalWidth += rect.width;
		}
		
		var currentX = BCHWGeom.RectangleUtil.getCenterX(this)-totalWidth/2;
		
		for(i=0; i<this.characters.length; i++){
			character = this.characters[i];
			rect = character.roundedRect;
			rect.x = currentX;
			currentX += rect.width;
		}
	};
	
	BCHWFontLayoutRect.prototype.layoutCharacters_horizontalAlignJustify = function(){
		console.log("layoutCharacters_horizontalAlignJustify() NOT IMPLENTED YET");
		this.layoutCharacters_horizontalAlignLeft();
	};
	
	window.BCHWFontLayoutRect = BCHWFontLayoutRect;
	
}(window));

(function (window){

	var BCHWFontCharacter = function (){
		this.width = 1;
		this.color = new BCHWColor.createRGBAColor();
		this.thickness = 1;
		this.roundedRect;//TODO extend a rect instead of having a property
	};
	
	BCHWFontCharacter.prototype.renderFunction = function(context,character){
		//BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
	};

	BCHWFontCharacter.prototype.renderToContext = function(context){
		this.renderFunction(context,this);
	};
	
	BCHWFontCharacter.prototype.addRandomness = function(maxPos,maxScale){
		this.roundedRect.x+=BCHWMathUtil.getRandomNumberInRange(-maxPos,maxPos);
		this.roundedRect.y+=BCHWMathUtil.getRandomNumberInRange(-maxPos,maxPos);
		this.roundedRect.scaleX(1+BCHWMathUtil.getRandomNumberInRange(-maxScale,maxScale));
		this.roundedRect.scaleY(1+BCHWMathUtil.getRandomNumberInRange(-maxScale,maxScale));
	};

	
	BCHWFontCharacter.createBCHWFontCharacter = function (character,color,lineColor,thickness,roundedRect){
		//TODO add Failsafes!
		var fontCharacter = new BCHWFontCharacter();
		fontCharacter.color = color;
		fontCharacter.lineColor = lineColor;
		fontCharacter.thickness = thickness;
		fontCharacter.roundedRect = roundedRect;
		var renderFunction = BCHWFontCharacterRenderer.getRenderFunction(character);
		if(renderFunction){
            fontCharacter.renderFunction=renderFunction;
        }
		fontCharacter.width = BCHWFontCharacterRenderer.getCharacterWidthPercent(character);
		//console.log("BCHWFontCharacter.createBCHWFontCharacter width : "+fontCharacter.width);
		return fontCharacter;
	};
	
	window.BCHWFontCharacter = BCHWFontCharacter;

}(window));


(function (window){

	var BCHWFontCharacterRenderer = function (){};

	//THIS SHOULD BE IN A geom JS File or so
	BCHWFontCharacterRenderer.renderRoundedRectToContext = function(context,character){
		context.beginPath();
		context.lineWidth = character.thickness;
		context.fillStyle = character.color.getCanvasColorString();
		context.strokeStyle = character.lineColor.getCanvasColorString();

		context.moveTo(character.roundedRect.x, character.roundedRect.y+character.roundedRect.radius);
		context.lineTo(character.roundedRect.x, character.roundedRect.y+character.roundedRect.height-character.roundedRect.radius);
		context.quadraticCurveTo(   character.roundedRect.x,
                                    character.roundedRect.y+character.roundedRect.height,
                                    character.roundedRect.x+character.roundedRect.radius,
                                    character.roundedRect.y+character.roundedRect.height);
		context.lineTo(character.roundedRect.x+character.roundedRect.width-character.roundedRect.radius,character.roundedRect.y+character.roundedRect.height);  
		context.quadraticCurveTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.height,character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.height-character.roundedRect.radius);  
		context.lineTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.radius);  
		context.quadraticCurveTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y,character.roundedRect.x+character.roundedRect.width-character.roundedRect.radius,character.roundedRect.y);  
		context.lineTo(character.roundedRect.x+character.roundedRect.radius,character.roundedRect.y);  
		context.quadraticCurveTo(character.roundedRect.x,character.roundedRect.y,character.roundedRect.x,character.roundedRect.y+character.roundedRect.radius);  
		context.fill();
		context.stroke();  
	};

	
	
	//bcefghiostuwy
	BCHWFontCharacterRenderer.getRenderFunction = function(character){
		if(!character || character==undefined){
            return null;
        }
		switch(character.toLowerCase()){
			case "b":
			case "c":
			case "e":
			case "f":
			case "g":
			case "h":
			case "i":
			case "m":
			case "o":
			case "r":
			case "s":
			case "t":
			case "u":
			case "w":
			case "y":
				return BCHWFontCharacterRenderer["render"+character.toUpperCase()];
				break;
		}
		return null;
	};
	
	//bcefghiostuwy
	BCHWFontCharacterRenderer.getCharacterWidthPercent = function(character){
		var percent = 1;
		if(!character || character==undefined){
            return percent;
        }
		switch(character.toLowerCase()){
			case "b":
				percent = 1;
				break;
			case "c":
				percent = .9;
				break;
			case "e":
				percent = .8;
				break;
			case "f":
				percent = .8;
				break;
			case "g":
				percent = .9;
				break;
			case "h":
				percent = .9;
				break;
			case "i":
				percent = .5;
				break;
            case "m":
                percent = 1.2;
                break;
			case "o":
				percent = .9;
				break;
            case "r":
                percent = 1;
                break;
			case "s":
				percent = .8;
				break;
			case "t":
				percent = 1;
				break;
			case "u":
				percent = .9;
				break;
			case "w":
				percent = 1.2;
				break;
			case "y":
				percent = 1;
				break;
		}
		return percent;
	};

	BCHWFontCharacterRenderer.renderB = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth = character.thickness;
		context.strokeStyle = character.lineColor.getCanvasColorString();
		
		var right = character.roundedRect.x+character.roundedRect.width;
		var yMiddle = character.roundedRect.y+character.roundedRect.height/2;
		context.moveTo(right, yMiddle);
		context.lineTo(right-character.roundedRect.width/4,yMiddle);
		
		var fourthHeight=character.roundedRect.height/4;
		context.moveTo(character.roundedRect.x+character.roundedRect.width/2,character.roundedRect.y+fourthHeight);
		context.lineTo(character.roundedRect.x+character.roundedRect.width/2+character.roundedRect.width/4,character.roundedRect.y+fourthHeight);
		
		context.moveTo(character.roundedRect.x+character.roundedRect.width/2,character.roundedRect.y+fourthHeight*3);
		context.lineTo(character.roundedRect.x+character.roundedRect.width/2+character.roundedRect.width/4,character.roundedRect.y+fourthHeight*3);
		
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderC=function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth = character.thickness;
		context.strokeStyle = character.lineColor.getCanvasColorString();
		
		var right = character.roundedRect.x+character.roundedRect.width;
		var yMiddle = character.roundedRect.y+character.roundedRect.height/2;
		var xMiddle=character.roundedRect.x+character.roundedRect.width/2;
		context.moveTo(right,yMiddle);
		context.lineTo(xMiddle,yMiddle);
		
		var fourthHeight=character.roundedRect.height/4;
		context.moveTo(xMiddle,character.roundedRect.y+fourthHeight);
		context.lineTo(xMiddle,character.roundedRect.y+fourthHeight*3);
			
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderE = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var right=character.roundedRect.x+character.roundedRect.width;
		var fourthWidth=character.roundedRect.width/4;
		var thirdHeight=character.roundedRect.height/3;
		context.moveTo(right,character.roundedRect.y+thirdHeight);
		context.lineTo(right-fourthWidth,character.roundedRect.y+thirdHeight);
		
		context.moveTo(right,character.roundedRect.y+thirdHeight*2);
		context.lineTo(right-fourthWidth,character.roundedRect.y+thirdHeight*2);
			
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderF = function(context,character){
		context.beginPath();
		context.lineWidth=character.thickness;
		context.fillStyle=character.color.getCanvasColorString();
		context.strokeStyle=character.lineColor.getCanvasColorString();
						
		var thirdWidth=character.roundedRect.width/3;
		var thirdHeight=character.roundedRect.height/3;
		var right=character.roundedRect.x+character.roundedRect.width;
		var bottom=character.roundedRect.y+character.roundedRect.height;
		
		context.moveTo(character.roundedRect.x,character.roundedRect.y+character.roundedRect.radius);  
		context.lineTo(character.roundedRect.x,bottom-character.roundedRect.radius);  
		context.quadraticCurveTo(character.roundedRect.x,bottom,character.roundedRect.x+character.roundedRect.radius,character.roundedRect.y+character.roundedRect.height);  
		
		context.lineTo(character.roundedRect.x+thirdWidth*2-character.roundedRect.radius,bottom);  
		context.quadraticCurveTo(character.roundedRect.x+thirdWidth*2,bottom,character.roundedRect.x+thirdWidth*2,bottom-character.roundedRect.radius);  
		
		context.lineTo(character.roundedRect.x+thirdWidth*2,bottom-thirdHeight);  	
		context.lineTo(right-character.roundedRect.radius,bottom-thirdHeight);
		context.quadraticCurveTo(right,bottom-thirdHeight,right,bottom-thirdHeight-character.roundedRect.radius);
		
		context.lineTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y+character.roundedRect.radius);  
		context.quadraticCurveTo(character.roundedRect.x+character.roundedRect.width,character.roundedRect.y,character.roundedRect.x+character.roundedRect.width-character.roundedRect.radius,character.roundedRect.y);  
		context.lineTo(character.roundedRect.x+character.roundedRect.radius,character.roundedRect.y);  
		context.quadraticCurveTo(character.roundedRect.x,character.roundedRect.y,character.roundedRect.x,character.roundedRect.y+character.roundedRect.radius);  

		context.fill();
		context.stroke();

		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();

		context.moveTo(right,character.roundedRect.y+thirdHeight);
		context.lineTo(right-thirdWidth,character.roundedRect.y+thirdHeight);
		
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderG = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var right=character.roundedRect.x+character.roundedRect.width;
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var halfY=character.roundedRect.y+character.roundedRect.height/1.8;
		var fourthWidth=character.roundedRect.width/4;
		var fourthHeight=character.roundedRect.height/4;
		
		context.moveTo(right,halfY);
		context.lineTo(halfX,halfY);
		context.lineTo(halfX,halfY+fourthHeight);
		context.lineTo(halfX+fourthWidth,halfY+fourthHeight);

		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderH = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var fourthHeight=character.roundedRect.height/4;
		
		context.moveTo(halfX,character.roundedRect.y);
		context.lineTo(halfX,character.roundedRect.y+fourthHeight);
		
		context.moveTo(halfX,character.roundedRect.y+character.roundedRect.height);
		context.lineTo(halfX,character.roundedRect.y+character.roundedRect.height-fourthHeight);

		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderI = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
	};

    BCHWFontCharacterRenderer.renderM = function(context,character){
        BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
        context.beginPath();
        context.lineWidth=character.thickness;
        context.strokeStyle=character.lineColor.getCanvasColorString();

        var thirdHeight=character.roundedRect.height/3;
        var thirdWidth=character.roundedRect.width/3;
        context.moveTo(character.roundedRect.x+thirdWidth,character.roundedRect.getBottom());
        context.lineTo(character.roundedRect.x+thirdWidth,character.roundedRect.getBottom()-thirdHeight);

        context.moveTo(character.roundedRect.x+thirdWidth*2,character.roundedRect.getBottom());
        context.lineTo(character.roundedRect.x+thirdWidth*2,character.roundedRect.getBottom()-thirdHeight);

        context.stroke();
    };
	
	BCHWFontCharacterRenderer.renderO = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var thirdHeight=character.roundedRect.height/3;
		
		context.moveTo(halfX,character.roundedRect.y+thirdHeight);
		context.lineTo(halfX,character.roundedRect.y+thirdHeight*2);

		context.stroke(); 
	};

    BCHWFontCharacterRenderer.renderR = function(context,character){
        BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
        context.beginPath();
        context.lineWidth = character.thickness;
        context.strokeStyle = character.lineColor.getCanvasColorString();

        var right = character.roundedRect.x+character.roundedRect.width;
        var yMiddle = character.roundedRect.y+character.roundedRect.height/2;
        context.moveTo(right, yMiddle);
        context.lineTo(right-character.roundedRect.width/4,yMiddle);

        var fourthHeight=character.roundedRect.height/4;
        context.moveTo(character.roundedRect.x+character.roundedRect.width/2,character.roundedRect.y+fourthHeight);
        context.lineTo(character.roundedRect.x+character.roundedRect.width/2+character.roundedRect.width/4,character.roundedRect.y+fourthHeight);

        var x = character.roundedRect.x+character.roundedRect.width/2;
        context.moveTo(x, character.roundedRect.getBottom()-fourthHeight);
        context.lineTo(x, character.roundedRect.getBottom());

        context.stroke();
    };

	BCHWFontCharacterRenderer.renderS = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();

		var right=character.roundedRect.x+character.roundedRect.width;	
		var thirdWidth=character.roundedRect.width/3;
		var thirdHeight=character.roundedRect.height/3;
		
		context.moveTo(right,character.roundedRect.y+thirdHeight);
		context.lineTo(right-thirdWidth,character.roundedRect.y+thirdHeight);

		context.moveTo(character.roundedRect.x,character.roundedRect.y+thirdHeight*2);
		context.lineTo(character.roundedRect.x+thirdWidth,character.roundedRect.y+thirdHeight*2);

		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderT = function(context,character){

		context.beginPath();
		context.lineWidth=character.thickness;
		context.fillStyle=character.color.getCanvasColorString();
		context.strokeStyle=character.lineColor.getCanvasColorString();

		var rect=character.roundedRect;	
		var radius=character.roundedRect.radius;

		var thirdWidth=rect.width/3;
		var thirdHeight=rect.height/3;
		var right=rect.x+rect.width;
		var bottom=rect.y+rect.height;
		
		
		context.moveTo(rect.x,rect.y+radius);  
		context.lineTo(rect.x,bottom-thirdHeight-radius);
		context.quadraticCurveTo(rect.x,bottom-thirdHeight,rect.x+radius,bottom-thirdHeight);
		context.lineTo(rect.x+thirdWidth-radius,bottom-thirdHeight);  
		context.quadraticCurveTo(rect.x+thirdWidth,bottom-thirdHeight,rect.x+thirdWidth,bottom-thirdHeight+radius);  

		context.lineTo(rect.x+thirdWidth,bottom-radius);
		context.quadraticCurveTo(rect.x+thirdWidth,bottom,rect.x+thirdWidth+radius,bottom);
		context.lineTo(rect.x+thirdWidth*2-radius,bottom);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom,rect.x+thirdWidth*2,bottom-radius);
		context.lineTo(rect.x+thirdWidth*2,bottom-thirdHeight+radius);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom-thirdHeight,rect.x+thirdWidth*2+radius,bottom-thirdHeight);
		context.lineTo(right-radius,bottom-thirdHeight);
		context.quadraticCurveTo(right,bottom-thirdHeight,right,bottom-thirdHeight-radius);
		
		context.lineTo(right,rect.y+radius);  
		context.quadraticCurveTo(right,rect.y,right-radius,rect.y);  
		context.lineTo(rect.x+radius,rect.y);  
		context.quadraticCurveTo(rect.x,rect.y,rect.x,rect.y+radius);  

		context.fill();
		context.stroke();

	};

	BCHWFontCharacterRenderer.renderU = function(context,character){

		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX=character.roundedRect.x+character.roundedRect.width/2;
		var fourthHeight=character.roundedRect.height/4;
		
		context.moveTo(halfX,character.roundedRect.y);
		context.lineTo(halfX,character.roundedRect.y+fourthHeight);
		
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderW = function(context,character){
		BCHWFontCharacterRenderer.renderRoundedRectToContext(context,character);
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var thirdHeight=character.roundedRect.height/3;
		var thirdWidth=character.roundedRect.width/3;
		context.moveTo(character.roundedRect.x+thirdWidth,character.roundedRect.y);
		context.lineTo(character.roundedRect.x+thirdWidth,character.roundedRect.y+thirdHeight);
		
		context.moveTo(character.roundedRect.x+thirdWidth*2,character.roundedRect.y);
		context.lineTo(character.roundedRect.x+thirdWidth*2,character.roundedRect.y+thirdHeight);

			
		context.stroke(); 
	};

	BCHWFontCharacterRenderer.renderY = function(context,character){

		context.beginPath();
		context.lineWidth=character.thickness;
		context.fillStyle=character.color.getCanvasColorString();
		context.strokeStyle=character.lineColor.getCanvasColorString();

		var rect=character.roundedRect;	
		var radius=character.roundedRect.radius;

		var thirdWidth=rect.width/3;
		var thirdHeight=rect.height/3;
		var right=rect.x+rect.width;
		var bottom=rect.y+rect.height;
		
		
		context.moveTo(rect.x,rect.y+radius);  
		context.lineTo(rect.x,bottom-thirdHeight-radius);
		context.quadraticCurveTo(rect.x,bottom-thirdHeight,rect.x+radius,bottom-thirdHeight);
		context.lineTo(rect.x+thirdWidth-radius,bottom-thirdHeight);  
		context.quadraticCurveTo(rect.x+thirdWidth,bottom-thirdHeight,rect.x+thirdWidth,bottom-thirdHeight+radius);  

		context.lineTo(rect.x+thirdWidth,bottom-radius);
		context.quadraticCurveTo(rect.x+thirdWidth,bottom,rect.x+thirdWidth+radius,bottom);
		context.lineTo(rect.x+thirdWidth*2-radius,bottom);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom,rect.x+thirdWidth*2,bottom-radius);
		context.lineTo(rect.x+thirdWidth*2,bottom-thirdHeight+radius);
		context.quadraticCurveTo(rect.x+thirdWidth*2,bottom-thirdHeight,rect.x+thirdWidth*2+radius,bottom-thirdHeight);
		context.lineTo(right-radius,bottom-thirdHeight);
		context.quadraticCurveTo(right,bottom-thirdHeight,right,bottom-thirdHeight-radius);
		
		context.lineTo(right,rect.y+radius);  
		context.quadraticCurveTo(right,rect.y,right-radius,rect.y);  
		context.lineTo(rect.x+radius,rect.y);  
		context.quadraticCurveTo(rect.x,rect.y,rect.x,rect.y+radius);  

		context.fill();
		context.stroke();
		
		context.beginPath();
		context.lineWidth=character.thickness;
		context.strokeStyle=character.lineColor.getCanvasColorString();
		
		var halfX = rect.x+rect.width/2;
		var fourthHeight = rect.height/4;
		
		context.moveTo(halfX,rect.y);
		context.lineTo(halfX,rect.y+fourthHeight);
		
		context.stroke(); 

	};
	
	window.BCHWFontCharacterRenderer = BCHWFontCharacterRenderer;

}(window));
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
(function (window){

	var BCHWMemoryGame = function(){
		this.margin = .05;
        this.lineThickness = 4;
        this.resizeTimeoutId = -1;
        this.gamesPlayed = 0;
    };

    //static variables

    //minimum width and height of "memory cards" this is used in conjunction with available
    //screensize to determine possible grid options
    BCHWMemoryGame.MINIMUM_TILE_SIZE = 100;
    BCHWMemoryGame.MAX_TILE_SIZE = 250;//the images on the server are 250x250
    BCHWMemoryGame.MINIMUM_GRID_TILES = 3;
    BCHWMemoryGame.REFRESH_AFTER_RESIZE_INTERVAL = 300;//wait this long to rerender graphics after last resize
    BCHWMemoryGame.MISMATCH_INTERVAL = 800;//wait this long to close cards in case of mismatch

    BCHWMemoryGame.prototype.init = function(canvasContainer){
        this.canvas = document.createElement('canvas');
        this.canvasContainer = canvasContainer;
        this.context = this.canvas.getContext("2d");
        this.context.lineCap="round";
        this.canvasContainer.appendChild(this.canvas);
        this.recordManager = new BCHWMemoryGameRecordsManager();
        this.cardsColor = BCHWColor.BCHWColorsLib.getRandomFillPaletteColorString();
        this.flippers = [new MemoryGameCardFlip(), new MemoryGameCardFlip()];
        this.currentFlipperIndex = 0;
        this.logo = new MemoryGameLogo(this.canvas);
        MemoryGameCardFlip.useGradient = !this.isMobile();
        MemoryGameCardFlip.useSimpleFlip = this.isMobile();
        this.cardPrep = new MemoryGameCardPrep();
        this.reset();
        //MemoryGameCardFlip.useGradient = true;
        //MemoryGameCardFlip.useSimpleFlip = false;
    };

    //move to flipper class as a static set up?
    BCHWMemoryGame.prototype.getFlipper = function(){
        var flipper = this.flippers[this.currentFlipperIndex];
        this.currentFlipperIndex++;
        this.currentFlipperIndex%=2;
        return flipper;
    };

    //http://stackoverflow.com/questions/1005153/auto-detect-mobile-browser-via-user-agent
    //not 100% sure this will work...
    BCHWMemoryGame.prototype.isMobile = function() {
        //console.log("BCHWMemoryGame.isMobile()", navigator.appVersion );
        return navigator.appVersion.indexOf("Mobile") > -1;
    }

    //=================::GENERAL RENDERING::==========================

	BCHWMemoryGame.prototype.clearContext = function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        //this.context.strokeStyle ="#FFFFFF";
        //this.context.strokeRect(0,0,this.canvas.width-1, this. canvas.height-1);
	};

	BCHWMemoryGame.prototype.resizeHandler = function(){
		this.clearContext();
        //abandon current game
		clearTimeout (this.resizeTimeoutId);
		clearTimeout (this.renderCellsTimeOutId);
        this.flippers[0].stop();
        this.flippers[1].stop();
		var scope = this;
		this.resizeTimeoutId = setTimeout(function(){
             scope.reset();
          }, BCHWMemoryGame.REFRESH_AFTER_RESIZE_INTERVAL );
	};

    BCHWMemoryGame.prototype.reset = function(){
        this.canvas.width = this.canvasContainer.clientWidth;
        this.canvas.height = this.canvasContainer.clientHeight;
        this.clearContext();
        //console.log("\t canvas width, height  : ",this.canvas.width, this.canvas.height);

        var boundsX,boundsY;
        if(this.canvasContainer.clientWidth > 800){
            this.lineThickness = 4;
            boundsX = 4;
            boundsY = 4;
        }else{
            this.lineThickness = 2;
            boundsX = this.canvas.width*this.margin;
            boundsY = this.canvas.height*this.margin;
        }
        if(this.canvasContainer.clientWidth < 450){
            this.lineThickness = 1;
        }
        this.renderRect = new BCHWGeom.Rectangle(boundsX, boundsY, this.canvas.width-boundsX*2, this.canvas.height-boundsY*2);

        this.createPossibleGrids();
        this.loadAssets();
    };

    //reloaded everytime, normally "repeats" are cached by browser
    BCHWMemoryGame.prototype.loadAssets = function(){
        this.assetsImageStore = new BCHWImageStore();
        var scope = this;
        this.cardBackPath = "assets/memoryGameCardBack.png";
        this.assetsImageStore.loadImages([this.cardBackPath], function(){scope.assetsLoadedHandler()});
    };

    BCHWMemoryGame.prototype.assetsLoadedHandler = function(){
        //console.log("BCHWMemoryGame.assetsLoadedHandler()");
        this.cardBackImage = this.assetsImageStore.images[0];
        this.enterHomeScreen();
    };

    BCHWMemoryGame.prototype.createPossibleGrids = function(){
        this.grids = [];
        var hcards = Math.floor(this.renderRect.width / BCHWMemoryGame.MINIMUM_TILE_SIZE);
        var vcards = Math.floor(this.renderRect.height / BCHWMemoryGame.MINIMUM_TILE_SIZE);
        //console.log("BCHWMemoryGame.createPossibleGrids", this.renderRect.toString(), hcards,vcards);
        while(hcards>BCHWMemoryGame.MINIMUM_GRID_TILES || vcards>BCHWMemoryGame.MINIMUM_GRID_TILES){
            //only even numbered options will work
            if((hcards*vcards) % 2 == 0){
                this.grids.push(new BCHWMemoryGameGrid(hcards,vcards));
            }
            if(hcards>BCHWMemoryGame.MINIMUM_GRID_TILES){
                hcards--;
            }
            if(vcards>BCHWMemoryGame.MINIMUM_GRID_TILES){
                vcards--;
            }
        }
        //console.log("BCHWMemoryGame.createPossibleGrids()", this.grids.length)
    };

	BCHWMemoryGame.prototype.enterHomeScreen = function(){
        //console.log("BCHWMemoryGame.enterHomeScreen()")
        //this.homeScreen.render();
        this.clearContext();
        var gridThumbSize = 50;
        var cols = Math.floor(Math.sqrt(this.grids.length));
        var rows = Math.floor(this.grids.length/cols);
        var previewsX = this.renderRect.getCenterX() - (cols*gridThumbSize)/2;
        var previewsY = this.renderRect.getCenterY() - (rows*gridThumbSize)/2;

        this.context.fillStyle = "#FFFFFF";
        this.context.font="24px Verdana";
        this.context.fillText("Difficulty:", previewsX, previewsY-30);

        for(var i=0; i<this.grids.length ; i++){
            this.grids[i].renderRect.update(previewsX + (i%cols) * gridThumbSize,
                                            previewsY + Math.floor(i/cols)*gridThumbSize , gridThumbSize, gridThumbSize);
            this.renderGridPreview(this.grids[i]);
            this.recordManager.addGrid(this.grids[i]);
        }
        var scope = this;
        this.canvasClickListener = function(event){scope.canvasClickHandlerHome(event)};
        this.canvas.addEventListener("click", this.canvasClickListener , false);

        this.logoBounds = new BCHWGeom.Rectangle();
        this.logoBounds.updateToRect(this.renderRect);
        this.logo.render(this.renderRect, this.lineThickness);
        //this.testFlip();
    };

    /*
    BCHWMemoryGame.prototype.testFlip = function(){
        console.log("testFlip");
        var flip = new MemoryGameCardFlip(1000,50);
        var rect = new BCHWGeom.Rectangle(0,0,250,250);
       flip.flip(rect, this.context, this.cardBackImage, this.cardBackImage, undefined, undefined, true );
    };*/

    BCHWMemoryGame.prototype.canvasClickHandlerHome = function(event){
        var x = event.pageX - this.canvasContainer.offsetLeft;
        var y = event.pageY - this.canvasContainer.offsetTop;
        //console.log("BCHWMemoryGame.canvasClickHandlerHome()", x,y);
        for(var i=0; i<this.grids.length;i++){
            if(this.grids[i].renderRect.containsPoint(x,y)){
                this.canvas.removeEventListener("click", this.canvasClickListener, false);
                this.enterGameScreen(this.grids[i]);
                return;
            }
        }
    };

	BCHWMemoryGame.prototype.renderGridPreview = function(grid){
        //console.log("BCHWMemoryGame.renderGridPreview()")
        this.context.fillStyle = "#FF0000";
        var cellWidth = Math.min(grid.renderRect.width/grid.cols, grid.renderRect.height/grid.rows);
        for(var i=0;i<grid.rows;i++){
            for(var j=0;j<grid.cols;j++){
                this.context.fillRect(grid.renderRect.x + j*cellWidth+1, grid.renderRect.y + i*cellWidth+1, cellWidth-2, cellWidth-2);
            }
        }
	};


    BCHWMemoryGame.prototype.enterGameScreen = function(grid){
        this.logo.destroy();
        this.clearContext();
        this.selectedGrid = grid;
        this.imagesManager = new BCHWMemoryGameImagesManager();
        var scope = this;
        this.imagesManager.loadImageList(function(){scope.imageListLoadCompleteHandler();});
    };


    BCHWMemoryGame.prototype.imageListLoadCompleteHandler = function(){
        //console.log("BCHWMemoryGame.imageListLoadCompleteHandler()");
        this.clearContext();
        var images = this.imagesManager.getRandomImages(this.selectedGrid.numCells()/2);
        this.imageStore = new BCHWImageStore();
        var scope = this;
        this.imageStore.loadImages(images, function(){scope.imageStoreLoadCompleteHandler()}, function(){scope.imageStoreProgressHandler()} );
    };

    BCHWMemoryGame.prototype.imageStoreProgressHandler = function(){
        this.clearContext();
        //this.imageStore.getProgressPercent();
        this.imageStore.getProgressString();
        this.context.textAlign = 'center';
        this.context.fillStyle = "#FFFFFF";
        this.context.font="30px Verdana";
        this.context.fillText(this.imageStore.getProgressString(), this.renderRect.getCenterX(), this.renderRect.getCenterY());
    };

    BCHWMemoryGame.prototype.imageStoreLoadCompleteHandler = function(){
        console.log("BCHWMemoryGame.imageStoreLoadCompleteHandler()");

        this.clearContext();

        //determine cell size
        var cellSize, spacer;
        cellSize = Math.min(this.renderRect.width / this.selectedGrid.cols, this.renderRect.height / this.selectedGrid.rows);
        spacer = cellSize*.1;
        cellSize -= spacer;
        this.cellSize = Math.floor(cellSize > BCHWMemoryGame.MAX_TILE_SIZE ? BCHWMemoryGame.MAX_TILE_SIZE : cellSize);
        this.cellRadius = cellSize*.1;

        var gridRect = new BCHWGeom.Rectangle(0,0,cellSize*this.selectedGrid.cols+spacer*(this.selectedGrid.cols-1), cellSize*this.selectedGrid.rows+spacer*(this.selectedGrid.rows-1));
        BCHWGeom.RectangleUtil.horizontalAlignMiddle(this.renderRect, gridRect);
        BCHWGeom.RectangleUtil.verticalAlignMiddle(this.renderRect, gridRect);

        //create and position cards
        this.cells = [];
        var i, j, cell;

        for(i=0;i<this.selectedGrid.rows;i++){
            for(j=0;j<this.selectedGrid.cols;j++){
                cell = new BCHWMemoryGameGridCell(gridRect.x + j*cellSize+ j*spacer, gridRect.y + i*this.cellSize+ i*spacer,
                                                    this.cellSize, this.cellSize, this.cellRadius,
                                                    null, this.context );
                this.cells.push(cell);
            }
        }

        this.clicksEnabled = false;
        var scope = this;
        this.cardPrep.prepareImage(this.cardBackImage, this.cellSize, this.cellRadius, function(cardImage){scope.bgCardPrepareComplete(cardImage)});
    }

    BCHWMemoryGame.prototype.bgCardPrepareComplete = function(cardImage){
        this.preparedBGCardImage = cardImage;
        this.preparedImages = [];
        this.currentImagePrepIndex = 0;
        var scope = this;
        this.renderCellsTimeOutId = setTimeout(function(){scope.prepareNextImage()},20);
    }

    BCHWMemoryGame.prototype.prepareNextImage = function(){
        //console.log("BCHWMemoryGame.prepareNextImage()");
        var image = this.imageStore.images[this.currentImagePrepIndex];
        var scope = this;
        this.cardPrep.prepareImage(image, this.cellSize, this.cellRadius, function(cardImage){scope.nextCellImagePrepComplete(cardImage)});
    };

    BCHWMemoryGame.prototype.nextCellImagePrepComplete = function(cardImage){
        console.log("BCHWMemoryGame.nextCellImagePrepComplete()");
        this.preparedImages.push(cardImage);
        this.currentImagePrepIndex++;
        if(this.currentImagePrepIndex==this.imageStore.images.length){
            this.gamePreparationReady();
        }else{
            var scope = this;
            this.renderCellsTimeOutId = setTimeout(function(){scope.prepareNextImage()},20);
        }
    }

    BCHWMemoryGame.prototype.createImagePairs = function(cardImage){
        //create pairs
        console.log("BCHWMemoryGame.createImagePairs()");
        var cells = this.cells.concat();

        console.log("\t","cells", cells.length);
        console.log("\t","images", this.preparedImages.length);

        var image;
        var index=0;
        while(this.preparedImages.length>0){
            image = this.preparedImages.splice(Math.floor(Math.random()*this.preparedImages.length), 1)[0];
            console.log("\timage==undefined : ",image==undefined)
            cell = cells.splice(Math.floor(Math.random()*cells.length), 1)[0];
            cell.image = image;
            cell.bgImage = this.preparedBGCardImage;
            cell.close();
            cell = cells.splice(Math.floor(Math.random()*cells.length), 1)[0];
            cell.image = image;
            cell.bgImage = this.preparedBGCardImage;
            cell.close();
            index++;
        }
    }

    BCHWMemoryGame.prototype.gamePreparationReady = function(){
        console.log("BCHWMemoryGame.gamePreparationReady()");
        this.createImagePairs();
        this.currentPair = [];
        this.numMatches = 0;
        var scope = this;
        this.gridCellClickListener = function(event){scope.gridCellClickHandler(event)};
        this.canvas.addEventListener("click", this.gridCellClickListener , false);
        this.clicksEnabled = true;
        this.startTime = new Date().getTime();
        this.numAttempts = 0;
    }

    BCHWMemoryGame.prototype.gridCellClickHandler = function(event){
        if(!this.clicksEnabled){
            return;
        }
        var x = event.pageX - this.canvasContainer.offsetLeft;
        var y = event.pageY - this.canvasContainer.offsetTop;
        //console.log("BCHWMemoryGame.gridCellClickHandler()", x,y);
        for(var i=0;i<this.cells.length;i++){
            if(this.cells[i].containsPoint(x, y) && !this.cells[i].isOpen){
                var flipper = this.getFlipper();
                this.cells[i].open(flipper);
                this.currentPair.push(this.cells[i]);
                if(this.currentPair.length==2){
                    var scope = this;
                    flipper.completeCallback = function(){scope.assessMatch()};
                    this.numAttempts++;
                }
                break;
            }
        }
    };

    BCHWMemoryGame.prototype.assessMatch = function(){
        var card1 = this.currentPair[0];
        var card2 = this.currentPair[1];
        var scope = this;
        if(card1.image.src == card2.image.src){
            this.currentPair = [];
            card1.showMatch();
            card2.showMatch();
            this.numMatches++;
            if(this.numMatches == this.imageStore.images.length ){
                //show anim
                this.clicksEnabled = false;
                setTimeout(function(){scope.enterWinScreen()}, 2000);
            }
        }else{
            this.clicksEnabled = false;
            this.currentPair[0].showMismatch();
            this.currentPair[1].showMismatch();
            setTimeout(function(){scope.handleMisMatch()}, BCHWMemoryGame.MISMATCH_INTERVAL);
        }
    };

    BCHWMemoryGame.prototype.handleMisMatch = function(){
        var card1 = this.currentPair[0];
        var card2 = this.currentPair[1];
        var flipper = this.getFlipper();
        card1.close(flipper);
        card2.close(this.getFlipper());
        this.currentPair = [];
        var scope = this;
        flipper.completeCallback = function(){scope.clicksEnabled = true};
    };

    BCHWMemoryGame.prototype.enterWinScreen = function(){
        this.clearContext();

        var gridRecord = this.recordManager.getGridRecord(this.selectedGrid);

        var gameDuration = new Date().getTime() - this.startTime;
        var seconds=Math.floor((gameDuration/1000)%60);
        var minutes=Math.floor((gameDuration/(1000*60))%60);
        var hours=Math.floor((gameDuration/(1000*60*60))%24);

        var summaryString = "It took you "+this.numAttempts+" tries and ";
        var timeString="";
        if(hours>0){
            timeString+=(hours+ "hours, ");
        }
        if(minutes>0){
            timeString+=(minutes+ "minutes, ");
        }
        if(timeString!=""){
            timeString+="and ";
        }
        timeString+=(seconds +"seconds");
        summaryString+=timeString;

        var newRecordTime = "";
        var newRecordTries = "";
        if(gameDuration < gridRecord.recordTime){
            gridRecord.recordTime = gameDuration;
            newRecordTime = "Congrats, new time record!";
        }
        if(this.numAttempts < gridRecord.recordTries){
            gridRecord.recordTries = this.numAttempts;
            newRecordTries = "Congrats, new record tries!";
        }

        this.context.textAlign = 'center';
        this.context.fillStyle = "#FFFFFF";
        this.context.font="30px Verdana";
        this.context.fillText("Congrats, YOU WIN!!!", this.renderRect.getCenterX(), this.renderRect.getCenterY());
        this.context.font="22px Verdana";
        this.context.fillText(summaryString, this.renderRect.getCenterX(), this.renderRect.getCenterY()+30);
        this.context.font="30px Verdana";
        if(gridRecord.gamesPlayed > 0){
            this.context.font="22px Verdana";
            if(newRecordTime!="" || newRecordTries!=""){
                this.context.fillStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
                this.context.fillText(newRecordTime+" "+newRecordTries, this.renderRect.getCenterX(), this.renderRect.getCenterY()+60);
            }else{
                this.context.fillStyle = BCHWColor.BCHWColorsLib.ORANGE.getCanvasColorString();
                this.context.fillText("your record tries "+gridRecord.recordTries+": , your record time :"+gridRecord.recordTime, this.renderRect.getCenterX(), this.renderRect.getCenterY()+60);
            }
        }
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText("Click to play again.", this.renderRect.getCenterX(), this.renderRect.getBottom()-30);
        this.canvas.removeEventListener("click", this.gridCellClickListener , false);

        var scope = this;
        this.restartClickListener = function(event){scope.restartClickHandler(event)};
        this.canvas.addEventListener("click", this.restartClickListener , false);

        gridRecord.gamesPlayed++;
        this.gamesPlayed++;
    };

    BCHWMemoryGame.prototype.restartClickHandler = function(){
        this.canvas.removeEventListener("click", this.restartClickListener , false);
        this.reset();
    };

	window.BCHWMemoryGame = BCHWMemoryGame;


    //==========================::BCHWMemoryGameGrid::=============================
    var BCHWMemoryGameGrid = function(cols, rows){
        this.rows = rows;
        this.cols = cols;
        this.renderRect = new BCHWGeom.Rectangle();
    };
    BCHWMemoryGameGrid.prototype.numCells = function(){
        return this.rows * this.cols;
    };
    window.BCHWMemoryGameGrid = BCHWMemoryGameGrid;





    //==========================::BCHWMemoryGameImagesManager::=============================
    var BCHWMemoryGameImagesManager = function(){};

    BCHWMemoryGameImagesManager.prototype.loadImageList = function(callBack){
        //console.log("BCHWMemoryGameImagesManager.loadImageList()");
        this.request = null;
        this.request = new XMLHttpRequest();
        var _this = this;
        this.request.onreadystatechange = function(){_this.imagesListLoadedHandler()};
        //this.request.open( "GET", "http://bigcityhousewife.net/php/getFilesInDirectory.php?directory=..%2fassets%2fmemoryGame%2f", true );
        //this.themeFolder = "assets/memoryGame/";
        this.request.open( "GET", "http://bigcityhousewife.net/php/getFilesInDirectory.php?directory=..%2fassets%2fmemoryGame%2fxmas%2f", true );
        this.themeFolder = "assets/memoryGame/xmas/";
        this.request.send( null );
        this.imageListLoadedCallBack = callBack ? callBack : null;
    };

    BCHWMemoryGameImagesManager.prototype.imagesListLoadedHandler = function(){
        //console.log("BCHWMemoryGameImagesManager.imagesListLoadedHandler()", this.request.readyState, this.request.status);
        if ( this.request.readyState == 4 && this.request.status == 200 ){
            //console.log(this.request.responseText);
            this.imageList = eval ( this.request.responseText  );
            //console.log(this.imageList );

            this.request.onreadystatechange = null;
            if(this.imageListLoadedCallBack){
                this.imageListLoadedCallBack();
                this.imageListLoadedCallBack = null;
            }
        }
    };

    BCHWMemoryGameImagesManager.prototype.getRandomImages = function(total){
        if(total>this.imageList.length){
            //throw some nasty nasty error
            console.warn("BCHWMemoryGameImagesManager.getRandomImages() requested "+total+" is more than available images"+this.imageList.length);
        }
        var images = [];
        var copy = this.imageList.concat();
        console.log("BCHWMemoryGameImagesManager.getRandomImages() ", total, copy.length);
        for(var i=0; i<total; i++){
            images[i] = this.themeFolder+copy.splice(Math.floor(Math.random()*copy.length), 1)[0];
        }
        return images;

    };
    window.BCHWMemoryGameImagesManager = BCHWMemoryGameImagesManager;

    //==========================::BCHWMemoryGameRecordsManager::=============================
    var BCHWMemoryGameRecordsManager = function(){
        this.grids = [];
    };

    BCHWMemoryGameRecordsManager.prototype.addGrid = function(grid){
        var numCells = grid.numCells();
        if(this.grids[numCells] == undefined){
            this.grids[numCells] = new BCHWMemoryGameGridRecord();
        }
    };

    BCHWMemoryGameRecordsManager.prototype.getGridRecord = function(grid){
        return this.grids[grid.numCells()];
    };

    window.BCHWMemoryGameRecordsManager = BCHWMemoryGameRecordsManager;

    var BCHWMemoryGameGridRecord = function(){
        this.recordTime = Number.MAX_VALUE;
        this.recordTries = Number.MAX_VALUE;
        this.gamesPlayed = 0;
    };

    window.BCHWMemoryGameGridRecord = BCHWMemoryGameGridRecord;

}(window));