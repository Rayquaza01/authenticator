// Script created by Max1Truc
// Source available on GitHub at https://GitHub.com/Max1Truc/crypt
// It's under the MIT License

function crypt(message, password) {
  // initialize the crypted message var
  var crypted = '';
  // crypt each letter
  for (var i = 0; i < message.length; i++) {
    var indexLetterInText, indexLetterInPass, cryptedLetter;
    indexLetterInText = message[i].charCodeAt(0);
    indexLetterInPass = password[i % password.length].charCodeAt(0);
    cryptedLetter = String.fromCharCode(indexLetterInText + indexLetterInPass);
    crypted = crypted.concat(cryptedLetter);
  }
  // return
  return crypted;
}

function decrypt(cryptedMessage, password) {
  // initialize the decrypted message var
  var decrypted = '';
  // decrypt each letter
  for (var i = 0; i < cryptedMessage.length; i++) {
    var indexLetterInText, indexLetterInPass, decryptedLetter;
    indexLetterInText = cryptedMessage[i].charCodeAt(0);
    indexLetterInPass = password[i % password.length].charCodeAt(0);
    decryptedLetter = String.fromCharCode(indexLetterInText - indexLetterInPass);
    decrypted = decrypted.concat(decryptedLetter);
  }
  // return
  return decrypted;
}

// Tests functions, else log it into the console
var message = 'Hello World !';
var pass = 'MyPassword';
if (decrypt(crypt(message, pass), pass) !== message) {
  console.error('Error in Max1Truc\'s Crypt Script !');
}
