function removeItem(ele) {
    ele.addEventListener("click", () => {
        browser.storage.local.remove(ele.id);
        location.reload();
    }, false);
}
function copyItem(ele) {
    ele.addEventListener("click", () => {
        var targetId = "_hiddenCopyText_";
        var origSelectionStart, origSelectionEnd;
        var target = document.createElement("textarea");
        target.style.position = "absolute";
        target.style.left = "-9999px";
        target.style.top = "0";
        target.id = targetId;
        document.body.appendChild(target);
        target.textContent = ele.id;
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        var succeed;
        try {
          succeed = document.execCommand("copy");
        } catch(e) {
            succeed = false;
        }
        target.textContent = "";
        return succeed;
    });
}
function restoreOptions() {
    browser.storage.local.get().then((res) => {
        for (var i in res) {
            if (res.hasOwnProperty(i)) {
                var names = document.getElementById("names");
                var numbers = document.getElementById("numbers");
                var name = document.createElement("span");
                var num = document.createElement("span");
                var del = document.createElement("a");
                var copy = document.createElement("a");
                del.innerHTML = '<img src="icons/delete.png">';
                del.id = i;
                copy.innerHTML = '<img src="icons/content-copy.png">';
                var totp = new jsOTP.totp();
                var timecode = totp.getOtp(res[i]);
                name.innerHTML = i;
                num.innerHTML = timecode;
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
document.addEventListener("DOMContentLoaded", restoreOptions);
