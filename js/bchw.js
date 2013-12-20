/**
 * Created by sakri on 18-11-13.
 */

(function (window){


    function TweetsManager(characters){
        this.characters = characters;
    }

    TweetsManager.prototype.loadTweets = function(callBack){
        //console.log("TweetsManagerloadTweets()");
        this.request = null;
        this.request = new XMLHttpRequest();
        var _this = this;
        this.request.onreadystatechange = function(){_this.tweetsLoadedHandler()};
        //this.request.open( "GET", "http://bigcityhousewife.net/php/getTwitterUserTimeline.php", true );
        this.request.open( "GET", "http://bigcityhousewife.net/php/getTwitterFamilyTimelines.php", true );
        this.request.send( null );
        this.tweetsLoadedCallBack = callBack ? callBack : null;
    };

    TweetsManager.prototype.tweetsLoadedHandler = function(){
        //console.log("tweetsLoadedHandler", this.request.readyState, this.request.status);
        if ( this.request.readyState == 4 && this.request.status == 200 ){
            //console.log(this.request.responseText);
            this.tweets = eval ( this.request.responseText  );
            //console.log(this.tweets);
            this.matchTweetsToCharacters();
            this.request.onreadystatechange = null;
            if(this.tweetsLoadedCallBack){
                this.tweetsLoadedCallBack();
                this.tweetsLoadedCallBack = null;
            }
        }

    }

    TweetsManager.prototype.matchTweetsToCharacters = function(){
        var i, userName, j, character;
        for(i=0;i<this.tweets.length;i++){
            userName = this.tweets[i][0].user.screen_name;
            for(j=0;j<this.characters.length;j++){
                character = this.characters[j];
                if(character.twitterHandle==userName){
                    character.tweets = BCHWArrayUtil.shuffle(this.tweets[i]);
                    character.tweetIndex = 0;
                }
            }
        }
        //this.tweets = undefined; TODO: no need to store the tweets in 2 places?
    }

    //from http://stackoverflow.com/questions/8020739/regex-how-to-replace-twitter-links
    TweetsManager.tweetLinkRegExp =  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    TweetsManager.tweetHashRegExp =  /(^|\s)#(\w+)/g;
    TweetsManager.tweetUserRegExp =  /(^|\s)@(\w+)/g;
    TweetsManager.prototype.processTweetLinks = function(text) {
        text = text.replace(TweetsManager.tweetLinkRegExp, "<a href='javascript: void(0)' onclick='tweetLinkClickHandler(\"$1\")' >$1</a>");
        text = text.replace(TweetsManager.tweetHashRegExp, "$1<a href='javascript: void(0)' onclick='tweetLinkClickHandler(\"https://twitter.com/search?q=%23$2\")' >#$2</a>");
        text = text.replace(TweetsManager.tweetUserRegExp, "$1<a href='javascript: void(0)' onclick='tweetLinkClickHandler(\"http://www.twitter.com/$2\")' >@$2</a>");
        return text;
    }

    TweetsManager.prototype.tweetsLoaded = function(){
        return this.tweets && this.tweets.length>0;
    }

    TweetsManager.prototype.getNextTweeter = function(){
        this.currentTweeter = this.characters[Math.floor(Math.random()*this.characters.length)];
        this.currentTweeter.tweetIndex++;
        this.currentTweeter.tweetIndex %= this.currentTweeter.tweets.length;
        return this.currentTweeter;
    }

    TweetsManager.prototype.getCurrentTweeter = function(){
        return this.currentTweeter;
    }

    window.TweetsManager = TweetsManager;

}(window));
/**
 * Created by sakri on 18-11-13.
 */

