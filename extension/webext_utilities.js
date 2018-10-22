/* eslint no-unused-vars: 0 */
async function loadSVG(url) {
    let svg = await fetch(url);
    return new DOMParser().parseFromString(await svg.text(), "image/svg+xml")
        .documentElement;
}

function generateElementsVariable(list) {
    // generate an object with elements based on a list of ids
    let dom = {};
    for (let item of list) {
        dom[item] = document.getElementById(item);
    }
    return dom;
}

function defaultValues(object, settings) {
    // initialize object with values.
    for (let key in settings) {
        if (!object.hasOwnProperty(key)) {
            object[key] = settings[key];
        }
    }
    return object;
}
