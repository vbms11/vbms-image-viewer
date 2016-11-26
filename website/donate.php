<?php include 'template/templateTop.php'; ?>

<h1>Donate</h1>
<p>
Here you can donate money.
</p>

<div class="donateDiv">
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input name="cmd" value="_s-xclick" type="hidden">
        <input name="hosted_button_id" value="NDYUQXK46Y4BW" type="hidden">
        <input src="https://www.paypalobjects.com/en_US/DE/i/btn/btn_donateCC_LG.gif" name="submit" alt="PayPal - The safer, easier way to pay online!" style="border:1px solid #000" type="image">
        <img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" style="border:1px solid #c0c0c0" width="1" height="1" />
    </form>
</div>

<h3>What you are donating for</h3>
<p>
Further development of the image viewer
</p>

<?php include 'template/templateBottom.php'; ?>