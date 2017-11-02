function createRow(info, target) {
    var row = target.insertRow(-1);
    for (var item of info) {
        var cell = row.insertCell(-1);
        if (Array.isArray(item)) {
            for (element of item) {
                createInnerElements(element, cell);
            }
        } else {
            createInnerElements(item, cell)
        }
    }
}
function createInnerElements(item, cell) {
    if (item.element === "parent") {
        cell.className = item.className;
        return;
    } else {
        var inner = document.createElement(item.element);
        if (item.element === "input") {
            inner.type = item.type;
            inner.value = item.text;
        } else if (item.hasOwnProperty("text")) {
            inner.innerText = item.text;
        }
        if (item.hasOwnProperty("src")) {
            inner.src = item.src;
        }
        if (item.hasOwnProperty("listener")) {
            inner.addEventListener(item.listener[0], item.listener[1])
        }
        if (item.hasOwnProperty("className")) {
            inner.className = item.className;
        }
        if (item.hasOwnProperty("dataset")) {
            for (key in item.dataset) {
                inner.dataset[key] = item.dataset[key];
            }
        }
        cell.append(inner);
    }
}
