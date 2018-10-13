/* globals defaultValues */

async function main() {
    let res = await browser.storage.local.get();
    defaultValues(res, {
        otp_list: [],
        fontColor: "#000000",
        backgroundColor: "#FFFFFF",
        hash: undefined
    });
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

async function installed() {
    browser.runtime.openOptionsPage();
    main();
}

browser.runtime.onMessage.addListener(main);
browser.runtime.onInstalled.addListener(installed);
