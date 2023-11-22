import { atom } from "recoil";
import { AreaAnalyzeMenuKey, IS_PRODUCTION, MenuKeys, MonitoringMenuKey, ReIdMenuKey, VideoExportMenuKey } from "../Constants/GlobalConstantsValues";

export const menuState = atom<MenuKeys>({
    key: "menuState",
    default: IS_PRODUCTION ? null : VideoExportMenuKey
})