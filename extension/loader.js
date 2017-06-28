function copyItem(ele) {
    ele.addEventListener("click", () => {
        var target = document.getElementById("hiddencopy");
        target.textContent = document.getElementById(ele.className).innerText;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        document.execCommand("copy");
        target.blur();
    });
}
function timeLoop() {
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var countDown = 30 - (epoch % 30);
    document.getElementById("ticker").innerText = countDown;
    if (epoch % 30 === 0) {
        var codes = document.getElementsByClassName("timecode");
        for (var i = 0; i < codes.length; i++) {
            var totp = new jsOTP.totp();
            var timecode = totp.getOtp(codes[i].id);
            codes[i].innerText = timecode;
        }
    }
}
function loadTOTP() {
    browser.storage.local.get().then((res) => {
        for (var i in res) {
            if (res.hasOwnProperty(i)) {
                var totp = new jsOTP.totp();
                var timecode = totp.getOtp(res[i]);
                var table = document.getElementById("totpbox");
                var row = document.createElement("tr");
                var name = document.createElement("td");
                name.innerText = i;
                var num = document.createElement("td");
                var numText = document.createElement("span");
                numText.innerText = timecode;
                numText.className = "timecode";
                numText.id = res[i];
                var copy = document.createElement("img");
                copy.src = "icons/content-copy.png";
                copy.className = res[i];
                row.appendChild(name);
                num.appendChild(numText);
                num.appendChild(copy);
                row.appendChild(num);
                copyItem(copy);
                table.appendChild(row);
            }
        }
    });
}
setInterval(timeLoop, 1000);
document.addEventListener("DOMContentLoaded", loadTOTP);
document.getElementById("settings").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
