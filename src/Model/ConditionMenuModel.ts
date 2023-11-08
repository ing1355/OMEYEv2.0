import { atom } from "recoil";
import { ReIDMenuKeys } from "../Components/ReID/ConstantsValues";

export const conditionMenu = atom<ReIDMenuKeys>({
    key: "conditionMenuState",
    default: process.env.NODE_ENV === 'development' ? ReIDMenuKeys['CONDITION'] : ReIDMenuKeys['CONDITION']
})