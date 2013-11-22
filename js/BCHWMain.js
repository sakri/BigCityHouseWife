

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
    BCHWMain.TWEET_INTERVAL = 5000;//characters display a tweet at this interval
    BCHWMain.MOUSEOVER_TWEET_INTERVAL = 8000;//tweet stops for this amount of time when hovering over with mouse

    BCHWMain.prototype.init = function(canvasContainer, speechBubbleContainer){
        //console.log("BCHWMain.init()");
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
        this.tweetsManager = new TweetsManager([this.mom,this.girl,this.boy,this.dad]);
        var scope = this;
        this.tweetsManager.loadTweets(function(){scope.tweetsLoadedHandler()});
        this.speechBubbleContainer = speechBubbleContainer;
        this.speechBubble = new BCHWSpeechBubble(this.canvas, this.bubbleArrowHeight);
    };

	BCHWMain.prototype.clearContext = function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	}

	BCHWMain.prototype.resizeHandler = function(){
		this.clearContext();
        this.speechBubbleContainer.style.opacity = 0;
		clearTimeout (this.resizeTimeoutId);
		clearTimeout (this.twitterTalkTimeout);
        this.speechBubble.stop();
		var scope = this;
		this.resizeTimeoutId = setTimeout(function(){
             scope.reset();
          }, BCHWMain.REFRESH_AFTER_RESIZE_INTERVAL );
	};

    BCHWMain.prototype.reset = function(){
        this.render();
        this.setTwitterTalkTimeout();
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


    BCHWMain.prototype.tweetsLoadedHandler = function(){
        //console.log("BCHWMain.tweetsLoadedHandler()");
        this.showNextTweet();
    }

    BCHWMain.prototype.renderCharacters = function(){
        this.mom.render(this.momBounds,this.lineThickness);
        this.girl.render(this.girlBounds, this.lineThickness);
        this.boy.render(this.boyBounds, this.lineThickness);
        this.dad.render(this.dadBounds, this.lineThickness);
    }

    BCHWMain.prototype.showNextTweet = function(){
        this.speechBubbleContainer.style.opacity = 0;
        var character = this.tweetsManager.getNextTweeter();
        var tweet = this.tweetsManager.processTweetLinks(character.tweets[character.tweetIndex].text);
        this.speechBubbleContainer.innerHTML = "<p>"+tweet+"</p>";
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
        this.speechBubble.render(this.bubbleBounds, triangleX, this.lineThickness, function(){scope.speechBubbleCompleteHandler()} );
    }

    BCHWMain.prototype.speechBubbleCompleteHandler = function(){
        this.speechBubbleContainer.style.opacity = 1;
        this.setTwitterTalkTimeout();
    }

    BCHWMain.prototype.setTwitterTalkTimeout = function(interval){
        //console.log("BCHWMain.setTwitterTalkTimeout()");
        var scope = this;
        this.twitterTalkTimeout = setTimeout(function(){
            scope.showNextTweet();
        }, isNaN(interval) ? BCHWMain.TWEET_INTERVAL : interval );
    }

    BCHWMain.prototype.speechBubbleContainerMouseOverHandler = function(){
        clearTimeout (this.twitterTalkTimeout);
        this.setTwitterTalkTimeout(BCHWMain.MOUSEOVER_TWEET_INTERVAL);
    }

	window.BCHWMain = BCHWMain;
	
}(window));