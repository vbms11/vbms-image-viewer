/**
 * this software is copyright menta software gmbh.
 * you may not use or alter the code for your own purposes
 */


$.widget( "custom.imageViewer", {
    
    // default options
    options: {
	width : "500",
	height : "500",
	imageUrl : null,
	language : 'en'
    },
    
    imageIndex : null,
    image : null,
    //
    zoom : 1,
    zoomStep : 0.1,
    minZoom : 0.10,
    maxZoom : 5.0,
    rotation : 0,
    //
    imgWidth : null,
    imgHeight : null,
    scrollTop : 0,
    scrollLeft : 0,
    // 
    mouseXY : null,
    selected : false,
    selection : null,
    mouseOver : false,
    blockEvents : false,
    // 
    drawCtx : null,
    markCtx : null,
    lines : new Array(),
    lineRatio : -1,
    // 
    imgClass : "iv_image",
    baseClass : "iv_base",
    bodyClass : "iv_body",
    drawClass : "iv_drawLayer",
    markClass : "iv_markLayer",
    fadeClass : "_fade",
    eventClass : "iv_eventLayer",
    frameClass : "iv_frame",
    canvasClass : "iv_canvas",
    headerClass : "_header",
    messageClass : "iv_message",
    lengthInputClass : "_lengthInput",
    lengthPanelClass : "_lengthPanel",
    bg_button : 'iv_buttonBg',
    bg_buttonSelected : 'iv_buttonBgSelected',
    btn_diashowClass : "iv_filmstripdiashow",
    btn_filmstripClass : "iv_filmstriptoggle",
    btn_zoomSelectionClass : "iv_zoomSelection",
    btn_moveClass : "iv_move",
    btn_mesureClass : "iv_mesure",
    btn_zoomInClass : "iv_zoomIn",
    btn_zoomOutClass : "iv_zoomOut",
    btn_prevClass : "iv_prev",
    btn_nextClass : "iv_next",
    btn_clearClass : "iv_clear",
    btn_fullscreen : "iv_fullscreen",
    btn_fullscreenRestore : "iv_restore",
    msg_fullscreenRestore : "iv_restoreMessage",
    // defined modes
    mode_move : 1,
    mode_zoom : 2,
    mode_draw : 3,
    mode : 1,
    // curors
    cur_openHandClass : 'iv_cursorOpenHand',
    cur_closedHandClass : 'iv_cursorClosedHand',
    cur_crosshair : 'iv_cursorCrosshair',
    // 
    fullscreen : false,
    originalWidth : '',
    originalHeight : '',
    //
    IE : document.all ? true : false,
    // events
    refreshEvent : null,
    //
    center : null,
    moved : null,
    // film strip
    filmStripThumbs : null,
    filmStripImages : null,
    filmStrip : false,
    filmStripHeight : 166,
    filmStripPosition : 0,
    filmStripThumbSize : 160,
    filmStripButtonWidth : 30,
    filmStripClass : "_filmstrip",
    filmStripSliderClass : "_filmstripslider",
    filmStripRangeFunc : null,
    filmStripImageFunc : null,
    filmStripLength : null,
    filmStripLarge : false,
    filmStripCacheStart : 0,
    filmStripCacheSize : 50,
    filmStripSelectionListener : null,
    filmStripHorizontal : true,
    filmStripSliderLength : null,
    showNextPreviousButtons : false,
    // dia show
    diaShowButton : false,
    diaShow : false,
    diaShowTimer : null,
    diaShowTime : 5000,
    // key handeling
    ivCtrlKeyDown : false,
    selectedToolId : null,
    
    // the constructor
    _create: function () {
        this.element
            // add a class for theming
            .addClass("imageViewer")
            // prevent double click to select text
            .disableSelection();
        this.attach();
        this._refresh();
    },
    
    // called when created, and later when changing options
    _refresh : function () {
        // trigger a callback/event
        this._trigger("refreshEvent");
    },

    // revert modifications here
    _destroy : function () {
        this.element
            .removeClass("imageViewer")
            .empty()
            .enableSelection();
    },

    // _setOptions is called with a hash of all options that are changing
    _setOptions : function () {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
    _setOption : function (key, value) {
        switch (key) {
            case "imageUrl":
                this.changeImage(value);
                break;
            case "width":
                this.options.width = width;
                this.resize(this.options.width,this.options.height);
                break;
            case "height":
                this.options.height = height;
                this.resize(this.options.width,this.options.height);
                break;
            default:
                this._super(key, value);
        }
    },
    
    /*
     * Image Viewer Methods
     */
    
    // init
    attach : function () {
        
        var thisObject = this;
        
        // insert base elements
        var iv_header = $("<div>",{"class" : "iv_header"})
            .append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg"})
                .append($("<div>",{
                    "class" : "iv_button iv_rotateLeft",
                    "title" : this.getTranslation('iv.rotate.left')
                }).click(function(){
                    thisObject.rotateLeft();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button iv_rotateRight",
                    "title" : this.getTranslation('iv.rotate.right')
                }).click(function(){
                    thisObject.rotateRight();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_zoomInClass,
                    "title" : this.getTranslation('iv.zoom.in')
                }).click(function(){
                    thisObject.zoomIn();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_zoomOutClass,
                    "title" : this.getTranslation('iv.zoom.out')
                }).click(function(){
                    thisObject.zoomOut();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg"})
                .append($("<div>",{
                    "class" : "iv_button iv_1-1",
                    "title" : this.getTranslation('iv.zoom.11')
                }).click(function(){
                    thisObject.zoomReset();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button iv_expand",
                    "title" : this.getTranslation('iv.zoom.fit')
                }).click(function(){
                    thisObject.zoomToFit();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_zoomSelectionClass,
                    "title" : this.getTranslation('iv.zoom.selection')
                }).click(function(){
                    thisObject.selectZoomMode();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_moveClass,
                    "title" : this.getTranslation('iv.move')
                }).click(function(){
                    thisObject.selectMoveMode();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_mesureClass,
                    "title" : this.getTranslation('iv.mesure.draw')
                }).click(function(){
                    thisObject.selectMesureMode();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_clearClass,
                    "title" : this.getTranslation('iv.mesure.clear')
                }).click(function(){
                    thisObject.onClearLines();
                }))
            ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button iv_window",
                    "title" : this.getTranslation('iv.window')
                }).click(function(){
                    thisObject.showInWindow();
                }))
            );
        
        if (this.filmStripThumbs !== null || this.filmStripLarge === true) {
            iv_header.append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_filmstripClass,
                    "title" : this.getTranslation('iv.filmstrip')
                }).click(function(){
                    thisObject.toggelFilmStrip();
                }))
            );
        }
    
        if (this.diaShowButton) {
            iv_header.append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_diashowClass,
                    "title" : this.getTranslation('iv.diashow')
                }).click(function(){
                    thisObject.toggleDiaShow();
                }))
            );
        }
        
        if (this.showNextPreviousButtons) {
            iv_header
                .append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg"})
                    .append($("<div>",{
                        "class" : "iv_button "+this.btn_prevClass,
                        "title" : this.getTranslation('iv.previmage')
                    }).click(function(){
                        thisObject.previousImage();
                    }))
                ).append($("<div>",{"class" : "iv_buttonLeft iv_buttonBg iv_buttonSpacing"})
                    .append($("<div>",{
                        "class" : "iv_button "+this.btn_nextClass,
                        "title" : this.getTranslation('iv.nextimage')
                    }).click(function(){
                        thisObject.nextImage();
                    }))
                );
        }
        
        iv_header
            .append($("<div>",{"class" : this.messageClass}))
            .append($("<div>",{"class" : "iv_buttonRight iv_buttonBg"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_fullscreen,
                    "title" : this.getTranslation('iv.fullscreen')
                }).click(function(){
                    thisObject.toggelFullscreenMode();
                }))
            ).append($("<div>",{"class" : "iv_buttonRight iv_buttonBg iv_buttonBgSelected"})
                .append($("<div>",{
                    "class" : "iv_button "+this.btn_fullscreenRestore,
                    "title" : this.getTranslation('iv.restore')
                }).click(function(){
                    thisObject.toggelFullscreenMode();
                }))
            ).append($("<div>",{"class" : this.msg_fullscreenRestore})
                .append($("<b>",{text : this.getTranslation('iv.restore')}))
            );
	
        $("<div>",{"class" : "iv_base"})
            .append(iv_header)
            .append($("<div>",{"class" : this.bodyClass}))
            .appendTo(this.element);
        
        // set tool enabled state
        if (this.showNextPreviousButtons)
            this.refreshNextPrevButtonState();
        if (this.diaShowButton && this.filmStripLength === 1)
            this.setToolDisabled(this.btn_diashowClass);
        this.setToolDisabled(this.btn_clearClass);
        
        // size to initial size
        this.resize(this.options.width,this.options.height);
        
        // prelaod image
        this.image = new Image();
        this.image.src = this.options.imageUrl;
        this.completeAttach();
    },
    
    completeAttach : function () {
        
        var thisObject = this;
        
        // wait for image to complete loading
        if (!this.image.complete) {
            if (this.element.find("."+this.bodyClass) !== null) {
                window.setTimeout(function(){
                    thisObject.completeAttach();
                },100);
            }
            return;
        }
        // load image into browsers
        this.imgWidth = this.image.width;
        this.imgHeight = this.image.height;
        var el_frame = $("<div>",{"class" : this.frameClass})
            .appendTo(this.element.find("."+this.bodyClass));
        
        // add panel to display image
        if (this.IE) {
            el_frame.append($("<img>",{
                "class" : this.imgClass, 
                "width" : this.imgWidth,
                "height" : this.imgHeight,
                "src" : this.options.imageUrl
            }));
        } else {
            el_frame.append($("<img>",{
                "class" : this.canvasClass, 
                "width" : this.imgWidth,
                "height" : this.imgHeight
            }));
        }
        
        // add layers for drawing and to receive events
        el_frame.append($("<div>",{
            "class" : this.drawClass
        })).append($("<div>",{
            "class" : this.markClass
        })).append($("<div>",{
            "class" : this.eventClass,
            "tabindex" : 0
        }).mousemove(function(event){
            thisObject.onMouseOver(event);
        }).mouseout(function(event){
            thisObject.onMouseOut(event);
        }).mousedown(function(event){
            thisObject.onMouseSelect(event);
            this.focus();
            return false;
        }).mouseup(function(event){
            thisObject.onMouseRelease(event);
        }).mousemove(function(event){
            thisObject.onMouseMove(event);
            return false;
        }).dblclick(function(event){
            thisObject.onMouseDoubleClick(event);
        }));
        
        // add event listeners
        this.attachKeyListener();
        this.attachMouseWheelListener();
        
        // set initial state
        this.zoomToFit();
        this.selectMoveMode();
    },

    changeImage : function (imageUrl) {
        
        // if image is the same do nothing
        if (this.options.imageUrl === imageUrl)
            return;
        
        // set button states
        if (this.showNextPreviousButtons)
            this.refreshNextPrevButtonState();
        
        this.onClearLines();
        
        // change the image
        this.options.imageUrl = imageUrl;
        this.image = new Image();
        this.image.src = this.options.imageUrl;
        this.completeChangeImage();
    },

    completeChangeImage : function () {
        
        // wait for image to complete loading
        if (!this.image.complete) {
            if (this.element.find("."+this.bodyClass) !== null) {
                var thisObject = this;
                setTimeout(function(){
                    thisObject.completeChangeImage();
                },100);
            }
            return;
        }
        
        // save image width, height
        this.imgWidth = this.image.width;
        this.imgHeight = this.image.height;
        
        // change image
        if (this.IE) {
            this.element.find("."+this.imgClass).attr({
                "src" : this.options.imageUrl,
                "width" : this.imgWidth,
                "height" : this.imgHeight
            });
        } else {
        }
        
        // set state
        this.zoomToFit();
    },

    // resize the image viewer
    resize : function (width,height) {
        
        this.saveViewCenter();
        if (this.fullscreen) {
            var winDim = getWindowDimensions();
            width = winDim[0];
            height = winDim[1];
        }
        this.options.width = width;
        this.options.height = height;
        this.element.find("."+this.baseClass).css({
            "width" : width + "px",
            "height" : height + "px"
        });
        var el_header = this.element.find("."+this.headerClass).css({
            "width" : width + "px"
        });
        var el_body = this.element.find("."+this.bodyClass);
        if (this.filmStrip) {
            if (this.filmStripHorizontal) {
                el_body.css({
                    "height" : height - (el_header.height() + this.filmStripHeight) + "px",
                    "width" : width + "px"
                });
            } else {
                el_body.css({
                    "height" : height - el_header.height() + "px",
                    "width" : width - this.filmStripHeight + "px"
                });
            }
            this.resizeFilmStrip();
        } else {
            el_body.css({
                "height" : height - el_header.height() + "px",
                "width" : width + "px"
            });
        }
        this.loadViewCenter();
    },
    
    resizeLayers : function () {
		//
		var el_draw = document.getElementById(this.elId+this.drawClass);
		var el_event = document.getElementById(this.elId+this.eventClass);
		var el_frame = document.getElementById(this.elId+this.frameClass);
		if (el_draw) {
			if (this.rotation==0 || this.rotation==180) {
				el_event.style.width = el_draw.style.width = Math.floor(this.imgWidth * this.zoom) + "px";
				el_event.style.height = el_draw.style.height = Math.floor(this.imgHeight * this.zoom) + "px";
			} else {
				el_event.style.width = el_draw.style.width = Math.floor(this.imgHeight * this.zoom) + "px";
				el_event.style.height = el_draw.style.height = Math.floor(this.imgWidth * this.zoom) + "px";
			}
			el_frame.style.width = el_draw.offsetWidth + "px";
			el_frame.style.height = el_draw.offsetHeight + "px";
		}
    },

    // scrolling
    setScroll : function (scrollLeft,scrollTop) {
        
        // check scroll is in bounds
        var el_body = this.element.find("."+this.bodyClass);
        if (this.rotation === 90 || this.rotation === 270) {
            if ((this.imgHeight * this.zoom) - scrollLeft < el_body.width()) {
                scrollLeft = this.imgHeight * this.zoom - el_body.width();
            }
            if ((this.imgWidth * this.zoom) - scrollTop < el_body.height()) {
                scrollTop = this.imgWidth * this.zoom - el_body.height();
            }
        } else {
            if ((this.imgWidth * this.zoom) - scrollLeft < el_body.width()) {
                scrollLeft = this.imgWidth * this.zoom - el_body.width();
            }
            if ((this.imgHeight * this.zoom) - scrollTop < el_body.height()) {
                scrollTop = this.imgHeight * this.zoom - el_body.height();
            }
        }
        if (scrollLeft < 0) {
            scrollLeft = 0;
        }
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        
        // apply scroll
        this.scrollLeft = Math.floor(scrollLeft);
        this.scrollTop = Math.floor(scrollTop);
        var el_frame = this.element.find("."+this.frameClass);
        if (el_frame !== null) {
            el_frame.css({
                "left" : -scrollLeft + "px",
                "top" : -scrollTop + "px"
            });
        }
    },

    // view position saving and loading
    saveViewCenter : function () {
        var el_body = this.element.find("."+this.bodyClass);
        this.center = [Math.floor(((el_body.width()/2)+this.scrollLeft)/this.zoom),
            Math.floor(((el_body.height()/2)+this.scrollTop)/this.zoom)];
    },

    loadViewCenter : function () {
        var el_body = this.element.find("."+this.bodyClass);
        this.setScroll((this.center[0]*this.zoom)-(el_body.width()/2),(this.center[1]*this.zoom)-(el_body.height()/2));
    },
    
    saveSelectionAsCenter : function (e) {
        var el_body = document.getElementById(this.elId+this.bodyClass);
        var el_draw = document.getElementById(this.elId+this.drawClass);
        this.mouseXY = this.getMouseXY(e);
        this.center = [((this.mouseXY[0]-this.getLeft(el_body))+this.scrollLeft)/this.zoom,
            ((this.mouseXY[1]-this.getTop(el_body))+this.scrollTop)/this.zoom];
    },
    
    rotateViewCenter : function (rotation) {
		
		// rotate back to original position
		var realCenter;
		if (this.rotation==0)
			realCenter = this.center;
		if (this.rotation==90)
			realCenter = [this.center[1],this.imgHeight-this.center[0]];
		else if (this.rotation==180)
			realCenter = [this.imgWidth-this.center[0],this.imgHeight-this.center[1]];
		else if (this.rotation==270)
			realCenter = [this.imgWidth-this.center[1],this.center[0]];
		
		// calculate next rotation
		var nextRotation = this.rotation + rotation;
		if (nextRotation >= 360)
			nextRotation -= 360;
		
		// apply rotation
		if (nextRotation==0)
			this.center = realCenter;
		if (nextRotation==90)
			this.center = [this.imgHeight-realCenter[1],realCenter[0]];
		else if (nextRotation==180)
			this.center = [this.imgWidth-realCenter[0],this.imgHeight-realCenter[1]];
		else if (nextRotation==270)
			this.center = [realCenter[1],this.imgWidth-realCenter[0]];
    },
    
    // for non ie, paints image to canvas function
    paintCanvas : function (canvasId,image,zoom,rotation) {
		var el_canvas = document.getElementById(canvasId);
		var ctx = el_canvas.getContext("2d");
		ctx.save();
		switch (rotation) {
			case 0:
				el_canvas.width = image.width * zoom;
				el_canvas.height = image.height * zoom;
				ctx.drawImage(image,0,0,image.width*zoom,image.height*zoom);
				break;
			case 90:
				el_canvas.width = image.height * zoom;
				el_canvas.height = image.width * zoom;
				ctx.translate(image.height*zoom-1,0);
				ctx.rotate(rotation * Math.PI / 180);
				ctx.drawImage(image,0,0,image.width*zoom,image.height*zoom);
				break;
			case 180:
				el_canvas.width = image.width * zoom;
				el_canvas.height = image.height * zoom;
				ctx.translate(image.width*zoom-1,image.height*zoom-1);
				ctx.rotate(rotation * Math.PI / 180);
				ctx.drawImage(image,0,0,image.width*zoom,image.height*zoom);
				break;
			case 270:
				el_canvas.width = image.height * zoom;
				el_canvas.height = image.width * zoom;
				ctx.translate(0,image.width*zoom-1);
				ctx.rotate(rotation * Math.PI / 180);
				ctx.drawImage(image,0,0,image.width*zoom,image.height*zoom);
				break;
		}
    },

    // simple image zooming
    zoomIn : function (steps) {
		if (!steps)
			steps = 1;
		this.saveViewCenter();
		if (this.zoom < this.maxZoom) {
			var zoomIncrease = (this.imgWidth * this.zoom) * (this.zoomStep * steps);
			var zoomValue = ((this.imgWidth * this.zoom) + zoomIncrease) / this.imgWidth;
			this.zoom = zoomValue;
		}
		if (this.zoom >= this.maxZoom)
			this.zoom = this.maxZoom;
		this.refreshZoomButtonState();
		this.applyZoomCenter();
    },
    
    zoomOut : function (steps) {
		if (!steps)
			steps = 1;
		this.saveViewCenter();
		if (this.zoom > this.minZoom) {
			var zoomDecrease = (this.imgWidth * this.zoom) * (this.zoomStep * steps);
			var zoomValue = ((this.imgWidth * this.zoom) - zoomDecrease) / this.imgWidth;
			this.zoom = zoomValue;
		}
		if (this.zoom <= this.minZoom)
			this.zoom = this.minZoom;
		this.refreshZoomButtonState();
		this.applyZoomCenter();
    },

    zoomReset : function () {
		this.zoom = 1;
		var el_body = document.getElementById(this.elId+this.bodyClass);
		this.setScroll(0,0);
		this.applyZoom(this.IE?(this.elId+this.imgClass):(this.elId+this.canvasClass),this.image,this.zoom);
		this.refreshZoomButtonState();
    },
    
    zoomToFit : function (targetId,image) {
		if (targetId == undefined || image == undefined) {
			this.zoom = this.getFitZoom(this.image);
			this.applyZoom(this.IE?(this.elId+this.imgClass):(this.elId+this.canvasClass),this.image,this.zoom);
		} else {
			var zoom = this.getFitZoom(image);
			this.applyZoom(targetId,image,zoom);
		}
		this.refreshZoomButtonState();
    },
    
    getFitZoom : function (image) {
		var el_body = document.getElementById(this.elId+this.bodyClass);
		this.setScroll(0,0);
		if (this.rotation==0 || this.rotation==180) {
			var xRatio = el_body.offsetWidth / image.width;
			var yRatio = el_body.offsetHeight / image.height;
		} else {
			var xRatio = el_body.offsetWidth / image.height;
			var yRatio = el_body.offsetHeight / image.width;
		}
		var zoom = xRatio < yRatio ? xRatio : yRatio;
		if (zoom > this.maxZoom)
			zoom = this.maxZoom;
		return zoom;
    },
    
    zoomSelection : function (e) {
		this.saveSelectionAsCenter(e);
		if (this.zoom < this.maxZoom) {
			var zoomIncrease = (this.imgWidth * this.zoom) * (this.zoomStep * 2);
			var zoomValue = ((this.imgWidth * this.zoom) + zoomIncrease) / this.imgWidth;
			this.zoom = zoomValue;
		}
		if (this.zoom > this.maxZoom)
			this.zoom = this.maxZoom;
		this.refreshZoomButtonState();
		this.applyZoomCenter();
    },
    
    applyZoom : function (targetId,image,zoom) {
		// set size of layers
		this.resizeLayers();
		this.redrawLines();
		// 
		if (this.IE) {
			// resize image
			var el_img = document.getElementById(targetId);
			el_img.style.zoom = Math.round(100*zoom) + "%";
		} else {
			this.paintCanvas(targetId,image,zoom,this.rotation);
		}
		// set zoom value message
		this.renderZoomMessage();
    },
    
    applyZoomCenter : function () {
		// clear lines now so they dont jump
		this.clearDrawContext();
		this.clearMarkContext();
		//
		if (this.IE) {
			// resize image
			var el_img = document.getElementById(this.elId+this.imgClass);
			el_img.style.zoom = Math.round(100*this.zoom) + "%";
		} else {
			this.paintCanvas(this.IE?(this.elId+this.imgClass):(this.elId+this.canvasClass),this.image,this.zoom,this.rotation);
		}
		this.loadViewCenter();
		// set size of layers
		this.resizeLayers();
		this.redrawLines();
		// set zoom value message
		this.renderZoomMessage();
    },

    renderZoomMessage : function () {
		var zoomMsg = (Math.round(100*this.zoom)) + "%";
		if (this.options.language == "de") zoomMsg = "Zoom: " + zoomMsg;
		else zoomMsg = "zoom: " + zoomMsg;
		document.getElementById(this.elId+this.messageClass).innerHTML = zoomMsg;
    },

    // image rotation
    rotateRight : function () {
		this.saveViewCenter();
		this.rotateViewCenter(90);
		this.rotation = this.rotation + 90;
		this.applyRotation();
		this.loadViewCenter();
    },
    
    rotateLeft : function () {
		this.saveViewCenter();
		this.rotateViewCenter(270);
		this.rotation = this.rotation - 90;
		this.applyRotation();
		this.loadViewCenter();
    },
    
    applyRotation : function () {
		// 
		if (this.rotation>=360) {
			this.rotation = this.rotation - 360;
		} else if (this.rotation<0) {
			this.rotation = this.rotation + 360;
		}
		// 
		if (this.IE) {
			var el_img = document.getElementById(this.elId+this.imgClass);
			el_img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation="+this.rotation/90+");";
		} else {
			this.paintCanvas(this.IE?(this.elId+this.imgClass):(this.elId+this.canvasClass),this.image,this.zoom,this.rotation);
		}
		this.applyZoom(this.IE?(this.elId+this.imgClass):(this.elId+this.canvasClass),this.image,this.zoom);
    },

    // image draging
    selectMoveMode : function () {
        this.mode = this.mode_move;
        this.element.find("."+this.eventClass)
            .removeClass(this.cur_closedHand)
            .removeClass(this.cur_crosshair)
            .addClass(this.cur_openHand);
        this.setToolSelection(this.btn_moveClass);
    },

    onImageSelect : function (e) {
        this.mouseXY = this.getMouseXY(e);
        this.selected = true;
        this.moved = false;
        this.element.find("."+this.eventClass)
            .removeClass(this.cur_openHand)
            .addClass(this.cur_closedHand);
    },
    
    onImageMove : function (e) {
        if (!this.selected)
            return;
        this.moved = true;
        var newXY = this.getMouseXY(e);
        this.setScroll(this.scrollLeft - (newXY[0] - this.mouseXY[0]),this.scrollTop - (newXY[1] - this.mouseXY[1]));
        this.mouseXY = newXY;
    },
    
    onImageRelease : function (e) {
        this.selected = false;
        this.element.find("."+this.eventClass)
            .removeClass(this.cur_closedHand)
            .addClass(this.cur_openHand);
    },
    
    // mesure mode
    selectMesureMode : function () {
        this.mode = this.mode_draw;
        this.element.find("."+this.eventClass)
            .removeClass(this.cur_closedHand)
            .removeClass(this.cur_openHand)
            .addClass(this.cur_crosshair);
        this.setToolSelection(this.btn_mesureClass);
    },
    
    onStartMesure : function (e) {
		this.selection = this.mouseXY = this.getMouseXY(e);
		var el_draw = document.getElementById(this.elId+this.drawClass);
		var el_body = document.getElementById(this.elId+this.bodyClass);
		this.selection[0] = this.selection[0] - this.getLeft(el_draw);
		this.selection[1] = this.selection[1] - this.getTop(el_draw);
		this.selected = true;
    },
    
    onMoveMesure : function (e) {
		if (!this.selected)
			return;
		this.mouseXY = this.getMouseXY(e);
		var el_draw = document.getElementById(this.elId+this.drawClass);
		var el_body = document.getElementById(this.elId+this.bodyClass);
		this.mouseXY[0] = this.mouseXY[0] - this.getLeft(el_draw);
		this.mouseXY[1] = this.mouseXY[1] - this.getTop(el_draw);
		this.clearMarkContext();
		this.markCtx.setColor("#00ff00");
		this.markCtx.drawLine(this.selection[0],this.selection[1],this.mouseXY[0],this.mouseXY[1]);
		this.markCtx.paint();
    },

    onEndMesure : function () {
		if (!this.selected)
			return;
		this.selected = false;
		// add the new line
		var x = (this.mouseXY[0]/this.zoom) - (this.selection[0]/this.zoom);
		var y = (this.mouseXY[1]/this.zoom) - (this.selection[1]/this.zoom);
		var len = Math.floor(Math.sqrt((x * x) + (y * y)) * 100) / 100;
		if (len == 0)
			return;
		var newLine = [this.selection[0]/this.zoom,this.selection[1]/this.zoom,this.mouseXY[0]/this.zoom,this.mouseXY[1]/this.zoom,len];
		newLine = this.correctLineRotation(newLine,360-this.rotation);
		this.lines.push(newLine);
		// ask user how long the line is
		if (this.lineRatio==-1) {
			this.showMesureLengthPanel();
		} else {
			// redraw lines
			this.redrawLines();
		}
    },

    onCancelMesure : function () {
		this.clearMarkContext();
		this.selected = false;
    },
    
    showMesureLengthPanel : function () {
		this.blockEvents = true;
		this.lineRatio = -1;
		var el_body = document.getElementById(this.elId+this.bodyClass);
		var el_lengthPanel = document.createElement("div");
		el_lengthPanel.setAttribute("id", this.elId+this.lengthPanelClass);
		el_body.appendChild(el_lengthPanel);
		el_lengthPanel.className = "iv_lengthPanel";
		el_lengthPanel.innerHTML = 
			" "+this.getTranslation("iv.measure.input.length")+": "+
			"<input type=\"text\" id=\""+this.elId+this.lengthInputClass+"\" onKeyPress=\""+this.elId+".commitMesureLengthOnEnter(event);\" tabindex='0'/>"+
			"<input type=\"button\" onclick=\""+this.elId+".commitMesureLength(); return false;\" value=\""+this.getTranslation("iv.measure.button.apply")+"\"/>"+
			"<input type=\"button\" onclick=\""+this.elId+".cancelMesureLengthPanel(); return false;\" value=\""+this.getTranslation("iv.measure.button.cancel")+"\"/>";
		document.getElementById(this.elId+this.lengthInputClass).focus(); 
    },
    
    hideMesureLengthPanel : function () {
		this.blockEvents = false;
		var el_lengthPanel = document.getElementById(this.elId+this.lengthPanelClass);
		if (el_lengthPanel != null)
			el_lengthPanel.parentNode.removeChild(el_lengthPanel);
    },
    
    commitMesureLength : function () {
		var value = document.getElementById(this.elId+this.lengthInputClass).value;
		if (value=="0" || value=="")
			value = "1";
		value = parseFloat(value);
		if (isNaN(value)) {
			alert(this.getTranslation("iv.measure.error.nan"));
		} else {
			this.lineRatio = this.lines[0][4] / value;
			this.redrawLines();
			this.hideMesureLengthPanel();
		}
		this.clearToolDisabled(this.elId+this.btn_clearClass);
    },

    commitMesureLengthOnEnter : function (event) {
		if (!event)
			event = window.event;
		if (event.which == 13 || event.keyCode == 13) { // return
			this.commitMesureLength();
		}
    },
    
    cancelMesureLengthPanel : function () {
		this.hideMesureLengthPanel();
		this.onCancelMesure();
		this.onClearLines();
    },
    
    rotateLine : function (line,rotation) {
		if (rotation==0)
			return line;
		if (rotation==90)
			return [this.imgHeight-line[1],line[0],this.imgHeight-line[3],line[2],line[4]];
		if (rotation==180)
			return [this.imgWidth-line[0],this.imgHeight-line[1],this.imgWidth-line[2],this.imgHeight-line[3],line[4]];
		if (rotation==270)
			return [line[1],this.imgWidth-line[0],line[3],this.imgWidth-line[2],line[4]];
    },
    
    correctLineRotation : function (line,rotation) {
		if (rotation==0 || rotation==360)
			return line;
		if (rotation==90)
			return [this.imgWidth-line[1],line[0],this.imgWidth-line[3],line[2],line[4]];
		if (rotation==180)
			return [this.imgWidth-line[0],this.imgHeight-line[1],this.imgWidth-line[2],this.imgHeight-line[3],line[4]];
		if (rotation==270)
			return [line[1],this.imgHeight-line[0],line[3],this.imgHeight-line[2],line[4]];
    },
    
    redrawLines : function () {
		this.clearDrawContext();
		this.clearMarkContext();
		// if mesure length panel is visible close it and dont draw lines
		if (this.lineRatio != -1) {
			for (var i=0; i<this.lines.length; i++) {
				var line = this.lines[i];
				var points = this.rotateLine(line,this.rotation);
				this.drawCtx.setColor("#0000ff");
				this.drawCtx.drawLine(points[0]*this.zoom,points[1]*this.zoom,points[2]*this.zoom,points[3]*this.zoom);
				this.drawCtx.setColor("#ff0000");
				var len = ""+Math.floor((line[4]/this.lineRatio)*100)/100;
				if (this.options.language == "de")
					len.replace(".",",");
				this.drawCtx.drawString(len,((points[0]*this.zoom)+(points[2]*this.zoom))/2,((points[1]*this.zoom)+(points[3]*this.zoom))/2);
			}
			this.drawCtx.paint();
		} else {
			this.cancelMesureLengthPanel();
		}
    },
    
    clearDrawContext : function () {
		if (this.drawCtx != null)
			this.drawCtx.clear();
		document.getElementById(this.elId+this.drawClass).innerHTML = "";
		this.drawCtx = new jsGraphics(this.elId+this.drawClass);
    },
    
    clearMarkContext : function () {
		if (this.markCtx != null)
			this.markCtx.clear();
		document.getElementById(this.elId+this.markClass).innerHTML = "";
		this.markCtx = new jsGraphics(this.elId+this.markClass);
    },
    
    onClearLines : function () {
		this.clearDrawContext();
		while (this.lines.length!=0)
			this.lines.pop();
		this.lineRatio = -1;
		this.setToolDisabled(this.elId+this.btn_clearClass);
    },
    
    // zoom selection mode
    selectZoomMode : function () {
		this.mode = this.mode_zoom;
		document.getElementById(this.elId+this.eventClass).style.cursor = "crosshair";
		this.setToolSelection(this.btn_zoomSelectionClass);
    },
    
    onStartZoom : function (e) {
		var el_draw = document.getElementById(this.elId+this.drawClass);
		var el_body = document.getElementById(this.elId+this.bodyClass);
		// set selection start point
		this.selection = this.getMouseXY(e);
		this.selection[0] = this.selection[0] - this.getLeft(el_draw);
		this.selection[1] = this.selection[1] - this.getTop(el_draw);
		// set selection end point as start point
		this.mouseXY = this.getMouseXY(e);
		this.mouseXY[0] = this.mouseXY[0] - this.getLeft(el_draw);
		this.mouseXY[1] = this.mouseXY[1] - this.getTop(el_draw);
		this.selected = true;
    },
    
    onMoveZoom : function (e) {
		if (!this.selected)
			return;
		this.mouseXY = this.getMouseXY(e);
		var el_draw = document.getElementById(this.elId+this.drawClass);
		var el_body = document.getElementById(this.elId+this.bodyClass);
		this.mouseXY[0] = this.mouseXY[0] - this.getLeft(el_draw);
		this.mouseXY[1] = this.mouseXY[1] - this.getTop(el_draw);
		this.clearMarkContext();
		this.markCtx.setColor("#00ff00");
		this.markCtx.drawLine(this.selection[0],this.selection[1],this.mouseXY[0],this.selection[1]);
		this.markCtx.drawLine(this.selection[0],this.selection[1],this.selection[0],this.mouseXY[1]);
		this.markCtx.drawLine(this.mouseXY[0],this.selection[1],this.mouseXY[0],this.mouseXY[1]);
		this.markCtx.drawLine(this.selection[0],this.mouseXY[1],this.mouseXY[0],this.mouseXY[1]);
		this.markCtx.paint();
    },

    onEndZoom : function (e) {
		this.clearMarkContext();
		this.selected = false;
		var el_body = document.getElementById(this.elId+this.bodyClass);
		// find start and end point pixel coords
		var start = [this.selection[0]<this.mouseXY[0]?this.selection[0]/this.zoom:this.mouseXY[0]/this.zoom,this.selection[1]<this.mouseXY[1]?this.selection[1]/this.zoom:this.mouseXY[1]/this.zoom];
		var end = [this.selection[0]>this.mouseXY[0]?this.selection[0]/this.zoom:this.mouseXY[0]/this.zoom,this.selection[1]>this.mouseXY[1]?this.selection[1]/this.zoom:this.mouseXY[1]/this.zoom];
		// if area selected equals 0 do nothing
		if (this.selection[0] == this.mouseXY[0] && this.selection[1] == this.mouseXY[1]) {
			this.saveSelectionAsCenter(e);
			this.loadViewCenter();
			return false;
		}
		// find min zoom and apply
		var xRatio = el_body.offsetWidth / (end[0] - start[0]);
		var yRatio = el_body.offsetHeight / (end[1] - start[1]);
		var viewSize = new Array(2);
		if (xRatio < yRatio) {
			viewSize[0] = (end[0] - start[0])
			viewSize[1] = el_body.offsetHeight / xRatio;
			this.zoom = xRatio;
		} else {
			viewSize[0] = el_body.offsetWidth / yRatio;
			viewSize[1] = (end[1] - start[1]);
			this.zoom = yRatio;
		}
		if (this.zoom>this.maxZoom) {
			this.zoom = this.maxZoom;
			viewSize[0] = el_body.offsetWidth / this.zoom;
			viewSize[1] = el_body.offsetHeight / this.zoom;
		}
		this.refreshZoomButtonState();
		this.applyZoom(this.IE?(this.elId+this.imgClass):(this.elId+this.canvasClass),this.image,this.zoom);
		// put center of selection in center of view
		var center = [((end[0]-start[0])/2)+start[0],((end[1]-start[1])/2)+start[1]];
		this.setScroll((center[0] - (viewSize[0]/2)) * this.zoom,(center[1] - (viewSize[1]/2)) * this.zoom);
    },
    
    onCancelZoom : function (e) {
		this.clearMarkContext();
		this.selected = false;
    },
    
    // show in seperate window
    showInWindow : function () {
        window.open(this.options.imageUrl, "", "height=600, width=700, dependent=yes, menubar=no, toolbar=no, scrollbars=yes, resizable=yes");
    },
    
    // toggels fullscreen mode
    toggelFullscreenMode : function () {
		this.fullscreen = !this.fullscreen;
		this.clearMarkContext();
		this.clearDrawContext();
		// detach event listeners
		this.detachKeyListener();
		this.detachMouseWheelListener();
		//
		if (this.fullscreen) {
			this.originalWidth = this.options.width;
			this.originalHeight = this.options.height;
			// create fullscreen div
			var winDim = getWindowDimensions();
			var el_body = document.getElementsByTagName("body")[0];
			el_body.className = el_body.className + " iv_fullscreenBody";
			var el_cover = document.createElement("iframe");
			el_cover.setAttribute("id","imageViewerFullscreenCover");
			el_cover.setAttribute("scrolling","no");
			el_cover.setAttribute("frameborder","0");
			var el_fullscreenDiv = document.createElement("div");
			el_fullscreenDiv.setAttribute("id","imageViewerFullscreenDiv");
			el_cover.style.position = el_fullscreenDiv.style.position 	= "absolute";
			el_cover.style.display 	= el_fullscreenDiv.style.display 	= "block";
			el_cover.style.zIndex 			= "98";
			el_fullscreenDiv.style.zIndex 	= "99";
			el_cover.style.top 		= el_fullscreenDiv.style.top 		= "0px";
			el_cover.style.left 	= el_fullscreenDiv.style.left 		= "0px";
			el_cover.style.width	= el_fullscreenDiv.style.width		= winDim[0];
			el_cover.style.height	= el_fullscreenDiv.style.height		= winDim[1];
			el_body.appendChild(el_fullscreenDiv);
			el_body.appendChild(el_cover);
			// add imageViewer to it
			var el_parent = document.getElementById(this.parentId);
			el_fullscreenDiv.innerHTML = el_parent.innerHTML;
			el_parent.innerHTML = "";
			// display image viewer
			this.resize(winDim[0],winDim[1]);
			this.zoomToFit();
			// swap the button image
			document.getElementById(this.btn_fullscreen).parentNode.style.display = "none";
			document.getElementById(this.btn_fullscreenRestore).parentNode.style.display = "block";
			document.getElementById(this.msg_fullscreen).style.display = "block";
		} else {
			//
			var el_cover = document.getElementById("imageViewerFullscreenCover");
			var el_fullscreen = document.getElementById("imageViewerFullscreenDiv");
			document.getElementById(this.parentId).innerHTML = el_fullscreen.innerHTML;
			var el_body = document.getElementsByTagName("body")[0];
			el_body.className = el_body.className.replace(/iv_fullscreenBody/g, "");
			el_body.removeChild(el_fullscreen);
			el_body.removeChild(el_cover);
			this.resize(this.originalWidth,this.originalHeight);
			this.zoomToFit();
			// swap the button image
			document.getElementById(this.btn_fullscreen).parentNode.style.display = "block";
			document.getElementById(this.btn_fullscreenRestore).parentNode.style.display = "none";
			document.getElementById(this.msg_fullscreen).style.display = "none";
		}
		
		// attach event listeners
		this.attachKeyListener();
		this.attachMouseWheelListener();
	},
        
	isFullscreen : function () {
            return this.fullscreen;
	},
	
	// filmstrip
	initFilmStrip : function (filmStripThumbs, filmStripImages, selectionListener) {
		this.filmStripThumbs = filmStripThumbs;
		this.filmStripImages = filmStripImages;
		this.filmStripSelectionListener = selectionListener;
		this.filmStripLength = filmStripThumbs.length;
		// find the selected image
		for (var i=0; i<this.filmStripImages.length; i+=1) {
			if (this.filmStripImages[i] === this.options.imageUrl) {
				this.selectFilmStripImage(i);
				return;
			}
		}
	},
        
	initLargeFilmStrip : function (length,getRangeFunc,getImageFunc,selection,selectionListener) {
		this.filmStripLarge = true;
		this.filmStripLength =  parseInt(length);
		this.filmStripRangeFunc = getRangeFunc;
		this.filmStripImageFunc = getImageFunc;
		this.filmStripSelectionListener = selectionListener;
		if (this.filmStripCacheSize > length) {
			this.filmStripCacheSize = length;
			this.filmStripCacheStart = 0;
			this.selectFilmStripImage(selection);
		} else {
			this.setCachePosition(selection);
			this.selectFilmStripImage(selection - this.filmStripCacheStart);
		}
	},
        
	toggelFilmStrip : function () {
		this.filmStrip = !this.filmStrip;
		if (!this.filmStrip) {
                    this.element.find("."+this.btn_filmstripClass)
                        .parent().removeClass(this.bg_buttonSelected);
                    // remove the filmstrip
                    	var el_filmStrip = document.getElementById(this.elId+this.filmStripClass);
			var el_body = document.getElementById(this.elId+this.bodyClass);
			if (this.filmStripHorizontal) {
				el_body.style.height = el_body.offsetHeight + this.filmStripHeight + "px";
			} else {
				el_body.style.width = el_body.offsetWidth + this.filmStripHeight + "px";
			}
			el_filmStrip.parentNode.removeChild(el_filmStrip);
			this.zoomToFit();
		} else {
                    this.element.find("."+this.btn_filmstripClass)
                        .parent().addClass(this.bg_buttonSelected);
			// add the filmStrip
			var el_base = document.getElementById(this.elId+this.baseClass);
			var el_body = document.getElementById(this.elId+this.bodyClass);
			var el_header = document.getElementById(this.elId+this.headerClass);
			
			var el_filmStrip = document.createElement("div");
			el_filmStrip.setAttribute("id",this.elId+this.filmStripClass);
			el_filmStrip.className = "iv_filmStrip";
			
			// make the left, right buttons
			var el_leftButton = document.createElement("div");
			var el_rightButton = document.createElement("div");
			el_leftButton.className = el_rightButton.className = "iv_filmStripButton";
			
			// make the thumb slider
			var el_thumbSlider = document.createElement("div");
			el_thumbSlider.setAttribute("id",this.elId+this.filmStripSliderClass);
			el_thumbSlider.className = "iv_filmStripSlider";
			
			// make the thumb container
			var el_thumbContainer = document.createElement("div");
			el_thumbContainer.className = "iv_filmStripThumbContainer";
			el_thumbSlider.appendChild(el_thumbContainer);
			
			// size elements according to orientation
			if (this.filmStripHorizontal) {
				
				el_body.style.height = el_body.offsetHeight - this.filmStripHeight + "px";
				
				el_filmStrip.style.height = this.filmStripHeight + "px";
				el_filmStrip.style.width = el_base.offsetWidth + "px";
				el_filmStrip.style.top = (el_base.offsetHeight - this.filmStripHeight) + "px";
				
				el_leftButton.style.width = el_rightButton.style.width = this.filmStripButtonWidth + "px";
				el_leftButton.style.height = el_rightButton.style.height = this.filmStripHeight + "px";
				
				this.filmStripSliderLength = (el_base.offsetWidth - (this.filmStripButtonWidth * 2 + 2));
				el_thumbSlider.style.width = this.filmStripSliderLength + "px";
				el_thumbSlider.style.height = this.filmStripHeight + "px";
				
				el_leftButton.innerHTML = "<div class='iv_filmStripButtonTop'></div>"+
				"<img class='iv_filmStripButtonImage' src='"+this.applicationPath+"/images/common/imageViewer/slide_left.gif' onclick='"+this.elId+".moveFilmStripRight();' />";
				//el_rightButton.innerHTML = "<img class='iv_filmStripButtonImage' src='"+this.applicationPath+"/images/common/imageViewer/slide_right.gif' onclick='"+this.elId+".moveFilmStripLeft();' />";
				
				el_rightButton.innerHTML = "<div class='iv_filmStripButtonTop'></div>"+
				"<div><img class='iv_filmStripButtonImage' src='"+this.applicationPath+"/images/common/imageViewer/slide_right.gif' onclick='"+this.elId+".moveFilmStripLeft();' /></div>"+
				"<div><img class='iv_filmStripRotateButtonHorizontal' src='"+this.applicationPath+"/images/common/imageViewer/iv_transpondFilmstrip.gif'  onclick='"+this.elId+".transpondFilmStrip();' ></div>";
				
			} else {
				
				el_body.style.width = el_body.offsetWidth - this.filmStripHeight + "px";
				
				el_filmStrip.style.height = el_base.offsetHeight - el_header.offsetHeight  + "px";
				el_filmStrip.style.width = this.filmStripHeight + "px";
				el_filmStrip.style.left = (el_base.offsetWidth - this.filmStripHeight) + "px";
				
				el_leftButton.style.width = el_rightButton.style.width = this.filmStripHeight + "px";
				el_leftButton.style.height = el_rightButton.style.height = this.filmStripButtonWidth + "px";
				
				this.filmStripSliderLength = (el_base.offsetHeight - (this.filmStripButtonWidth * 2 + 2 + el_header.offsetHeight));
				el_thumbSlider.style.width = this.filmStripHeight + "px";
				el_thumbSlider.style.height = this.filmStripSliderLength + "px";
				
				el_leftButton.innerHTML = "<img class='iv_filmStripButtonImageVertical' src='"+this.applicationPath+"/images/common/imageViewer/slide_up.gif' onclick='"+this.elId+".moveFilmStripRight();' />";
				el_rightButton.innerHTML = "<img class='iv_filmStripRotateButtonVertical' src='"+this.applicationPath+"/images/common/imageViewer/iv_transpondFilmstrip.gif'  onclick='"+this.elId+".transpondFilmStrip();' >"+ 
					"<img class='iv_filmStripButtonImageVertical' src='"+this.applicationPath+"/images/common/imageViewer/slide_down.gif' onclick='"+this.elId+".moveFilmStripLeft();' />";
			}
			
			// put it all together 
			el_filmStrip.appendChild(el_leftButton);
			el_filmStrip.appendChild(el_thumbSlider);
			el_filmStrip.appendChild(el_rightButton);
			el_base.appendChild(el_filmStrip);
			
			if (this.filmStripLarge) {
				this.setCachePosition(this.imageIndex); 
				this.selectFilmStripImage(this.imageIndex - this.filmStripCacheStart);
			} else {
				this.selectFilmStripImage(this.imageIndex);
			}
			
			this.zoomToFit();
			this.populateFilmStrip();
		}
    },
    
    transpondFilmStrip : function () {
		if (this.filmStrip)
			this.toggelFilmStrip();
		this.filmStripHorizontal = !this.filmStripHorizontal;
		this.toggelFilmStrip();
    },
    
    resizeFilmStrip : function () {
		var el_filmStrip = document.getElementById(this.elId+this.filmStripClass);
		var el_header = document.getElementById(this.elId+this.headerClass);
		if (el_filmStrip) {
			var el_base = document.getElementById(this.elId+this.baseClass);
			var el_thumbSlider = document.getElementById(this.elId+this.filmStripSliderClass);
			// resize according to orientation
			if (this.filmStripHorizontal) {
				el_filmStrip.style.width = el_base.offsetWidth + "px";
				el_filmStrip.style.top = (el_base.offsetHeight - this.filmStripHeight) + "px";
				this.filmStripSliderLength = (el_base.offsetWidth - (this.filmStripButtonWidth * 2 + 2));
				el_thumbSlider.style.width = this.filmStripSliderLength + "px";
			} else {
				el_filmStrip.style.height = (el_base.offsetHeight - el_header.offsetHeight) + "px";
				el_filmStrip.style.left = (el_base.offsetWidth - this.filmStripHeight) + "px";
				this.filmStripSliderLength = (el_base.offsetHeight - (this.filmStripButtonWidth * 2 + 2 + el_header.offsetHeight));
				el_thumbSlider.style.height = this.filmStripSliderLength + "px";
			}
			this.clearFilmStrip();
			this.populateFilmStrip();
		}
    },
    
    moveFilmStripLeft : function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderClass);
		if (el_slider && (this.filmStripHorizontal ? (el_slider.offsetWidth < el_slider.firstChild.offsetWidth) : (el_slider.offsetHeight < el_slider.firstChild.offsetHeight))) {
			this.filmStripPosition++;
			el_slider.firstChild.removeChild(el_slider.firstChild.firstChild);
			this.populateFilmStrip();
		}
    },
    
    moveFilmStripRight : function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderClass);
		if (el_slider && this.filmStripCacheStart + this.filmStripPosition > 0) {
			this.filmStripPosition--;
			el_slider.firstChild.insertBefore(this.createFilmStripThumb(this.filmStripPosition),el_slider.firstChild.firstChild);
			this.populateFilmStrip();
		}
    },
    
    populateFilmStrip : function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderClass);
		if (el_slider) {
			// update cache if needed, return if cache updated
			if (this.filmStripLarge)
				if (this.manageFilmStripCache())
					return;
			//
			var sliderWidth = this.filmStripSliderLength;
			var thumbsWidth = 0;
			var thumbs = el_slider.firstChild.childNodes;
			// count width of thumbs removeing unnessesery thumbs
			for (var i=0; i<thumbs.length; i+=1) {
				if (thumbsWidth > sliderWidth) {
					el_slider.firstChild.removeChild(thumbs[i]);
				} else {
					thumbsWidth += this.filmStripThumbSize + 5;
				}
			}
			if (this.filmStripHorizontal) {
				el_slider.firstChild.style.width = thumbsWidth + "px";
			} else {
				el_slider.firstChild.style.height = thumbsWidth + "px";
			}
			// add thumbs to fill the thumb slider if needed
			var nextPos = parseInt(this.filmStripPosition) + thumbs.length;
			while (thumbsWidth < sliderWidth) {
				var el_thumb = this.createFilmStripThumb(nextPos);
				if (el_thumb == null)
					break;
				thumbsWidth += this.filmStripThumbSize + 5;
				if (this.filmStripHorizontal) {
					el_slider.firstChild.style.width = thumbsWidth + "px";
				} else {
					el_slider.firstChild.style.height = thumbsWidth + "px";
				}
				el_slider.firstChild.appendChild(el_thumb);
				nextPos++;
			}
			// make sure there is not to much space on the right side
			var blankSpace;
			if (this.filmStripHorizontal) {
				blankSpace = this.filmStripSliderLength - el_slider.firstChild.offsetWidth;
			} else {
				blankSpace = this.filmStripSliderLength - el_slider.firstChild.offsetHeight;
			}
			if (blankSpace >= this.filmStripThumbSize + 5 && this.filmStripPosition != 0) {
				this.filmStripPosition -= Math.floor(blankSpace / (this.filmStripThumbSize + 5));
				this.clearFilmStrip();
				this.populateFilmStrip();
			}
			this.highlightSelectedThumb();
		}
    },
    
    highlightSelectedThumb : function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderClass);
		var thumbs = el_slider.firstChild.childNodes;
		for (var i=0; i<thumbs.length; i++) {
			if (i + this.filmStripPosition + this.filmStripCacheStart == this.imageIndex) {
				thumbs[i].className = "iv_filmStripThumb iv_filmStripHighlight";
			} else {
				thumbs[i].className = "iv_filmStripThumb";
			}
                }
    },
    
    setCachePosition : function (selection) {
		var halfCacheSize = this.filmStripCacheSize / 2;
		this.filmStripCacheStart = selection - halfCacheSize;
		if (this.filmStripCacheStart + this.filmStripCacheSize > this.filmStripLength)
			this.filmStripCacheStart = this.filmStripLength - this.filmStripCacheSize;
		if (this.filmStripCacheStart < 0)
			this.filmStripCacheStart = 0;
    },
    
    manageFilmStripCache : function () {
		// find offset to center in thumbs
		var el_slider = document.getElementById(this.elId+this.filmStripSliderClass);
		if (el_slider == null)
			return;
		var sliderWidth = this.filmStripSliderLength;
		var thumbs = Math.ceil((sliderWidth / (this.filmStripThumbSize + 5)));
		/*
		alert("thumbs: "+thumbs+"\n"+
			  "position: "+this.filmStripPosition+"\n"+
			  "cacheStart: "+this.filmStripCacheStart+"\n"+
			  "cacheSize: "+this.filmStripCacheSize+"\n");
		*/
		if (this.filmStripThumbs == null) {
			// cache thumbs for the first time
			this.filmStripRangeFunc(this.filmStripCacheStart,this.filmStripCacheStart+this.filmStripCacheSize);
			return true;
			
		} else if (this.filmStripPosition < 0 || this.filmStripPosition + thumbs > this.filmStripCacheSize) {
			
			// cache previous thumbs
			var newCacheStart = (this.filmStripCacheStart + this.filmStripPosition) - Math.ceil((this.filmStripCacheSize / 2));
			if (newCacheStart < 0)
				newCacheStart = 0;
			if (newCacheStart + this.filmStripCacheSize > this.filmStripLength)
				newCacheStart = this.filmStripLength - this.filmStripCacheSize;
			if (newCacheStart != this.filmStripCacheStart) {
				this.filmStripPosition += this.filmStripCacheStart - newCacheStart;
				this.filmStripCacheStart = newCacheStart;
				this.filmStripRangeFunc(newCacheStart,newCacheStart+this.filmStripCacheSize);
				return true;
			}
		}
		return false;
    },

    updateFilmStripThumbCache : function (urlArray) {
            this.filmStripThumbs = urlArray;
            this.clearFilmStrip();
            this.populateFilmStrip();
    },

    clearFilmStrip : function () {
            document.getElementById(this.elId+this.filmStripSliderClass).firstChild.innerHTML = "";
    },

    createFilmStripThumb : function (index) {
            if (index > -1 && index < this.filmStripThumbs.length) {
                    var el_thumbDiv = document.createElement("div");
                    el_thumbDiv.className = "iv_filmStripThumb";
                    el_thumbDiv.innerHTML = 
                            "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"iv_filmStripThumbTable\"><tr><td align=\"center\">"+
                                    "<img src=\""+this.filmStripThumbs[index]+"\" onclick=\""+this.elId+".onFilmStripThumbSelected("+index+");\" />"+
                            "</td></tr></table>";
                    return el_thumbDiv;
            }
            return null;
    },

    onFilmStripThumbSelected : function (index) {
            if (this.filmStripLarge) {
                    this.filmStripImageFunc(index+this.filmStripCacheStart);
            } else {
                    this.changeImage(this.filmStripImages[index]);
            }
            this.selectFilmStripImage(index);
            if (this.filmStrip) {
                    this.clearFilmStrip();
                    this.populateFilmStrip();
            }
            if (this.filmStripSelectionListener != null)
                    this.filmStripSelectionListener(index+this.filmStripCacheStart);
    },

    selectFilmStripImage : function (index) {
            this.imageIndex = this.filmStripCacheStart + index;
            var thumbs = this.filmStripSliderLength / (this.filmStripThumbSize + 5);
            var center = Math.ceil(thumbs / 2);
            if (this.filmStripCacheStart + index < center) {
                    this.filmStripPosition = 0;
            } else if (this.filmStripCacheStart + index > this.filmStripLength - (1 + (Math.floor(thumbs) - center))) {
                    this.filmStripPosition = this.filmStripLength - Math.floor(thumbs);
            } else {
                    this.filmStripPosition = 1 + index - center;
            }
    },
    
    // next \ previous image
    initNextPrevious : function (flag) {
		this.showNextPreviousButtons = flag;
    },
    
    nextImage : function () {
		this.imageIndex++;
		if (this.imageIndex >= this.filmStripLength) {
			this.imageIndex = this.filmStripLength - 1;
		}
		if (this.filmStrip) {
			this.selectFilmStripImage(this.imageIndex - this.filmStripCacheStart);
			this.clearFilmStrip();
			this.populateFilmStrip();
		}
		this.rotation = 0;
		if (this.filmStripLarge) {
			this.filmStripImageFunc(this.imageIndex);
		} else {
			this.changeImage(this.filmStripImages[this.imageIndex]);
		}
    },

    previousImage : function () {
		this.imageIndex--;
		if (this.imageIndex < 0) {
			this.imageIndex = 0;
		}
		if (this.filmStrip) {
			this.selectFilmStripImage(this.imageIndex - this.filmStripCacheStart);
			this.clearFilmStrip();
			this.populateFilmStrip();
		}
		this.rotation = 0;
		if (this.filmStripLarge) {
			this.filmStripImageFunc(this.imageIndex);
		} else {
			this.changeImage(this.filmStripImages[this.imageIndex]);
		}
    },
    
    // diashow
    initDiaShow : function (flag) {
		this.diaShowButton = flag;
    },
                
    toggleDiaShow : function () {
        if (this.filmStripLength === 1)
            return;
        this.diaShow = !this.diaShow;
                if (this.diaShow) {
                    this.element.find("."+this.btn_diashowClass)
                        .parent().addClass(this.bg_buttonSelected);
                    this.diaShowTimer = window.setTimeout("if ("+this.elId+" != undefined) { "+this.elId+".diaShowNextImage(); }",this.diaShowTime);
                } else {
                    this.element.find("."+this.btn_diashowClass)
                        .parent().removeClass(this.bg_buttonSelected);
                    window.clearTimeout(this.diaShowTimer);
                }
    },
    
    diaShowNextImage : function () {
		if (document.getElementById(this.elId+this.bodyClass) != null) {
			this.nextImage();
			if (this.imageIndex == this.filmStripLength - 1) {
				this.toggleDiaShow();
			} else {
				this.diaShowTimer = window.setTimeout("if ("+this.elId+" != undefined) { "+this.elId+".diaShowNextImage(); }",this.diaShowTime);
			}
		}
    },
    
    // mouse handeling
    onMouseOver : function () {
		this.mouseOver = true;
    },
            
    onMouseOut : function (event) {
		this.mouseOver = false;
		this.onMouseCancel(event);
    },
    
    getMouseOver : function () {
        return this.mouseOver;
    },
    
    onMouseSelect : function (e) {
		if (this.blockEvents)
			return;
		switch (this.mode) {
			case this.mode_move:
				this.onImageSelect(e);
				break;
			case this.mode_zoom:
				this.onStartZoom(e);
				break;
			case this.mode_draw:
				this.onStartMesure(e);
				break;
		}
    },
    
    onMouseMove : function (e) {
		if (this.blockEvents)
			return;
		switch (this.mode) {
			case this.mode_move:
				this.onImageMove(e);
				break;
			case this.mode_zoom:
				this.onMoveZoom(e);
				break;
			case this.mode_draw:
				this.onMoveMesure(e);
				break;
		}
    },
    
    onMouseRelease : function (e) {
		if (this.blockEvents)
			return;
		switch (this.mode) {
			case this.mode_move:
				this.onImageRelease(e);
				break;
			case this.mode_zoom:
				this.onEndZoom(e);
				break;
			case this.mode_draw:
				this.onEndMesure(e);
				break;
		}
    },
    
    onMouseCancel : function (e) {
		if (this.blockEvents)
			return;
		switch (this.mode) {
			case this.mode_move:
				this.onImageRelease(e);
				break;
			case this.mode_zoom:
				this.onCancelZoom(e);
				break;
			case this.mode_draw:
				this.onCancelMesure(e);
				break;
		}
    },
    
    onMouseDoubleClick : function (e) {
		if (this.blockEvents)
			return;
		switch (this.mode) {
			case this.mode_move:
				this.zoomSelection(e);
				break;
		}
    },
    
    // key handeling
    attachKeyListener : function () {
		var el_event = document.getElementById(this.elId+this.eventClass);
		if (el_event.addEventListener) {
			el_event.addEventListener('keydown', ivOnKeyDown, false);
			el_event.addEventListener('keyup', ivOnKeyUp, false);
	 	} else if (el_event.attachEvent) {
	 		el_event.attachEvent('onkeydown', ivOnKeyDown);
	 		el_event.attachEvent('onkeyup', ivOnKeyUp);
		}
    },
    
    detachKeyListener : function () {
		var el_event = document.getElementById(this.elId+this.eventClass);
		if(el_event.removeEventListener) {
			el_event.removeEventListener('keydown', ivOnKeyDown, false);  
			el_event.removeEventListener('keyup', ivOnKeyUp, false);
	  	} else if(el_event.detachEvent) {
	  		el_event.detachEvent('onkeydown', ivOnKeyDown);
	  		el_event.detachEvent('onkeyup', ivOnKeyUp);
		}
    },
    
    onKeyDown : function (event) {
		if (this.blockEvents)
			return;
		if (!event)
			event = window.event;
		if (!this.ivCtrlKeyDown) { 
			if (event.which == 17 || event.keyCode == 17) { // strg
				if (this.mode == 1) {
					this.selectZoomMode();
				} else {
					this.selectMoveMode();
				}
				this.ivCtrlKeyDown = true;
			}
		}
		if (event.which == 107 || event.keyCode == 107) { // addition
			this.zoomIn(1);
		}
		if (event.which == 109 || event.keyCode == 109) { // subtraction
			this.zoomOut(1);
		}
		if (this.fullscreen) {
			if (event.whitch == 27 || event.keyCode == 27) { // escape
				this.toggelFullscreenMode();
			}
		}
    },
    
    onKeyUp : function (event) {
		if (this.blockEvents)
			return;
		if (!event)
			event = window.event;
		if (this.ivCtrlKeyDown) {
			if (event.which == 17 || event.keyCode == 17) {
				if (this.mode == 1) this.selectZoomMode();
				else this.selectMoveMode();
				this.ivCtrlKeyDown = false;
			}
		}
    },
    
    // mouse wheel handeling
    attachMouseWheelListener : function () {
		if(window.addEventListener) {
	      	window.addEventListener('DOMMouseScroll', ivOnMouseWheel, false);  
	    	window.addEventListener('mousewheel', ivOnMouseWheel, false);
	  	} else if(window.attachEvent) {
	    	window.attachEvent('onmousewheel', ivOnMouseWheel);
		}
		window.onmousewheel = document.onmousewheel = ivOnMouseWheel;
    },
    
    detachMouseWheelListener : function () {
		if(window.removeEventListener) {
                    window.removeEventListener('DOMMouseScroll', ivOnMouseWheel, false);  
                    window.removeEventListener('mousewheel', ivOnMouseWheel, false);
	  	} else if(window.detachEvent) {
                    window.detachEvent('onmousewheel', ivOnMouseWheel);
		}
		window.onmousewheel = document.onmousewheel = '';
    },
    
    onMouseWheel : function (event) {
		if (!this.getMouseOver() || this.blockEvents)
			return;
		if (document.getElementById(this.elId+this.baseClass) == null) {
			this.detachMouseWheelListener();
			this.detachKeyListener();
			return;
		}
		var delta = 0;
		if (!event)
			event = window.event;
		if (event.wheelDelta) {
			delta = event.wheelDelta/120;
		    if (window.opera)
		    	delta = -delta;
		} else if (event.detail) {
			delta = -event.detail/3;
		}
		if (delta) {
			if (delta>0) {
				this.zoomIn(delta);
			} else {
				this.zoomOut(-delta);
			}
		}
		if (event.preventDefault)
			event.preventDefault();
		event.returnValue = false;
    },

    // selected tool
    clearToolSelection : function () {
        if (this.selectedToolId !== null)
            this.element.find("."+this.selectedToolId)
                .parent().removeClass(this.bg_buttonSelected);
        this.selectedToolId = null;
        if (this.lines.length === 0)
            this.setToolDisabled(this.btn_clearClass);
    },
    
    setToolSelection : function (cssClass) {
        this.clearToolSelection();
        this.selectedToolId = cssClass;
        this.element.find("."+this.selectedToolId)
            .parent().addClass(this.bg_buttonSelected);
    },
    
    clearToolDisabled : function (cssClass) {
        this.element.find("."+cssClass)
            .parent().removeClass("iv_buttonDisabled");
    },
    
    setToolDisabled : function (cssClass) {
        this.element.find("."+cssClass)
            .parent().addClass("iv_buttonDisabled");
    },
            
    refreshNextPrevButtonState : function () {
        if (this.imageIndex === 0) {
            this.setToolDisabled(this.btn_prevClass);
        } else {
            this.clearToolDisabled(this.btn_prevClass);	
        }
        if (this.imageIndex === this.filmStripLength - 1) {
            this.setToolDisabled(this.btn_nextClass);
        } else {
            this.clearToolDisabled(this.btn_nextClass);
        }
    },
    
    refreshZoomButtonState : function () {
        if (this.zoom === this.maxZoom) {
            this.setToolDisabled(this.btn_zoomInClass);
            this.setToolDisabled(this.btn_zoomSelectionClass);
        } else {
            this.clearToolDisabled(this.btn_zoomInClass);
            this.clearToolDisabled(this.btn_zoomSelectionClass);
        }
        if (this.zoom === this.minZoom) {
            this.setToolDisabled(this.btn_zoomOut);
        } else {
            this.clearToolDisabled(this.btn_zoomOut);
        }
    },
    
    // set current language
    setLanguage : function (language) {
        this.options.language = language;
    },
    
    // get translation for a key
    getTranslation : function (textCode) {
        var languageTexts = ivTranslationTexts[this.options.language];
        if (languageTexts === null) {
            alert("The image viewer dose not have any \ntranslations for the selected language "+this.options.language);
        } else {
            if (languageTexts[textCode] === null) {
                alert("No translation exists in the language: "+this.options.language+" for the key: "+textCode);
            } else {
                return languageTexts[textCode];
            }
        }
    },
    
    // util functions
    getMouseXY : function (e) {
                if (this.IE) {
                    return [event.clientX + document.body.scrollLeft, event.clientY + document.body.scrollTop];
                } else {
                    return [e.pageX, e.pageY];
                }
    },
    
    getLeft : function (ele) {
		if (ele.offsetParent)	return ele.offsetLeft + this.getLeft(ele.offsetParent);
		else 					return ele.offsetLeft;
    },
    
    getTop : function (ele) {
		if (ele.offsetParent) 	return (ele.offsetTop + this.getTop(ele.offsetParent));
		else 					return (ele.offsetTop);
    }
});



