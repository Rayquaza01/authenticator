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

// UI helper
function createSiteRow(siteInfo, index) {
    var row = document.createElement('div');
    row.className = 'row';
    row.id = index;
    sites.appendChild(row);

    var elem = document.createElement('input');
    elem.style['flex-grow'] = 1;
    elem.type = 'text';
    elem.value = siteInfo.name;
    elem.addEventListener('change', changeName.bind(null, index));
    row.appendChild(elem);

    elem = document.createElement('button');
    elem.innerText = 'Change Secret Key';
    elem.addEventListener('click', modifySite.bind(null, index));
    row.appendChild(elem);

    elem = document.createElement('button');
    elem.innerText = 'Delete';
    elem.addEventListener('click', deleteKey.bind(null, index));
    row.appendChild(elem);
}

function removeSiteRow(index) {
    // use index+1 as the first is an empty text node
    sites.removeChild(sites.childNodes[index+1]);
}

async function exportSettings() {
    var res = await browser.storage.local.get();
    exportButton.href = "data:text/json;charset=utf-8," + JSON.stringify(res);
}

function importSettings() {
    var reader = new FileReader();
    reader.addEventListener("load", () => {
        var obj = JSON.parse(reader.result);
        browser.storage.local.clear();
        browser.storage.local.set(obj);
        browser.runtime.sendMessage("fixOptions").then(() => {
            location.reload();
        });
    });
    var file = this.files[0];
    reader.readAsText(file);
}

async function restoreOptions() {
    exportSettings();
    var res = await browser.storage.local.get("otp_list");
    res.otp_list.forEach(createSiteRow);
}

async function changeName(index, event) {
    console.log(arguments)
    var res = await browser.storage.local.get("otp_list");
    res.otp_list[index].name = event.target.value;
    browser.storage.local.set(res);
}
async function modifySite(index) {
    var res = await browser.storage.local.get("otp_list");
    keyname.innerText = res.otp_list[index].name;
    submitChange.dataset.index = index;
    key.focus();
    changeKey.style.width = "100%";
}
async function deleteKey(index) {
    var res = await browser.storage.local.get("otp_list");
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
    res.otp_list.splice(this.dataset.index, 1);
    browser.storage.local.set(res);
    removeSiteRow(parseInt(this.dataset.index));
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
    var site = {
        name: newName.value,
        key: newKey.value.replace(/\s/g, "")
    };
    res.otp_list.push(site);
    browser.storage.local.set(res);

    createSiteRow(site, res.otp_list.length-1);

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
