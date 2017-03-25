function removeItem(ele) {
    ele.addEventListener("click", () => {
        browser.storage.local.remove(ele.id);
        location.reload();
    });
}
function copyItem(ele) {
    ele.addEventListener("click", () => {
        var targetId = "_hiddenCopyText_";
        var target = document.createElement("textarea");
        target.style.position = "absolute";
        target.style.left = "-9999px";
        target.style.top = "0";
        target.id = targetId;
        document.body.appendChild(target);
        target.textContent = ele.id;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        document.execCommand("copy");
    });
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
                var del = document.createElement("img");
                del.src = "icons/delete.png";
                del.id = i;
                var copy = document.createElement("img");
                copy.src = "icons/content-copy.png";
                copy.id = timecode;
                names.appendChild(name);
                numbers.appendChild(num);
                numbers.appendChild(copy);
                numbers.appendChild(del);
                removeItem(del);
                copyItem(copy);
                names.appendChild(document.createElement("br"));
                numbers.appendChild(document.createElement("br"));
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", loadTOTP);
