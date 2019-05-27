/* globals generateElementsVariable jsSHA decryptJSON cryptJSON crypt */
/* eslint no-console: 0 */
const DOM = generateElementsVariable([
    "sites",
    "keyname",
    "sitename",
    "changeKey",
    "deleteSite",
    "enterPassword",
    "password",
    "key",
    "cancel",
    "submitChange",
    "yes",
    "no",
    "newName",
    "newKey",
    "makeNew",
    "export",
    "import",
    "submitPassword",
    "ChangeFontColorBtn",
    "ChangeBackgroundColorBtn",
    "ChangePwButton",
    "resetColors",
    "sortOrder"
]);

function hash(text) {
    const extension_UUID = new URL(browser.runtime.getURL("options.js")).hostname;
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(text + extension_UUID);
    var hash = shaObj.getHash("HEX");

    return hash;
}

async function pseudoReload() {
    DOM.sites.innerText = "";
    restoreOptions();
}

// UI helper
function createSiteRow(siteInfo) {
    var row = document.createElement("div");
    row.className = "row";
    DOM.sites.appendChild(row);

    var elem = document.createElement("input");
    elem.style.flexGrow = 1;
    elem.type = "text";
    elem.value = siteInfo.name;
    // binding row because after deleting an item, the bound index isn't correct
    elem.addEventListener("change", changeName.bind(null, row));
    row.appendChild(elem);

    elem = document.createElement("button");
    elem.innerText = "Change Secret Key";
    elem.addEventListener("click", modifySite.bind(null, row));
    row.appendChild(elem);

    elem = document.createElement("button");
    elem.innerText = "Delete 🗑";
    elem.addEventListener("click", deleteKey.bind(null, row));
    row.appendChild(elem);

    elem = document.createElement("button");
    elem.innerText = "Up ⬆️";
    elem.addEventListener("click", moveRow.bind(null, row, -1));
    row.appendChild(elem);

    elem = document.createElement("button");
    elem.innerText = "Down ⬇️";
    elem.addEventListener("click", moveRow.bind(null, row, 1));
    row.appendChild(elem);
}

function getRowIndex(row) {
    // get an index given a row
    return [...DOM.sites.childNodes].indexOf(row);
}

function removeSiteRow(index) {
    DOM.sites.removeChild(DOM.sites.childNodes[index]);
}

async function exportSettings() {
    var password = DOM.password.value;
    var res = await browser.storage.local.get();

    if (password !== "") {
        res = decryptJSON(res, password);
    }

    // Permit to only export otp_list and colors settings
    res = {
        otp_list: res.otp_list,
        fontColor: res.fontColor,
        backgroundColor: res.backgroundColor
    };

    DOM.export.href =
        "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res));
}

function importSettings() {
    // reads file on import
    var reader = new FileReader();
    reader.addEventListener("load", async () => {
        var obj = JSON.parse(reader.result);
        await browser.storage.local.clear();
        await browser.storage.local.set(obj);
        // converts old (pre 1.0.4) exports to new format when imported.
        // calls main() in authenticator-bg.js
        await browser.runtime.sendMessage("fixOptions");
        location.reload();
        // pseudoReload();
    });
    var file = this.files[0];
    reader.readAsText(file);
}

async function waitForPasswordInput() {
    let res = await browser.storage.local.get();

    if (res.hash === hash("")) {
        DOM.password.value = "";
        restoreOptions();
    } else {
        if (res.hash === null) {
            document.getElementById("new").removeAttribute("hidden");
        }
        DOM.enterPassword.style.width = "100%";
    }
    DOM.ChangeFontColorBtn.value = res.fontColor;
    DOM.ChangeBackgroundColorBtn.value = res.backgroundColor;
    DOM.sortOrder.value = res.sortOrder;
}

async function restoreOptions() {
    var res = await browser.storage.local.get();
    var password = DOM.password.value;

    if (res.hash === null) {
        if (password === "") {
            browser.storage.local.set({
                hash: hash("")
            });
        } else {
            browser.storage.local.set({
                hash: hash(password),
                otp_list: cryptJSON(res, password).otp_list
            });
        }

        closeOverlays();
        restoreOptions();
    } else if (hash(password) === res.hash) {
        closeOverlays();
        exportSettings();
        console.log(res.otp_list);
        if (res.otp_list.length > 0) {
            res.otp_list.forEach(createSiteRow);
        } else {
            DOM.sites.innerText = "No sites configured.";
        }
    } else {
        document.getElementById("wrongPassword").removeAttribute("hidden");
    }
}

async function changeName(row, event) {
    // changes the name and saves it when editing a name textbox
    var res = await browser.storage.local.get("otp_list");
    res.otp_list[getRowIndex(row)].name = event.target.value;
    browser.storage.local.set(res);
}

async function modifySite(row) {
    // opens the overlay to change secret key for selected site
    var res = await browser.storage.local.get("otp_list");
    DOM.keyname.innerText = res.otp_list[getRowIndex(row)].name;
    DOM.submitChange.dataset.index = getRowIndex(row);
    DOM.key.focus();
    DOM.changeKey.style.width = "100%";
}

