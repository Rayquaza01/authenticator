/* globals generateElementsVariable jsSHA otplib decryptJSON loadSVG */
const DOM = generateElementsVariable([
    "totpbox",
    "hiddencopy",
    "ticker",
    "enterPassword",
    "password",
    "submitPassword"
]);

function hash(text) {
    const extension_UUID = new URL(browser.runtime.getURL("loader.js")).hostname;
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(text + extension_UUID);
    var hash = shaObj.getHash("HEX");

    return hash;
}

async function copyTarget(code, copy) {
    // move code to textarea, copy
    DOM.hiddencopy.value = code.innerText;
    DOM.hiddencopy.focus();
    DOM.hiddencopy.setSelectionRange(0, DOM.hiddencopy.value.length);
    document.execCommand("copy");
    DOM.hiddencopy.blur();
    // Change icon from copy to check for 1s as visual feedback
    copy.innerText = "";
    copy.appendChild(await loadSVG("icons/check.svg"));
    setTimeout(async () => {
        copy.innerText = "";
        copy.appendChild(await loadSVG("icons/content-copy.svg"));
    }, 1000);
}

function timeLoop() {
    // from https://github.com/yeojz/otplib/blob/gh-pages/js/app.js#L65
    var epoch = Math.floor(Date.now() / 1000);
    var countDown = epoch % 30;
    DOM.ticker.innerText = 30 - countDown;
    if (countDown === 0) {
        var codes = document.getElementsByClassName("timecode");
        for (var code of codes) {
            if (code.dataset.key === "") {
                continue;
            } else {
                code.innerText = otplib.authenticator.generate(code.dataset.key);
            }
        }
    }
}

async function createRow(tab, item) {
    var row = document.createElement("tr");
    row.className = "row";

    console.log(item, tab);
    if (item.hasOwnProperty("url") && item.url !== "") {
        if (tab.indexOf(item.url) > -1) {
            row.style.backgroundColor = "yellow";
        }
    }

    DOM.totpbox.appendChild(row);

    var name = document.createElement("td");
    name.innerText = item.name;
    name.className = "name";
    row.appendChild(name);

    var code = document.createElement("td");
    if (item.name === "") {
        code.style.padding = 0;
    }
    if (item.key === "") {
        code.innerText = "000000";
        code.className = "timecode";
    } else {
        code.innerText = otplib.authenticator.generate(item.key);
        code.className = "timecode";
    }
    code.dataset.key = item.key;
    row.appendChild(code);

    var copyParent = document.createElement("td");
    copyParent.style.width = "16px";
    var copy = document.createElement("span");
    copy.className = "copy img";
    copy.appendChild(await loadSVG(browser.runtime.getURL("icons/content-copy.svg")));
    copyParent.appendChild(copy);
    row.appendChild(copyParent);

    row.addEventListener("click", copyTarget.bind(null, code, copy));
}

function nameSort(a, b) {
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    } else {
        return 0;
    }
}

async function loadTOTP() {
    var res = await browser.storage.local.get();
    var password = DOM.password.value;
    var passwordHash = hash(password);

    // Check the entered password is correct
    if (passwordHash === res.hash) {
        if (password !== "") {
            res = decryptJSON(res, password);
        }

        // Hides password input popup with a transition
        // and sets the popup page size to automatic
        DOM.enterPassword.style.transition = "0.5s";
        DOM.enterPassword.style.width = 0;
        document.getElementsByTagName("html")[0].style.width = "270px";
        document.body.style.width = "270px";
        document.body.style.height = "100%";

        switch (res.sortOrder) {
            case "alpha":
                res.otp_list = res.otp_list.sort(nameSort);
                break;
            case "revalpha":
                res.otp_list = res.otp_list.sort(nameSort).reverse();
                break;
            default:
                break;
        }

        let tab = (await browser.tabs.query({currentWindow: true, active: true}))[0].url;
        if (res.otp_list.length > 0) {
            res.otp_list.forEach(createRow.bind(null, tab));
        } else {
            createRow(tab, {
                name: "No sites configured.",
                key: ""
            });
        }
        timeLoop(); // loads timer before waiting 1s
        setInterval(timeLoop, 1000);
        document.body.className = "";
    } else {
        document.getElementById("wrongPassword").removeAttribute("hidden");
    }
}

async function main() {
    // if ((await browser.runtime.getPlatformInfo()).os !== "linux") {
    //     DOM.password.type = "password";
    // }
    var res = await browser.storage.local.get();
    if (res.hash === null) {
        browser.runtime.openOptionsPage();
        window.close();
    }
    if (res.hash === hash("")) {
        loadTOTP();
    } else {
        DOM.enterPassword.style.width = "100%";
        document.body.style.width = "400px";
        document.body.style.height = "250px";
    }

    for (let item of document.getElementsByClassName("svg-replace")) {
        item.appendChild(await loadSVG(item.dataset.svg));
    }

    Array.from(document.getElementsByTagName("*")) // Use Array.from to permit using .forEach
        .forEach(el => {
            el.style.color = res.fontColor;
        });
    Array.from(document.getElementsByTagName("*")) // Use Array.from to permit using forEach
        .forEach(el => {
            el.style.backgroundColor = res.backgroundColor;
        });
}

document.getElementById("settings").addEventListener("click", () => {
    browser.runtime.openOptionsPage();
});
DOM.submitPassword.addEventListener("click", loadTOTP);
DOM.password.addEventListener("keyup", key => {
    // submit password with enter
    if (key.key === "Enter") {
        loadTOTP();
    }
});
document.addEventListener("DOMContentLoaded", main);
