import { atom } from "recoil";
import { ReIDMenuKeys } from "../Components/ReID/ConstantsValues";

export const conditionMenu = atom<ReIDMenuKeys>({
    key: "conditionMenuState",
    default: ReIDMenuKeys['CONDITION']
})