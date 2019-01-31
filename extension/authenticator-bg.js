/* globals defaultValues */

async function main() {
    let res = await browser.storage.local.get();
    // change default hash from undefined to null to support FF52
    // (because FF52 can't store undefined)
    if (res.hash !== undefined && typeof hash !== "string") {
        res.hash = null;
    }
    // switch to non svg icon on FF52
    if ((await browser.runtime.getBrowserInfo()).version.startsWith("52")) {
        browser.browserAction.setIcon({
            path: "icons/icon-96.png"
        });
    }
    defaultValues(res, {
        otp_list: [],
        fontColor: "#000000",
        backgroundColor: "#FFFFFF",
        hash: null,
        sortOrder: "created"
    });
    // convert from old options formatting
    if (!res.hasOwnProperty("otp_list") || !Array.isArray(res.otp_list)) {
        let otp_list = [];
        for (let item in res) {
            otp_list.push({
                name: item,
                key: res[item]
            });
            delete res[item];
        }
        res.otp_list = otp_list;
        await browser.storage.local.clear();
    }
    browser.storage.local.set(res);
}

async function installed(details) {
    let res = await browser.storage.local.get("hash");
    // only open options page if password is undef and user is installing for the very first time
    if ((res.hash === null || res.hash === undefined) && details.reason === "install") {
        browser.runtime.openOptionsPage();
    }
    main();
}

browser.runtime.onMessage.addListener(main);
browser.runtime.onInstalled.addListener(installed);
