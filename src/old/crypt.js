// This file is not used for encryption in authenticatior anymore.
// It is still used for upgrading from pre-2.0.0 versions



// Script created by Max1Truc
// Source available on GitHub at https://GitHub.com/Max1Truc/crypt
// It's under the MIT License

function modulo(a, b) {
  return a - (b * Math.floor(a / b));
}

export function crypt(message, password) {
  // ALPHABET, changing it changes characters which are encrypted
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 =";
  // initialize the crypted message var
  var crypted = '';
  // crypt each letter
  for (var i = 0; i < message.length; i++) {
    var indexLetterInText, indexLetterInPass, cryptedLetter;
    indexLetterInText = modulo(ALPHABET.indexOf(message[i]), ALPHABET.length);
    indexLetterInPass = modulo(ALPHABET.indexOf(password[modulo(i, password.length)]), ALPHABET.length);
    cryptedLetter = ALPHABET[modulo(indexLetterInText + indexLetterInPass, ALPHABET.length)];
    crypted = crypted.concat(cryptedLetter);
  }
  // return
  return crypted;
}

export function decrypt(cryptedMessage, password) {
  // ALPHABET, changing it changes characters which are encrypted
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 =";
  // initialize the decrypted message var
  var decrypted = '';
  // decrypt each letter
  for (var i = 0; i < cryptedMessage.length; i++) {
    var indexLetterInText, indexLetterInPass, decryptedLetter;
    indexLetterInText = modulo(ALPHABET.indexOf(cryptedMessage[i]), ALPHABET.length);
    indexLetterInPass = modulo(ALPHABET.indexOf(password[modulo(i, password.length)]), ALPHABET.length);
    decryptedLetter = ALPHABET[modulo(indexLetterInText - indexLetterInPass, ALPHABET.length)];
    decrypted = decrypted.concat(decryptedLetter);
  }
  // return
  return decrypted;
}
