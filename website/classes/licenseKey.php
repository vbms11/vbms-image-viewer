<?php

class Email {
    
    static function send ($to, $from, $subject, $message, $html=true) {
        
        $header  = "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/".($html ? "html" : "plain")."; charset=iso-8859-1\r\n";
        $header .= "From: $from\r\n";
        $header .= "Reply-To: $from\r\n";
        $header .= "X-Mailer: PHP ". phpversion();
        
        return mail($to,$subject,$message,$header);
    }
    
}

class License {
    
    public static $salt = "vbmscode";
    public static $licensesFile = "licenses.ini";
    
    public static $licenseKeySubject = "ImageViewer License Key";
    public static $licenseKeyMessage = "
    <h1>ImageViewer License Key</h1>
    <p>Thank you for ordering a commercial license key. Read the instructions on how to install the license key!</p>
    <p>License Key: <b>placeholder_key</b></p>
    <h3>Preinstalled version</h3>
    <p>If you dont want to manualy install the license you can now download the prepackaged version.</p>
    <p>Preinstalled version: <a href='placeholder_download'>Download</a></p>
    <h3>Updates</h3>
    <p>Future versions can be downloaded for free on our <a href='placeholder_homepage'>web page</a> without aditional costs.</p>
    <p>Thank you for buying our product. placeholder_datetime</p>
    ";
    
    public $email = null;
    public $licenseKey = null;
    public $validation = array();
    public $message = array();
    
    function setEmail ($email) {
        
        $this->email = $email;
    }
    
    function isValid () {
        
        if ($this->email == null) {
            $message["email"] = "Please enter a valid email address!";
        } else if (filter_var($this->email, FILTER_VALIDATE_EMAIL) && preg_match('/@.+\./', $this->email)) {
            $message["email"] = "Please enter a valid email address!";
        }
        
        return count($this->validation) == 0;
    }
    
    function onLicensePurchased () {
        
        $key = $this->makeLicenseKey($this->email);
        $this->sendLicenseKey();
        $this->storeLicenseKey();
    }
    
    function makeLicenseKey ($companyName = null) {
    
        $salt = md5(self::$salt);
        
        $hash = md5(($companyName == null ? $this->email : $this->email).$salt);
        
        $this->licenseKey = $hash;
        
        return $hash;
    }
    
    function sendLicenseKey () {
        
        $message = $this->replacePlaceholders($licenseKeyMessage);
        
        Email::send($this->email, Config::getAdminEmail(), self::$licenseKeySubject, $message);
    }
    
    function confirmPurchase () {
        
        return true;
    }
    
    function resendLicenseKey ($email) {
        
        if (($license = $this->getEmailLicense($email)) != null) {
            
            $this->email = $email;
            $this->licenseKey = $license;
            
            $this->sendLicenseKey();
        }
    }
    
    function getEmailLicense ($email) {
        
        $licenses = parse_ini_file(self::$licensesFile);
        
        if (isset($licenses[$email])) {
            return $licenses[$email];
        }
        return null;
    }
    
    function storeLicenseKey () {
        
        if ($this->getEmailLicense($this->email) != null) {
            file_put_contents(self::$licensesFile, $this->email."=".$this->licenseKey , FILE_APPEND);
        }
    }
    
    function replacePlaceholders ($message) {
        
        $placeholders = array('/placeholder_key/' => $this->licenseKey, 
            '/placeholder_download/' => $_SERVER["HTTP_HOST"]."/download.php?email=".urlencode($this->email), 
            '/placeholder_homepage/' => $_SERVER["HTTP_HOST"], 
            '/placeholder_datetime/' => new Date());
        
        return preg_replace(array_keys($placeholders), array_values($placeholders), $message);
    }
    
    function getLicenseFile ($email) {
        
        $license = $this->getEmailLicense($email);
        
        if ($license != null) {
            
            $file = file_get_contents(self::$licenseFile);
            
            $placeholders = array(
                '/ownerName/' => $this->licenseKey, 
                '/licenseKey/' => $license
            );
            
            return preg_replace(array_keys($placeholders), array_values($placeholders), $file);
        }
        
        return null;
    }
}
