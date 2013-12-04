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