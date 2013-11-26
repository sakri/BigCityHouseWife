

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