(function (window){


    function BlogPostsManager(){}

    BlogPostsManager.prototype.load = function(callBack){
        //console.log("BlogPostsManager.load()");
        this.request = null;
        var _this = this;
        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = function(){_this.blogPostsLoadedHandler()};
        //this.request.open( "GET", "http://bigcityhousewife.net/php/getTwitterUserTimeline.php", true );
        this.request.open( "GET", "http://www.bigcityhousewife.net/php/getBlogPosts.php", true );
        this.request.send( null );

        this.blogPostsLoadedCallBack = callBack ? callBack : null;
        this.currentPostIndex = 0;

    };

    //Move to some XML UTIL or so
    BlogPostsManager.prototype.getValueFromTagName = function(item, tagname) {
        var val = item.getElementsByTagName(tagname);
        return val[0].firstChild.nodeValue;
    }

    BlogPostsManager.regExpUrlContainingSize = /-\d+x\d+\.(jpg|png|gif)$/;//http://stackoverflow.com/questions/13385608/jquery-replace-image-size-in-filename
    BlogPostsManager.regExpUrlWithoutSize = /\.(jpg|png|gif)$/;

    BlogPostsManager.prototype.setWordPressImageSize = function(url) {
        url = url.replace(BlogPostsManager.regExpUrlContainingSize, "-150x150.$1");
        if(url.indexOf("150x150")==-1){
            url = url.replace(BlogPostsManager.regExpUrlWithoutSize, "-150x150.$1");
        }
        return url;
    }

    BlogPostsManager.prototype.blogPostsLoadedHandler = function(){
        //console.log("blogPostsLoadedHandler", this.request.readyState, this.request.status);
        if ( this.request.readyState == 4 && this.request.status == 200 ){
            //console.log(this.request.responseText);
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.request.responseText,"text/xml");

            var items = doc.getElementsByTagName('item');
            this.posts = [];
            var i, title, link, content, parts, img;
            for (i = 0; i < items.length; ++i) {
                title = this.getValueFromTagName(items[i], 'title');
                link = this.getValueFromTagName(items[i], 'link');
                content = items[i].getElementsByTagNameNS("http://purl.org/rss/1.0/modules/content/","encoded")[0].firstChild.nodeValue;
                if(content && content.indexOf("src=\"">-1)){
                    parts = content.split("src=\"");
                    img = parts[1].split("\"")[0];
                    img = this.setWordPressImageSize(img);
                    this.posts.push(new BlogPost(title, link, img));
                }
                this.posts = BCHWArrayUtil.shuffle(this.posts);
            }

            this.request.onreadystatechange = null;
            if(this.blogPostsLoadedCallBack){
                this.blogPostsLoadedCallBack();
                this.blogPostsLoadedCallBack = null;
            }
        }

    }

    BlogPostsManager.prototype.rssLoaded = function(){
        return this.posts && this.posts.length>0;
    }

    BlogPostsManager.prototype.getNextBlogPost = function(){
        this.currentPostIndex++;
        this.currentPostIndex %= this.posts.length;
        return this.posts[this.currentPostIndex];
    }

    window.BlogPostsManager = BlogPostsManager;

    //====================================================================
    //=========================::BLOG POST::================
    //====================================================================
    function BlogPost(title,link,img){
        this.title = title;
        this.link = link;
        this.img = img;
    }

    window.BlogPost = BlogPost;

}(window));
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
 * Created by sakri on 6-11-13.
 */
//===========================================================
//===================::BIG CITY HOUSE WIFE LOGO::=============
//==========================================================

