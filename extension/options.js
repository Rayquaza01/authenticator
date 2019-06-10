/* globals generateElementsVariable jsSHA decryptJSON cryptJSON crypt loadSVG */
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
    "newURL",
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

function dragStart(e) {
    e.target.classList.add("dragging");
    e.dataTransfer.setData("text/plain", getRowIndex(e.target.parentElement));
    e.dataTransfer.setDragImage(e.target.parentElement, 0, 0);
    e.dataTransfer.dropEffect = "move";
}

function dragOver(e) {
    e.preventDefault();
    let target;
    switch (e.target.tagName) {
        case "svg":
            target = e.target.parentElement;
            break;
        case "path":
            target = e.target.parentElement.parentElement;
            break;
        default:
            target = e.target;
            break;
    }

    let startIndex = Number(e.dataTransfer.getData("text/plain"));
    let hoverIndex = getRowIndex(target.parentElement);

    if (startIndex < hoverIndex) {
        target.parentElement.classList.add("displayBelow");
    } else if (startIndex > hoverIndex) {
        target.parentElement.classList.add("displayAbove");
    }

    e.dataTransfer.dropEffect = "move";
    target.classList.add("dragover");
}

function dragLeave(e) {
    e.preventDefault();
    let target;
    switch (e.target.tagName) {
        case "svg":
            target = e.target.parentElement;
            break;
        case "path":
            target = e.target.parentElement.parentElement;
            break;
        default:
            target = e.target;
            break;
    }
    target.classList.remove("dragover");
    target.parentElement.classList.remove("displayBelow");
    target.parentElement.classList.remove("displayAbove");
}

async function drop(e) {
    e.preventDefault();
    let children = Array.from(DOM.sites.children);
    let target;
    switch (e.target.tagName) {
        case "svg":
            target = e.target.parentElement;
            break;
        case "path":
            target = e.target.parentElement.parentElement;
            break;
        default:
            target = e.target;
            break;
    }
    target.classList.remove("dragover");

    let startIndex = Number(e.dataTransfer.getData("text/plain"));
    let endIndex = getRowIndex(target.parentElement);

    // update storage
    let res = await browser.storage.local.get();
    res.otp_list.splice(endIndex, 0, res.otp_list.splice(startIndex, 1)[0]);
    browser.storage.local.set(res);

    // move dragged item
    children[startIndex].firstChild.firstChild.classList.remove("dragging");
    target.parentElement.parentElement.appendChild(children[startIndex].firstChild);
    target.parentElement.classList.remove("displayAbove");
    target.parentElement.classList.remove("displayBelow");

    let direction;
    // find whether to shift up or down
    if (startIndex < endIndex) {
        direction = "previousSibling";
    } else if (startIndex > endIndex) {
        direction = "nextSibling";
    } else {
        return;
    }

    let dropTarget = target.parentElement.parentElement;
    // shift elements until the end or all spaces are filled
    while (dropTarget[direction] !== null) {
        console.log(dropTarget);
        console.log(dropTarget.children.length);
        if (dropTarget.children.length === 1) {
            break;
        }
        dropTarget[direction].appendChild(dropTarget.firstChild);
        dropTarget = dropTarget[direction];
    }
}

// UI helper
async function createSiteRow(siteInfo) {
    let contRow = document.createElement("div");
    contRow.className = "row topLevel";
    DOM.sites.appendChild(contRow);

    let row = document.createElement("div");
    row.className = "row bottomLevel";
    contRow.appendChild(row);

    let drag = document.createElement("span");
    drag.draggable = true;
    drag.className = "draggable";
    drag.addEventListener("dragstart", dragStart);
    drag.addEventListener("dragover", dragOver);
    drag.addEventListener("dragleave", dragLeave);
    drag.addEventListener("drop", drop);
    drag.appendChild(await loadSVG("icons/drag.svg"));
    row.appendChild(drag);

    var elem = document.createElement("input");
    elem.style.flexGrow = 1;
    elem.type = "text";
    elem.value = siteInfo.name;
    // binding row because after deleting an item, the bound index isn't correct
    elem.addEventListener("change", changeName.bind(null, row));
    row.appendChild(elem);

    elem = document.createElement("input");
    elem.placeholder = "Domain";
    if (siteInfo.hasOwnProperty("url")) {
        elem.value = siteInfo.url;
    } else {
        elem.value = "";
    }
    elem.addEventListener("change", changeURL.bind(null, row))
    row.appendChild(elem);

    elem = document.createElement("button");
    elem.innerText = "Change Secret Key";
    elem.addEventListener("click", modifySite.bind(null, row));
    row.appendChild(elem);

    elem = document.createElement("button");
    elem.innerText = "Delete 🗑";
    elem.addEventListener("click", deleteKey.bind(null, row));
    row.appendChild(elem);
}

function getRowIndex(row) {
    // get an index given a row
    return Array.from(DOM.sites.children).indexOf(row.parentElement);
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

async function changeName(row, e) {
    // changes the name and saves it when editing a name textbox
    let res = await browser.storage.local.get("otp_list");
    res.otp_list[getRowIndex(row)].name = e.target.value;
    browser.storage.local.set(res);
}

async function changeURL(row, e) {
    let res = await browser.storage.local.get();
    res.otp_list[getRowIndex(row)].url = e.target.value;
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
        key: DOM.newKey.value,
        url: DOM.newURL.value
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
