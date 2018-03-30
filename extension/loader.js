const totpbox = document.getElementById("totpbox");
const hiddenCopy = document.getElementById("hiddencopy");
const ticker = document.getElementById("ticker");

const enterPassword = document.getElementById("enterPassword");
const passwordInput = document.getElementById("password");
const submitPassword = document.getElementById("submitPassword");

function copyTarget(code, copy) {
  // move code to textarea, copy
  hiddenCopy.value = code.innerText;
  hiddenCopy.focus();
  hiddenCopy.setSelectionRange(0, hiddenCopy.value.length);
  document.execCommand("copy");
  hiddenCopy.blur();
  // Change icon from copy to check for 1s as visual feedback
  copy.src = "icons/check.svg";
  setTimeout(() => {
    copy.src = "icons/content-copy.svg";
  }, 1000);
}

function timeLoop() {
  // from https://github.com/yeojz/otplib/blob/gh-pages/js/app.js#L65
  var epoch = Math.floor(Date.now() / 1000);
  var countDown = epoch % 30;
  ticker.innerText = (30 - countDown);
  if (countDown === 0) {
    var codes = document.getElementsByClassName("timecode");
    for (var code of codes) {
      if (code.dataset.key === "") {
        continue;
      } else {
        code.innerText = otplib.authenticator.generate(code.dataset.key);
      }
    }
  }
}

function createRow(item) {

  var row = document.createElement("div");
  row.className = "row";
  totpbox.appendChild(row);

  var name = document.createElement("span");
  name.innerText = item.name;
  name.className = "name";
  row.appendChild(name);

  var code = document.createElement("span");
  if (item.name === "") {
    code.style.padding = 0;
  }
  if (item.key === "") {
    code.innerText = "000000";
    code.className = "timecode";
  } else {
    code.innerText = otplib.authenticator.generate(item.key);
    code.className = "timecode";
  }
  code.dataset.key = item.key;
  row.appendChild(code);

  var copy = document.createElement("img");
  copy.src = "icons/content-copy.svg";
  copy.className = "copy";
  row.appendChild(copy);

  row.addEventListener("click", copyTarget.bind(null, code, copy));
}

async function loadTOTP() {
  var res = await browser.storage.local.get();
  // Make a SHA-256 hash of the entered password
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(passwordInput.value);
  var hash = shaObj.getHash("HEX");
  // Check the entered password is correct
  if (hash == res.hash) {
    res = decryptJSON(res, passwordInput.value);

    // Hide popup and set the popup page size to automatic
    enterPassword.style.width = 0;
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    if (res.otp_list.length > 0) {
      res.otp_list.forEach(createRow);
    } else {
      createRow({
        name: "No sites configured.",
        key: ""
      });
    }
    timeLoop(); // loads timer before waiting 1s
    setInterval(timeLoop, 1000);
  } else {
    document.getElementById("wrongPassword").removeAttribute("hidden");
  }
}

document.getElementById("settings").addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});
submitPassword.addEventListener("click", loadTOTP);
document.addEventListener("DOMContentLoaded", async () => {
  var res = await browser.storage.local.get();
  if (res.hash === undefined) {
    browser.runtime.openOptionsPage();
    window.close();
  }
});
