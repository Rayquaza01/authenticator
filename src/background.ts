import { browser, Runtime } from "webextension-polyfill-ts";
import { Options } from "./Options/Options";

async function setup(info: Runtime.OnInstalledDetailsType) {
    const opts = new Options(await browser.storage.local.get());
    await browser.storage.local.set(opts);

    if (info.reason === "install" || info.reason === "update") {
        browser.runtime.openOptionsPage();
    }
}

browser.runtime.onInstalled.addListener(setup);
