import { atom } from "recoil";
import { AreaAnalyzeMenuKey, MenuKeys, MonitoringMenuKey, ReIdMenuKey } from "../Constants/GlobalConstantsValues";

export const menuState = atom<MenuKeys>({
    key: "menuState",
    default: ReIdMenuKey
})