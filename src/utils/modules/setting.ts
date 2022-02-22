import store from "@/store";

export default class Setting {
    private setting = {
        version: 0
    };
    constructor() {

    }
    static getSetting() {
        let setting = {
            version: 0
        };
        if (localStorage.getItem("setting") == null) {
            console.log("Do not find setting data, now will init setting");
            store.commit("initSetting");
        } else {
            setting = JSON.parse(localStorage.getItem("setting")!);
            if (setting.version < store.state.defaultSetting.version) {
                store.commit("upgradeSetting");
            }
            store.commit("changeSetting", setting);
        }
        return setting;
    }
}