const sites = document.getElementById("sites");
const keyname = document.getElementById("keyname");
const sitename = document.getElementById("sitename");
const changeKey = document.getElementById("changeKey");
const deleteSite = document.getElementById("deleteSite");
const enterPassword = document.getElementById("enterPassword");
const passwordInput = document.getElementById("password");
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
const ChangePwButton = document.getElementById("ChangePwButton");
const ChangeFontColorBtn = document.getElementById("ChangeFontColorBtn");
const ChangeBackgroundColorBtn = document.getElementById("ChangeBackgroundColorBtn");
const ResetColorsBtn = document.getElementById("resetColors");

function hash(text) {
  const extension_UUID = browser.runtime.getURL("/").split("/")[2];
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(text + extension_UUID);
  var hash = shaObj.getHash("HEX");

  return hash;
}

// UI helper
function createSiteRow(siteInfo) {
  var row = document.createElement("div");
  row.className = "row";
  sites.appendChild(row);

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
  elem.innerText = "Delete";
  elem.addEventListener("click", deleteKey.bind(null, row));
  row.appendChild(elem);
}

function getRowIndex(row) {
  // get an index given a row
  return [...sites.childNodes].indexOf(row);
}

function removeSiteRow(index) {
  sites.removeChild(sites.childNodes[index]);
}

async function exportSettings() {
  var password = passwordInput.value;
  var res = await browser.storage.local.get();

  if (password != "") {
    res = decryptJSON(res, password);
  }

  // Permit to only export otp_list and colors settings
  res = {
    otp_list: res.otp_list,
    fontColor: res.fontColor,
    backgroundColor: res.backgroundColor
  };

  exportButton.href = "data:text/json;charset=utf-8," + JSON.stringify(res);
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
  });
  var file = this.files[0];
  reader.readAsText(file);
}

async function waitForPasswordInput() {
  var res = await browser.storage.local.get();

  if (res.hash == hash("")) {
    passwordInput.value = "";
    restoreOptions();
  } else {
    if (res.hash === undefined) {
      document.getElementById("new").removeAttribute("hidden");
    }
    enterPassword.style.width = "100%";
  }

  if (res.fontColor != undefined) {
    ChangeFontColorBtn.value = res.fontColor;

    Array.from(document.getElementsByTagName("*")) // Use Array.from to permit using .forEach
      .forEach((el) => {
        el.style.color = res.fontColor;
      });
  } else {
    ChangeFontColorBtn.value = "#000000";
  }
  if (res.backgroundColor != undefined) {
    ChangeBackgroundColorBtn.value = res.backgroundColor;

    Array.from(document.getElementsByTagName("*")) // Use Array.from to permit using forEach
      .forEach((el) => {
        if (el.tagName != "BUTTON" && el.tagName != "A" && el.tagName != "LABEL") el.style.backgroundColor = res.backgroundColor;
      });
  } else {
    ChangeBackgroundColorBtn.value = "#F9F9FA";
  }
}

