<?php 

include 'template/templateTop.php';

switch ($view) {
    
    case "sent":
        
?>

<h1>Contact Message Sent</h1>
<p>
Your message has been sent.
</p>

<h3>Wait for response</h3>
<p>
Our company will receive the message straight away. 
We will respond to you as soon as possible. 
</p>

<form action="" method="post">
    <button type="submit">Send Another Message</button>
</form>

<?php 
        
        break;
    case "validate":
    default:
        
?>

<h1>Contact</h1>
<p>
Image Viewer web page contact form.
</p>

<h3>Send us a message</h3>
<p>
Here is the contact form that you can use to send us messages.
</p>

<form action="" method="post">
    <div class="divTable">
        <div>
            <label>First Name</label>
            <div><input value="firstName" type="textfeild" placeholder="Enter your first name here!" /></div>
        </div>
        <div>
            <label>Last Name</label>
            <div><input value="lastName" type="textfeild" placeholder="Enter your last name here!" /></div>
        </div>
        <div>
            <label>Email</label>
            <div><input value="email" type="email" placeholder="Enter your email address here!"/></div>
        </div>
        <div>
            <label>Message</label>
            <div>
                <textarea name="message" placeholder="Write your message in this feild!">
                    
                </textarea>
            </div>
        </div>
    </div>
    <button type="submit" name="submit" value="1">Send Message</button>
    <button type="reset">Send Message</button>
</form>

<?php 
        
}

include 'template/templateBottom.php'; 

?>