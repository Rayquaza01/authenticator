const sites = document.getElementById("sites");
// function deleteKey(ele) {
//     ele.addEventListener("click", () => {
//         browser.storage.local.remove(ele.className);
//         location.reload()
//     });
// }
// function changeKey(ele) {
//     ele.addEventListener("click", () => {
//         var newKey = prompt("Enter the new secret key for " + ele.className);
//         var obj = {};
//         obj[ele.className] = newKey;
//         browser.storage.local.set(obj);
//     });
// }
// function saveOptions(e) {
//     var obj = {};
//     obj[document.querySelector("#name").value] = document.querySelector("#num").value.replace(/\s/g, '');
//     browser.storage.local.set(obj);
//     e.preventDefault();
//     location.reload();
// }
function createRow(info, target) {
    var row = target.insertRow(-1);
    for (var item of info) {
        var cell = row.insertCell(-1);
        var inner = document.createElement(item.element);
        if (item.element === "input") {
            inner.type = item.type;
            inner.value = item.text;
        } else {
            inner.innerText = item.text;
        }
        cell.append(inner);
    }
}
function exportSettings() {
    browser.storage.local.get().then((res) => {
        document.getElementById("export").href = "data:text/json;charset=utf-8," + JSON.stringify(res);
    });
}
function importSettings() {
    var reader = new FileReader();
    reader.addEventListener("load", () => {
        var obj = JSON.parse(reader.result);
        browser.storage.local.clear();
        browser.storage.local.set(obj);
        location.reload();
    });
    var file = document.getElementById("import").files[0];
    reader.readAsText(file);
}
async function restoreOptions() {
    exportSettings();
    var res = await browser.storage.local.get("otp_list")
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
                listener: ["click", openKeyInput]
            },
            {
                element: "button",
                text: "Delete",
                listener: ["click", deleteSite]
            }
        ], sites)
    }
    createRow([
        {
            element: "input",
            type: "text",
            text: ""
        }, {
            element: "input",
            type: "text",
            text: ""
        }, {
            element: "button",
            text: "Add"
        }
    ], sites);
}
function getRowIndex(element) {
    return [...sites.children].indexOf(element.parentNode.parentNode) - 1;
}
async function changeName(e) {
    var res = await browser.storage.local.get("otp_list");
    var index = getRowIndex(e.target);
    switch (index) {
        case -1:
        case sites.children.length - 2:
            return;
        default:
            console.log(index);
            res.otp_list[index].name = e.target.value;
            browser.storage.local.set(res);
    }
}
function openKeyInput(row) {
    row.cells[1].innerText = "";
    var input = document.createElement("input");
    input.type = "text";
    var change = document.createElement("button");
    change.innerText = "Change";
    row.cells[1].append(input);
    row.cells[1].append(change);
}
function modifySite(e) {
    switch (e.target.innerText) {
        case "Change Key":
            openKeyInput(e.target.parentNode.parentNode);
            break;
        case "Delete":
            deleteItem(e.target.parentNode.parentNode);
            break;
        case "Add":
            addItem(e.target.parentNode.parentNode);
            break;
    }
}
document.addEventListener("DOMContentLoaded", restoreOptions);
sites.addEventListener("change", changeName);
sites.addEventListener("click", modifySite);
// document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("importButton").addEventListener("click", importSettings);
