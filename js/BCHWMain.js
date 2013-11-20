

(function (window){

	function BCHWMain(){
		this.margin = .05;
        this.momWidth = .2;
        this.lineThickness = 4;
        this.resizeTimeoutId = -1;
        this.bubbleArrowHeight = 20;
    }

    //static variables
    BCHWMain.REFRESH_AFTER_RESIZE_INTERVAL = 300;//wait this long to rerender graphics after last resize
    BCHWMain.TWEET_INTERVAL = 5000;//characters display a tweet at this interval

    BCHWMain.prototype.init = function(canvasContainer, speechBubbleContainer){
        //console.log("BCHWMain.init()");
        this.canvas = document.createElement('canvas');
        this.canvasContainer = canvasContainer;
        this.context = this.canvas.getContext("2d");
        this.context.lineCap="round";
        this.canvasContainer.appendChild(this.canvas);
        this.logo = new BCHWLogo(this.canvas);
        this.logo.lineThickness = this.lineThickness;
        this.mom = new BCHWMom(this.canvas);
        this.mom.lineThickness = this.lineThickness;
        this.render();
        this.tweetsManager = new TweetsManager();
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

        var boundsX = this.canvas.width*this.margin;
        var boundsY = this.canvas.height*this.margin;
        var renderBounds = new BCHWGeom.Rectangle(boundsX, boundsY, this.canvas.width-boundsX*2, this.canvas.height-boundsY*2);
        //console.log("\trenderBounds : ",renderBounds.toString());

        this.lineThickness = renderBounds.width > 700 ? 4 : 2;
        //console.log("lineThickness", lineThickness);

        //MOM
        this.momBounds = new BCHWGeom.Rectangle(renderBounds.x, renderBounds.y, renderBounds.width*this.momWidth, renderBounds.height);
        //this.context.fillStyle = "#FF0000";
        //this.context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        this.mom.render(this.momBounds, this.lineThickness);
        //console.log("\t",bounds.toString());

        //LOGO
        this.logoBounds = new BCHWGeom.Rectangle(   this.momBounds.getRight()+this.lineThickness, renderBounds.y,
                                                    renderBounds.getRight()-this.momBounds.getRight()-this.lineThickness, renderBounds.height);
        this.logo.render(this.logoBounds, this.lineThickness);
        //console.log("\t",bounds.toString());

	};


    BCHWMain.prototype.tweetsLoadedHandler = function(){
        //console.log("BCHWMain.tweetsLoadedHandler()");
        this.showNextTweet();
    }

    BCHWMain.prototype.showNextTweet = function(){
        //console.log("BCHWMain.showNextTweet()");
        this.speechBubbleContainer.style.opacity = 0;
        var tweet = this.tweetsManager.getNextTweet();
        //console.log(tweet);
        this.speechBubbleContainer.innerHTML = "<p>"+tweet+"</p>";
        this.speechBubbleContainer.style.maxWidth = (this.logoBounds.width+this.momBounds.width/2)+"px";
        var x = this.canvasContainer.offsetLeft + this.mom.getCenterX();
        var y = this.canvasContainer.offsetTop + this.mom.y - this.speechBubbleContainer.clientHeight-this.bubbleArrowHeight - this.speechBubble.padding*2;
        this.speechBubbleContainer.style.left = x+"px";
        this.speechBubbleContainer.style.top = y+"px";
        this.bubbleBounds = new BCHWGeom.Rectangle( this.mom.getCenterX(), this.mom.y - this.speechBubbleContainer.clientHeight-this.bubbleArrowHeight - this.speechBubble.padding*2,
                                                    this.speechBubbleContainer.clientWidth,  this.speechBubbleContainer.clientHeight+this.bubbleArrowHeight);
        this.mom.render(this.momBounds,this.lineThickness);
        var scope = this;
        this.speechBubble.render(this.bubbleBounds, this.lineThickness, function(){scope.speechBubbleCompleteHandler()} )
    }

    BCHWMain.prototype.speechBubbleCompleteHandler = function(){
        this.speechBubbleContainer.style.opacity = 1;
        this.setTwitterTalkTimeout();
    }

    BCHWMain.prototype.setTwitterTalkTimeout = function(){
        //console.log("BCHWMain.setTwitterTalkTimeout()");
        var scope = this;
        this.twitterTalkTimeout = setTimeout(function(){
            scope.showNextTweet();
        }, BCHWMain.TWEET_INTERVAL );
    }

    BCHWMain.prototype.speechBubbleContainerMouseOverHandler = function(){
        clearTimeout (this.twitterTalkTimeout);
    }
    //this is necessary because mouseOut is called when mouse goes over the text of a tweet
    //doesn't work when mouse moves out from right side of bubble?!
    BCHWMain.prototype.speechBubbleContainerMouseOutHandler = function(event){
        var rect = new BCHWGeom.Rectangle(  this.speechBubbleContainer.offsetLeft, this.speechBubbleContainer.offsetTop,
                                            this.speechBubbleContainer.clientWidth, this.speechBubbleContainer.clientHeight);
        //console.log("BCHWMain.speechBubbleContainerMouseOutHandler()", rect.toString(), event.clientX, event.clientY )
        if(!rect.containsPoint(event.clientX, event.clientY)){
            this.setTwitterTalkTimeout();
        }
    }

	window.BCHWMain = BCHWMain;
	
}(window));