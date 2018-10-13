/* eslint no-unused-vars: 0 */
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

function getContext() {
    for (let context of ["popup", "sidebar", "tab"]) {
        if (browser.extension.getViews({ type: context }).indexOf(window) > -1) {
            return context;
        }
    }
    return undefined;
}
