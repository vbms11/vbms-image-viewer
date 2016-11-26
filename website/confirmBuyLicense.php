<?php 
include 'template/templateTop.php'; 
include 'classes/licenseKey.php';

$license = new License();
$license->onLicensePurchased();

?>

<h1>License Delivery</h1>
<p>
Congradulations it seems that you have purchased the license. 
Below is your license key. It has also been sent to your email address. 
</p>

<h3>License Key</h3>
<p>
    This is your license key: 
    <b><?php echo $license->licenseKey; ?></b>
</p>

<h3>Download Commercial version</h3>
<p>
<a href="download.php?email=<?php echo htmlspecialchars(urlencode($license->email), ENT_QUOTES); ?>">Download imageViewer.js package</a> that already contain the appropriate license. 
Simply use that version instead of the older download. 
Updates can be downloaded from the same page by entering your email as an existing customer. 
</p>

<h3>License Key File</h3>
<p>
Put the license key in the same folder as imageViewer.js. Download Here.
</p>

<h3>Installing License Key</h3>
<p>
The license key is put in the same folder as imageViewer.js. 
The license key email contains a further imageViewer.js that already contain the appropriate license. 
Simply use the newer imageViewer.js or put the license file in the same folder. 
</p>

<?php include 'template/templateBottom.php'; ?>