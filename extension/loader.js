const totpbox = document.getElementById("totpbox");
const hiddenCopy = document.getElementById("hiddencopy");
const ticker = document.getElementById("ticker");

function copyTarget(code, copy) {
    console.log(code);
    hiddenCopy.value = code.innerText;
    hiddenCopy.focus();
    hiddenCopy.setSelectionRange(0, hiddenCopy.value.length);
    document.execCommand("copy");
    hiddenCopy.blur();
    copy.src = "icons/check.svg";
    setTimeout(() => {
        copy.src = "icons/content-copy.svg";
    }, 1000);
}

function timeLoop() {
    var epoch = Math.floor(Date.now() / 1000);
    var countDown = epoch % 30;
    ticker.innerText = (30 - countDown);
    if (countDown === 0) {
        var codes = document.getElementsByClassName("timecode");
        for (var code of codes) {
            code.innerText = otplib.authenticator.generate(code.dataset.key);
        }
    }
}

function createRow(item) {
    var timecode =  otplib.authenticator.generate(item.key);

    var row = totpbox.insertRow(-1);
    var leftCol = row.insertCell(-1);
    leftCol.className = "left";
    var rightCol = row.insertCell(-1);
    rightCol.className = "right";

    var name = document.createElement("span");
    name.innerText = item.name;
    leftCol.append(name)

    var code = document.createElement("span");
    code.innerText = timecode;
    code.className = "timecode right";
    code.dataset.key = item.key;
    rightCol.append(code);

    var copy = document.createElement("img");
    copy.src = "icons/content-copy.svg";
    rightCol.append(copy);

    row.addEventListener("click", copyTarget.bind(null, code, copy))
}

async function loadTOTP() {
    var res = await browser.storage.local.get("otp_list")
    res.otp_list.forEach(createRow);
}

setInterval(timeLoop, 1000);
document.addEventListener("DOMContentLoaded", loadTOTP);
document.getElementById("settings").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
