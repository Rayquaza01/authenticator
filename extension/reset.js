/* globals jsSHA */
function hash(text) {
    const extension_UUID = new URL(browser.runtime.getURL("options.js")).hostname;
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(text + extension_UUID);
    var hash = shaObj.getHash("HEX");

    return hash;
}

function reset() {
    browser.storage.local.set({
        hash: hash("")
    });
    document.querySelector("span").removeAttribute("hidden");
}

document.getElementById("reset").addEventListener("click", reset);
