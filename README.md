# authenticator

Firefox addon that generates TOTPs for 2 factor authentication

This addon shows TOTPs (Timed One Time Passwords) for accounts set up with 2 Factor Authentication/2 Step Verification.  
Enter the site name and secret key in the addon's options page and click the check to add a site.  
The codes will appear in the toolbar icon. The copy icon after the code copies the code.

It is worth noting that the secret keys entered are currently NOT encrypted. Encryption will be added in a later version. Keep this in mind before using this extension.

# Acknowledgements

-   Using icons from [Material Design Icons](https://materialdesignicons.com/) ([OFL 1.1](http://scripts.sil.org/OFL))
-   Using [otplib](https://github.com/yeojz/otplib) ([MIT](https://opensource.org/licenses/mit))
-   Using [alphanumerical branch](https://github.com/Max1Truc/crypt/tree/alphanumerical-encryption) of [crypt](https://github.com/Max1Truc/crypt) ([MIT](https://opensource.org/licenses/mit))
-   Using [jsSHA](https://caligatio.github.io/jsSHA/) ([BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)) to hash the master password.

[Link to addon page](https://addons.mozilla.org/en-US/firefox/addon/two-factor-authenticator/)
