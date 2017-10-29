function copyItem(ele) {
    ele.addEventListener("click", () => {
        var target = document.getElementById("hiddencopy");
        target.textContent = ele.previousSibling.innerText;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        document.execCommand("copy");
        target.blur();
        ele.src = "icons/check.png";
        setTimeout(() => {
            ele.src = "icons/content-copy.png";
        }, 1000);
    });
}
function timeLoop() {
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var countDown = 30 - (epoch % 30);
    document.getElementById("ticker").innerText = countDown;
    if (epoch % 30 === 0) {
        var codes = document.getElementsByClassName("timecode");
        for (var code of codes) {
            var timecode = otplib.authenticator.generate(code.dataset.key);
            code.innerText = timecode;
        }
    }
}
async function loadTOTP() {
    var res = await browser.storage.local.get("otp_list")
    for (var item of res.otp_list) {
        var timecode = otplib.authenticator.generate(item.key);
        var table = document.getElementById("totpbox");
        var row = document.createElement("tr");
        var name = document.createElement("td");
        name.innerText = item.name;
        name.className = "left";
        var num = document.createElement("td");
        num.className = "right";
        var numText = document.createElement("span");
        numText.innerText = timecode;
        numText.className = "timecode right";
        numText.dataset.key = item.key;
        var copy = document.createElement("img");
        copy.src = "icons/content-copy.png";
        copy.className = "copy";
        row.append(name);
        num.append(numText);
        num.append(copy);
        row.append(num);
        copyItem(copy);
        table.append(row);
    }
}
setInterval(timeLoop, 1000);
document.addEventListener("DOMContentLoaded", loadTOTP);
document.getElementById("settings").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
