(function (window){

	var BCHWMemoryGame = function(){
		this.margin = .05;
        this.lineThickness = 4;
        this.resizeTimeoutId = -1;
        this.gamesPlayed = 0;
    };

    //static variables

    //minimum width and height of "memory cards" this is used in conjunction with available
    //screensize to determine possible grid options
    BCHWMemoryGame.MINIMUM_TILE_SIZE = 100;
    BCHWMemoryGame.MAX_TILE_SIZE = 250;//the images on the server are 250x250
    BCHWMemoryGame.MINIMUM_GRID_TILES = 3;
    BCHWMemoryGame.REFRESH_AFTER_RESIZE_INTERVAL = 300;//wait this long to rerender graphics after last resize
    BCHWMemoryGame.MISMATCH_INTERVAL = 800;//wait this long to close cards in case of mismatch

    BCHWMemoryGame.prototype.init = function(canvasContainer){
        this.canvas = document.createElement('canvas');
        this.canvasContainer = canvasContainer;
        this.context = this.canvas.getContext("2d");
        this.context.lineCap="round";
        this.canvasContainer.appendChild(this.canvas);
        this.recordManager = new BCHWMemoryGameRecordsManager();
        this.cardsColor = BCHWColor.BCHWColorsLib.getRandomFillPaletteColorString();
        this.flippers = [new MemoryGameCardFlip(), new MemoryGameCardFlip()];
        this.currentFlipperIndex = 0;
        this.logo = new MemoryGameLogo(this.canvas);
        MemoryGameCardFlip.useGradient = !this.isMobile();
        MemoryGameCardFlip.useSimpleFlip = this.isMobile();
        this.cardPrep = new MemoryGameCardPrep();
        this.reset();
        //MemoryGameCardFlip.useGradient = true;
        //MemoryGameCardFlip.useSimpleFlip = false;
    };

    //move to flipper class as a static set up?
    BCHWMemoryGame.prototype.getFlipper = function(){
        var flipper = this.flippers[this.currentFlipperIndex];
        this.currentFlipperIndex++;
        this.currentFlipperIndex%=2;
        return flipper;
    };

    //http://stackoverflow.com/questions/1005153/auto-detect-mobile-browser-via-user-agent
    //not 100% sure this will work...
    BCHWMemoryGame.prototype.isMobile = function() {
        //console.log("BCHWMemoryGame.isMobile()", navigator.appVersion );
        return navigator.appVersion.indexOf("Mobile") > -1;
    }

    //=================::GENERAL RENDERING::==========================

	BCHWMemoryGame.prototype.clearContext = function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        //this.context.strokeStyle ="#FFFFFF";
        //this.context.strokeRect(0,0,this.canvas.width-1, this. canvas.height-1);
	};

	BCHWMemoryGame.prototype.resizeHandler = function(){
		this.clearContext();
        //abandon current game
		clearTimeout (this.resizeTimeoutId);
		clearTimeout (this.renderCellsTimeOutId);
        this.flippers[0].stop();
        this.flippers[1].stop();
		var scope = this;
		this.resizeTimeoutId = setTimeout(function(){
             scope.reset();
          }, BCHWMemoryGame.REFRESH_AFTER_RESIZE_INTERVAL );
	};

    BCHWMemoryGame.prototype.reset = function(){
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
        this.renderRect = new BCHWGeom.Rectangle(boundsX, boundsY, this.canvas.width-boundsX*2, this.canvas.height-boundsY*2);

        this.createPossibleGrids();
        this.loadAssets();
    };

    //reloaded everytime, normally "repeats" are cached by browser
    BCHWMemoryGame.prototype.loadAssets = function(){
        this.assetsImageStore = new BCHWImageStore();
        var scope = this;
        this.cardBackPath = "assets/memoryGameCardBack.png";
        this.assetsImageStore.loadImages([this.cardBackPath], function(){scope.assetsLoadedHandler()});
    };

    BCHWMemoryGame.prototype.assetsLoadedHandler = function(){
        //console.log("BCHWMemoryGame.assetsLoadedHandler()");
        this.cardBackImage = this.assetsImageStore.images[0];
        this.enterHomeScreen();
    };

    BCHWMemoryGame.prototype.createPossibleGrids = function(){
        this.grids = [];
        var hcards = Math.floor(this.renderRect.width / BCHWMemoryGame.MINIMUM_TILE_SIZE);
        var vcards = Math.floor(this.renderRect.height / BCHWMemoryGame.MINIMUM_TILE_SIZE);
        //console.log("BCHWMemoryGame.createPossibleGrids", this.renderRect.toString(), hcards,vcards);
        while(hcards>BCHWMemoryGame.MINIMUM_GRID_TILES || vcards>BCHWMemoryGame.MINIMUM_GRID_TILES){
            //only even numbered options will work
            if((hcards*vcards) % 2 == 0){
                this.grids.push(new BCHWMemoryGameGrid(hcards,vcards));
            }
            if(hcards>BCHWMemoryGame.MINIMUM_GRID_TILES){
                hcards--;
            }
            if(vcards>BCHWMemoryGame.MINIMUM_GRID_TILES){
                vcards--;
            }
        }
        //console.log("BCHWMemoryGame.createPossibleGrids()", this.grids.length)
    };

	BCHWMemoryGame.prototype.enterHomeScreen = function(){
        //console.log("BCHWMemoryGame.enterHomeScreen()")
        //this.homeScreen.render();
        this.clearContext();
        var gridThumbSize = 50;
        var cols = Math.floor(Math.sqrt(this.grids.length));
        var rows = Math.floor(this.grids.length/cols);
        var previewsX = this.renderRect.getCenterX() - (cols*gridThumbSize)/2;
        var previewsY = this.renderRect.getCenterY() - (rows*gridThumbSize)/2;

        this.context.fillStyle = "#FFFFFF";
        this.context.font="24px Verdana";
        this.context.fillText("Difficulty:", previewsX, previewsY-30);

        for(var i=0; i<this.grids.length ; i++){
            this.grids[i].renderRect.update(previewsX + (i%cols) * gridThumbSize,
                                            previewsY + Math.floor(i/cols)*gridThumbSize , gridThumbSize, gridThumbSize);
            this.renderGridPreview(this.grids[i]);
            this.recordManager.addGrid(this.grids[i]);
        }
        var scope = this;
        this.canvasClickListener = function(event){scope.canvasClickHandlerHome(event)};
        this.canvas.addEventListener("click", this.canvasClickListener , false);

        this.logoBounds = this.logo.getContentRect(this.renderRect);
        this.logoBounds.y = this.renderRect.y;
        this.logo.render(this.logoBounds, this.lineThickness);
        //this.testFlip();
    };

    /*
    BCHWMemoryGame.prototype.testFlip = function(){
        console.log("testFlip");
        var flip = new MemoryGameCardFlip(1000,50);
        var rect = new BCHWGeom.Rectangle(0,0,250,250);
       flip.flip(rect, this.context, this.cardBackImage, this.cardBackImage, undefined, undefined, true );
    };*/

    BCHWMemoryGame.prototype.canvasClickHandlerHome = function(event){
        var x = event.pageX - this.canvasContainer.offsetLeft;
        var y = event.pageY - this.canvasContainer.offsetTop;
        //console.log("BCHWMemoryGame.canvasClickHandlerHome()", x,y);
        for(var i=0; i<this.grids.length;i++){
            if(this.grids[i].renderRect.containsPoint(x,y)){
                this.canvas.removeEventListener("click", this.canvasClickListener, false);
                this.enterGameScreen(this.grids[i]);
                return;
            }
        }
    };

	BCHWMemoryGame.prototype.renderGridPreview = function(grid){
        //console.log("BCHWMemoryGame.renderGridPreview()")
        this.context.fillStyle = "#FF0000";
        var cellWidth = Math.min(grid.renderRect.width/grid.cols, grid.renderRect.height/grid.rows);
        for(var i=0;i<grid.rows;i++){
            for(var j=0;j<grid.cols;j++){
                this.context.fillRect(grid.renderRect.x + j*cellWidth+1, grid.renderRect.y + i*cellWidth+1, cellWidth-2, cellWidth-2);
            }
        }
	};


    BCHWMemoryGame.prototype.enterGameScreen = function(grid){
        this.clearContext();
        this.selectedGrid = grid;
        this.imagesManager = new BCHWMemoryGameImagesManager();
        var scope = this;
        this.imagesManager.loadImageList(function(){scope.imageListLoadCompleteHandler();});
    };


    BCHWMemoryGame.prototype.imageListLoadCompleteHandler = function(){
        //console.log("BCHWMemoryGame.imageListLoadCompleteHandler()");
        this.clearContext();
        var images = this.imagesManager.getRandomImages(this.selectedGrid.numCells()/2);
        this.imageStore = new BCHWImageStore();
        var scope = this;
        this.imageStore.loadImages(images, function(){scope.imageStoreLoadCompleteHandler()}, function(){scope.imageStoreProgressHandler()} );
    };

    BCHWMemoryGame.prototype.imageStoreProgressHandler = function(){
        this.clearContext();
        //this.imageStore.getProgressPercent();
        this.imageStore.getProgressString();
        this.context.textAlign = 'center';
        this.context.fillStyle = "#FFFFFF";
        this.context.font="30px Verdana";
        this.context.fillText(this.imageStore.getProgressString(), this.renderRect.getCenterX(), this.renderRect.getCenterY());
    };

    BCHWMemoryGame.prototype.imageStoreLoadCompleteHandler = function(){
        console.log("BCHWMemoryGame.imageStoreLoadCompleteHandler()");

        this.clearContext();

        //determine cell size
        var cellSize, spacer;
        cellSize = Math.min(this.renderRect.width / this.selectedGrid.cols, this.renderRect.height / this.selectedGrid.rows);
        spacer = cellSize*.1;
        cellSize -= spacer;
        this.cellSize = Math.floor(cellSize > BCHWMemoryGame.MAX_TILE_SIZE ? BCHWMemoryGame.MAX_TILE_SIZE : cellSize);
        this.cellRadius = cellSize*.1;

        var gridRect = new BCHWGeom.Rectangle(0,0,cellSize*this.selectedGrid.cols+spacer*(this.selectedGrid.cols-1), cellSize*this.selectedGrid.rows+spacer*(this.selectedGrid.rows-1));
        BCHWGeom.RectangleUtil.horizontalAlignMiddle(this.renderRect, gridRect);
        BCHWGeom.RectangleUtil.verticalAlignMiddle(this.renderRect, gridRect);

        //create and position cards
        this.cells = [];
        var i, j, cell;

        for(i=0;i<this.selectedGrid.rows;i++){
            for(j=0;j<this.selectedGrid.cols;j++){
                cell = new BCHWMemoryGameGridCell(gridRect.x + j*cellSize+ j*spacer, gridRect.y + i*this.cellSize+ i*spacer,
                                                    this.cellSize, this.cellSize, this.cellRadius,
                                                    null, this.context );
                this.cells.push(cell);
            }
        }

        this.clicksEnabled = false;
        var scope = this;
        this.cardPrep.prepareImage(this.cardBackImage, this.cellSize, this.cellRadius, function(cardImage){scope.bgCardPrepareComplete(cardImage)});
    }

    BCHWMemoryGame.prototype.bgCardPrepareComplete = function(cardImage){
        this.preparedBGCardImage = cardImage;
        this.preparedImages = [];
        this.currentImagePrepIndex = 0;
        var scope = this;
        this.renderCellsTimeOutId = setTimeout(function(){scope.prepareNextImage()},20);
    }

    BCHWMemoryGame.prototype.prepareNextImage = function(){
        //console.log("BCHWMemoryGame.prepareNextImage()");
        var image = this.imageStore.images[this.currentImagePrepIndex];
        var scope = this;
        this.cardPrep.prepareImage(image, this.cellSize, this.cellRadius, function(cardImage){scope.nextCellImagePrepComplete(cardImage)});
    };

    BCHWMemoryGame.prototype.nextCellImagePrepComplete = function(cardImage){
        console.log("BCHWMemoryGame.nextCellImagePrepComplete()");
        this.preparedImages.push(cardImage);
        this.currentImagePrepIndex++;
        if(this.currentImagePrepIndex==this.imageStore.images.length){
            this.gamePreparationReady();
        }else{
            var scope = this;
            this.renderCellsTimeOutId = setTimeout(function(){scope.prepareNextImage()},20);
        }
    }

    BCHWMemoryGame.prototype.createImagePairs = function(cardImage){
        //create pairs
        console.log("BCHWMemoryGame.createImagePairs()");
        var cells = this.cells.concat();

        console.log("\t","cells", cells.length);
        console.log("\t","images", this.preparedImages.length);

        var image;
        var index=0;
        while(this.preparedImages.length>0){
            image = this.preparedImages.splice(Math.floor(Math.random()*this.preparedImages.length), 1)[0];
            console.log("\timage==undefined : ",image==undefined)
            cell = cells.splice(Math.floor(Math.random()*cells.length), 1)[0];
            cell.image = image;
            cell.bgImage = this.preparedBGCardImage;
            cell.close();
            cell = cells.splice(Math.floor(Math.random()*cells.length), 1)[0];
            cell.image = image;
            cell.bgImage = this.preparedBGCardImage;
            cell.close();
            index++;
        }
    }

    BCHWMemoryGame.prototype.gamePreparationReady = function(){
        console.log("BCHWMemoryGame.gamePreparationReady()");
        this.createImagePairs();
        this.currentPair = [];
        this.numMatches = 0;
        var scope = this;
        this.gridCellClickListener = function(event){scope.gridCellClickHandler(event)};
        this.canvas.addEventListener("click", this.gridCellClickListener , false);
        this.clicksEnabled = true;
        this.startTime = new Date().getTime();
        this.numAttempts = 0;
    }

    BCHWMemoryGame.prototype.gridCellClickHandler = function(event){
        if(!this.clicksEnabled){
            return;
        }
        var x = event.pageX - this.canvasContainer.offsetLeft;
        var y = event.pageY - this.canvasContainer.offsetTop;
        //console.log("BCHWMemoryGame.gridCellClickHandler()", x,y);
        for(var i=0;i<this.cells.length;i++){
            if(this.cells[i].containsPoint(x, y) && !this.cells[i].isOpen){
                var flipper = this.getFlipper();
                this.cells[i].open(flipper);
                this.currentPair.push(this.cells[i]);
                if(this.currentPair.length==2){
                    var scope = this;
                    flipper.completeCallback = function(){scope.assessMatch()};
                    this.numAttempts++;
                }
                break;
            }
        }
    };

    BCHWMemoryGame.prototype.assessMatch = function(){
        var card1 = this.currentPair[0];
        var card2 = this.currentPair[1];
        var scope = this;
        if(card1.image.src == card2.image.src){
            this.currentPair = [];
            card1.showMatch();
            card2.showMatch();
            this.numMatches++;
            if(this.numMatches == this.imageStore.images.length ){
                //show anim
                this.clicksEnabled = false;
                setTimeout(function(){scope.enterWinScreen()}, 2000);
            }
        }else{
            this.clicksEnabled = false;
            this.currentPair[0].showMismatch();
            this.currentPair[1].showMismatch();
            setTimeout(function(){scope.handleMisMatch()}, BCHWMemoryGame.MISMATCH_INTERVAL);
        }
    };

    BCHWMemoryGame.prototype.handleMisMatch = function(){
        var card1 = this.currentPair[0];
        var card2 = this.currentPair[1];
        var flipper = this.getFlipper();
        card1.close(flipper);
        card2.close(this.getFlipper());
        this.currentPair = [];
        var scope = this;
        flipper.completeCallback = function(){scope.clicksEnabled = true};
    };

    BCHWMemoryGame.prototype.enterWinScreen = function(){
        this.clearContext();

        var gridRecord = this.recordManager.getGridRecord(this.selectedGrid);

        var gameDuration = new Date().getTime() - this.startTime;
        var seconds=Math.floor((gameDuration/1000)%60);
        var minutes=Math.floor((gameDuration/(1000*60))%60);
        var hours=Math.floor((gameDuration/(1000*60*60))%24);

        var summaryString = "It took you "+this.numAttempts+" tries and ";
        var timeString="";
        if(hours>0){
            timeString+=(hours+ "hours, ");
        }
        if(minutes>0){
            timeString+=(minutes+ "minutes, ");
        }
        if(timeString!=""){
            timeString+="and ";
        }
        timeString+=(seconds +"seconds");
        summaryString+=timeString;

        var newRecordTime = "";
        var newRecordTries = "";
        if(gameDuration < gridRecord.recordTime){
            gridRecord.recordTime = gameDuration;
            newRecordTime = "Congrats, new time record!";
        }
        if(this.numAttempts < gridRecord.recordTries){
            gridRecord.recordTries = this.numAttempts;
            newRecordTries = "Congrats, new record tries!";
        }

        this.context.textAlign = 'center';
        this.context.fillStyle = "#FFFFFF";
        this.context.font="30px Verdana";
        this.context.fillText("Congrats, YOU WIN!!!", this.renderRect.getCenterX(), this.renderRect.getCenterY());
        this.context.font="22px Verdana";
        this.context.fillText(summaryString, this.renderRect.getCenterX(), this.renderRect.getCenterY()+30);
        this.context.font="30px Verdana";
        if(gridRecord.gamesPlayed > 0){
            this.context.font="22px Verdana";
            if(newRecordTime!="" || newRecordTries!=""){
                this.context.fillStyle = BCHWColor.BCHWColorsLib.RED.getCanvasColorString();
                this.context.fillText(newRecordTime+" "+newRecordTries, this.renderRect.getCenterX(), this.renderRect.getCenterY()+60);
            }else{
                this.context.fillStyle = BCHWColor.BCHWColorsLib.ORANGE.getCanvasColorString();
                this.context.fillText("your record tries "+gridRecord.recordTries+": , your record time :"+gridRecord.recordTime, this.renderRect.getCenterX(), this.renderRect.getCenterY()+60);
            }
        }
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText("Click to play again.", this.renderRect.getCenterX(), this.renderRect.getBottom()-30);
        this.canvas.removeEventListener("click", this.gridCellClickListener , false);

        var scope = this;
        this.restartClickListener = function(event){scope.restartClickHandler(event)};
        this.canvas.addEventListener("click", this.restartClickListener , false);

        gridRecord.gamesPlayed++;
        this.gamesPlayed++;
    };

    BCHWMemoryGame.prototype.restartClickHandler = function(){
        this.canvas.removeEventListener("click", this.restartClickListener , false);
        this.reset();
    };

	window.BCHWMemoryGame = BCHWMemoryGame;


    //==========================::BCHWMemoryGameGrid::=============================
    var BCHWMemoryGameGrid = function(cols, rows){
        this.rows = rows;
        this.cols = cols;
        this.renderRect = new BCHWGeom.Rectangle();
    };
    BCHWMemoryGameGrid.prototype.numCells = function(){
        return this.rows * this.cols;
    };
    window.BCHWMemoryGameGrid = BCHWMemoryGameGrid;





    //==========================::BCHWMemoryGameImagesManager::=============================
    var BCHWMemoryGameImagesManager = function(){};

    BCHWMemoryGameImagesManager.prototype.loadImageList = function(callBack){
        //console.log("BCHWMemoryGameImagesManager.loadImageList()");
        this.request = null;
        this.request = new XMLHttpRequest();
        var _this = this;
        this.request.onreadystatechange = function(){_this.imagesListLoadedHandler()};
        //this.request.open( "GET", "http://bigcityhousewife.net/php/getFilesInDirectory.php?directory=..%2fassets%2fmemoryGame%2f", true );
        //this.themeFolder = "assets/memoryGame/";
        this.request.open( "GET", "http://bigcityhousewife.net/php/getFilesInDirectory.php?directory=..%2fassets%2fmemoryGame%2fxmas%2f", true );
        this.themeFolder = "assets/memoryGame/xmas/";
        this.request.send( null );
        this.imageListLoadedCallBack = callBack ? callBack : null;
    };

    BCHWMemoryGameImagesManager.prototype.imagesListLoadedHandler = function(){
        //console.log("BCHWMemoryGameImagesManager.imagesListLoadedHandler()", this.request.readyState, this.request.status);
        if ( this.request.readyState == 4 && this.request.status == 200 ){
            //console.log(this.request.responseText);
            this.imageList = eval ( this.request.responseText  );
            //console.log(this.imageList );

            this.request.onreadystatechange = null;
            if(this.imageListLoadedCallBack){
                this.imageListLoadedCallBack();
                this.imageListLoadedCallBack = null;
            }
        }
    };

    BCHWMemoryGameImagesManager.prototype.getRandomImages = function(total){
        if(total>this.imageList.length){
            //throw some nasty nasty error
            console.warn("BCHWMemoryGameImagesManager.getRandomImages() requested "+total+" is more than available images"+this.imageList.length);
        }
        var images = [];
        var copy = this.imageList.concat();
        console.log("BCHWMemoryGameImagesManager.getRandomImages() ", total, copy.length);
        for(var i=0; i<total; i++){
            images[i] = this.themeFolder+copy.splice(Math.floor(Math.random()*copy.length), 1)[0];
        }
        return images;

    };
    window.BCHWMemoryGameImagesManager = BCHWMemoryGameImagesManager;

    //==========================::BCHWMemoryGameRecordsManager::=============================
    var BCHWMemoryGameRecordsManager = function(){
        this.grids = [];
    };

    BCHWMemoryGameRecordsManager.prototype.addGrid = function(grid){
        var numCells = grid.numCells();
        if(this.grids[numCells] == undefined){
            this.grids[numCells] = new BCHWMemoryGameGridRecord();
        }
    };

    BCHWMemoryGameRecordsManager.prototype.getGridRecord = function(grid){
        return this.grids[grid.numCells()];
    };

    window.BCHWMemoryGameRecordsManager = BCHWMemoryGameRecordsManager;

    var BCHWMemoryGameGridRecord = function(){
        this.recordTime = Number.MAX_VALUE;
        this.recordTries = Number.MAX_VALUE;
        this.gamesPlayed = 0;
    };

    window.BCHWMemoryGameGridRecord = BCHWMemoryGameGridRecord;

}(window));