async function deleteKey(row) {
    // opens overlay to delete the selected site
    var res = await browser.storage.local.get("otp_list");
    DOM.sitename.innerText = res.otp_list[getRowIndex(row)].name;
    DOM.yes.dataset.index = getRowIndex(row);
    DOM.deleteSite.style.width = "100%";
}

async function moveRow(row, dir) {
    let res = await browser.storage.local.get("otp_list");
    let rowindex = getRowIndex(row);
    let destindex = rowindex + dir;
    if (destindex < res.otp_list.length && destindex > -1) {
        res.otp_list.splice(destindex, 0, res.otp_list.splice(rowindex, 1)[0]);
        await browser.storage.local.set(res);
        pseudoReload();
        // location.reload();
    }
}

function closeOverlays() {
    DOM.changeKey.style.width = 0;
    DOM.deleteSite.style.width = 0;
    DOM.enterPassword.style.width = 0;
}

async function removeSite() {
    // removes site from list and storage
    // activates when "Yes" is clicked from overlay opened by deleteKey
    var res = await browser.storage.local.get("otp_list");
    res.otp_list.splice(this.dataset.index, 1);
    browser.storage.local.set(res);
    removeSiteRow(parseInt(this.dataset.index));
    if (!DOM.sites.hasChildNodes()) {
        DOM.sites.innerText = "No sites configured.";
    }
    closeOverlays();
}

async function submitKeyChange() {
    // changes the key
    // activates when "Submit" is clicked from overlay opened by modifySite
    var res = await browser.storage.local.get("otp_list");
    var password = DOM.password.value;

    if (DOM.key.value === "") {
        // prevents empty keys, which break the popup
        console.log("Secret Key cannot be empty");
        return;
    }
    DOM.key.value = DOM.key.value.replace(/\s/g, ""); // strip whitespace BEFORE encrypting to fix potential errors
    res.otp_list[this.dataset.index].key = DOM.key.value;
    if (password !== "") {
        DOM.key.value = crypt(DOM.key.value, password);
    }
    res.otp_list[this.dataset.index].key = DOM.key.value;
    browser.storage.local.set(res);
    DOM.key.value = "";
    closeOverlays();
}

async function addSite() {
    var password = DOM.password.value;

    // Adds the site to both the list and storage
    if (DOM.newKey.value === "") {
        // prevents empty keys, which break the popup
        console.log("Secret Key cannot be empty");
        return;
    }
    DOM.newKey.value = DOM.newKey.value.replace(/\s/g, ""); // strip spaces BEFORE encrypting to fix potential errors
    if (password !== "") {
        DOM.newKey.value = crypt(DOM.newKey.value, password);
    }
    var res = await browser.storage.local.get("otp_list");
    var site = {
        name: DOM.newName.value,
        key: DOM.newKey.value
    };
    res.otp_list.push(site);
    browser.storage.local.set(res);

    if (DOM.sites.innerText === "No sites configured.") {
        DOM.sites.removeChild(DOM.sites.lastChild);
    }

    createSiteRow(site);

    DOM.newName.value = "";
    DOM.newKey.value = "";
}

async function changeMasterPassword() {
    // Delete the password hash and decrypt storage, then reload the page to prompt for a new password
    var res = await browser.storage.local.get();

    if (res.hash !== hash("")) {
        res = decryptJSON(res, DOM.password.value);
    }
    res.hash = null;

    await browser.storage.local.set(res);
    location.reload();
}

async function changeColor(event) {
    if (event.target.id === "ChangeFontColorBtn") {
        browser.storage.local.set({
            fontColor: event.target.value
        });
    } else if (event.target.id === "ChangeBackgroundColorBtn") {
        browser.storage.local.set({
            backgroundColor: event.target.value
        });
    }
}

async function resetColors() {
    browser.storage.local.set({
        fontColor: "#000000",
        backgroundColor: "#FFFFFF"
    });
    location.reload();
}

function changeSort() {
    browser.storage.local.set({
        sortOrder: DOM.sortOrder.value
    });
}

function enterSubmit(callback, e) {
    if (e.key === "Enter") {
        callback();
    }
}

DOM.no.addEventListener("click", closeOverlays);
DOM.yes.addEventListener("click", removeSite);
DOM.submitChange.addEventListener("click", submitKeyChange);
DOM.submitPassword.addEventListener("click", restoreOptions);
DOM.cancel.addEventListener("click", closeOverlays);
DOM.makeNew.addEventListener("click", addSite);
DOM.import.addEventListener("change", importSettings);
browser.storage.onChanged.addListener(exportSettings);
document.addEventListener("DOMContentLoaded", waitForPasswordInput);
DOM.ChangePwButton.addEventListener("click", changeMasterPassword);
DOM.ChangeFontColorBtn.addEventListener("input", changeColor);
DOM.ChangeBackgroundColorBtn.addEventListener("input", changeColor);
DOM.resetColors.addEventListener("click", resetColors);
DOM.key.addEventListener("keyup", enterSubmit.bind(null, submitKeyChange));
DOM.password.addEventListener("keyup", enterSubmit.bind(null, restoreOptions));
DOM.sortOrder.addEventListener("change", changeSort);
