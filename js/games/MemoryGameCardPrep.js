/**
 * Created by sakri on 19-12-13.
 */

(function (window){


    var MemoryGameCardPrep = function(){
        this.images =[];
        this.preparationCanvas = document.createElement('canvas');
        this.context = this.preparationCanvas.getContext("2d");
        this.preparedImages = [];
    };

    MemoryGameCardPrep.getImageForSrcPath = function(path){
        for(var i=0;i<BCHWMemoryGameGridCell.preparedImages.length;i++){
            if(BCHWMemoryGameGridCell.preparedImages[i].src = path){
                return BCHWMemoryGameGridCell.preparedImages[i].preparedImage;
            }
        }
        return undefined;//or new Image() ?
    }


    MemoryGameCardPrep.prototype.prepareImage = function(img, size, radius, completeHandler){
        /*for(var i=0;i<this.preparedImages.length;i++){
            if(this.preparedImages[i].src = img.src){
                console.log("MemoryGameCardPrep.prepareImage() skipping, already prepared ", this.preparedImages[i].src , img.src);
                completeHandler( this.preparedImages[i].preparedImage);
                return;
            }
        }
        if(img.src.indexOf("memoryGame")==-1){
            console.log("MemoryGameCardPrep.prepareImage() skipping, already prepared ", this.preparedImages[i].src , img.src);
            completeHandler( this.preparedImages[i].preparedImage);
            return;
        }*/
        var image = new MemoryGameCardImage(img);

        //this.preparedImages.push(image);

        this.preparationCanvas.width = size;
        this.preparationCanvas.height = size;

        //first resize image
        console.log("prepareImage()", image.src);
        //console.log(image.sourceImage.width, image.sourceImage.height, size, size);
        this.context.drawImage(image.sourceImage, 0, 0, image.sourceImage.width, image.sourceImage.height, 0, 0, size, size);
        image.preparedImage.src = this.preparationCanvas.toDataURL();

        var scope = this;
        setTimeout(function(){scope.prepareImage2(image, size, radius, completeHandler)},20);

    }

    MemoryGameCardPrep.prototype.prepareImage2 = function(image, size, radius, completeHandler){
        //clear
        this.context.clearRect(0, 0, this.preparationCanvas.width, this.preparationCanvas.height);

        //then draw with rounded corners
        var renderMargin = 1;
        var rect = new BCHWGeom.RoundedRectangle(renderMargin, renderMargin, size-renderMargin*2, size-renderMargin*2, radius);
        this.context.fillStyle = "#CCCCCC";
        rect.drawPathToContext(this.context);
        this.context.fill();

        var pattern = this.context.createPattern(image.preparedImage, "no-repeat");
        rect.drawPathToContext(this.context);
        this.context.fillStyle = pattern;
        this.context.fill();
        image.preparedImage.src = this.preparationCanvas.toDataURL();

        this.context.clearRect(0,0,this.preparationCanvas.width, this.preparationCanvas.height);
        if(completeHandler){
            completeHandler(image.preparedImage);
        }
    };

    window.MemoryGameCardPrep = MemoryGameCardPrep;

    //===============================::CardImage::==========================

    var MemoryGameCardImage = function(image){
        this.sourceImage = image;
        this.src = image.src;
        this.preparedImage = document.createElement("img");
        console.log("MemoryGameCardImage constructor : ", this.src);
    };
    window.MemoryGameCardImage = MemoryGameCardImage;

}(window));