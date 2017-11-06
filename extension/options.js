const sites = document.getElementById("sites");
const keyname = document.getElementById("keyname");
const sitename = document.getElementById("sitename");
const changeKey = document.getElementById("changeKey");
const deleteSite = document.getElementById("deleteSite");
const key = document.getElementById("key");
const cancel = document.getElementById("cancel");
const submitChange = document.getElementById("submitChange");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const newName = document.getElementById("newName");
const newKey = document.getElementById("newKey");
const makeNew = document.getElementById("makeNew");
const exportButton = document.getElementById("export");
const importButton = document.getElementById("import");
async function exportSettings() {
    var res = await browser.storage.local.get();
    exportButton.href = "data:text/json;charset=utf-8," + JSON.stringify(res);
}
function importSettings() {
    var reader = new FileReader();
    reader.addEventListener("load", async () => {
        var obj = JSON.parse(reader.result);
        await browser.storage.local.clear();
        await browser.storage.local.set(obj);
        await browser.runtime.sendMessage("fixOptions");
        location.reload();
    });
    var file = this.files[0];
    reader.readAsText(file);
}
async function restoreOptions() {
    exportSettings();
    var res = await browser.storage.local.get("otp_list");
    for (var item of res.otp_list) {
        createRow([
            {
                element: "input",
                type: "text",
                text: item.name,
                listener: ["change", changeName]
            },
            {
                element: "button",
                text: "Change Key",
                listener: ["click", modifySite]
            },
            {
                element: "button",
                text: "Delete",
                listener: ["click", deleteKey]
            }
        ], sites);
    }
}
function getRowIndex(element) {
    return [...sites.children[0].children].indexOf(element.parentNode.parentNode) - 1;
}
async function changeName() {
    var res = await browser.storage.local.get("otp_list");
    var index = getRowIndex(this);
    console.log(index);
    if (index > -1) {
        res.otp_list[index].name = this.value;
        browser.storage.local.set(res);
    }
}
async function modifySite() {
    var res = await browser.storage.local.get("otp_list");
    var index = getRowIndex(this);
    keyname.innerText = res.otp_list[index].name;
    submitChange.dataset.index = index;
    key.focus();
    changeKey.style.width = "100%";
}
async function deleteKey() {
    var res = await browser.storage.local.get("otp_list");
    var index = getRowIndex(this);
    sitename.innerText = res.otp_list[index].name;
    yes.dataset.index = index;
    deleteSite.style.width = "100%";
}
function closeOverlays() {
    changeKey.style.width = 0;
    deleteSite.style.width = 0;
}
async function removeSite() {
    var res = await browser.storage.local.get("otp_list");
    res.otp_list.splice(this.dataset.index, 1)
    browser.storage.local.set(res);
    sites.deleteRow(parseInt(this.dataset.index) + 1)
    closeOverlays();
}
async function submitKeyChange() {
    var res = await browser.storage.local.get("otp_list");
    res.otp_list[this.dataset.index].key = key.value.replace(/\s/g, "");
    browser.storage.local.set(res);
    key.value = "";
    closeOverlays();
}
async function addSite() {
    var res = await browser.storage.local.get("otp_list");
    res.otp_list.push({
        name: newName.value,
        key: newKey.value.replace(/\s/g, "")
    });
    browser.storage.local.set(res);
    createRow([
        {
            element: "input",
            type: "text",
            text: newName.value,
            listener: ["change", changeName]
        },
        {
            element: "button",
            text: "Change Key",
            listener: ["click", modifySite]
        },
        {
            element: "button",
            text: "Delete",
            listener: ["click", deleteKey]
        }
    ], sites);
    newName.value = "";
    newKey.value = "";
}
no.addEventListener("click", closeOverlays);
yes.addEventListener("click", removeSite);
submitChange.addEventListener("click", submitKeyChange);
cancel.addEventListener("click", closeOverlays);
makeNew.addEventListener("click", addSite);
importButton.addEventListener("change", importSettings);
browser.storage.onChanged.addListener(exportSettings);
document.addEventListener("DOMContentLoaded", restoreOptions);
