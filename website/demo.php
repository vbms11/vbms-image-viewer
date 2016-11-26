<?php include 'template/templateTop.php'; ?>

<h1>Image Viewer Demo</h1>

<h3>Plain Image Viewer</h3>
<p>This is the image viewer with minimum configuration.</p>
<div id="imageViewer1"></div>

<script type="text/javascript">
$("#imageViewer1").imageViewer({
    'imageUrl' : 'test/image1.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'originalSize' : true
});
</script>

<h3>Film Strip</h3>
<p>This is the image viewer with film strip.</p>
<div id="imageViewer2"></div>

<script type="text/javascript">
$("#imageViewer2").imageViewer({
    'imageUrl' : 'test/image2.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'originalSize' : true,
    'filmStripActive' : true,
    'filmStripThumbs' : ['test/small/image1.jpg','test/small/image2.jpg','test/small/image3.jpg','test/small/image4.jpg','test/small/image5.jpg','test/small/image6.jpg'],
    'filmStripImages' : ['test/image1.jpg','test/image2.jpg','test/image3.jpg','test/image4.jpg','test/image5.jpg','test/image6.jpg']
});
</script>

<h3>Dia Show &amp; Extra Buttons</h3>
<p>This is the image viewer with film strip, dia show and next previous buttons. The film strip is set to vertical</p>
<div id="imageViewer3"></div>

<script type="text/javascript">
$("#imageViewer3").imageViewer({
    'imageUrl' : 'test/image3.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'originalSize' : true,
    'enableDiaShow' : true,
    'enableNextPrevious' : true,
    'filmStripActive' : true,
    'filmStripVertical' : true,
    'filmStripThumbs' : ['test/small/image1.jpg','test/small/image2.jpg','test/small/image3.jpg','test/small/image4.jpg','test/small/image5.jpg','test/small/image6.jpg'],
    'filmStripImages' : ['test/image1.jpg','test/image2.jpg','test/image3.jpg','test/image4.jpg','test/image5.jpg','test/image6.jpg']
});
</script>

<h3>Lazy Loading Image Viewer</h3>
<p>This is the image viewer with film strip lazy loading. This can be used to get the images per ajax in case of a verry large collection of images.</p>
<div id="imageViewer4"></div>

<script type="text/javascript">
function getThumbsRangeCallback(startIndex,endIndex) {
    var thumbs = ['test/small/image1.jpg','test/small/image2.jpg','test/small/image3.jpg','test/small/image4.jpg','test/small/image5.jpg','test/small/image6.jpg'];
    $("#imageViewer4").imageViewer("updateFilmStripThumbCache",thumbs);
}
function getImageCallback(index) {
    var images = ['test/image1.jpg','test/image2.jpg','test/image3.jpg','test/image4.jpg','test/image5.jpg','test/image6.jpg'];
    $("#imageViewer4").imageViewer("changeImage",images[index]);
}
function dummySelectionListener(index) {
}
$("#imageViewer4").imageViewer({
    'imageUrl' : 'test/image4.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'originalSize' : true,
    'enableDiaShow' : true,
    'enableNextPrevious' : true,
    'filmStripActive' : true,
    'filmStripLength' : 4,
    'getThumbsRangeCallback' : getThumbsRangeCallback,
    'getImageCallback' : getImageCallback
});
</script>

<h3>Image analysis</h3>
<p>This shows the image analysis feature of the image viewer</p>
<div id="imageViewer5"></div>

<script type="text/javascript">
$("#imageViewer5").imageViewer({
    'imageUrl' : 'test/faces.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'enableFaceInfo' : true, 
    'filmStripActive' : true, 
    'filmStripType' : 'face'
});
</script>

<h3>Exif data</h3>
<p>This shows the exif data feature of the image viewer</p>
<div id="imageViewer6"></div>

<script type="text/javascript">
$("#imageViewer6").imageViewer({
    'imageUrl' : 'test/exif.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'enableExif' : true 
});
</script>

<h3>Image Filter</h3>
<p>This shows the image filter feature of the image viewer</p>
<div id="imageViewer7"></div>

<script type="text/javascript">
$("#imageViewer7").imageViewer({
    'imageUrl' : 'test/image4.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'enableImageFilter' : true 
});
</script>

<h3>Image Items</h3>
<p>This shows the image items feature of the image viewer. Information is displayed about items found in the image.</p>
<div id="imageViewer8"></div>

<h3>Button Placement, Alignment</h3>
<p>This shows the options for placement and alignment of buttons.</p>
<div id="imageViewer9"></div>

<h3>Button Visibility</h3>
<p>This shows the Button Visibility feature of the image viewer. Buttons are only visible if the mouse is over the image. Various effects can be used. (slide, fade, drop, flash)</p>
<p>Effect: 
    <select name='effect10'>
        <option value='none'>(None)</option>
        <option value='fade'>Fade</option>
        <option value='slide'>Slide</option>
        <option value='fade'>Blind</option>
    <select>
</p>

<div id="imageViewer10"></div>

<script type="text/javascript">
var imageViewer10 = $("#imageViewer10").imageViewer({
    'imageUrl' : 'test/image4.jpg',
    'lang' : 'en',
    'width' : 700,
    'height' : 500,
    'hideButtons' : true,
    'hideButtonsEffect' : 'fade'
});
$("#effect10").change(function(e){
    var effect = e.item.val();
    imageViewer10.setOption('hideButtonsEffect', effect);
});
</script>

<?php include 'template/templateBottom.php'; ?>