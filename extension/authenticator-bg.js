async function main() {
    var res = await browser.storage.local.get();
    if (!res.hasOwnProperty("otp_list") || !Array.isArray(res.otp_list)) {
        var otp_list = [];
        for (var item in res) {
            otp_list.push({
                name: item,
                key: res[item],
            });
            delete res[item];
        }
        res.otp_list = otp_list;
        browser.storage.local.clear();
        browser.storage.local.set(res);
    }
}
browser.runtime.onMessage.addListener(main);
browser.runtime.onInstalled.addListener(main);
