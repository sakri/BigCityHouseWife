(function (window){

	BCHWGeom=function(){}

	//==================================================
	//===================::RECTANGLE::==================
	//==================================================

	BCHWGeom.Rectangle=function (){
		this.update(0,0,0,0);
	}
	
	BCHWGeom.Rectangle.prototype.update=function(x,y,width,height){
		if(!isNaN(x))this.x=x;
		if(!isNaN(y))this.y=y;
		if(!isNaN(width))this.width=width;
		if(!isNaN(height))this.height=height;
	}
	
	BCHWGeom.Rectangle.prototype.updateToRect=function(rect){
		this.x=rect.x;
		this.y=rect.y;
		this.width=rect.width;
		this.height=rect.height;
	}
	
	BCHWGeom.Rectangle.prototype.scaleX=function(scaleBy){
		this.width*=scaleBy;
	}
	
	BCHWGeom.Rectangle.prototype.scaleY=function(scaleBy){
		this.height*=scaleBy;
	}
	
	BCHWGeom.Rectangle.prototype.scale=function(scaleBy){
		this.scaleX(scaleBy);
		this.scaleY(scaleBy);
	}

	BCHWGeom.Rectangle.prototype.getRight=function(){
		return this.x+this.width;
	}
	
	BCHWGeom.Rectangle.prototype.getBottom=function(){
		return this.y+this.height;
	}
	
	BCHWGeom.Rectangle.prototype.isSquare=function(){
		return this.width==this.height;
	}
	BCHWGeom.Rectangle.prototype.isLandscape=function(){
		return this.width>this.height;
	}
	BCHWGeom.Rectangle.prototype.isPortrait=function(){
		return this.width<this.height;
	}
	
	BCHWGeom.Rectangle.prototype.getSmallerSide=function(){
		return Math.min(this.width,this.height);
	}
	
	BCHWGeom.Rectangle.prototype.getBiggerSide=function(){
		return Math.max(this.width,this.height);
	}
	
	BCHWGeom.Rectangle.prototype.getArea=function(){
		return this.width*this.height;
	}
	
	BCHWGeom.Rectangle.prototype.floor=function(){
		this.x=Math.floor(this.x);
		this.y=Math.floor(this.y);
		this.width=Math.floor(this.width);
		this.height=Math.floor(this.height);
	}
	
	BCHWGeom.Rectangle.prototype.ceil=function(){
		this.x=Math.ceil(this.x);
		this.y=Math.ceil(this.y);
		this.width=Math.ceil(this.width);
		this.height=Math.ceil(this.height);
	}
	BCHWGeom.Rectangle.prototype.round=function(){
		this.x=Math.round(this.x);
		this.y=Math.round(this.y);
		this.width=Math.round(this.width);
		this.height=Math.round(this.height);
	}
	BCHWGeom.Rectangle.prototype.roundIn=function(){
		this.x=Math.ceil(this.x);
		this.y=Math.ceil(this.y);
		this.width=Math.floor(this.width);
		this.height=Math.floor(this.height);
	}
	BCHWGeom.Rectangle.prototype.roundOut=function(){
		this.x=Math.floor(this.x);
		this.y=Math.floor(this.y);
		this.width=Math.ceil(this.width);
		this.height=Math.ceil(this.height);
	}
	
	BCHWGeom.Rectangle.prototype.clone=function(){
		return BCHWGeom.createRectangle(this.x,this.y,this.width,this.height);
	}
	
	BCHWGeom.Rectangle.prototype.toString=function(){
		return "Rectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+"}";
	}
	
	BCHWGeom.createRectangle=function(x,y,width,height){
		var rect=new BCHWGeom.Rectangle();
		rect.update(x,y,width,height);
		return rect;
	}
	
	//==================================================
	//===========::ROUNDED RECTANGLE::==================
	//==================================================	

	BCHWGeom.RoundedRectangle=function (){
		this.radius=5
	}	
		
	BCHWGeom.RoundedRectangle.prototype=new BCHWGeom.Rectangle();
		
	BCHWGeom.RoundedRectangle.prototype.toString=function(){
		return "RoundedRectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+" , radius:"+this.radius+"}";
	}
	
	BCHWGeom.RoundedRectangle.prototype.clone=function(){
		return BCHWGeom.createRoundedRectangle(this.x,this.y,this.width,this.height,this.radius);
	}
	
	BCHWGeom.createRoundedRectangle=function(x,y,width,height,radius){
		var rect=new BCHWGeom.RoundedRectangle();
		if(!isNaN(x))rect.x=x;
		if(!isNaN(y))rect.y=y;
		if(!isNaN(width))rect.width=width;
		if(!isNaN(height))rect.height=height;
		if(!isNaN(radius))rect.radius=radius;
		return rect;
	}
	
	

	//==================================================
	//==============::RECTANGLE UTIL::==================
	//==================================================
	
	//TODO: Move this elsewhere. Find a way to deal with small files that have dependencies
	//is the only way to make sure they are imported in the right order?
	//can javascript files import other javascript files? ANSWER : Not in a clean way
	
	BCHWGeom.RectangleUtil=function (){}
	
	BCHWGeom.RectangleUtil.getBiggerRectangle=function(rectA,rectB){
		return (rectA.getArea() > rectB.getArea() ? rectA : rectB);
	}
	
	BCHWGeom.RectangleUtil.getSmallerRectangle=function(rectA,rectB){
		return (rectA.getArea() < rectB.getArea() ? rectA : rectB);
	}
	
	BCHWGeom.RectangleUtil.isBiggerThan=function(rectA,rectB){
		return rectA.getArea() > rectB.getArea();
	}
	
	BCHWGeom.RectangleUtil.isBiggerThanOrEqual=function(rectA,rectB){
		return rectA.getArea() >= rectB.getArea();
	}
		
	BCHWGeom.RectangleUtil.isSmallerThan=function(rectA,rectB){
		return rectA.getArea() < rectB.getArea();
	}
	
	BCHWGeom.RectangleUtil.isSmallerThanOrEqual=function(rectA,rectB){
		return rectA.getArea() <= rectB.getArea();
	}
	
	BCHWGeom.RectangleUtil.isEqual=function(rectA,rectB){
		return BCHWGeom.RectangleUtil.hasEqualPosition(rectA,rectB) && BCHWGeom.RectangleUtil.hasEqualSides(rectA,rectB);
	}
	
	BCHWGeom.RectangleUtil.hasEqualPosition=function(rectA,rectB){
		return rectA.x==rectB.x && rectA.y==rectB.y;
	}
	
	BCHWGeom.RectangleUtil.hasEqualSides=function(rectA,rectB){
		return rectA.width==rectB.width && rectA.height==rectB.height;
	}
	
	BCHWGeom.RectangleUtil.hasEqualArea=function(rectA,rectB){
		return rectA.getArea() == rectB.getArea();
	}
	
	BCHWGeom.RectangleUtil.getCenterX=function(rect){
		return rect.x+rect.width/2;
	}
	
	BCHWGeom.RectangleUtil.getCenterY=function(rect){
		return rect.y+rect.height/2;
	}

	BCHWGeom.RectangleUtil.createRandomXIn=function(rect){
		return BCHWMathUtil.getRandomNumberInRange(rect.x,rect.getRight);
	}
	BCHWGeom.RectangleUtil.createRandomYIn=function(rect){
		return BCHWMathUtil.getRandomNumberInRange(rect.y,rect.getBottom);
	}
	
	BCHWGeom.RectangleUtil.createRandomRectangleIn=function(rect){
		var w=Math.random()*rect.width;
		var h=Math.random()*rect.height;
		var x=Math.random()*(rect.width-w);
		var y=Math.random()*(rect.height-h);
		return BCHWGeom.createRectangle(rect.x+x,rect.y+y,w,h);
	}
	
	BCHWGeom.RectangleUtil.createRandomIntegerRectangleIn=function(rect){
		var rect=BCHWGeom.RectangleUtil.createRandomRectangleIn(rect);
		rect.round();
		return rect;
	}

	BCHWGeom.RectangleUtil.horizontalAlignLeft=function(staticRect,rectToAlign){
		rectToAlign.x=staticRect.x;
	}
	BCHWGeom.RectangleUtil.horizontalAlignMiddle=function(staticRect,rectToAlign){
		rectToAlign.x=BCHWGeom.RectangleUtil.getCenterX(staticRect)-rectToAlign.width/2;
	}
	BCHWGeom.RectangleUtil.horizontalAlignRight=function(staticRect,rectToAlign){
		rectToAlign.x=staticRect.getRight()-rectToAlign.width;
	}
	
	BCHWGeom.RectangleUtil.verticalAlignTop=function(staticRect,rectToAlign){
		rectToAlign.y=staticRect.y;
	}
	BCHWGeom.RectangleUtil.verticalAlignMiddle=function(staticRect,rectToAlign){
		rectToAlign.y=BCHWGeom.RectangleUtil.getCenterY(staticRect)-rectToAlign.height/2;
	}
	BCHWGeom.RectangleUtil.verticalAlignBottom=function(staticRect,rectToAlign){
		rectToAlign.y=staticRect.getBottom()-rectToAlign.height;
	}

	BCHWGeom.RectangleUtil.scaleRectToPortraitFit=function(staticRect,rectToScale){
		BCHWGeom.RectangleUtil.scaleRectToHeight(rectToScale,staticRect.height);
	}
	
	BCHWGeom.RectangleUtil.scaleRectToLandscapeFit=function(staticRect,rectToScale){
		BCHWGeom.RectangleUtil.scaleRectToWidth(rectToScale,staticRect.width);
	}
	
	BCHWGeom.RectangleUtil.scaleRectToHeight=function(rect,height){
		rect.width*=(height/rect.height);
		rect.height=height;
	}
	
	BCHWGeom.RectangleUtil.scaleRectToWidth=function(rect,width){
		rect.height*=(width/rect.width);
		rect.width=width;
	}
	
	BCHWGeom.RectangleUtil.scaleRectToBestFit=function(staticRect,rectToScale){
		var copy=rectToScale.clone();
		BCHWGeom.RectangleUtil.scaleRectToPortraitFit(staticRect,copy);
		if(copy.width>staticRect.width){
			BCHWGeom.RectangleUtil.scaleRectToLandscapeFit(staticRect,rectToScale);
		}else{
			rectToScale.updateToRect(copy);
		}
	}
	
	BCHWGeom.RectangleUtil.scaleRectInto=function(staticRect,rectToScale){
		BCHWGeom.RectangleUtil.scaleRectToBestFit(staticRect,rectToScale);
		BCHWGeom.RectangleUtil.verticalAlignMiddle(staticRect,rectToScale);
		BCHWGeom.RectangleUtil.horizontalAlignMiddle(staticRect,rectToScale);
	}
	
	window.BCHWGeom=BCHWGeom;
	
}(window));