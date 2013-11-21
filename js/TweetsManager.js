/**
 * Created by sakri on 18-11-13.
 */

/* currently loads only MOM tweets and manages them*/
(function (window){


    function TweetsManager(){

    }

    TweetsManager.prototype.loadTweets = function(callBack){
        console.log("TweetsManagerloadTweets()");
        this.request = null;
        this.request = new XMLHttpRequest();
        var _this = this;
        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = function(){_this.tweetsLoadedHandler()};
        this.request.open( "GET", "http://bigcityhousewife.net/php/getTwitterUserTimeline.php", true );
        this.request.send( null );

        this.tweetsLoadedCallBack = callBack ? callBack : null;
        this.currentTweetIndex = 0;

    };

    TweetsManager.prototype.tweetsLoadedHandler = function(){
        console.log("tweetsLoadedHandler", this.request.readyState, this.request.status);
        if ( this.request.readyState == 4 && this.request.status == 200 ){
            this.tweets = eval ( this.request.responseText  );
            //info.jsonData[ 0 ].cmname;
            console.log(this.tweets);
            this.request.onreadystatechange = null;
            if(this.tweetsLoadedCallBack){
                this.tweetsLoadedCallBack();
                this.tweetsLoadedCallBack = null;
            }
        }

    }

    //from http://stackoverflow.com/questions/8020739/regex-how-to-replace-twitter-links
    TweetsManager.prototype.processTweetLinks = function(text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;

        text = text.replace(exp, "<a href='javascript: void(0)' onclick='tweetLinkClickHandler(\"$1\")' >$1</a>");
        exp = /(^|\s)#(\w+)/g;
        text = text.replace(exp, "$1<a href='javascript: void(0)' onclick='tweetLinkClickHandler(\"https://twitter.com/search?q=%23$2\")' >#$2</a>");
        exp = /(^|\s)@(\w+)/g;
        text = text.replace(exp, "$1<a href='javascript: void(0)' onclick='tweetLinkClickHandler(\"http://www.twitter.com/$2\")' >@$2</a>");

        /*
        text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
        exp = /(^|\s)#(\w+)/g;
        text = text.replace(exp, "$1<a href='https://twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
        exp = /(^|\s)@(\w+)/g;
        text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
        */
        return text;
    }

    TweetsManager.prototype.getNextTweet = function(){
        if(!this.tweets){
            return null;
        }
        var tweet = this.tweets[this.currentTweetIndex];

        this.currentTweetIndex++;
        this.currentTweetIndex%=this.tweets.length;

        return this.processTweetLinks(tweet.text);
    }

    window.TweetsManager = TweetsManager;

}(window));