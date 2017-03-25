function saveOptions(e) {
    var obj = {};
    obj[document.querySelector("#name").value] = document.querySelector("#num").value.replace(/\s/g, '');
    browser.storage.local.set(obj);
    e.preventDefault();
    location.reload();
}
function restoreOptions(e) {
    browser.storage.local.get().then((res) => {
        document.getElementById("json").innerHTML = JSON.stringify(res, false, 4);
    });
}
document.querySelector("form").addEventListener("submit", saveOptions);
document.addEventListener("DOMContentLoaded", restoreOptions);
var load = document.getElementById("loadJSON");
load.addEventListener("click", () => {
    var obj = JSON.parse(document.getElementById("json").value);
    browser.storage.local.clear();
    browser.storage.local.set(obj);
}, false);
