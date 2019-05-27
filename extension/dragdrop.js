/* globals pseudoReload */
const sites = document.getElementById("sitesParent");
const list = document.getElementById("dd-list");

function dragStart(e) {
    e.target.classList.add("dragging");
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.dropEffect = "move";
}

function dragOver(e) {
    e.preventDefault();
    let target = e.target.tagName === "DIV" ? e.target : e.target.parentElement;
    e.dataTransfer.dropEffect = "move";
    target.classList.add("dragover");
}

function dragLeave(e) {
    e.preventDefault();
    let target = e.target.tagName === "DIV" ? e.target : e.target.parentElement;
    target.classList.remove("dragover");
}

function drop(e) {
    e.preventDefault();
    let data = e.dataTransfer.getData("text/plain");
    let target = e.target.tagName === "DIV" ? e.target : e.target.parentElement;
    target.classList.remove("dragover");

    let item = document.getElementById(data);
    item.classList.remove("dragging");

    let children = Array.from(list.children);
    let startIndex = children.indexOf(item.parentElement);
    target.appendChild(document.getElementById(data));
    let endIndex = children.indexOf(item.parentElement);
    let direction;

    // find whether to shift up or down
    if (startIndex < endIndex) {
        direction = "previousSibling";
    } else if (startIndex > endIndex) {
        direction = "nextSibling";
    } else {
        return;
    }

    // shift elements until the end or all spaces are filled
    while (target[direction] !== null) {
        if (target.children.length === 1) {
            break;
        }
        target[direction].appendChild(target.firstChild);
        target = target[direction];
    }
}

async function ddLoad() {
    let res = await browser.storage.local.get("otp_list");
    let url = new URL(location.href);
    if (url.hash === "#main") {
        // save
        list.parentElement.style.display = "none";
        sites.style.display = "inherit";

        // reload changes
        if (list.innerText !== "") {
            // sort otp_list based on new sort order
            let newIDs = Array.from(document.getElementsByClassName("dd-site")).map(item =>
                Number(item.dataset.uniqueID)
            );
            let otp_list = newIDs.map(item => {
                let obj = res.otp_list.find((i, idx) => idx === item);
                return obj ? obj : null;
            });

            // save otp_list
            browser.storage.local.set({
                otp_list: otp_list
            });

            pseudoReload();
            list.innerText = "";
        }
    } else if (url.hash === "#dragdrop") {
        // open drag and drop tool
        list.parentElement.style.display = "inherit";
        sites.style.display = "none";
        list.innerText = "";

        let uniqueID = 0;
        res.otp_list.forEach(item => {
            // create element container
            let cont = document.createElement("div");
            cont.className = "dd-item";
            cont.addEventListener("dragover", dragOver);
            cont.addEventListener("dragleave", dragLeave);
            cont.addEventListener("dragstart", dragStart);
            cont.addEventListener("drop", drop);

            // create draggable element
            let li = document.createElement("span");
            li.innerText = item.name;
            li.id = "element-" + uniqueID;
            li.dataset.uniqueID = uniqueID;
            li.className = "dd-site";
            li.draggable = true;
            li.addEventListener("dragstart", dragStart);

            cont.appendChild(li);
            list.appendChild(cont);
            uniqueID++;
        });
    }
}

window.addEventListener("hashchange", ddLoad);
window.addEventListener("DOMContentLoaded", ddLoad);
