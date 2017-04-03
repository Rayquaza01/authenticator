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
                var names = document.getElementById("names");
                var numbers = document.getElementById("numbers");
                var name = document.createElement("span");
                name.innerText = i;
                var num = document.createElement("span");
                num.innerText = timecode;
                num.className = "timecode";
                num.id = res[i];
                var copy = document.createElement("img");
                copy.src = "icons/content-copy.png";
                copy.className = res[i];
                names.appendChild(name);
                numbers.appendChild(num);
                numbers.appendChild(copy);
                copyItem(copy);
                names.appendChild(document.createElement("br"));
                numbers.appendChild(document.createElement("br"));
            }
        }
    });
}
setInterval(timeLoop, 1000);
document.addEventListener("DOMContentLoaded", loadTOTP);
document.getElementById("settings").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
