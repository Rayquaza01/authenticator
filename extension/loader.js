function copyTarget(ele) {
    var target = document.getElementById("hiddencopy");
    target.textContent = this.previousSibling.innerText;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    document.execCommand("copy");
    target.blur();
    this.src = "icons/check.svg";
    setTimeout(() => {
        this.src = "icons/content-copy.svg";
    }, 1000);
}
function timeLoop() {
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var countDown = 30 - (epoch % 30);
    document.getElementById("ticker").innerText = countDown;
    if (epoch % 30 === 0) {
        var codes = document.getElementsByClassName("timecode");
        for (var code of codes) {
            code.innerText = otplib.authenticator.generate(code.dataset.key);
        }
    }
}
async function loadTOTP() {
    var res = await browser.storage.local.get("otp_list")
    for (var item of res.otp_list) {
        createRow([
            [
                {
                    element: "parent",
                    className: "left"
                },
                {
                    element: "span",
                    text: item.name
                }
            ], [
                {
                    element: "parent",
                    className: "right"
                }, {
                    element: "span",
                    text: otplib.authenticator.generate(item.key),
                    className: "timecode",
                    dataset: {
                        key: item.key
                    }
                }, {
                    element: "img",
                    src: "icons/content-copy.svg",
                    className: "copy",
                    listener: ["click", copyTarget]
                }
            ]
        ], document.getElementById("totpbox"));
    }
}
setInterval(timeLoop, 1000);
document.addEventListener("DOMContentLoaded", loadTOTP);
document.getElementById("settings").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