(function (window){

    var BCHWLogo = function(canvas, x, y, width, height){
        LayoutRectangle.call(this, canvas, x, y, width, height);
        this.lineThickness = 4;
        this.row1 = new BCHWFontLayoutRect(canvas);
        this.row1.setHorizontalAlign(LayoutRectangle.HORIZONTAL_ALIGN_RIGHT);
        this.setRowText(this.row1,"big city");
        this.row2 = new BCHWFontLayoutRect(canvas);
        this.setRowText(this.row2,"house wife");
        this.renderNextCharacterTimeoutId = -1;
    };

    //subclass extends superclass
    BCHWLogo.prototype = Object.create(LayoutRectangle.prototype);
    BCHWLogo.prototype.constructor = LayoutRectangle;

    BCHWLogo.RENDER_CHARACTER_INTERVAL = 30;//characters are rendered one at a time with this interval between renders

    BCHWLogo.prototype.setRowText=function(row, text){
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

    BCHWLogo.prototype.render = function(bounds, lineThickness){
        //console.log("BCHWLogo.render()", bounds.toString());
        this.updateLayout(bounds);
        this.clear();
        this.zIndeces = BCHWArrayUtil.createSequentialNumericArray(this.allCharacters.length);
        this.zIndeces = BCHWArrayUtil.shuffle(this.zIndeces);
        this.currentRenderIndex = 0;
        var roundedRectRadius = this.row1.height / 12;
        for(var i=0; i<this.allCharacters.length; i++){
            this.allCharacters[i].thickness = lineThickness;
            this.allCharacters[i].roundedRect.radius = roundedRectRadius;
        }
        this.renderNextCharacter();
    };

    BCHWLogo.prototype.stop = function(bounds){
        clearTimeout (this.renderNextCharacterTimeoutId);
    }

    BCHWLogo.prototype.renderNextCharacter = function(){
        if(this.currentRenderIndex == this.allCharacters.length){
            //console.log("BCHWLogo render complete");
            return;
        }
        var fontCharacter = this.allCharacters[this.zIndeces[this.currentRenderIndex]];
        fontCharacter.addRandomness(this.row1.height/40,.01);
        fontCharacter.renderToContext(this.context);

        var scope = this;
        this.renderNextCharacterTimeoutId = setTimeout(function(){
            scope.renderNextCharacter();
        }, BCHWLogo.RENDER_CHARACTER_INTERVAL );
        this.currentRenderIndex++;
    };

    BCHWLogo.prototype.getContentRect = function(bounds){
        //100 height is hardcoded... hmm
        var layoutRect = BCHWGeom.RectangleUtil.getBiggerRectangle(this.row1.getContentRect(100), this.row2.getContentRect(100));
        BCHWGeom.RectangleUtil.scaleRectToBestFit(bounds,layoutRect);
        return layoutRect;
    }

    BCHWLogo.prototype.updateLayout = function(bounds){
        //100 height is hardcoded... hmm
        var layoutRect = BCHWGeom.RectangleUtil.getBiggerRectangle(this.row1.getContentRect(100), this.row2.getContentRect(100));
        BCHWGeom.RectangleUtil.scaleRectToBestFit(bounds, layoutRect);
        BCHWGeom.RectangleUtil.horizontalAlignMiddle(bounds, layoutRect);
        layoutRect.y = bounds.getBottom()-layoutRect.height;
        this.row2.updateToRect(layoutRect);
        this.row2.layoutCharacters();

        layoutRect.y -= layoutRect.height;
        this.row1.updateToRect(layoutRect);
        this.row1.layoutCharacters();

        this.allCharacters = this.row1.characters.concat(this.row2.characters);
    };

    BCHWLogo.prototype.getCharacterBounds = function(rowIndex, characterIndex){
        var row = this["row"+rowIndex];
        var character = row.characters[characterIndex];
        return character.roundedRect;
    }

    window.BCHWLogo = BCHWLogo;

}(window));
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
        this.twitterHandle = "B_C_H_W";
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
        var hairHeight = this.height*.35;
        this.cornerRadius = hairHeight/7;
        this.hairRect = new BCHWGeom.RoundedRectangle(this.x, this.y, this.width, hairHeight, this.cornerRadius);
        this.renderRoundedRect(this.hairRect);

        //face
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.x + this.width/4,
                                                        this.hairRect.y+this.hairRect.height/3,
                                                        this.width/2,
                                                        this.height*.3, this.cornerRadius);
        this.renderRoundedRect(this.faceRect);

    }
    BCHWMom.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.RoundedRectangle(  0, this.faceRect.getBottom(),
                                                        this.faceRect.width *.95 , (this.getBottom()-this.faceRect.getBottom()) *.7, this.cornerRadius+1);
        this.bodyRect.x = (this.faceRect.x+this.faceRect.width/2)-(this.bodyRect.width/2);
        this.renderRoundedRect(this.bodyRect);

        //pants
        this.context.fillStyle = this.pantsFillStyle;
        this.pantsRect = new BCHWGeom.RoundedRectangle( this.faceRect.x, this.bodyRect.getBottom()-this.faceRect.radius,
                                                        this.faceRect.width, (this.getBottom()-this.bodyRect.getBottom()) *.95,this.cornerRadius);
        this.renderRoundedRect(this.pantsRect);

        //shoes
        this.context.lineWidth = 0;
        this.shoeRect = new BCHWGeom.RoundedRectangle(this.pantsRect.x, this.pantsRect.getBottom() ,
                                                        this.pantsRect.width/2 , (this.getBottom()-this.pantsRect.getBottom()), this.cornerRadius/2);
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
        this.twitterHandle = "bchw_girl";
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
        var hairRadius = leftHairBall.width/5;

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
        var faceHeight = (this.height-this.hairRect.height) *.4;
        this.cornerRadius = faceHeight/6;
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.x + this.width *.15,
                                                        this.hairRect.getBottom(),
                                                        this.width *.7,
                                                        faceHeight, this.cornerRadius);
        this.renderRoundedRect(this.faceRect);
        this.context.lineWidth = this.lineThickness;

    }
    BCHWGirl.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.RoundedRectangle(  0, this.faceRect.getBottom(),
            this.faceRect.width *.95 , (this.getBottom()-this.faceRect.getBottom()) *.7, this.cornerRadius *.8);
        this.bodyRect.x = (this.faceRect.x+this.faceRect.width/2)-(this.bodyRect.width/2);
        this.renderRoundedRect(this.bodyRect);

        //pants
        this.context.fillStyle = this.pantsFillStyle;
        this.pantsRect = new BCHWGeom.RoundedRectangle( this.faceRect.x, this.bodyRect.getBottom(),
            this.faceRect.width, this.getBottom()-this.bodyRect.getBottom(), this.cornerRadius *.8);
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
        this.twitterHandle = "bchw_son";
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

        var hairHeight = this.hairRect.height/2;
        var hairRoundedRect = new BCHWGeom.RoundedRectangle(this.hairRect.x, this.hairRect.getCenterY(), this.hairRect.width, hairHeight, hairHeight/3);
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
        var faceHeight = (this.height-this.hairRect.height) *.4;
        this.cornerRadius = faceHeight/6;
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.x + this.width *.05,
            this.hairRect.getBottom(),
            this.width *.9,
            faceHeight, this.cornerRadius);
        this.renderRoundedRect(this.faceRect);
        this.context.lineWidth = this.lineThickness;
    }
    BCHWBoy.prototype.renderBody = function(){
        //trunk
        this.context.fillStyle = this.shirtFillStyle ;
        this.bodyRect = new BCHWGeom.RoundedRectangle(  0, this.faceRect.getBottom(),
            this.faceRect.width *.95 , (this.getBottom()-this.faceRect.getBottom()) *.7, this.cornerRadius);
        this.bodyRect.x = (this.faceRect.x+this.faceRect.width/2)-(this.bodyRect.width/2);
        this.renderRoundedRect(this.bodyRect);

        //pants
        this.context.fillStyle = this.pantsFillStyle;
        this.pantsRect = new BCHWGeom.RoundedRectangle( this.faceRect.x, this.bodyRect.getBottom(),
            this.faceRect.width, this.getBottom()-this.bodyRect.getBottom(), this.cornerRadius *.8);
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
        this.twitterHandle="bchw_dad";
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
        var couchHeight = this.height*.6;
        this.couchRect = new BCHWGeom.RoundedRectangle(this.x+this.width *.4, this.y+this.height *.4, this.width *.6, couchHeight, couchHeight/18);
        this.renderRoundedRect(this.couchRect);
    }

    BCHWDad.prototype.renderBody = function(){

        //laptop
        this.context.fillStyle = BCHWColor.BCHWColorsLib.LIGHT_GRAY.getCanvasColorString();
        this.laptopRect = new BCHWGeom.RoundedRectangle(0,0, this.width *.25, this.width *.05, 2);
        this.context.save();
        this.context.translate(this.x, this.getCenterY());
        this.context.rotate(Math.PI *.2);
        this.renderRoundedRect(this.laptopRect);
        this.context.restore();

        //trunk
        this.context.fillStyle = this.shirtFillStyle ;

        this.bodyRect = new BCHWGeom.Rectangle(  this.x + this.width *.25, this.couchRect.y,
                                                  this.width *.6 , this.couchRect.height);
        var radius = this.couchRect.height/20;
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

        //shoe
        var shoeHeight = this.bodyRect.height*.1;
        var shoeRect = new BCHWGeom.RoundedRectangle(this.bodyRect.x, this.bodyRect.getBottom()-this.bodyRect.height*.1 ,
                                                       this.bodyRect.width/2, shoeHeight, shoeHeight/3 );
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        this.renderRoundedRect(shoeRect, false, true);

        //arm
        this.context.beginPath();
        var shoulderX = this.bodyRect.getCenterX();
        var shoulderY = this.bodyRect.y + (this.bodyRect.height *.25);
        var handX = this.x+this.bodyRect.width *.1 + Math.random()*(this.bodyRect.width *.2);
        var handY = this.bodyRect.y+Math.random()*(this.bodyRect.height *.25);
        this.context.moveTo(shoulderX,shoulderY);
        this.context.lineTo(handX+(shoulderX-handX)/2 , shoulderY + Math.random()*(this.bodyRect.width *.2));
        this.context.lineTo(handX,handY);
        this.context.stroke();
    }

    BCHWDad.prototype.renderHead = function(){
        //face
        this.context.fillStyle = BCHWColor.BCHWColorsLib.WHITE.getCanvasColorString();
        var faceHeight = this.bodyRect.y-this.y;
        this.faceRect = new BCHWGeom.RoundedRectangle(  this.bodyRect.x, this.y,
                                                        this.bodyRect.width,
                                                        faceHeight, faceHeight/7);
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
        this.context.lineWidth = Math.round(this.lineThickness/2);

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


(function (window){

	function BCHWMain(){
		this.margin = .05;
        this.momProportions = new BCHWGeom.Rectangle(0, 0, 200, 250);
        this.lineThickness = 4;
        this.resizeTimeoutId = -1;
        this.bubbleArrowHeight = 20;
    }

    //static variables
    BCHWMain.REFRESH_AFTER_RESIZE_INTERVAL = 300;//wait this long to rerender graphics after last resize
    BCHWMain.SPEECH_PAUSE_INTERVAL = 400;//wait this long between speech bubbles
    BCHWMain.MOUSEOVER_TWEET_INTERVAL = 5000;//tweet stops for this amount of time when hovering over with mouse

    BCHWMain.prototype.init = function(canvasContainer, speechBubbleContainer){
        this.canvas = document.createElement('canvas');
        this.canvasContainer = canvasContainer;
        this.context = this.canvas.getContext("2d");
        this.context.lineCap="round";
        this.canvasContainer.appendChild(this.canvas);
        this.logo = new BCHWLogo(this.canvas);
        this.mom = new BCHWMom(this.canvas);
        this.girl = new BCHWGirl(this.canvas);
        this.boy = new BCHWBoy(this.canvas);
        this.dad = new BCHWDad(this.canvas);
        this.render();

        this.speechBubbleContainer = speechBubbleContainer;
        this.speechBubble = new BCHWSpeechBubble(this.canvas, this.bubbleArrowHeight);

        this.tweetsManager = new TweetsManager([this.mom,this.girl,this.boy,this.dad]);
        var scope = this;
        this.tweetsManager.loadTweets(function(){scope.tweetsLoadedHandler()});

        this.blogPostsManager = new BlogPostsManager();
        var scope = this;
        this.blogPostsManager.load(function(){scope.blogPostsLoadedHandler()});

        this.hasSpeechBubbleContent = false;
    };

    //=================::GENERAL RENDERING::==========================

	BCHWMain.prototype.clearContext = function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	}

	BCHWMain.prototype.resizeHandler = function(){
		this.clearContext();
        this.speechBubbleContainer.style.opacity = 0;
		clearTimeout (this.resizeTimeoutId);
		clearTimeout (this.showNextSpeechBubbleTimeoutId);
        this.speechBubble.stop();
		var scope = this;
		this.resizeTimeoutId = setTimeout(function(){
             scope.reset();
          }, BCHWMain.REFRESH_AFTER_RESIZE_INTERVAL );
	};

    BCHWMain.prototype.reset = function(){
        this.render();
        this.showNextSpeechBubble();//risky... should let logo complete first?
    }    
	
	BCHWMain.prototype.render = function(){
        //console.log("BCHWMain.render()");
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

        var canvasBounds = new BCHWGeom.Rectangle(boundsX, boundsY, this.canvas.width-boundsX*2, this.canvas.height-boundsY*2);
        var renderBounds = new BCHWGeom.Rectangle(0,0,800,200);
        BCHWGeom.RectangleUtil.scaleRectInto(canvasBounds,renderBounds);
        BCHWGeom.RectangleUtil.verticalAlignMiddle(canvasBounds,renderBounds);

        this.logoBounds = this.logo.getContentRect(renderBounds);
        this.logoBounds.height *= 2;

        //MOM
        var momHeight = this.logoBounds.height + this.logoBounds.height/8;
        var momScale = momHeight / this.momProportions.height;
        this.momBounds = new BCHWGeom.Rectangle(renderBounds.x, renderBounds.y, this.momProportions.width*momScale, momHeight);
        var totalBounds = new BCHWGeom.Rectangle(0, 0, this.logoBounds.width+this.momBounds.width*2, momHeight);
        BCHWGeom.RectangleUtil.scaleRectInto(renderBounds, totalBounds);
        momScale = totalBounds.height / this.momProportions.height;
        this.momBounds.height = totalBounds.height;
        this.momBounds.width = this.momProportions.width*momScale;
        this.mom.render(this.momBounds, this.lineThickness);

        //DAD
        this.dadBounds = new BCHWGeom.Rectangle(renderBounds.getRight()-this.mom.width, this.mom.y, this.mom.width, this.mom.height);
        this.dad.render(this.dadBounds, this.lineThickness);


        //LOGO
        this.logoBounds.width= totalBounds.width-this.mom.width*2 - this.mom.width/4;
        this.logoBounds.height= totalBounds.height;
        this.logoBounds.x = this.mom.getRight()+ this.mom.width/8;
        this.logoBounds.y = this.mom.getBottom()-totalBounds.height;
        this.logo.render(this.logoBounds, this.lineThickness);
        //console.log("\t",bounds.toString());

        var charBounds = this.logo.getCharacterBounds(2,0);
        this.girlBounds = charBounds.clone();
        this.girlBounds.width*=.9;
        this.girlBounds.height*=.8;
        BCHWGeom.RectangleUtil.horizontalAlignMiddle(charBounds, this.girlBounds);
        BCHWGeom.RectangleUtil.verticalAlignBottom(charBounds, this.girlBounds);
        this.girlBounds.y -= (charBounds.height+this.lineThickness);
        this.girl.render(this.girlBounds, this.lineThickness);

        charBounds = this.logo.getCharacterBounds(2,1);
        this.boyBounds = charBounds.clone();
        this.boyBounds.width*=.9;
        this.boyBounds.height*=1.1;
        BCHWGeom.RectangleUtil.verticalAlignBottom(charBounds, this.boyBounds);
        this.boyBounds.y -= (charBounds.height+this.lineThickness);
        this.boy.render(this.boyBounds, this.lineThickness);
	};

    BCHWMain.prototype.renderCharacters = function(){
        this.mom.render(this.momBounds,this.lineThickness);
        this.girl.render(this.girlBounds, this.lineThickness);
        this.boy.render(this.boyBounds, this.lineThickness);
        this.dad.render(this.dadBounds, this.lineThickness);
    }


    //=================::SPEECH BUBBLE RELATED::==========================

    BCHWMain.prototype.showNextSpeechBubble = function(){
        //console.log("BCHWMain.showNextSpeechBubble()");
        this.showNextSpeechBubbleTimeoutId = -1;
        if(this.blogPostsManager.rssLoaded() && this.tweetsManager.tweetsLoaded()){
            if(Math.random()>.7){
                this.showNextBlogPost();
            }else{
                this.showNextTweet();
            }
            return;
        }
        if(this.blogPostsManager.rssLoaded()){
            this.showNextBlogPost();
        }
        if(this.tweetsManager.tweetsLoaded()){
            this.showNextTweet();
        }
        //set some form of a timeout?
    }

    BCHWMain.prototype.showNextTweet = function(){
        var character = this.tweetsManager.getNextTweeter();
        var tweet = this.tweetsManager.processTweetLinks(character.tweets[character.tweetIndex].text);
        this.displayInSpeechBubble(character, "<p>"+tweet+"</p>");
    }

    BCHWMain.prototype.showNextBlogPost = function(){
        var post = this.blogPostsManager.getNextBlogPost();
        //http://jsfiddle.net/L5r5W/2/  <= example of vertically centered text, why this doesn't work here, I cannot explain
        var content =  "<p class='blogPostBubbleText'><img src='"+post.img+"' />";
        content += "<a href='javascript: void(0)' onclick='blogPostClickHandler(\""+post.link+"\")' >"+post.title+"</a></p>";
        this.displayInSpeechBubble(this.mom, content);
    }

    //This is some ghetto spaghetti, clean up as soon as, well, it becomes necessary ;)
    BCHWMain.prototype.displayInSpeechBubble = function(character, text){
        this.context.clearRect(0,0,this.canvas.width,this.mom.y-this.lineThickness);
        this.speechBubbleContainer.style.opacity = 0;

        this.speechBubbleContainer.innerHTML = text;
        this.speechBubbleContainer.style.maxWidth = (this.logoBounds.width+this.momBounds.width/2)+"px";

        var x, triangleX;
        if(character == this.dad){
            x = this.canvasContainer.offsetLeft + this.dad.getCenterX() - this.speechBubbleContainer.clientWidth;
        }else{
            x = this.canvasContainer.offsetLeft + this.mom.getCenterX();
        }
        var y = this.canvasContainer.offsetTop + this.mom.y - this.speechBubbleContainer.clientHeight-this.bubbleArrowHeight - this.speechBubble.padding*2;

        this.speechBubbleContainer.style.left = x+"px";
        this.speechBubbleContainer.style.top = y+"px";

        if(character == this.dad){
            this.bubbleBounds = new BCHWGeom.Rectangle( this.dad.getCenterX() - this.speechBubbleContainer.clientWidth,
                this.mom.y - this.speechBubbleContainer.clientHeight-this.bubbleArrowHeight - this.speechBubble.padding*2,
                this.speechBubbleContainer.clientWidth,
                this.speechBubbleContainer.clientHeight+this.bubbleArrowHeight);
        }else{
            this.bubbleBounds = new BCHWGeom.Rectangle( this.mom.getCenterX(),
                this.mom.y - this.speechBubbleContainer.clientHeight-this.bubbleArrowHeight - this.speechBubble.padding*2,
                this.speechBubbleContainer.clientWidth,
                this.speechBubbleContainer.clientHeight+this.bubbleArrowHeight);
        }

        switch(character){
            case this.dad:
                triangleX = this.dad.x + this.dad.width*.25;
                break;
            case this.boy:
                triangleX = this.boy.getCenterX();
                break;
            case this.girl:
                triangleX = this.girl.getCenterX();
                break;
            default:
                triangleX = this.mom.x+this.mom.width*.75;
                break;
        }
        this.renderCharacters();
        var scope = this;
        this.speechBubble.showBubble(   this.bubbleBounds, triangleX, this.lineThickness,
                                        function(){scope.showBubbleCompleteHandler()},
                                        function(){scope.startHideBubbleCompleteHandler()},
                                        function(){scope.hideBubbleCompleteHandler()});
    }

    BCHWMain.prototype.tweetsLoadedHandler = function(){
        //console.log("BCHWMain.tweetsLoadedHandler()");
        if(!this.hasSpeechBubbleContent){
            this.showNextSpeechBubble();
        }
        this.hasSpeechBubbleContent = true;
    }

    BCHWMain.prototype.getCurrentTweeterName = function(){
        return this.tweetsManager.getCurrentTweeter().name;
    }

    BCHWMain.prototype.blogPostsLoadedHandler = function(){
        if(!this.hasSpeechBubbleContent){
            this.showNextSpeechBubble();
        }
        this.hasSpeechBubbleContent = true;
    }


    BCHWMain.prototype.showBubbleCompleteHandler = function(){
        //console.log("BCHWMain.showBubbleCompleteHandler()");
        this.speechBubbleContainer.style.opacity = 1;
    }

    BCHWMain.prototype.startHideBubbleCompleteHandler = function(){
        //console.log("BCHWMain.startHideBubbleCompleteHandler()");
        this.speechBubbleContainer.style.opacity = 0;
    }

    BCHWMain.prototype.hideBubbleCompleteHandler = function(){
        //console.log("BCHWMain.hideBubbleCompleteHandler()");
        var scope = this;
        this.showNextSpeechBubbleTimeoutId = setTimeout(function(){scope.showNextSpeechBubble();}, BCHWMain.SPEECH_PAUSE_INTERVAL);
    }

    BCHWMain.prototype.speechBubbleContainerMouseOverHandler = function(){
        //needs to make a call to speechBubble
        /*
        clearTimeout (this.speechBubbleTimeout);
        this.setSpeechBubbleTimeout(BCHWMain.MOUSEOVER_TWEET_INTERVAL);
        */
    }

	window.BCHWMain = BCHWMain;
	
}(window));