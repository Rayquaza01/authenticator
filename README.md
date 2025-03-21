# Deprecation Notice
The encryption included in this extension is not secure. As such, I am deprecating this extension. It will no longer be installable from AMO. You may still use it, but migrating to a different app is recommended.

Apologies for any inconvenience.

# Migration
To export your keys, go to the extension settings (the gear in the popup), and click the "Export" button at the bottom of the page. A file (totp.json) will be downloaded containing your authenticator keys. You can then use those keys with a different authenticator app.

---

# authenticator

Firefox addon that generates TOTPs for 2 factor authentication

This addon shows TOTPs (Timed One Time Passwords) for accounts set up with 2 Factor Authentication/2 Step Verification.  
Enter the site name and secret key in the addon's options page and click the check to add a site.  
The codes will appear in the toolbar icon. The copy icon after the code copies the code.

Secret keys added to this extension are encrypted if a password is provided during setup. Please store your secret keys in another location (e.g. a password manager) just to be safe!

# Acknowledgements

-   Using icons from [Material Design Icons](https://materialdesignicons.com/) ([OFL 1.1](http://scripts.sil.org/OFL))
-   Using [otplib](https://github.com/yeojz/otplib) ([MIT](https://opensource.org/licenses/mit))
-   Using [alphanumerical branch](https://github.com/Max1Truc/crypt/tree/alphanumerical-encryption) of [crypt](https://github.com/Max1Truc/crypt) ([MIT](https://opensource.org/licenses/mit))
-   Using [jsSHA](https://caligatio.github.io/jsSHA/) ([BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)) to hash the master password.

[Link to addon page](https://addons.mozilla.org/en-US/firefox/addon/two-factor-authenticator/)
