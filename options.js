function deleteKey(ele) {
    ele.addEventListener("click", () => {
        browser.storage.local.remove(ele.className);
        location.reload()
    });
}
function changeKey(ele) {
    ele.addEventListener("click", () => {
        var newKey = prompt("Enter the new secret key for " + ele.className);
        var obj = {};
        obj[ele.className] = newKey;
        browser.storage.local.set(obj);
    });
}
function saveOptions(e) {
    var obj = {};
    obj[document.querySelector("#name").value] = document.querySelector("#num").value.replace(/\s/g, '');
    browser.storage.local.set(obj);
    e.preventDefault();
    location.reload();
}
function exportSettings() {
    browser.storage.local.get().then((res) => {
        document.getElementById("export").href = "data:text/json;charset=utf-8," + JSON.stringify(res);
    });
}
function importSettings() {
    var reader = new FileReader();
    reader.onload = () => {
        var obj = JSON.parse(reader.result);
        browser.storage.local.clear();
        browser.storage.local.set(obj);
        location.reload();
    }
    var file = document.getElementById("import").files[0];
    reader.readAsText(file);
}
function restoreOptions() {
    exportSettings();
    browser.storage.local.get().then((res) => {
        for (var i in res) {
            if (res.hasOwnProperty(i)) {
                var sites = document.getElementById("sites");
                var name = document.createElement("span");
                name.innerText = i;
                var del = document.createElement("img");
                del.src = "icons/delete.png";
                del.className = i;
                var edit = document.createElement("img");
                edit.src = "icons/pencil.png";
                edit.className = i;
                sites.appendChild(del);
                sites.appendChild(edit);
                sites.appendChild(name);
                sites.appendChild(document.createElement("br"));
                deleteKey(del);
                changeKey(edit);
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("importButton").addEventListener("click", importSettings);
