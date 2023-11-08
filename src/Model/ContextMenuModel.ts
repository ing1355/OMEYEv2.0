import { atom } from "recoil";
import { CSSProperties } from "react";
import { ReIDObjectTypeKeys, ReIDResultDataResultListDataType } from "../Constants/GlobalTypes";

export const contextMenuVisible = atom<{left: CSSProperties['left'], top: CSSProperties['top'], data: ReIDResultDataResultListDataType, type: ReIDObjectTypeKeys}|null>({
    key: "contextMenuVisible",
    default: null
})