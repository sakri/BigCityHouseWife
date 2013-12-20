(function (window){


	var BCHWImageStore = function(){};
		
	BCHWImageStore.prototype.loadImages = function(urls, completeCallback, updateCallback){
		this.urls = urls;
		this.completeCallback = completeCallback;
		this.updateCallback = updateCallback != undefined ? updateCallback : undefined;
		this.images = [];
		this.currentLoadIndex = 0;
		this.loadNextImage();
	};

	BCHWImageStore.prototype.stop = function(){
		this.completeCallback = undefined;
		this.updateCallback = undefined;
		this.urls = [];
	};
	
	BCHWImageStore.prototype.getProgressPercent = function(){
		return BCHWMathUtil.normalize(this.currentLoadIndex, 0, this.urls.length);
	};
	
	BCHWImageStore.prototype.getProgressString = function(){
		return this.currentLoadIndex+" / "+this.urls.length;
	};

	BCHWImageStore.prototype.loadNextImage = function(){
		if(this.currentLoadIndex >= this.urls.length){
			//console.log("all images loaded");
			this.completeCallback();
			return;
		}
		//console.log("BCHWImageStore.prototype.loadNextImage(", this.currentLoadIndex, "/", this.urls.length,") : ",this.urls[this.currentLoadIndex]);
		var image = new Image();
		var _this = this;
		image.onload = function(){
			_this.imageLoadComplete();
		};

		var url = this.urls[this.currentLoadIndex];
        console.log("BCHWImageStore.loadNextImage()", url );
		image.onerror = function(){
			alert("BCHWImageStore ERROR : "+url+" could not be loaded.");
		};
		image.src = this.urls[this.currentLoadIndex];
		this.images.push(image);
		this.currentLoadIndex++;
	};
	
	BCHWImageStore.prototype.imageLoadComplete = function(){
		//console.log("BCHWImageStore.imageLoadComplete()");
		for(var i=0; i<this.images.length; i++){
			this.images[i].onload = undefined;
		}
		if(this.updateCallback != undefined){
			this.updateCallback();
		}
		this.loadNextImage();
	};

	window.BCHWImageStore = BCHWImageStore;
	
}(window));