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