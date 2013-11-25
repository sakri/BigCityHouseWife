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