async function restoreOptions() {
  var res = await browser.storage.local.get();
  var password = passwordInput.value;
  var passwordHash = hash(password);

  if (res.hash === undefined) {
    if (password == "") {
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
  } else if (hash(password) == res.hash) {
    closeOverlays();
    exportSettings();
    if (res.otp_list.length > 0) {
      res.otp_list.forEach(createSiteRow);
    } else {
      sites.innerText = "No sites configured.";
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
  keyname.innerText = res.otp_list[getRowIndex(row)].name;
  submitChange.dataset.index = getRowIndex(row);
  key.focus();
  changeKey.style.width = "100%";
}

async function deleteKey(row) {
  // opens overlay to delete the selected site
  var res = await browser.storage.local.get("otp_list");
  sitename.innerText = res.otp_list[getRowIndex(row)].name;
  yes.dataset.index = getRowIndex(row);
  deleteSite.style.width = "100%";
}

function closeOverlays() {
  changeKey.style.width = 0;
  deleteSite.style.width = 0;
  enterPassword.style.width = 0;
}

async function removeSite() {
  // removes site from list and storage
  // activates when "Yes" is clicked from overlay opened by deleteKey
  var res = await browser.storage.local.get("otp_list");
  res.otp_list.splice(this.dataset.index, 1);
  browser.storage.local.set(res);
  console.log(this)
  removeSiteRow(parseInt(this.dataset.index));
  if (!sites.hasChildNodes()) {
    sites.innerText = "No sites configured.";
  }
  closeOverlays();
}

async function submitKeyChange() {
  // changes the key
  // activates when "Submit" is clicked from overlay opened by modifySite
  var res = await browser.storage.local.get("otp_list");
  var password = passwordInput.value;

  if (key.value === "") {
    // prevents empty keys, which break the popup
    console.log("Secret Key cannot be empty");
    return;
  }
  if (password != "") {
    key.value = crypt(key.value, password);
  }
  res.otp_list[this.dataset.index].key = key.value.replace(/\s/g, "");
  browser.storage.local.set(res);
  key.value = "";
  closeOverlays();
}

async function addSite() {
  var password = passwordInput.value;

  // Adds the site to both the list and storage
  if (newKey.value === "") {
    // prevents empty keys, which break the popup
    console.log("Secret Key cannot be empty");
    return;
  }
  if (password != "") {
    newKey.value = crypt(newKey.value, password);
  }
  var res = await browser.storage.local.get("otp_list");
  var site = {
    name: newName.value,
    key: newKey.value.replace(/\s/g, "")
  };
  res.otp_list.push(site);
  browser.storage.local.set(res);

  if (sites.innerText === "No sites configured.") {
    sites.removeChild(sites.lastChild);
  }

  createSiteRow(site);

  newName.value = "";
  newKey.value = "";
}

async function changeMasterPassword() {
  // Delete the password hash and decrypt storage, then reload the page to prompt for a new password
  var res = await browser.storage.local.get();

  if (res.hash != hash("")) {
    res = decryptJSON(res, passwordInput.value);
  }
  res.hash = undefined;

  browser.storage.local.set(res);
  location.reload();
}

async function changeColor(event) {
  Array.from(document.getElementsByTagName("*")) // Use Array.from to permit using .forEach
    .forEach((el) => {
      if (event.target.id == "ChangeFontColorBtn") {
        el.style.color = event.target.value;
      } else if (event.target.id == "ChangeBackgroundColorBtn" && el.tagName != "BUTTON" && el.tagName != "A" && el.tagName != "LABEL") {
        el.style.backgroundColor = event.target.value;
      }
    });

  if (event.type == "change") {
    if (event.target.id == "ChangeFontColorBtn") {
      browser.storage.local.set({
        fontColor: event.target.value
      });
    } else if (event.target.id == "ChangeBackgroundColorBtn") {
      browser.storage.local.set({
        backgroundColor: event.target.value
      });
    }
  }
}

async function resetColors() {
  browser.storage.local.set({
    fontColor: undefined,
    backgroundColor: undefined
  });
  location.reload();
}

no.addEventListener("click", closeOverlays);
yes.addEventListener("click", removeSite);
submitChange.addEventListener("click", submitKeyChange);
submitPassword.addEventListener("click", restoreOptions);
cancel.addEventListener("click", closeOverlays);
makeNew.addEventListener("click", addSite);
importButton.addEventListener("change", importSettings);
browser.storage.onChanged.addListener(exportSettings);
document.addEventListener("DOMContentLoaded", waitForPasswordInput);
ChangePwButton.addEventListener("click", changeMasterPassword);
ChangeFontColorBtn.addEventListener("change", changeColor);
ChangeFontColorBtn.addEventListener("input", changeColor);
ChangeBackgroundColorBtn.addEventListener("change", changeColor);
ChangeBackgroundColorBtn.addEventListener("input", changeColor);
ResetColorsBtn.addEventListener("click", resetColors);
