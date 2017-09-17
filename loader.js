function noTooltip(e) {
    console.log("Removed Tooltip");
    e.target.removeEventListener("mouseleave", noTooltip);
    e.target.className = "copy";
}
function copySuccess(e) {
    getSelection().removeAllRanges();
    e.trigger.addEventListener("mouseleave", noTooltip);
    e.trigger.setAttribute("aria-label", "Copied!");
    e.trigger.className = "copy tooltipped tooltipped-no-delay tooltipped-w";
}
function timeLoop() {
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var countDown = 30 - (epoch % 30);
    document.getElementById("ticker").innerText = countDown;
    if (epoch % 30 === 0) {
        var codes = document.getElementsByClassName("timecode");
        for (var code of codes) {
            var totp = new jsOTP.totp();
            var timecode = totp.getOtp(code.dataset.key);
            code.innerText = timecode;
        }
    }
}
function loadTOTP() {
    for (var i in TOTPObject) {
        if (TOTPObject.hasOwnProperty(i)) {
            var totp = new jsOTP.totp();
            var timecode = totp.getOtp(TOTPObject[i]);
            var table = document.getElementById("totpbox");
            var row = document.createElement("tr");
            var name = document.createElement("td");
            name.innerText = i;
            name.className = "left";
            var num = document.createElement("td");
            num.className = "align-right"
            var numText = document.createElement("span");
            numText.innerText = timecode;
            numText.className = "timecode right";
            numText.dataset.key = TOTPObject[i];
            var copyButton = document.createElement("span");
            copyButton.className = "copy";
            var copy = document.createElement("img");
            copy.src = "https://rayquaza01.github.io/authenticator/icons/content-copy.png";
            copyButton.appendChild(copy);
            row.appendChild(name);
            num.appendChild(numText);
            num.appendChild(copyButton);
            row.appendChild(num);
            table.appendChild(row);
        }
    }
    var clipboard = new Clipboard(".copy", {
        target: (trigger) => {
            return trigger.previousSibling;
        }
    });
    clipboard.on("success", copySuccess);
}
setInterval(timeLoop, 1000);
document.addEventListener("DOMContentLoaded", loadTOTP);