function ivOnMouseWheel (event) {
	selectedImageViewer.onMouseWheel(event);
}
function ivOnKeyDown (event) {
	selectedImageViewer.onKeyDown(event);
}
function ivOnKeyUp (event) {
	selectedImageViewer.onKeyUp(event);
}

var ivTranslationTexts = {
    "en" : {
        "iv.fullscreen" : "Make this image viewer fullscreen",
        "iv.measure.error.nan" : "The length value must be a valid number",
        "iv.measure.button.cancel" : "Cancel",
        "iv.measure.button.apply" : "Apply",
        "iv.measure.input.length" : "Length",
        "iv.measure.modalpanel.title.line_length" : "Reference length",
        "iv.mesure.clear" : "Clear all measurements marked on the image",
        "iv.mesure.draw" : "Measure a part of the image",
        "iv.move" : "Use the mouse to move the image",
        "iv.restore" : "Restore previous view",
        "iv.restoreMessage" : "Click here to restore the previous view\:" ,
        "iv.rotate.left" : "Rotate the image 90\u00B0 left",
        "iv.rotate.right" : "Rotate the image 90\u00B0 right",
        "iv.window" : "Show this image in a new window",
        "iv.zoom.11" : "Original size",
        "iv.zoom.fit" : "Full image",
        "iv.zoom.in" : "Increase zoom factor",
        "iv.zoom.out" : "Decrease zoom factor",
        "iv.zoom.selection" : "Select an area to zoom into",
        "iv.filmstrip" : "Show image selector filmstrip",
        "iv.diashow" : "toggle diashow animation",
        "iv.previmage" : "show previous image",
        "iv.nextimage" : "show next image"
    },
    "de":{
        "iv.fullscreen" : "Bild auf den ganzen Bildschirm ausdehnen",
        "iv.measure.error.nan" : "Die L\u00E4nge muss ein g\u00E0ltiger numerischer Wert sein!",
        "iv.measure.button.cancel" : "Abbrechen",
        "iv.measure.button.apply" : "Anwenden",
        "iv.measure.input.length" : "L\u00E4nge",
        "iv.measure.modalpanel.title.line_length" : "Referenzl\u00E4nge",
        "iv.mesure.clear" : "Alle Ma\u00DFlinien l\u00F6schen",
        "iv.mesure.draw" : "Messwerkzeug",
        "iv.move" : "Hand-Werkzeug (klicken und ziehen, um das Bild zu bewegen)",
        "iv.restore" : "Vorherige Ansicht wiederherstellen",
        "iv.restoreMessage" : "Hier klicken, um die vorherige Ansicht wiederherzustellen\: ",
        "iv.rotate.left" : "Drehen um 90\u00B0 nach links",
        "iv.rotate.right" : "Drehen um 90\u00B0 nach rechts",
        "iv.window" : "Bild in neuem Fenster \u00F6ffnen",
        "iv.zoom.11" : "Originalgr\u00F6\u00DFe",
        "iv.zoom.fit" : "Ganzes Bild",
        "iv.zoom.in" : "Zoomfaktor erh\u00F6hen",
        "iv.zoom.out" : "Zoomfaktor verringern",
        "iv.zoom.selection" : "Zoombereich ausw\u00E4hlen",
        "iv.filmstrip" : "Show image selector filmstrip",
        "iv.diashow" : "toggle diashow animation",
        "iv.previmage" : "show previous image",
        "iv.nextimage" : "show next image"
    }
};


