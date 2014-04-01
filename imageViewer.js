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
	language : 'en',
        filmStripThumbs : null,
        filmStripImages : null,
        selectionListener : null,
        filmStripLength : null,
        getThumbsRangeCallback : null,
        getImageCallback : null,
        selectionIndex : null,
        enableDiaShow : null,
        enableNextPrevious : null,
        filmStripActive : null,
        filmStripVertical : null,
        originalSize : null
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
    headerClass : "iv_header",
    messageClass : "iv_message",
    lengthInputClass : "iv_lengthInput",
    lengthPanelClass : "iv_lengthPanel",
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
    btn_fullscreenRestore : "iv_fullscreenRestore",
    msg_fullscreenRestore : "iv_restoreMessage",
    // defined modes
    mode_move : 1,
    mode_zoom : 2,
    mode_draw : 3,
    mode : 1,
    // curors
    cur_openHandClass : 'iv_cursorOpenHand',
    cur_closedHandClass : 'iv_cursorClosedHand',
    cur_crosshairClass : 'iv_cursorCrosshair',
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
    filmStripClass : "iv_filmStrip",
    filmStripSliderClass : "iv_filmStripSlider",
    filmStripButtonClass : "iv_filmStripButton",
    filmStripThumbContainerClass : "iv_filmStripThumbContainer",
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
    //
    attachCompleteListener : null,
    originalPositionPlaceholderId : null,
    
    // the constructor
    _create: function () {
        
        this.element
            .addClass("imageViewer")
            .disableSelection();
        
        var multiImages = false;
        
        // init filmstrip
        if (this.options.filmStripThumbs !== null && this.options.filmStripImages !== null) {
            this.initFilmStrip(this.options.filmStripThumbs,this.options.filmStripImages,this.options.selectionListener);
            multiImages = true;
        }
        
        // init film strip large
        if (this.options.filmStripLength !== null && this.options.getThumbsRangeCallback !== null && this.options.getImageCallback !== null) {
            this.initLargeFilmStrip(this.options.filmStripLength,this.options.getThumbsRangeCallback,this.options.getImageCallback,this.options.selectionIndex,this.options.selectionListener);
            multiImages = true;
        }
        
        // options possible with multiple images
        if (multiImages) {
            
            if (this.options.enableDiaShow !== null) {
                this.initDiaShow(this.options.enableDiaShow);
            }
            if (this.options.enableNextPrevious !== null) {
                this.initNextPrevious(this.options.enableNextPrevious);
            }
        }
        
        var thisObject = this;
        this.attachCompleteListener = function () {
            
            if (multiImages) {
                if (thisObject.options.filmStripActive === true) {
                    thisObject.toggelFilmStrip();
                }
                if (thisObject.options.filmStripVertical === true) {
                     thisObject.transpondFilmStrip();
                }
            }
            
            if (thisObject.options.originalSize === true) {
                thisObject.zoomReset();
            }
        };
        
        // attach the image viewer
        this.attach();
        
        this._refresh();
    },
    
    // called when created, and later when changing options
    _refresh : function () {
        
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
        
        this._superApply(arguments);
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
        var iv_header = $("<div>",{"class" : this.headerClass})
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
                .hide()
            ).append($("<div>",{"class" : this.msg_fullscreenRestore})
                .append($("<b>",{text : this.getTranslation('iv.restore')}))
            );
	
        $("<div>",{"class" : this.baseClass})
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
            if (this.element.find("."+this.bodyClass).length > 0) {
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
            el_frame.append($("<canvas>",{
                "class" : this.canvasClass
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
        
        if (this.attachCompleteListener) {
            this.attachCompleteListener();
        }
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
            if (this.element.find("."+this.bodyClass).length > 0) {
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
            width = $(window).width();
            height = $(window).height();
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
        var headerHeight = el_header.height();
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
        
        var el_draw = this.element.find("."+this.drawClass);
        var el_event = this.element.find("."+this.eventClass);
        var el_frame = this.element.find("."+this.frameClass);
        if (el_draw) {
            var width, height;
            if (this.rotation === 0 || this.rotation === 180) {
                width = Math.floor(this.imgWidth * this.zoom) + "px";
                height = Math.floor(this.imgHeight * this.zoom) + "px";
            } else {
                width = Math.floor(this.imgHeight * this.zoom) + "px";
                height = Math.floor(this.imgWidth * this.zoom) + "px";
            }
            el_draw.css({
                "width" : width,
                "height" : height
            });
            el_event.css({
                "width" : width,
                "height" : height
            });
            el_frame.css({
                "width" : el_draw.width() + "px",
                "height" : el_draw.height() + "px"
            });
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
        if (el_frame.length > 0) {
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
        
        var el_body = this.element.find("."+this.bodyClass);
        this.mouseXY = this.getMouseXY(e);
        this.center = [((this.mouseXY[0] - el_body.offset().left) + this.scrollLeft) / this.zoom,
            ((this.mouseXY[1] - el_body.offset().top) + this.scrollTop) / this.zoom];
    },
    
    rotateViewCenter : function (rotation) {
		
        // rotate back to original position
        var realCenter;
        if (this.rotation === 0) {
            realCenter = this.center;
        } else if (this.rotation === 90) {
            realCenter = [this.center[1],this.imgHeight - this.center[0]];
        } else if (this.rotation === 180) {
            realCenter = [this.imgWidth - this.center[0],this.imgHeight - this.center[1]];
        } else if (this.rotation === 270) {
            realCenter = [this.imgWidth - this.center[1],this.center[0]];
        }
        // calculate next rotation
        var nextRotation = this.rotation + rotation;
        if (nextRotation >= 360) {
            nextRotation -= 360;
        }
        // apply rotation
        if (nextRotation === 0) {
            this.center = realCenter;
        } if (nextRotation === 90) {
            this.center = [this.imgHeight - realCenter[1],realCenter[0]];
        } else if (nextRotation === 180) {
            this.center = [this.imgWidth - realCenter[0],this.imgHeight - realCenter[1]];
        } else if (nextRotation === 270) {
            this.center = [realCenter[1],this.imgWidth - realCenter[0]];
        }
    },
    
    // for non ie, paints image to canvas function
    paintCanvas : function (canvasClass,image,zoom,rotation) {
        
        var el_canvas = this.element.find("."+canvasClass);
        var ctx = el_canvas.get(0).getContext("2d");
        ctx.save();
        
        var width = Math.floor(image.width * zoom);
        var height = Math.floor(image.height * zoom);
        
        switch (rotation) {
            case 0:
                el_canvas.attr({
                    "width" : width,
                    "height" : height
                });
                ctx.drawImage(image,0,0,width,height);
                break;
            case 90:
                el_canvas.attr({
                    "width" : height,
                    "height" : width
                });
                ctx.translate(height-1,0);
                ctx.rotate(rotation * Math.PI / 180);
                ctx.drawImage(image,0,0,width,height);
                break;
            case 180:
                el_canvas.attr({
                    "width" : width,
                    "height" : height
                });
                ctx.translate(width-1,height-1);
                ctx.rotate(rotation * Math.PI / 180);
                ctx.drawImage(image,0,0,width,height);
                break;
            case 270:
                el_canvas.attr({
                    "width" : height,
                    "height" : width
                });
                ctx.translate(0,width-1);
                ctx.rotate(rotation * Math.PI / 180);
                ctx.drawImage(image,0,0,width,height);
                break;
        }
    },

    // zoom in
    zoomIn : function (steps) {
        
        if (!steps) {
            steps = 1;
        }
        this.saveViewCenter();
        if (this.zoom < this.maxZoom) {
            var zoomIncrease = (this.imgWidth * this.zoom) * (this.zoomStep * steps);
            var zoomValue = ((this.imgWidth * this.zoom) + zoomIncrease) / this.imgWidth;
            this.zoom = zoomValue;
        }
        if (this.zoom >= this.maxZoom) {
            this.zoom = this.maxZoom;
        }
        this.refreshZoomButtonState();
        this.applyZoomCenter();
    },
    
    // zoom out
    zoomOut : function (steps) {
        
        if (!steps) {
            steps = 1;
        }
        this.saveViewCenter();
        if (this.zoom > this.minZoom) {
            var zoomDecrease = (this.imgWidth * this.zoom) * (this.zoomStep * steps);
            var zoomValue = ((this.imgWidth * this.zoom) - zoomDecrease) / this.imgWidth;
            this.zoom = zoomValue;
        }
        if (this.zoom <= this.minZoom) {
            this.zoom = this.minZoom;
        }
        this.refreshZoomButtonState();
        this.applyZoomCenter();
    },
    
    // reset zoom
    zoomReset : function () {
        
        this.zoom = 1;
        this.setScroll(0,0);
        this.applyZoom(this.IE?(this.imgClass):(this.canvasClass),this.image,this.zoom);
        this.refreshZoomButtonState();
    },
    
    // zoom image so it fits in viewer
    zoomToFit : function (targetId,image) {
        
        if (targetId === undefined || image === undefined) {
            this.zoom = this.getFitZoom(this.image);
            this.applyZoom(this.IE?(this.imgClass):(this.canvasClass),this.image,this.zoom);
        } else {
            var zoom = this.getFitZoom(image);
            this.applyZoom(targetId,image,zoom);
        }
        this.refreshZoomButtonState();
    },
    
    // return zoom required for image to fit viewer bounds
    getFitZoom : function (image) {
        
        var el_body = this.element.find("."+this.bodyClass);
        this.setScroll(0,0);
        if (this.rotation === 0 || this.rotation === 180) {
            var xRatio = el_body.width() / image.width;
            var yRatio = el_body.height() / image.height;
        } else {
            var xRatio = el_body.width() / image.height;
            var yRatio = el_body.height() / image.width;
        }
        var zoom = xRatio < yRatio ? xRatio : yRatio;
        if (zoom > this.maxZoom) {
            zoom = this.maxZoom;
        }
        return zoom;
    },
    
    // zoom the selected area
    zoomSelection : function (e) {
        
        this.saveSelectionAsCenter(e);
        if (this.zoom < this.maxZoom) {
            var zoomIncrease = (this.imgWidth * this.zoom) * (this.zoomStep * 2);
            var zoomValue = ((this.imgWidth * this.zoom) + zoomIncrease) / this.imgWidth;
            this.zoom = zoomValue;
        }
        if (this.zoom > this.maxZoom) {
            this.zoom = this.maxZoom;
        }
        this.refreshZoomButtonState();
        this.applyZoomCenter();
    },
    
    // apply zoom to a target
    applyZoom : function (targetClass,image,zoom) {
	
        this.resizeLayers();
        this.redrawLines();
	if (this.IE) {
            this.element.find("."+targetClass).css({
                "zoom" : Math.round(100*zoom) + "%"
            });
        } else {
            this.paintCanvas(targetClass,image,zoom,this.rotation);
        }
        this.renderZoomMessage();
    },
    
    applyZoomCenter : function () {
        
        // clear lines now so they dont jump
        this.clearDrawContext();
        this.clearMarkContext();
        //
        if (this.IE) {
            // resize image
            this.element.find("."+this.imgClass).css({
                "zoom" : Math.round(100 * this.zoom) + "%"
            });
        } else {
            this.paintCanvas(this.canvasClass,this.image,this.zoom,this.rotation);
        }
        this.loadViewCenter();
        // set size of layers
        this.resizeLayers();
        this.redrawLines();
        // set zoom value message
        this.renderZoomMessage();
    },
    
    // refresh the zoom message
    renderZoomMessage : function () {
        
        var zoomValue = (Math.round(100 * this.zoom)) + "%";
        this.element.find("."+this.messageClass)
            .text(this.getTranslation("iv.zoom.message") + zoomValue);
    },

    // rotate image clockwise 90 degres
    rotateRight : function () {
        
        this.saveViewCenter();
        this.rotateViewCenter(90);
        this.rotation = this.rotation + 90;
        this.applyRotation();
        this.loadViewCenter();
    },
    
    // rotate image anti clockwise 90 degres
    rotateLeft : function () {

        this.saveViewCenter();
        this.rotateViewCenter(270);
        this.rotation = this.rotation - 90;
        this.applyRotation();
        this.loadViewCenter();
    },
    
    // apply rotation to image panel
    applyRotation : function () {
		 
        if (this.rotation>=360) {
            this.rotation = this.rotation - 360;
        } else if (this.rotation<0) {
            this.rotation = this.rotation + 360;
        }
        if (this.IE) {
            this.element.find("."+this.imgClass).css({
                "filter" : "progid:DXImageTransform.Microsoft.BasicImage(rotation="+(this.rotation / 90)+");"
            });
        } else {
            this.paintCanvas(this.IE?(this.imgClass):(this.canvasClass),this.image,this.zoom,this.rotation);
        }
        this.applyZoom(this.IE?(this.imgClass):(this.canvasClass),this.image,this.zoom);
    },

    // image draging
    selectMoveMode : function () {
        
        this.mode = this.mode_move;
        this.setCursor(this.element.find("."+this.eventClass), this.cur_openHandClass);
        this.setToolSelection(this.btn_moveClass);
    },

    onImageSelect : function (e) {
        
        this.mouseXY = this.getMouseXY(e);
        this.selected = true;
        this.moved = false;
        this.setCursor(this.element.find("."+this.eventClass), this.cur_closedHandClass);
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
        this.setCursor(this.element.find("."+this.eventClass), this.cur_openHandClass);
    },
    
    // mesure mode
    selectMesureMode : function () {
        
        this.mode = this.mode_draw;
        this.setCursor(this.element.find("."+this.eventClass), this.cur_crosshairClass);
        this.setToolSelection(this.btn_mesureClass);
    },
    
    onStartMesure : function (e) {
        
        this.selection = this.mouseXY = this.getMouseXY(e);
        var el_draw = this.element.find("."+this.drawClass);
        this.selection[0] = this.selection[0] - el_draw.offset().left;
        this.selection[1] = this.selection[1] - el_draw.offset().top;
        this.selected = true;
    },
    
    onMoveMesure : function (e) {
        
        if (!this.selected) {
            return;
        }
        this.mouseXY = this.getMouseXY(e);
        var el_draw = this.element.find("."+this.drawClass);
        this.mouseXY[0] = this.mouseXY[0] - el_draw.offset().left;
        this.mouseXY[1] = this.mouseXY[1] - el_draw.offset().top;
        this.clearMarkContext();
        this.markCtx.setColor("#00ff00");
        this.markCtx.drawLine(this.selection[0],this.selection[1],this.mouseXY[0],this.mouseXY[1]);
        this.markCtx.paint();
    },

    onEndMesure : function () {
        
        if (!this.selected) {
            return;
        }
        this.selected = false;
        // add the new line
        var x = (this.mouseXY[0]/this.zoom) - (this.selection[0]/this.zoom);
        var y = (this.mouseXY[1]/this.zoom) - (this.selection[1]/this.zoom);
        var len = Math.floor(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) * 100) / 100;
        if (len === 0) {
            return;
        }
        var newLine = [this.selection[0]/this.zoom,this.selection[1]/this.zoom,this.mouseXY[0]/this.zoom,this.mouseXY[1]/this.zoom,len];
        newLine = this.correctLineRotation(newLine,360-this.rotation);
        this.lines.push(newLine);
        // ask user how long the line is
        if (this.lineRatio === -1) {
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
	
        var thisObject = this;
        this.blockEvents = true;
        this.lineRatio = -1;
        
        $("<div>",{
            "class" : this.lengthPanelClass
        }).append($("<span>",{
                text : this.getTranslation("iv.measure.input.length")
            })
        ).append($("<input>",{
                "type" : "text",
                "class" : this.lengthInputClass,
                "tabindex" : 0
            }).keypress(function(event){
                thisObject.commitMesureLengthOnEnter(event);
            })
        ).append($("<input>",{
                "type" : "button",
                "value" : this.getTranslation("iv.measure.button.apply")
            }).click(function(event){
                thisObject.commitMesureLength();
                return false;
            })
        ).append($("<input>",{
                "type" : "button",
                "value" : this.getTranslation("iv.measure.button.cancel")
            }).click(function(event){
                thisObject.cancelMesureLengthPanel();
                return false;
            })
        ).appendTo(this.element.find("."+this.bodyClass));
        
        this.element.find("."+this.lengthInputClass).focus();
    },
    
    hideMesureLengthPanel : function () {
        
        this.blockEvents = false;
        var el_lengthPanel = this.element.find("."+this.lengthPanelClass);
        if (el_lengthPanel.length > 0) {
            el_lengthPanel.remove();
        }
    },
    
    commitMesureLength : function () {
        
        var value = this.element.find("."+this.lengthInputClass).val();
        if (value === "0" || value === "") {
            value = "1";
        }
        value = parseFloat(value);
        if (isNaN(value)) {
            alert(this.getTranslation("iv.measure.error.nan"));
        } else {
            this.lineRatio = this.lines[0][4] / value;
            this.redrawLines();
            this.hideMesureLengthPanel();
        }
        this.clearToolDisabled(this.btn_clearClass);
    },

    commitMesureLengthOnEnter : function (event) {
        
        if (event.which === 13) { // return
            this.commitMesureLength();
        }
    },
    
    cancelMesureLengthPanel : function () {
        
        this.hideMesureLengthPanel();
        this.onCancelMesure();
        this.onClearLines();
    },
    
    rotateLine : function (line,rotation) {
        
        if (rotation === 0) {
            return line;
        }
	if (rotation === 90) {
            return [this.imgHeight-line[1],line[0],this.imgHeight-line[3],line[2],line[4]];
        }
        if (rotation === 180) {
            return [this.imgWidth-line[0],this.imgHeight-line[1],this.imgWidth-line[2],this.imgHeight-line[3],line[4]];
        }
        if (rotation === 270) {
            return [line[1],this.imgWidth-line[0],line[3],this.imgWidth-line[2],line[4]];
        }
    },
    
    correctLineRotation : function (line,rotation) {
        
        if (rotation === 0 || rotation === 360) {
            return line;
        }
        if (rotation === 90) {
            return [this.imgWidth-line[1],line[0],this.imgWidth-line[3],line[2],line[4]];
        }
	if (rotation === 180) {
            return [this.imgWidth-line[0],this.imgHeight-line[1],this.imgWidth-line[2],this.imgHeight-line[3],line[4]];
        }
	if (rotation === 270) {
            return [line[1],this.imgHeight-line[0],line[3],this.imgHeight-line[2],line[4]];
        }
    },
    
    redrawLines : function () {

        this.clearDrawContext();
        this.clearMarkContext();
        // if mesure length panel is visible close it and dont draw lines
        if (this.lineRatio !== -1) {
            for (var i=0; i<this.lines.length; i++) {
                var line = this.lines[i];
                var points = this.rotateLine(line,this.rotation);
                this.drawCtx.setColor("#0000ff");
                this.drawCtx.drawLine(points[0]*this.zoom,points[1]*this.zoom,points[2]*this.zoom,points[3]*this.zoom);
                this.drawCtx.setColor("#ff0000");
                var len = ""+Math.floor((line[4]/this.lineRatio)*100)/100;
                if (this.options.language === "de") {
                    len.replace(".",",");
                }
                this.drawCtx.drawString(len,((points[0]*this.zoom)+(points[2]*this.zoom))/2,((points[1]*this.zoom)+(points[3]*this.zoom))/2);
            }
            this.drawCtx.paint();
        } else {
            this.cancelMesureLengthPanel();
        }
    },
    
    // clear draw layer and context
    clearDrawContext : function () {

        if (this.drawCtx !== null) {
            this.drawCtx.clear();
        }
        this.element.find("."+this.drawClass).html("");
        var drawCtxId = this.element.find("."+this.drawClass).attr("id");
        if (typeof drawCtxId === "undefined") {
            drawCtxId = this.getGeneratedId("iv_"+this.drawClass+"_");
            this.element.find("."+this.drawClass).attr({"id" : drawCtxId});
        }
        this.drawCtx = new jsGraphics(drawCtxId);
    },
    
    // clear mark layer and context
    clearMarkContext : function () {
        
        if (this.markCtx !== null) {
            this.markCtx.clear();
        }
        this.element.find("."+this.markClass).html("");
        var markCtxId = this.element.find("."+this.markClass).attr("id");
        if (typeof markCtxId === "undefined") {
            markCtxId = this.getGeneratedId("iv_"+this.markClass+"_");
            this.element.find("."+this.markClass).attr({"id" : markCtxId});
        }
        this.markCtx = new jsGraphics(markCtxId);
    },
    
    // remove all lines on draw layer
    onClearLines : function () {
        
        this.clearDrawContext();
        while (this.lines.length !== 0)
            this.lines.pop();
        this.lineRatio = -1;
        this.setToolDisabled(this.btn_clearClass);
    },
    
    // set mode to zoom mode
    selectZoomMode : function () {
        
        this.mode = this.mode_zoom;
        this.setCursor(this.element.find("."+this.eventClass), this.cur_crosshairClass);
        this.setToolSelection(this.btn_zoomSelectionClass);
    },
    
    // start zoom mode by setting selection point
    onStartZoom : function (e) {
        
        var el_draw = this.element.find("."+this.drawClass);
        // set selection start point
        this.selection = this.getMouseXY(e);
        this.selection[0] = this.selection[0] - el_draw.offset().left;
        this.selection[1] = this.selection[1] - el_draw.offset().top;
        // set selection end point as start point
        this.mouseXY = this.getMouseXY(e);
        this.mouseXY[0] = this.mouseXY[0] - el_draw.offset().left;
        this.mouseXY[1] = this.mouseXY[1] - el_draw.offset().top;
        this.selected = true;
    },
    
    // handel mouse move while zoom mode
    onMoveZoom : function (e) {
        
        if (!this.selected)
            return;
        this.mouseXY = this.getMouseXY(e);
        var el_draw = this.element.find("."+this.drawClass);
        this.mouseXY[0] = this.mouseXY[0] - el_draw.offset().left;
        this.mouseXY[1] = this.mouseXY[1] - el_draw.offset().top;
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
        var el_body = this.element.find("."+this.bodyClass);
        // find start and end point pixel coords
        var start = [this.selection[0] < this.mouseXY[0] ? this.selection[0] / this.zoom:this.mouseXY[0] / this.zoom,this.selection[1] < this.mouseXY[1] ? this.selection[1] / this.zoom : this.mouseXY[1] / this.zoom];
        var end = [this.selection[0] > this.mouseXY[0] ? this.selection[0] / this.zoom:this.mouseXY[0] / this.zoom,this.selection[1] > this.mouseXY[1] ? this.selection[1] / this.zoom : this.mouseXY[1] / this.zoom];
        // if area selected equals 0 do nothing
        if (this.selection[0] === this.mouseXY[0] && this.selection[1] === this.mouseXY[1]) {
            this.saveSelectionAsCenter(e);
            this.loadViewCenter();
            return false;
        }
        // find min zoom and apply
        var xRatio = el_body.width() / (end[0] - start[0]);
        var yRatio = el_body.height() / (end[1] - start[1]);
        var viewSize = new Array(2);
        if (xRatio < yRatio) {
            viewSize[0] = (end[0] - start[0]);
            viewSize[1] = el_body.height() / xRatio;
            this.zoom = xRatio;
        } else {
            viewSize[0] = el_body.width() / yRatio;
            viewSize[1] = (end[1] - start[1]);
            this.zoom = yRatio;
        }
        if (this.zoom > this.maxZoom) {
            this.zoom = this.maxZoom;
            viewSize[0] = el_body.width() / this.zoom;
            viewSize[1] = el_body.height() / this.zoom;
        }
        this.refreshZoomButtonState();
        this.applyZoom(this.IE?(this.imgClass):(this.canvasClass),this.image,this.zoom);
        // put center of selection in center of view
        var center = [((end[0] - start[0]) / 2) + start[0],((end[1] - start[1]) / 2) + start[1]];
        this.setScroll((center[0] - (viewSize[0] / 2)) * this.zoom,(center[1] - (viewSize[1] / 2)) * this.zoom);
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
        //this.detachKeyListener();
        //this.detachMouseWheelListener();
        //
        if (this.fullscreen) {
            this.originalWidth = this.options.width;
            this.originalHeight = this.options.height;
            var el_body = $("body").addClass("iv_fullscreenBody");
            
            if (this.originalPositionPlaceholderId === null) {
                this.originalPositionPlaceholderId = this.getGeneratedId("originalPosition_");
                $("<div>",{
                    "id" : this.originalPositionPlaceholderId
                }).insertBefore(this.element);
            }
            
            // create fullscreen holder
            var el_cover = $("<iframe>",{
                "id" : "imageViewerFullscreenCover",
                "scrolling" : "no",
                "frameborder" : "0"
            }).css({
                "position" : "absolute",
                "display" : "block",
                "z-index" : "98",
                "top" : $(document).scrollTop()+"px",
                "left" : "0px",
                "width" : $(window).width(),
                "height" : $(window).height()
            }).appendTo(el_body);
            
            var el_fullscreenDiv = $("<div>",{
                "id" : "imageViewerFullscreenDiv"
            }).css({
                "position" : "absolute",
                "display" : "block",
                "z-index" : "99",
                "top" : $(document).scrollTop()+"px",
                "left" : "0px",
                "background" : "white",
                "width" : $(window).width(),
                "height" : $(window).height()
            }).appendTo(el_body);
            
            // add imageViewer to it
            el_fullscreenDiv.append(this.element);
            
            // display image viewer
            this.resize($(window).width(),$(window).height());
            this.zoomToFit();
            // swap the button image
            this.element.find("."+this.btn_fullscreen).parent().hide();
            this.element.find("."+this.btn_fullscreenRestore).parent().show();
            this.element.find("."+this.msg_fullscreen).show();
        } else {
            //
            this.element.insertAfter($("#"+this.originalPositionPlaceholderId));
            
            $("#imageViewerFullscreenCover").remove();
            $("#imageViewerFullscreenDiv").remove();
            $("body").removeClass("iv_fullscreenBody");
            
            this.resize(this.originalWidth,this.originalHeight);
            this.zoomToFit();
            
            // swap the button image
            this.element.find("."+this.btn_fullscreen).parent().show();
            this.element.find("."+this.btn_fullscreenRestore).parent().hide();
            this.element.find("."+this.msg_fullscreen).hide();
        }

        // attach event listeners
        //this.attachKeyListener();
        //this.attachMouseWheelListener();
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
        if (selection === null) {
            selection = 0;
        }
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
            var el_filmStrip = this.element.find("."+this.filmStripClass);
            var el_body = this.element.find("."+this.bodyClass);
            if (this.filmStripHorizontal) {
                el_body.css({
                    "height" : el_body.height() + this.filmStripHeight + "px"
                });
            } else {
                el_body.css({
                    "width" : el_body.width() + this.filmStripHeight + "px"
                });
            }
            el_filmStrip.remove();
            this.zoomToFit();
        } else {
            var thisObject = this;
            this.element.find("."+this.btn_filmstripClass)
                .parent().addClass(this.bg_buttonSelected);
            // add the filmStrip
            var el_base = this.element.find("."+this.baseClass);
            var el_body = this.element.find("."+this.bodyClass);
            var el_header = this.element.find("."+this.headerClass);
            
            var el_filmStrip = $("<div>",{
                "class" : this.filmStripClass
            });
            // make the buttons
            var el_leftButton = $("<div>",{
                "class" : this.filmStripButtonClass
            });
            var el_rightButton = $("<div>",{
                "class" : this.filmStripButtonClass
            });
            // make the thumb slider
            var el_thumbSlider = $("<div>",{
                "class" : this.filmStripSliderClass
            });
            // make the thumb container
            $("<div>",{
                "class" : this.filmStripThumbContainerClass
            }).appendTo(el_thumbSlider);
			
            // size elements according to orientation
            if (this.filmStripHorizontal) {
		
                this.filmStripSliderLength = (el_base.width() - (this.filmStripButtonWidth * 2 + 2));
                
                el_body.css({
                    "height" : el_body.height() - this.filmStripHeight + "px"
                });

                el_filmStrip.css({
                    "height" : this.filmStripHeight + "px",
                    "width" : el_base.width() + "px",
                    "top" : (el_base.height() - this.filmStripHeight) + "px"
                });

                el_leftButton.css({
                    "width" : this.filmStripButtonWidth + "px",
                    "height" : this.filmStripHeight + "px"
                }).append(
                    $("<div>",{
                        "class" : "iv_filmStripButtonTop"
                })).append(
                    $("<div>",{
                        "class" : "iv_filmStripButtonImage iv_filmStripButtonImageLeft"
                    }).click(function(){
                        thisObject.moveFilmStripRight();
                    })
                );
                
                el_rightButton.css({
                    "width" : this.filmStripButtonWidth + "px",
                    "height" : this.filmStripHeight + "px"
                }).append(
                    $("<div>",{
                        "class" : "iv_filmStripButtonTop"
                    })
                ).append(
                    $("<div>",{
                        "class" : "iv_filmStripButtonImage iv_filmStripButtonImageRight"
                    }).click(function(){
                        thisObject.moveFilmStripLeft();
                    })
                ).append(
                    $("<div>",{
                        "class" : "iv_filmStripRotateButtonHorizontal"
                    }).click(function(){
                        thisObject.transpondFilmStrip();
                    })
                );
                
                el_thumbSlider.css({
                    "width" : this.filmStripSliderLength + "px",
                    "height" : this.filmStripHeight + "px"
                });
            } else {
		
                this.filmStripSliderLength = (el_base.height() - (this.filmStripButtonWidth * 2 + 2 + el_header.height()));
                		
                el_body.css({
                    "width" : el_body.width() - this.filmStripHeight + "px"
                });
		
                el_filmStrip.css({
                    "height" : el_base.height() - el_header.height() + "px",
                    "width" : this.filmStripHeight + "px",
                    "left" : (el_base.width() - this.filmStripHeight) + "px"
                });
		
                el_leftButton.css({
                    "width" : this.filmStripHeight + "px",
                    "height" : this.filmStripButtonWidth + "px"
                }).append($("<div>",{
                    "class" : "iv_filmStripButtonImageVertical iv_filmStripButtonImageVerticalTop"
                }).click(function(){
                    thisObject.moveFilmStripRight();
                }));
                
                el_rightButton.css({
                    "width" : this.filmStripHeight + "px",
                    "height" : this.filmStripButtonWidth + "px"
                }).append($("<div>",{
                    "class" : "iv_filmStripRotateButtonVertical"
                }).click(function(){
                    thisObject.transpondFilmStrip();
                })).append($("<div>",{
                    "class" : "iv_filmStripButtonImageVertical iv_filmStripButtonImageVerticalBottom"
                }).click(function(){
                    thisObject.moveFilmStripLeft();
                }));
                
                el_thumbSlider.css({
                    "width" : this.filmStripHeight + "px",
                    "height" : this.filmStripSliderLength + "px"
                });
            }
	    
            // put it all together
            el_filmStrip
                .append(el_leftButton)
                .append(el_thumbSlider)
                .append(el_rightButton)
                .appendTo(el_base);
            
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
        
        if (this.filmStrip) {
            this.toggelFilmStrip();
        }
        this.filmStripHorizontal = !this.filmStripHorizontal;
        this.toggelFilmStrip();
    },
    
    resizeFilmStrip : function () {

        var el_filmStrip = this.element.find("."+this.filmStripClass);
        if (el_filmStrip) {
            var el_base = this.element.find("."+this.baseClass);
            var el_header = this.element.find("."+this.headerClass);
            var el_thumbSlider = this.element.find("."+this.filmStripSliderClass);
            // resize according to orientation
            if (this.filmStripHorizontal) {
                this.filmStripSliderLength = (el_base.width() - (this.filmStripButtonWidth * 2 + 2));
                el_filmStrip.css({
                    "width" : el_base.width() + "px",
                    "top" : (el_base.height() - this.filmStripHeight) + "px"
                });
                el_thumbSlider.css({
                    "width" : this.filmStripSliderLength + "px"
                });
            } else {
                this.filmStripSliderLength = (el_base.height() - (this.filmStripButtonWidth * 2 + 2 + el_header.height()));
                el_filmStrip.css({
                    "height" : (el_base.height() - el_header.height()) + "px",
                    "left" : (el_base.width() - this.filmStripHeight) + "px"
                });
                el_thumbSlider.css({
                    "height" : this.filmStripSliderLength + "px"
                });
            }
            this.clearFilmStrip();
            this.populateFilmStrip();
        }
    },
    
    moveFilmStripLeft : function () {
        
        var el_slider = this.element.find("."+this.filmStripSliderClass);
        if (el_slider && (this.filmStripHorizontal ? (el_slider.width() < el_slider.children().first().width()) : (el_slider.height() < el_slider.children().first().height()))) {
            this.filmStripPosition++;
            el_slider.children().first().children().first().remove();
            this.populateFilmStrip();
        }
    },
    
    moveFilmStripRight : function () {
        
        var el_slider = this.element.find("."+this.filmStripSliderClass);
        if (el_slider && this.filmStripCacheStart + this.filmStripPosition > 0) {
            this.filmStripPosition--;
            //TODO test el_slider.firstChild.insertBefore(this.createFilmStripThumb(this.filmStripPosition),el_slider.firstChild.firstChild);
            this.createFilmStripThumb(this.filmStripPosition).insertBefore(el_slider.children().first().children().first());
            this.populateFilmStrip();
        }
    },
    
    populateFilmStrip : function () {
	
        var el_slider = this.element.find("."+this.filmStripSliderClass);
        if (el_slider) {
            // update cache if needed, return if cache updated
            if (this.filmStripLarge) {
                if (this.manageFilmStripCache()) {
                    return;
                }
            }
            //
            var sliderWidth = this.filmStripSliderLength;
            var thumbsWidth = 0;
            var thumbs = el_slider.children().first().children();
            // count width of thumbs removeing unnessesery thumbs
            for (var i=0; i<thumbs.length; i+=1) {
                if (thumbsWidth > sliderWidth) {
                    thumbs[i].remove();
                } else {
                    thumbsWidth += this.filmStripThumbSize + 5;
                }
            }
            if (this.filmStripHorizontal) {
                el_slider.children().first().css({
                    "width" : thumbsWidth + "px"
                });
            } else {
                el_slider.children().first().css({
                    "height" : thumbsWidth + "px"
                });
            }
            // add thumbs to fill the thumb slider if needed
            var nextPos = parseInt(this.filmStripPosition) + thumbs.length;
            while (thumbsWidth < sliderWidth) {
                var el_thumb = this.createFilmStripThumb(nextPos);
                if (el_thumb === null) {
                    break;
                }
                thumbsWidth += this.filmStripThumbSize + 5;
                if (this.filmStripHorizontal) {
                    el_slider.children().first().css({
                        "width" : thumbsWidth + "px"
                    });
                } else {
                    el_slider.children().first().css({
                        "height" : thumbsWidth + "px"
                    });
                }
                el_slider.children().first().append(el_thumb);
                nextPos++;
            }
            // make sure there is not to much space on the right side
            var blankSpace;
            if (this.filmStripHorizontal) {
                blankSpace = this.filmStripSliderLength - el_slider.children().first().width();
            } else {
                blankSpace = this.filmStripSliderLength - el_slider.children().first().height();
            }
            if (blankSpace >= this.filmStripThumbSize + 5 && this.filmStripPosition !== 0) {
                this.filmStripPosition -= Math.floor(blankSpace / (this.filmStripThumbSize + 5));
                this.clearFilmStrip();
                this.populateFilmStrip();
            }
            this.highlightSelectedThumb();
        }
    },
    
    highlightSelectedThumb : function () {
        
        var el_slider = this.element.find("."+this.filmStripSliderClass);
        var thisObject = this;
        $(el_slider.children().first().children()).each(function(index,object){
            if (index + thisObject.filmStripPosition + thisObject.filmStripCacheStart === thisObject.imageIndex) {
                $(object).addClass("iv_filmStripHighlight");
            }
        });
    },
    
    setCachePosition : function (selection) {
        
        var halfCacheSize = this.filmStripCacheSize / 2;
        this.filmStripCacheStart = selection - halfCacheSize;
        if (this.filmStripCacheStart + this.filmStripCacheSize > this.filmStripLength) {
            this.filmStripCacheStart = this.filmStripLength - this.filmStripCacheSize;
        }
        if (this.filmStripCacheStart < 0) {
            this.filmStripCacheStart = 0;
        }
    },
    
    manageFilmStripCache : function () {
        
        // find offset to center in thumbs
        var sliderWidth = this.filmStripSliderLength;
        var thumbs = Math.ceil((sliderWidth / (this.filmStripThumbSize + 5)));
        if (this.filmStripThumbs === null) {
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
            if (newCacheStart !== this.filmStripCacheStart) {
                this.filmStripPosition += this.filmStripCacheStart - newCacheStart;
                this.filmStripCacheStart = newCacheStart;
                this.filmStripRangeFunc(newCacheStart,newCacheStart + this.filmStripCacheSize);
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
        
        this.element.find("."+this.filmStripSliderClass).children().first().empty();
    },

    createFilmStripThumb : function (index) {
        
        if (index > -1 && index < this.filmStripThumbs.length) {
            var thisObject = this;
            var el_thumb = $("<div>",{
                "class" : "iv_filmStripThumb"
            }).append(
                $("<table>",{
                    "cellpadding" : "0",
                    "cellspacing" : "0"
                }).append(
                    $("<tr>")
                        .append(
                            $("<td>")
                                .append(
                                    $("<img>",{
                                        "src" : this.filmStripThumbs[index]
                                    }).click(function(){
                                        thisObject.onFilmStripThumbSelected(index);
                                    })
                                )
                        )
                )
            );
            return el_thumb;
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
        if (this.filmStripSelectionListener !== null) {
            this.filmStripSelectionListener(index+this.filmStripCacheStart);
        }
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
        
        if (this.filmStripLength === 1) {
            return;
        }
        this.diaShow = !this.diaShow;
        if (this.diaShow) {
            this.element.find("."+this.btn_diashowClass)
                .parent().addClass(this.bg_buttonSelected);
            this.setDiaShowNextImageTimeout();
        } else {
            this.element.find("."+this.btn_diashowClass)
                .parent().removeClass(this.bg_buttonSelected);
            window.clearTimeout(this.diaShowTimer);
        }
    },
    
    diaShowNextImage : function () {
        
        if (this.element.find("."+this.bodyClass).length > 0) {
            this.nextImage();
            if (this.imageIndex === this.filmStripLength - 1) {
                this.toggleDiaShow();
            } else {
                this.setDiaShowNextImageTimeout();
            }
        }
    },
    
    setDiaShowNextImageTimeout : function () {

        var thisObject = this;
        this.diaShowTimer = window.setTimeout(function(){
            if (this.element.find("."+this.baseClass).length > 0) {
                thisObject.diaShowNextImage();
            }
        }, this.diaShowTime);
    },
    
    // handel mouse over event
    onMouseOver : function () {

        this.mouseOver = true;
    },
    
    // handel mouse out event
    onMouseOut : function (event) {

        this.mouseOver = false;
        this.onMouseCancel(event);
    },
    
    // return is mouse over image viewer
    getMouseOver : function () {

        return this.mouseOver;
    },
    
    // handel mouse click start event
    onMouseSelect : function (e) {
        
        if (this.blockEvents) {
            return;
        }
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
    
    // handel mouse move event
    onMouseMove : function (e) {
        
        if (this.blockEvents) {
            return;
        }
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
    
    // handel mouse click release event
    onMouseRelease : function (e) {
        
        if (this.blockEvents) {
            return;
        }
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
    
    // handel mouse cancel event (mouse draged out of area)
    onMouseCancel : function (e) {
        
        if (this.blockEvents) {
            return;
        }
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
    
    // handel double click event
    onMouseDoubleClick : function (e) {
        
        if (this.blockEvents) {
            return;
        }
        switch (this.mode) {
            case this.mode_move:
                this.zoomSelection(e);
                break;
        }
    },
    
    // attach key event listener
    attachKeyListener : function () {
        
        var thisObject = this;
        this.element.find("."+this.eventClass)
            .on("keydown", function(event){
                thisObject.onKeyDown(event);
            }).on("keyup", function(event){
                thisObject.onKeyUp(event);
            });
    },
    
    // detach key event listener
    detachKeyListener : function () {
        
        this.element.find("."+this.eventClass)
            .off("keydown")
            .off("keyup");
    },
    
    // handel key down event
    onKeyDown : function (event) {
        
        if (this.blockEvents) {
            return;
        }
        if (!this.ivCtrlKeyDown) { 
            if (event.which === 17) { // strg
                if (this.mode === this.mode_move) {
                    this.selectZoomMode();
                } else {
                    this.selectMoveMode();
                }
                this.ivCtrlKeyDown = true;
            }
        }
        if (event.which === 107) { // addition
            this.zoomIn(1);
        }
        if (event.which === 109) { // subtraction
            this.zoomOut(1);
        }
        if (this.fullscreen) {
            if (event.whitch === 27) { // escape
                this.toggelFullscreenMode();
            }
        }
    },
    
    // handel key up event
    onKeyUp : function (event) {
        
        if (this.blockEvents) {
            return;
        }
        if (this.ivCtrlKeyDown) {
            if (event.which === 17) {
                if (this.mode === this.mode_move) {
                    this.selectZoomMode();
                } else {
                    this.selectMoveMode();
                }
                this.ivCtrlKeyDown = false;
            }
        }
    },
    
    // attach mouse wheel event listener
    attachMouseWheelListener : function () {
        
        var thisObject = this;
        $(window).on('mousewheel DOMMouseScroll', function(event){
            var delta;
            if (event.originalEvent.wheelDelta) {
                delta = event.originalEvent.wheelDelta / 120;
            } else if (event.originalEvent.detail) {
                delta = event.originalEvent.detail / 3;
            }
            delta = -delta;
            return thisObject.onMouseWheel(delta);
        });
    },
    
    // detach mouse wheel event listener
    detachMouseWheelListener : function () {
        
        $(window).off('mousewheel DOMMouseScroll');
    },
    
    // handel mouse wheel event
    onMouseWheel : function (delta) {
        
        if (!this.getMouseOver() || this.blockEvents) {
            return true;
        }
        if (this.element.find("."+this.baseClass).length === 0) {
            this.detachMouseWheelListener();
            this.detachKeyListener();
            return true;
        }
        if (delta > 0) {
            this.zoomIn(delta);
        } else if (delta < 0) {
            this.zoomOut(-delta);
        }
        return false;
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
    
    getGeneratedId : function (prefix) {
        var id;
        do {
            id = prefix + Math.floor(Math.random()*1000000000);
        } while ($("#"+id).length > 0)
        return id;
    },
    
    setCursor : function (object, cursorClass) {
        return object
            .removeClass(this.cur_closedHandClass)
            .removeClass(this.cur_openHandClass)
            .removeClass(this.cur_crosshairClass)
            .addClass(cursorClass);
    }
    
});

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
        "iv.zoom.message" : "zoom: ",
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
        "iv.zoom.message" : "Zoom: ",
        "iv.filmstrip" : "Show image selector filmstrip",
        "iv.diashow" : "toggle diashow animation",
        "iv.previmage" : "show previous image",
        "iv.nextimage" : "show next image"
    }
};


