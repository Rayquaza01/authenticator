function decryptJSON (myJSON, password) {
  myJSON.otp_list.forEach((item) => {
    item.key = decrypt(item.key, password);
  });
  return myJSON;
}

function cryptJSON (myJSON, password) {
  myJSON.otp_list.forEach((item) => {
    item.key = crypt(item.key, password);
  });
  return myJSON;
}
