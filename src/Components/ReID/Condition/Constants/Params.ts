export const ReIDTargetTypeKey: ReIDConditionParamsType = 'REIDTARGET'
export const ReIDTimeBoundaryTypeKey: ReIDConditionParamsType = 'REIDTIMEBOUNDARY'
export const ReIDAreaBoundaryTypeKey: ReIDConditionParamsType = 'REIDAREABOUNDARY'
export const ReIDETCTypeKey: ReIDConditionParamsType = 'REIDETC'

export type ReIDConditionParamsType = 'REIDTARGET' | 'REIDTIMEBOUNDARY' | 'REIDAREABOUNDARY' | 'REIDETC'

export const ConditionDataTargetSelectMethodTypeKeys: ConditionDataTargetSelectMethodTypeKeys[] = ["CCTV", "ImageUpload", "Description"]

export type ConditionDataTargetSelectMethodTypeKeys = 'CCTV' | 'ImageUpload' | 'Description'

export enum ConditionDataTargetSelectMethodTypes {
    CCTV,
    IMAGEUPLOAD,
    DESCRIPTION
}