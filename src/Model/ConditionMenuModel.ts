import { atom } from "recoil";
import { ReIDMenuKeys } from "../Components/ReID/ConstantsValues";
import { IS_PRODUCTION } from "../Constants/GlobalConstantsValues";

export const conditionMenu = atom<ReIDMenuKeys>({
    key: "conditionMenuState",
    default: IS_PRODUCTION ? ReIDMenuKeys['CONDITION'] : ReIDMenuKeys['REIDRESULT']
})