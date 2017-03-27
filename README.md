# authenticator
Firefox addon that generates TOTPs for 2 factor authentication

This addon shows TOTPs (Timed One Time Passwords) for accounts set up with 2 Factor Authentication/2 Step Verification.  
Enter the site name and secret key in the addon's options page and click the check to add a site.  
The codes will appear in the toolbar icon. The copy icon after the code copies the code.

On the options page, the pencil icon next to a site allows you to change the key for that site and the delete icon removes that site.

It is worth noting that the secret keys entered are NOT encrypted and, as far as I can, tell there is no way to securely store extension data without asking the user for a password everytime the extension is used. Keep this in mind before using this extension.

This addon uses [JS-OTP](https://github.com/jiangts/JS-OTP/) and [jsSHA](https://github.com/Caligatio/jsSHA) to generate the codes.  
The icons are from [Material Design Icons](https://materialdesignicons.com/).

[Link to addon page](https://addons.mozilla.org/en-US/firefox/addon/two-factor-authenticator/)
