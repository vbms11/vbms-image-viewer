/**
 * this software is copyright menta software gmbh.
 * you may not use or alter the code for your own purposes
 */


/* image viewer */
var selectedImageViewer = null;
function ImageViewer (elId, width, height, imageUrl, selectedLanguage, applicationPath) {
	//
	this.elId = elId;
	this.width = width;
	this.height = height;
	this.imageUrl = imageUrl;
	this.imageIndex = null;
	this.image;
	this.fadeImage;
	this.language = selectedLanguage;
	this.applicationPath = applicationPath;
	this.parentId;
	//
	this.zoom = 1;
	this.zoomStep = 0.1;
	this.minZoom = 0.10;
	this.maxZoom = 5.0;
	this.rotation = 0;
	//
	this.imgWidth;
	this.imgHeight;
	this.scrollTop = 0;
	this.scrollLeft = 0;
	// 
	this.mouseXY;
	this.selected = false;
	this.selection;
	this.mouseOver = false;
	this.blockEvents = false;
	// 
	this.drawCtx = null;
	this.markCtx = null;
	this.lines = new Array();
	this.lineRatio = -1;
	// 
	this.imgSuffix = "_img";
	this.baseSuffix = "_base";
	this.bodySuffix = "_body";
	this.drawSuffix = "_draw";
	this.markSuffix = "_mark";
	this.fadeSuffix = "_fade";
	this.eventSuffix = "_event";
	this.frameSuffix = "_frame";
	this.canvasSuffix = "_canvas";
	this.headerSuffix = "_header";
	this.messageSuffix = "_message";
	this.lengthInputSuffix = "_lengthInput";
	this.lengthPanelSuffix = "_lengthPanel";
	this.btn_diashowSuffix = "_filmstripdiashow";
	this.btn_filmstrip = "_filmstriptoggle";
	this.btn_zoomSelection = "_zoomSelection";
	this.btn_move = "_move";
	this.btn_mesure = "_mesure";
	this.btn_zoomIn = "_zoomIn";
	this.btn_zoomOut = "_zoomOut";
	this.btn_prev = "_prev";
	this.btn_next = "_next";
	this.btn_clear = "_clear";
	// defined modes
	this.mode_move = 1;
	this.mode_zoom = 2;
	this.mode_draw = 3;
	this.mode = 1;
	// curors
	this.cur_openHand;
	this.cur_closedHand;
	// images
	this.bg_button;
	this.bg_buttonSelected;
	// 
	this.fullscreen = false;
	this.originalWidth;
	this.originalHeight;
	//
	this.IE = document.all?true:false;
	
	
	// init
	this.attach = function (parentId) {
		// insert base html
		this.parentId = parentId;
		var el_parent = document.getElementById(parentId);
		el_parent.innerHTML =
			"<div id=\""+this.elId+this.baseSuffix+"\" class=\"iv_base\">"+
				"<div id=\""+this.elId+this.headerSuffix+"\" class=\"iv_header\">"+
					"<div class=\"iv_buttonLeft iv_buttonBg\"><img id=\""+this.elId+"_rotateLeft\" title=\""+this.getTranslation('iv.rotate.left')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_rotateLeft.gif\" onclick=\""+this.elId+".rotateLeft();\" class=\"iv_button\" ></img></div>"+
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+"_rotateRight\" title=\""+this.getTranslation('iv.rotate.right')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_rotateRight.gif\" onclick=\""+this.elId+".rotateRight();\" class=\"iv_button\" ></img></div>"+
					
					"<div class=\"iv_buttonLeft iv_buttonBg\"><img id=\""+this.elId+this.btn_zoomIn+"\" title=\""+this.getTranslation('iv.zoom.in')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_max.gif\" onclick=\""+this.elId+".zoomIn();\" class=\"iv_button\" ></img></div>"+
					"<div class=\"iv_buttonLeft iv_buttonBg\"><img id=\""+this.elId+this.btn_zoomOut+"\" title=\""+this.getTranslation('iv.zoom.out')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_min.gif\" onclick=\""+this.elId+".zoomOut();\" class=\"iv_button\" ></img></div>"+
					"<div class=\"iv_buttonLeft iv_buttonBg\"><img id=\""+this.elId+"_1-1\" title=\""+this.getTranslation('iv.zoom.11')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_1-1.gif\" onclick=\""+this.elId+".zoomReset();\" class=\"iv_button\" ></img></div>"+
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+"_expand\" title=\""+this.getTranslation('iv.zoom.fit')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_expand.gif\" onclick=\""+this.elId+".zoomToFit();\" class=\"iv_button\" ></img></div>"+
					
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+this.btn_zoomSelection+"\" title=\""+this.getTranslation('iv.zoom.selection')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_zoomSelection.gif\" onclick=\""+this.elId+".selectZoomMode();\" class=\"iv_button\" ></img></div>"+
					
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+this.btn_move+"\" title=\""+this.getTranslation('iv.move')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_move.gif\" onclick=\""+this.elId+".selectMoveMode();\" class=\"iv_button\" ></img></div>"+
					
					"<div class=\"iv_buttonLeft iv_buttonBg\"><img id=\""+this.elId+this.btn_mesure+"\" title=\""+this.getTranslation('iv.mesure.draw')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_mesure.gif\" onclick=\""+this.elId+".selectMesureMode();\" class=\"iv_button\" ></img></div>"+
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+this.btn_clear+"\" title=\""+this.getTranslation('iv.mesure.clear')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_clear.gif\" onclick=\""+this.elId+".onClearLines();\" class=\"iv_button\" ></img></div>"+
					
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+"_window\" title=\""+this.getTranslation('iv.window')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_window.gif\" onclick=\""+this.elId+".showInWindow();\" class=\"iv_button\" ></img></div>"+
					
					(this.filmStripThumbs != null || this.filmStripLarge == true ?
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+this.btn_filmstrip+"\" title=\""+this.getTranslation('iv.filmstrip')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_filmstrip.gif\" onclick=\""+this.elId+".toggelFilmStrip();\" class=\"iv_button\" ></img></div>":"")+
					
					(this.diaShowButton ?
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+this.btn_diashowSuffix+"\" title=\""+this.getTranslation('iv.diashow')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_diashow.gif\" onclick=\""+this.elId+".toggleDiaShow();\" class=\"iv_button\" ></img></div>":"")+
					
					(this.showNextPreviousButtons ? (
					"<div class=\"iv_buttonLeft iv_buttonBg\"><img id=\""+this.elId+this.btn_prev+"\" title=\""+this.getTranslation('iv.previmage')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_prev.gif\" onclick=\""+this.elId+".previousImage();\" class=\"iv_button\" ></img></div>"+
					"<div class=\"iv_buttonLeft iv_buttonBg iv_buttonSpacing\"><img id=\""+this.elId+this.btn_next+"\" title=\""+this.getTranslation('iv.nextimage')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_next.gif\" onclick=\""+this.elId+".nextImage();\" class=\"iv_button\" ></img></div>"):"")+
					
					"<div id=\""+this.elId+this.messageSuffix+"\" style=\"float: left; margin-top: 1px; margin-left: 1px;\"></div>"+
					"<div class=\"iv_buttonRight iv_buttonBg\"><img id=\""+this.elId+"_fullscreen\" title=\""+this.getTranslation('iv.fullscreen')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_fullscreen.gif\" onclick=\""+this.elId+".toggelFullscreenMode();\" class=\"iv_button\"/ ></img></div>"+
					"<div class=\"iv_buttonRight iv_buttonBg iv_buttonBgSelected\" style=\"display:none;\"><img id=\""+this.elId+"_restore\" title=\""+this.getTranslation('iv.restore')+"\" src=\""+this.applicationPath+"/images/common/imageViewer/iv_restore.gif\" onclick=\""+this.elId+".toggelFullscreenMode();\" class=\"iv_button\" ></img></div>"+
					"<div id=\""+this.elId+"_restoreMessage\" style=\"display:none; float: right; margin-top: 1px; margin-right: 1px; color:red;\">"+
						"<b>"+this.getTranslation('iv.restore')+"</b>"+
					"</div>"+
				"</div>"+
				"<div id=\""+this.elId+this.bodySuffix+"\" style=\"overflow:hidden;position:absolute;\" class=\"iv_body\">"+
				"</div>"+
			"</div>";
		
		// size to initial size
		this.resize(this.width,this.height);
		// prelaod image
		this.image = new Image();
		this.image.src = this.imageUrl;
		// set cursor icons
		this.cur_openHand = "url("+applicationPath+"/images/common/imageViewer/iv_openhand.cur), default";
		this.cur_closedHand = "url("+applicationPath+"/images/common/imageViewer/iv_closedhand.cur), default";
		this.bg_button = "url("+applicationPath+"/images/common/imageViewer/button_bg.gif)";
		this.bg_buttonSelected = "url("+applicationPath+"/images/common/imageViewer/button_bg_selected.gif)";
		// set tool enabled state
		if (this.showNextPreviousButtons)
			this.refreshNextPrevButtonState();
		if (this.diaShowButton && this.filmStripLength == 1)
			this.setToolDisabled(this.elId+this.btn_diashowSuffix);
		this.setToolDisabled(this.elId+this.btn_clear);
		//
		this.completeAttach();
	}
	this.completeAttach = function () {
		// wait for image to complete loading
		if (!this.image.complete) {
			if (document.getElementById(this.elId + this.bodySuffix) != null) 
				setTimeout(this.elId+".completeAttach();",100);
			return;
		}
		// load image into browsers
		this.imgWidth = this.image.width;
   		this.imgHeight = this.image.height;
		var el_body = document.getElementById(this.elId + this.bodySuffix);
		if (this.IE) {
			el_body.innerHTML = 
				"<div id='"+this.elId+this.frameSuffix+"' class='iv_frame'>"+
				"<img id='"+this.elId+this.imgSuffix+"' width='"+this.imgWidth+"' height='"+this.imgHeight+"' class='iv_image' src='"+this.imageUrl+"' />"+
				//"<img id='"+this.elId+this.fadeSuffix+"' class='iv_fadeImage'>"+
				"<div id='"+this.elId+this.drawSuffix+"' class='iv_drawLayer'></div>"+
				"<div id='"+this.elId+this.markSuffix+"' class='iv_markLayer'></div>"+
				"<div id='"+this.elId+this.eventSuffix+"' class='iv_eventLayer' onmouseover='"+this.elId+".onMouseOver();' onmouseout='"+this.elId+".onMouseOut(event);' onmousedown='"+this.elId+".onMouseSelect(event); this.focus(); return false;' onmouseup='"+this.elId+".onMouseRelease(event);' onmousemove='"+this.elId+".onMouseMove(event); return false;' ondblclick='"+this.elId+".onMouseDoubleClick(event);' tabindex='0'></div>"+
				"</div>";
		} else {
			el_body.innerHTML = 
				"<div id='"+this.elId+this.frameSuffix+"' class='iv_frame'>"+
				"<canvas id='"+this.elId+this.canvasSuffix+"' style=\"position:absolute;\" class='iv_canvas' width='"+this.imgWidth+"' height='"+this.imgHeight+"'></canvas>"+
				//"<canvas id='"+this.elId+this.fadeSuffix+"' style=\"position:absolute;\" class='iv_fadeCanvas'></canvas>"+
				"<div id='"+this.elId+this.drawSuffix+"' style=\"position:absolute;\" class='iv_drawLayer'></div>"+
				"<div id='"+this.elId+this.markSuffix+"' style=\"position:absolute;\" class='iv_markLayer'></div>"+
				"<div id='"+this.elId+this.eventSuffix+"' style=\"position:absolute;\" class='iv_eventLayer' onmouseover='"+this.elId+".onMouseOver();' onmouseout='"+this.elId+".onMouseOut(event);' onmousedown='"+this.elId+".onMouseSelect(event); this.focus(); return false;' onmouseup='"+this.elId+".onMouseRelease(event);' onmousemove='"+this.elId+".onMouseMove(event); return false;' ondblclick='"+this.elId+".onMouseDoubleClick(event);' tabindex='0'></div>"+
				"</div>";
		}
		this.zoomToFit();
		//
		this.selectMoveMode();
		// add event listeners
		selectedImageViewer = this;
		this.attachKeyListener();
		this.attachMouseWheelListener();
	}
	
	this.changeImage = function (imageUrl) {
		if (this.imageUrl == imageUrl)
			return;
		// set button states
		if (this.showNextPreviousButtons)
			this.refreshNextPrevButtonState();
		// change the image
		this.imageUrl = imageUrl;
		this.onClearLines();
		this.image = new Image();
		this.image.src = this.imageUrl;
		this.completeChangeImage();
	}
	
	this.completeChangeImage = function () {
		// wait for image to complete loading
		if (!this.image.complete) {
			if (document.getElementById(this.elId + this.bodySuffix) != null) 
				setTimeout(this.elId+".completeChangeImage();",100);
			return;
		}
		// save image width, height
		this.imgWidth = this.image.width;
   		this.imgHeight = this.image.height;
		if (this.IE) {
			var el_img = document.getElementById(this.elId+this.imgSuffix);
			el_img.src = this.imageUrl;
			el_img.width = this.imgWidth;
			el_img.height = this.imgHeight;
		} else {
		}
		this.zoomToFit();
	}
	
	// resizing
	this.resize = function (width,height) {
		//
		this.saveViewCenter();
		if (this.fullscreen) {
			var winDim = getWindowDimensions();
			width = winDim[0];
			height = winDim[1];
		}
		this.width = width;
		this.height = height;
		var el_base = document.getElementById(this.elId + this.baseSuffix);
		el_base.style.width = width + "px";
		el_base.style.height = height + "px";
		var el_header = document.getElementById(this.elId + this.headerSuffix);
		el_header.style.width = width + "px";
		var el_body = document.getElementById(this.elId + this.bodySuffix);
		
		if (this.filmStrip) {
			if (this.filmStripHorizontal) {
				el_body.style.height = height - (el_header.offsetHeight + this.filmStripHeight) + "px";
				el_body.style.width = width + "px";
			} else {
				el_body.style.height = height - el_header.offsetHeight + "px";
				el_body.style.width = width - this.filmStripHeight + "px";
			}
			this.resizeFilmStrip();
		} else {
			el_body.style.width = width + "px";
			el_body.style.height = height - el_header.offsetHeight + "px";
		}
		this.loadViewCenter();
	}
	this.resizeLayers = function () {
		//
		var el_draw = document.getElementById(this.elId+this.drawSuffix);
		var el_event = document.getElementById(this.elId+this.eventSuffix);
		var el_frame = document.getElementById(this.elId+this.frameSuffix);
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
	}
	
	// scrolling
	this.setScroll = function (scrollLeft,scrollTop) {
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		
		// check scroll is in bounds
		if (this.rotation == 90 || this.rotation == 270) {
			if ((this.imgHeight*this.zoom)-scrollLeft < el_body.offsetWidth)
				scrollLeft = this.imgHeight*this.zoom - el_body.offsetWidth;
			if ((this.imgWidth*this.zoom)-scrollTop < el_body.offsetHeight)
				scrollTop = this.imgWidth*this.zoom - el_body.offsetHeight;
		} else {
			if ((this.imgWidth*this.zoom)-scrollLeft < el_body.offsetWidth)
				scrollLeft = this.imgWidth*this.zoom - el_body.offsetWidth;
			if ((this.imgHeight*this.zoom)-scrollTop < el_body.offsetHeight)
				scrollTop = this.imgHeight*this.zoom - el_body.offsetHeight;
		}
		if (scrollLeft < 0)
			scrollLeft = 0;
		if (scrollTop < 0)
			scrollTop = 0;
		
		// apply scroll
		this.scrollLeft = Math.floor(scrollLeft);
		this.scrollTop = Math.floor(scrollTop);
		var el_frame = document.getElementById(this.elId+this.frameSuffix);
		if (el_frame != null) {
			el_frame.style.left = -scrollLeft + "px";
			el_frame.style.top = -scrollTop + "px";
		}
	}
	
	// view position saving and loading
	this.center;
	this.saveViewCenter = function () {
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		this.center = [Math.floor(((el_body.offsetWidth/2)+this.scrollLeft)/this.zoom),
					Math.floor(((el_body.offsetHeight/2)+this.scrollTop)/this.zoom)];
	}
	this.loadViewCenter = function () {
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		this.setScroll((this.center[0]*this.zoom)-(el_body.offsetWidth/2),(this.center[1]*this.zoom)-(el_body.offsetHeight/2));
	}
	this.saveSelectionAsCenter = function (e) {
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		var el_draw = document.getElementById(this.elId+this.drawSuffix);
		this.mouseXY = this.getMouseXY(e);
		this.center = [((this.mouseXY[0]-this.getLeft(el_body))+this.scrollLeft)/this.zoom,
		               ((this.mouseXY[1]-this.getTop(el_body))+this.scrollTop)/this.zoom];
	}
	this.rotateViewCenter = function (rotation) {
		
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
	}
	
	// for non ie, paints image to canvas function
	this.paintCanvas = function (canvasId,image,zoom,rotation) {
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
	}
	
	// simple image zooming
	this.zoomIn = function (steps) {
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
	}
	this.zoomOut = function (steps) {
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
	}
	this.zoomReset = function () {
		this.zoom = 1;
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		this.setScroll(0,0);
		this.applyZoom(this.IE?(this.elId+this.imgSuffix):(this.elId+this.canvasSuffix),this.image,this.zoom);
		this.refreshZoomButtonState();
	}
	this.zoomToFit = function (targetId,image) {
		if (targetId == undefined || image == undefined) {
			this.zoom = this.getFitZoom(this.image);
			this.applyZoom(this.IE?(this.elId+this.imgSuffix):(this.elId+this.canvasSuffix),this.image,this.zoom);
		} else {
			var zoom = this.getFitZoom(image);
			this.applyZoom(targetId,image,zoom);
		}
		this.refreshZoomButtonState();
	}
	this.getFitZoom = function (image) {
		var el_body = document.getElementById(this.elId+this.bodySuffix);
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
	}
	this.zoomSelection = function (e) {
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
	}
	this.applyZoom = function (targetId,image,zoom) {
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
	}
	this.applyZoomCenter = function () {
		// clear lines now so they dont jump
		this.clearDrawContext();
		this.clearMarkContext();
		//
		if (this.IE) {
			// resize image
			var el_img = document.getElementById(this.elId+this.imgSuffix);
			el_img.style.zoom = Math.round(100*this.zoom) + "%";
		} else {
			this.paintCanvas(this.IE?(this.elId+this.imgSuffix):(this.elId+this.canvasSuffix),this.image,this.zoom,this.rotation);
		}
		this.loadViewCenter();
		// set size of layers
		this.resizeLayers();
		this.redrawLines();
		// set zoom value message
		this.renderZoomMessage();
	}
	this.renderZoomMessage = function () {
		var zoomMsg = (Math.round(100*this.zoom)) + "%";
		if (this.language == "de") zoomMsg = "Zoom: " + zoomMsg;
		else zoomMsg = "zoom: " + zoomMsg;
		document.getElementById(this.elId+this.messageSuffix).innerHTML = zoomMsg;
	}
	
	// image rotation
	this.rotateRight = function () {
		this.saveViewCenter();
		this.rotateViewCenter(90);
		this.rotation = this.rotation + 90;
		this.applyRotation();
		this.loadViewCenter();
	}
	this.rotateLeft = function () {
		this.saveViewCenter();
		this.rotateViewCenter(270);
		this.rotation = this.rotation - 90;
		this.applyRotation();
		this.loadViewCenter();
	}
	this.applyRotation = function () {
		// 
		if (this.rotation>=360) {
			this.rotation = this.rotation - 360;
		} else if (this.rotation<0) {
			this.rotation = this.rotation + 360;
		}
		// 
		if (this.IE) {
			var el_img = document.getElementById(this.elId+this.imgSuffix);
			el_img.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation="+this.rotation/90+");";
		} else {
			this.paintCanvas(this.IE?(this.elId+this.imgSuffix):(this.elId+this.canvasSuffix),this.image,this.zoom,this.rotation);
		}
		this.applyZoom(this.IE?(this.elId+this.imgSuffix):(this.elId+this.canvasSuffix),this.image,this.zoom);
	}
	
	// image draging
	this.moved;
	this.selectMoveMode = function () {
		this.mode = this.mode_move;
		document.getElementById(this.elId+this.eventSuffix).style.cursor = this.cur_openHand;
		this.setToolSelection(this.btn_move);
	}
	this.onImageSelect = function (e) {
		this.mouseXY = this.getMouseXY(e);
		this.selected = true;
		this.moved = false;
		document.getElementById(this.elId+this.eventSuffix).style.cursor = this.cur_closedHand;
	}
	this.onImageMove = function (e) {
		if (!this.selected)
			return;
		this.moved = true;
		var el_body = document.getElementById(this.elId + this.bodySuffix);
		var newXY = this.getMouseXY(e);
		this.setScroll(this.scrollLeft - (newXY[0] - this.mouseXY[0]),this.scrollTop - (newXY[1] - this.mouseXY[1]));
		this.mouseXY = newXY;
	}
	this.onImageRelease = function (e) {
		this.selected = false;
		//if (!this.moved) {
		//	this.saveSelectionAsCenter(e);
		//	this.loadViewCenter();
		//}
		document.getElementById(this.elId+this.eventSuffix).style.cursor = this.cur_openHand;
	}
	
	// mesure mode
	this.selectMesureMode = function () {
		this.mode = this.mode_draw;
		document.getElementById(this.elId+this.eventSuffix).style.cursor = "crosshair";
		this.setToolSelection(this.btn_mesure);
	}
	this.onStartMesure = function (e) {
		this.selection = this.mouseXY = this.getMouseXY(e);
		var el_draw = document.getElementById(this.elId+this.drawSuffix);
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		this.selection[0] = this.selection[0] - this.getLeft(el_draw);
		this.selection[1] = this.selection[1] - this.getTop(el_draw);
		this.selected = true;
	}
	this.onMoveMesure = function (e) {
		if (!this.selected)
			return;
		this.mouseXY = this.getMouseXY(e);
		var el_draw = document.getElementById(this.elId+this.drawSuffix);
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		this.mouseXY[0] = this.mouseXY[0] - this.getLeft(el_draw);
		this.mouseXY[1] = this.mouseXY[1] - this.getTop(el_draw);
		this.clearMarkContext();
		this.markCtx.setColor("#00ff00");
		this.markCtx.drawLine(this.selection[0],this.selection[1],this.mouseXY[0],this.mouseXY[1]);
		this.markCtx.paint();
	}
	this.onEndMesure = function () {
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
	}
	this.onCancelMesure = function () {
		this.clearMarkContext();
		this.selected = false;
	}
	this.showMesureLengthPanel = function () {
		this.blockEvents = true;
		this.lineRatio = -1;
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		var el_lengthPanel = document.createElement("div");
		el_lengthPanel.setAttribute("id", this.elId+this.lengthPanelSuffix);
		el_body.appendChild(el_lengthPanel);
		el_lengthPanel.className = "iv_lengthPanel";
		el_lengthPanel.innerHTML = 
			" "+this.getTranslation("iv.measure.input.length")+": "+
			"<input type=\"text\" id=\""+this.elId+this.lengthInputSuffix+"\" onKeyPress=\""+this.elId+".commitMesureLengthOnEnter(event);\" tabindex='0'/>"+
			"<input type=\"button\" onclick=\""+this.elId+".commitMesureLength(); return false;\" value=\""+this.getTranslation("iv.measure.button.apply")+"\"/>"+
			"<input type=\"button\" onclick=\""+this.elId+".cancelMesureLengthPanel(); return false;\" value=\""+this.getTranslation("iv.measure.button.cancel")+"\"/>";
		document.getElementById(this.elId+this.lengthInputSuffix).focus(); 
	}
	this.hideMesureLengthPanel = function () {
		this.blockEvents = false;
		var el_lengthPanel = document.getElementById(this.elId+this.lengthPanelSuffix);
		if (el_lengthPanel != null)
			el_lengthPanel.parentNode.removeChild(el_lengthPanel);
	}
	this.commitMesureLength = function () {
		var value = document.getElementById(this.elId+this.lengthInputSuffix).value;
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
		this.clearToolDisabled(this.elId+this.btn_clear);
	}
	this.commitMesureLengthOnEnter = function (event) {
		if (!event)
			event = window.event;
		if (event.which == 13 || event.keyCode == 13) { // return
			this.commitMesureLength();
		}
	}
	this.cancelMesureLengthPanel = function () {
		this.hideMesureLengthPanel();
		this.onCancelMesure();
		this.onClearLines();
	}
	
	this.rotateLine = function (line,rotation) {
		if (rotation==0)
			return line;
		if (rotation==90)
			return [this.imgHeight-line[1],line[0],this.imgHeight-line[3],line[2],line[4]];
		if (rotation==180)
			return [this.imgWidth-line[0],this.imgHeight-line[1],this.imgWidth-line[2],this.imgHeight-line[3],line[4]];
		if (rotation==270)
			return [line[1],this.imgWidth-line[0],line[3],this.imgWidth-line[2],line[4]];
	}
	
	this.correctLineRotation = function (line,rotation) {
		if (rotation==0 || rotation==360)
			return line;
		if (rotation==90)
			return [this.imgWidth-line[1],line[0],this.imgWidth-line[3],line[2],line[4]];
		if (rotation==180)
			return [this.imgWidth-line[0],this.imgHeight-line[1],this.imgWidth-line[2],this.imgHeight-line[3],line[4]];
		if (rotation==270)
			return [line[1],this.imgHeight-line[0],line[3],this.imgHeight-line[2],line[4]];
	}
	
	this.redrawLines = function () {
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
				if (this.language == "de")
					len.replace(".",",");
				this.drawCtx.drawString(len,((points[0]*this.zoom)+(points[2]*this.zoom))/2,((points[1]*this.zoom)+(points[3]*this.zoom))/2);
			}
			this.drawCtx.paint();
		} else {
			this.cancelMesureLengthPanel();
		}
	}
	this.clearDrawContext = function () {
		if (this.drawCtx != null)
			this.drawCtx.clear();
		document.getElementById(this.elId+this.drawSuffix).innerHTML = "";
		this.drawCtx = new jsGraphics(this.elId+this.drawSuffix);
	}
	this.clearMarkContext = function () {
		if (this.markCtx != null)
			this.markCtx.clear();
		document.getElementById(this.elId+this.markSuffix).innerHTML = "";
		this.markCtx = new jsGraphics(this.elId+this.markSuffix);
	}
	this.onClearLines = function () {
		this.clearDrawContext();
		while (this.lines.length!=0)
			this.lines.pop();
		this.lineRatio = -1;
		this.setToolDisabled(this.elId+this.btn_clear);
	}
	
	// zoom selection mode
	this.selectZoomMode = function () {
		this.mode = this.mode_zoom;
		document.getElementById(this.elId+this.eventSuffix).style.cursor = "crosshair";
		this.setToolSelection(this.btn_zoomSelection);
	}
	this.onStartZoom = function (e) {
		var el_draw = document.getElementById(this.elId+this.drawSuffix);
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		// set selection start point
		this.selection = this.getMouseXY(e);
		this.selection[0] = this.selection[0] - this.getLeft(el_draw);
		this.selection[1] = this.selection[1] - this.getTop(el_draw);
		// set selection end point as start point
		this.mouseXY = this.getMouseXY(e);
		this.mouseXY[0] = this.mouseXY[0] - this.getLeft(el_draw);
		this.mouseXY[1] = this.mouseXY[1] - this.getTop(el_draw);
		this.selected = true;
	}
	this.onMoveZoom = function (e) {
		if (!this.selected)
			return;
		this.mouseXY = this.getMouseXY(e);
		var el_draw = document.getElementById(this.elId+this.drawSuffix);
		var el_body = document.getElementById(this.elId+this.bodySuffix);
		this.mouseXY[0] = this.mouseXY[0] - this.getLeft(el_draw);
		this.mouseXY[1] = this.mouseXY[1] - this.getTop(el_draw);
		this.clearMarkContext();
		this.markCtx.setColor("#00ff00");
		this.markCtx.drawLine(this.selection[0],this.selection[1],this.mouseXY[0],this.selection[1]);
		this.markCtx.drawLine(this.selection[0],this.selection[1],this.selection[0],this.mouseXY[1]);
		this.markCtx.drawLine(this.mouseXY[0],this.selection[1],this.mouseXY[0],this.mouseXY[1]);
		this.markCtx.drawLine(this.selection[0],this.mouseXY[1],this.mouseXY[0],this.mouseXY[1]);
		this.markCtx.paint();
	}
	this.onEndZoom = function (e) {
		this.clearMarkContext();
		this.selected = false;
		var el_body = document.getElementById(this.elId+this.bodySuffix);
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
		this.applyZoom(this.IE?(this.elId+this.imgSuffix):(this.elId+this.canvasSuffix),this.image,this.zoom);
		// put center of selection in center of view
		var center = [((end[0]-start[0])/2)+start[0],((end[1]-start[1])/2)+start[1]];
		this.setScroll((center[0] - (viewSize[0]/2)) * this.zoom,(center[1] - (viewSize[1]/2)) * this.zoom);
	}
	this.onCancelZoom = function (e) {
		this.clearMarkContext();
		this.selected = false;
	}
	
	//
	
	//
	this.showInWindow = function () {
		window.open(this.imageUrl, "", "height=600, width=700, dependent=yes, menubar=no, toolbar=no, scrollbars=yes, resizable=yes");
	}
	
	// toggels fullscreen mode
	this.toggelFullscreenMode = function () {
		this.fullscreen = !this.fullscreen;
		this.clearMarkContext();
		this.clearDrawContext();
		// detach event listeners
		this.detachKeyListener();
		this.detachMouseWheelListener();
		//
		if (this.fullscreen) {
			this.originalWidth = this.width;
			this.originalHeight = this.height;
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
			document.getElementById("iv_id_fullscreen").parentNode.style.display = "none";
			document.getElementById("iv_id_restore").parentNode.style.display = "block";
			document.getElementById("iv_id_restoreMessage").style.display = "block";
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
			document.getElementById("iv_id_fullscreen").parentNode.style.display = "block";
			document.getElementById("iv_id_restore").parentNode.style.display = "none";
			document.getElementById("iv_id_restoreMessage").style.display = "none";
		}
		
		// attach event listeners
		this.attachKeyListener();
		this.attachMouseWheelListener();
	}
	this.isFullscreen = function () {
		return this.fullscreen;
	}
	
	// filmstrip
	this.filmStripThumbs = null;
	this.filmStripImages = null;
	this.filmStrip = false;
	this.filmStripHeight = 166;
	this.filmStripPosition = 0;
	this.filmStripThumbSize = 160;
	this.filmStripButtonWidth = 30;
	this.filmStripSuffix = "_filmstrip";
	this.filmStripSliderSuffix = "_filmstripslider";
	this.filmStripRangeFunc = null;
	this.filmStripImageFunc = null;
	this.filmStripLength;
	this.filmStripLarge = false;
	this.filmStripCacheStart = 0;
	this.filmStripCacheSize = 50;
	this.filmStripSelectionListener = null;
	this.filmStripHorizontal = true;
	this.filmStripSliderLength;
	 
	this.initFilmStrip = function (filmStripThumbs, filmStripImages, selectionListener) {
		this.filmStripThumbs = filmStripThumbs;
		this.filmStripImages = filmStripImages;
		this.filmStripSelectionListener = selectionListener;
		this.filmStripLength = filmStripThumbs.length;
		// find the selected image
		for (var i=0; i<this.filmStripImages.length; i+=1) {
			if (this.filmStripImages[i] == this.imageUrl) {
				this.selectFilmStripImage(i);
				return;
			}
		}
	}
	this.initLargeFilmStrip = function (length,getRangeFunc,getImageFunc,selection,selectionListener) {
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
	}
	this.toggelFilmStrip = function () {
		this.filmStrip = !this.filmStrip;
		if (!this.filmStrip) {
			document.getElementById(this.elId+this.btn_filmstrip).parentNode.style.backgroundImage = this.bg_button;
 			// remove the filmstrip
			var el_filmStrip = document.getElementById(this.elId+this.filmStripSuffix);
			var el_body = document.getElementById(this.elId+this.bodySuffix);
			if (this.filmStripHorizontal) {
				el_body.style.height = el_body.offsetHeight + this.filmStripHeight + "px";
			} else {
				el_body.style.width = el_body.offsetWidth + this.filmStripHeight + "px";
			}
			el_filmStrip.parentNode.removeChild(el_filmStrip);
			this.zoomToFit();
		} else {
			document.getElementById(this.elId+this.btn_filmstrip).parentNode.style.backgroundImage = this.bg_buttonSelected;
			// add the filmStrip
			var el_base = document.getElementById(this.elId+this.baseSuffix);
			var el_body = document.getElementById(this.elId+this.bodySuffix);
			var el_header = document.getElementById(this.elId+this.headerSuffix);
			
			var el_filmStrip = document.createElement("div");
			el_filmStrip.setAttribute("id",this.elId+this.filmStripSuffix);
			el_filmStrip.className = "iv_filmStrip";
			
			// make the left, right buttons
			var el_leftButton = document.createElement("div");
			var el_rightButton = document.createElement("div");
			el_leftButton.className = el_rightButton.className = "iv_filmStripButton";
			
			// make the thumb slider
			var el_thumbSlider = document.createElement("div");
			el_thumbSlider.setAttribute("id",this.elId+this.filmStripSliderSuffix);
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
	}
	this.transpondFilmStrip = function () {
		if (this.filmStrip)
			this.toggelFilmStrip();
		this.filmStripHorizontal = !this.filmStripHorizontal;
		this.toggelFilmStrip();
	}
	this.resizeFilmStrip = function () {
		var el_filmStrip = document.getElementById(this.elId+this.filmStripSuffix);
		var el_header = document.getElementById(this.elId+this.headerSuffix);
		if (el_filmStrip) {
			var el_base = document.getElementById(this.elId+this.baseSuffix);
			var el_thumbSlider = document.getElementById(this.elId+this.filmStripSliderSuffix);
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
	}
	this.moveFilmStripLeft = function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderSuffix);
		if (el_slider && (this.filmStripHorizontal ? (el_slider.offsetWidth < el_slider.firstChild.offsetWidth) : (el_slider.offsetHeight < el_slider.firstChild.offsetHeight))) {
			this.filmStripPosition++;
			el_slider.firstChild.removeChild(el_slider.firstChild.firstChild);
			this.populateFilmStrip();
		}
	}
	this.moveFilmStripRight = function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderSuffix);
		if (el_slider && this.filmStripCacheStart + this.filmStripPosition > 0) {
			this.filmStripPosition--;
			el_slider.firstChild.insertBefore(this.createFilmStripThumb(this.filmStripPosition),el_slider.firstChild.firstChild);
			this.populateFilmStrip();
		}
	}
	this.populateFilmStrip = function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderSuffix);
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
	}
	this.highlightSelectedThumb = function () {
		var el_slider = document.getElementById(this.elId+this.filmStripSliderSuffix);
		var thumbs = el_slider.firstChild.childNodes;
		for (var i=0; i<thumbs.length; i++) {
			if (i + this.filmStripPosition + this.filmStripCacheStart == this.imageIndex) {
				thumbs[i].className = "iv_filmStripThumb iv_filmStripHighlight";
			} else {
				thumbs[i].className = "iv_filmStripThumb";
			}
		}
	}
	this.setCachePosition = function (selection) {
		var halfCacheSize = this.filmStripCacheSize / 2;
		this.filmStripCacheStart = selection - halfCacheSize;
		if (this.filmStripCacheStart + this.filmStripCacheSize > this.filmStripLength)
			this.filmStripCacheStart = this.filmStripLength - this.filmStripCacheSize;
		if (this.filmStripCacheStart < 0)
			this.filmStripCacheStart = 0;
	}
	this.manageFilmStripCache = function () {
		// find offset to center in thumbs
		var el_slider = document.getElementById(this.elId+this.filmStripSliderSuffix);
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
	}
	this.updateFilmStripThumbCache = function (urlArray) {
		this.filmStripThumbs = urlArray;
		this.clearFilmStrip();
		this.populateFilmStrip();
	}
	this.clearFilmStrip = function () {
		document.getElementById(this.elId+this.filmStripSliderSuffix).firstChild.innerHTML = "";
	}
	this.createFilmStripThumb = function (index) {
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
	}
	this.onFilmStripThumbSelected = function (index) {
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
	}
	this.selectFilmStripImage = function (index) {
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
	} 
	
	// next \ previous image
	this.showNextPreviousButtons = false;
	this.initNextPrevious = function (flag) {
		this.showNextPreviousButtons = flag;
	}
	this.nextImage = function () {
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
	}
	this.previousImage = function () {
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
	}
	
	// diashow
	this.diaShowButton = false;
	this.diaShow = false;
	this.diaShowTimer = null;
	this.diaShowTime = 5000;
	this.initDiaShow = function (flag) {
		this.diaShowButton = flag;
	}
	this.toggleDiaShow = function () {
		if (this.filmStripLength == 1)
			return;
		this.diaShow = !this.diaShow;
		if (this.diaShow) {
			document.getElementById(this.elId+this.btn_diashowSuffix).parentNode.style.backgroundImage = this.bg_buttonSelected;
			this.diaShowTimer = window.setTimeout("if ("+this.elId+" != undefined) { "+this.elId+".diaShowNextImage(); }",this.diaShowTime);
		} else {
			document.getElementById(this.elId+this.btn_diashowSuffix).parentNode.style.backgroundImage = this.bg_button;
			window.clearTimeout(this.diaShowTimer);
		}
	}
	this.diaShowNextImage = function () {
		if (document.getElementById(this.elId+this.bodySuffix) != null) {
			this.nextImage();
			if (this.imageIndex == this.filmStripLength - 1) {
				this.toggleDiaShow();
			} else {
				this.diaShowTimer = window.setTimeout("if ("+this.elId+" != undefined) { "+this.elId+".diaShowNextImage(); }",this.diaShowTime);
			}
		}
	}
	
	// mouse handeling
	this.onMouseOver = function () {
		this.mouseOver = true;
	}
	this.onMouseOut = function (event) {
		this.mouseOver = false;
		this.onMouseCancel(event);
	}
	this.getMouseOver = function () {
		return this.mouseOver;
	}
	this.onMouseSelect = function (e) {
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
	}
	this.onMouseMove = function (e) {
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
	}
	this.onMouseRelease = function (e) {
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
	}
	this.onMouseCancel = function (e) {
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
	}
	this.onMouseDoubleClick = function (e) {
		if (this.blockEvents)
			return;
		switch (this.mode) {
			case this.mode_move:
				this.zoomSelection(e);
				break;
		}
	}
	
	// key handeling
	this.ivCtrlKeyDown = false;
	this.attachKeyListener = function () {
		var el_event = document.getElementById(this.elId+this.eventSuffix);
		if (el_event.addEventListener) {
			el_event.addEventListener('keydown', ivOnKeyDown, false);
			el_event.addEventListener('keyup', ivOnKeyUp, false);
	 	}else if (el_event.attachEvent) {
	 		el_event.attachEvent('onkeydown', ivOnKeyDown);
	 		el_event.attachEvent('onkeyup', ivOnKeyUp);
		}
	}
	this.detachKeyListener = function () {
		var el_event = document.getElementById(this.elId+this.eventSuffix);
		if(el_event.removeEventListener) {
			el_event.removeEventListener('keydown', ivOnKeyDown, false);  
			el_event.removeEventListener('keyup', ivOnKeyUp, false);
	  	} else if(el_event.detachEvent) {
	  		el_event.detachEvent('onkeydown', ivOnKeyDown);
	  		el_event.detachEvent('onkeyup', ivOnKeyUp);
		}
	}
	this.onKeyDown = function (event) {
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
	}
	this.onKeyUp = function (event) {
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
	}
	
	// mouse wheel handeling
	this.attachMouseWheelListener = function () {
		if(window.addEventListener) {
	      	window.addEventListener('DOMMouseScroll', ivOnMouseWheel, false);  
	    	window.addEventListener('mousewheel', ivOnMouseWheel, false);
	  	} else if(window.attachEvent) {
	    	window.attachEvent('onmousewheel', ivOnMouseWheel);
		}
		window.onmousewheel = document.onmousewheel = ivOnMouseWheel;
	}

	this.detachMouseWheelListener = function () {
		if(window.removeEventListener) {
	      	window.removeEventListener('DOMMouseScroll', ivOnMouseWheel, false);  
	    	window.removeEventListener('mousewheel', ivOnMouseWheel, false);
	  	} else if(window.detachEvent) {
	    	window.detachEvent('onmousewheel', ivOnMouseWheel);
		}
		window.onmousewheel = document.onmousewheel = '';
	}
	this.onMouseWheel = function (event) {
		if (!this.getMouseOver() || this.blockEvents)
			return;
		if (document.getElementById(this.elId+this.baseSuffix) == null) {
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
	}
	
	// button highlight
	this.selectedToolId = null;
	this.clearToolSelection = function () {
		if (this.selectedToolId != null)
			document.getElementById(this.elId+this.selectedToolId).parentNode.style.backgroundImage = this.bg_button;
		this.selectedToolId = null;
		if (this.lines.length == 0)
			this.setToolDisabled(this.elId+this.btn_clear);
	}
	this.setToolSelection = function (id) {
		this.clearToolSelection();
		this.selectedToolId = id;
		document.getElementById(this.elId+this.selectedToolId).parentNode.style.backgroundImage = this.bg_buttonSelected;
	}
	this.clearToolDisabled = function (id) {
		document.getElementById(id).className = "iv_button";
	}
	this.setToolDisabled = function (id) {
		document.getElementById(id).className = "iv_buttonDisabled";
	}
	this.refreshNextPrevButtonState = function () {
		if (this.imageIndex == 0) {
			this.setToolDisabled(this.elId+this.btn_prev);
		} else {
			this.clearToolDisabled(this.elId+this.btn_prev);	
		}
		if (this.imageIndex == this.filmStripLength - 1) {
			this.setToolDisabled(this.elId+this.btn_next);
		} else {
			this.clearToolDisabled(this.elId+this.btn_next);
		}
	}
	this.refreshZoomButtonState = function () {
		if (this.zoom == this.maxZoom) {
			this.setToolDisabled(this.elId+this.btn_zoomIn);
			this.setToolDisabled(this.elId+this.btn_zoomSelection);
		} else {
			this.clearToolDisabled(this.elId+this.btn_zoomIn);
			this.clearToolDisabled(this.elId+this.btn_zoomSelection);
		}
		if (this.zoom == this.minZoom) {
			this.setToolDisabled(this.elId+this.btn_zoomOut);
		} else {
			this.clearToolDisabled(this.elId+this.btn_zoomOut);
		}
	}
	
	// language
	this.setLanguage = function (language) {
		this.language = language;
	}
	this.getTranslation = function (textCode) {
		var languageTexts = ivTranslationTexts[selectedLanguage];
		if (languageTexts == null) {
			alert("The image viewer dose not have any \ntranslations for the selected language "+selectedLanguage);
		} else {
			if (languageTexts[textCode] == null) {
				alert("No translation exists in the language: "+selectedLanguage+" for the key: "+textCode);
			} else {
				return languageTexts[textCode];
			}
		}
	}
	
	// util functions
	this.getMouseXY = function (e) {
		if (this.IE) {
	    	return [event.clientX + document.body.scrollLeft, event.clientY + document.body.scrollTop];
	    } else {
	    	return [e.pageX, e.pageY];
	  	}
	}
	this.getLeft = function (ele) {
		if (ele.offsetParent)	return ele.offsetLeft + this.getLeft(ele.offsetParent);
		else 					return ele.offsetLeft;
	}
	this.getTop = function (ele) {
		if (ele.offsetParent) 	return (ele.offsetTop + this.getTop(ele.offsetParent));
		else 					return (ele.offsetTop);
	}
}

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


