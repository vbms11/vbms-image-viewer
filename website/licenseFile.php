<?php 
include 'classes/licenseKey.php';

$email = isset($_GET["email"]) ? $_GET["email"] : null;

if ($email) {
    
    $license = new License();
    $file = $license->getLicenseFile($email);
    
    if ($file != null) {
        
        echo $file;
        exit;
    }
}

include 'template/templateTop.php'; ?>

<h1>No License Exists</h1>
<p>
You do not seem to have purchased a license. 
<a href="license.php?email=<?php echo htmlspecialchars(urlencode($email), ENT_QUOTES); ?>">Buy license now</a>. 
</p>

<?php include 'template/templateBottom.php'; ?>