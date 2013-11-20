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