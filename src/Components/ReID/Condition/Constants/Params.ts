export const ReIDTargetTypeKey: ReIDConditionParamsType = 'REIDTARGET'
export const ReIDTimeBoundaryTypeKey: ReIDConditionParamsType = 'REIDTIMEBOUNDARY'
export const ReIDAreaBoundaryTypeKey: ReIDConditionParamsType = 'REIDAREABOUNDARY'
export const ReIDETCTypeKey: ReIDConditionParamsType = 'REIDETC'

export type ReIDConditionParamsType = 'REIDTARGET' | 'REIDTIMEBOUNDARY' | 'REIDAREABOUNDARY' | 'REIDETC'

export const ConditionDataTargetSelectMethodTypeKeys: ConditionDataTargetSelectMethodTypeKeys[] = ["CCTV", "IMAGEUPLOAD", "DESCRIPTION", "REIDRESULT", "JSONUPLOAD", "PLATE"]

export type ConditionDataTargetSelectMethodTypeKeys = 'CCTV' | 'IMAGEUPLOAD' | 'DESCRIPTION' | "REIDRESULT" | "JSONUPLOAD" | "PLATE"

export enum ConditionDataTargetSelectMethodTypes {
    CCTV,
    IMAGEUPLOAD,
    DESCRIPTION,
    REIDRESULT,
    JSONUPLOAD,
    PLATE
}