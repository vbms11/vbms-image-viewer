
function getThumbsUrlsByIndexRangeCompleted(urlArray) {
    iv_id.updateFilmStripThumbCache(urlArray);
}
function getImageByIndexCompleted(urlArray) {
    iv_id.changeImage(urlArray[0]);
}
function dummySelectionListener(index) {
} 

var iv_id;
function getContentPanel() {
	return jQuery("#divContentRight");
}

function getImageViewerSize () {
	var jq = getContentPanel();
	return [jq.width() - 50, jq.height() - 200];
}

function resizeImageViewer () {
	//alert('resizeImageViewer');
	// if image viewer is not on page anymore cancel
	var el_base = document.getElementById("iv_id_base");
	if (el_base == null) {
		//alert('unbind');
		getContentPanel().unbind("resize");		
		iv_id = null;
		return;
	}
	// resize image viewer
	var size = getImageViewerSize();
	iv_id.resize(size[0],size[1]);
}

function initImageViewer (imageUrl,selectedLanguage,applicationPath,parentId,width,height) {
	// init image viewer
	iv_id = new ImageViewer("iv_id",width,height,imageUrl,selectedLanguage,applicationPath);
	iv_id.attach(parentId);
}

function initImageViewerWithFilmStrip (imageUrl,filmStripImages,filmStripThumbs,filmStripSelectionListener,selectedLanguage,applicationPath,parentId) {
	getContentPanel().bind("resize", resizeImageViewer);
	var size = getImageViewerSize();
	
	// init image viewer
	iv_id = new ImageViewer("iv_id",size[0],size[1],imageUrl,selectedLanguage,applicationPath);
	iv_id.initFilmStrip(filmStripThumbs,filmStripImages,filmStripSelectionListener);
	iv_id.initDiaShow(true);
	iv_id.initNextPrevious(true);
	iv_id.attach(parentId);
}

function initImageViewerWithLargeFilmStrip (imageUrl,length,selection,getRangeFunc,getImageFunc,selectionListener,selectedLanguage,applicationPath,parentId) {
	getContentPanel().bind("resize", resizeImageViewer);
	var size = getImageViewerSize();
	
	// init image viewer
	iv_id = new ImageViewer("iv_id",size[0],size[1],imageUrl,selectedLanguage,applicationPath);
	iv_id.initLargeFilmStrip(length,getRangeFunc,getImageFunc,selection,selectionListener);
	iv_id.initDiaShow(true);
	iv_id.initNextPrevious(true);
	iv_id.attach(parentId);
	//alert(parentId);
}
