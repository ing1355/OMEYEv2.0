import { atom } from "recoil";

export type GetOmeyeSettingsInfoType = {
  threshHold: number;
  maxResultDuration: number;
  maxAnalyzeCount: number;
  maxLiveAnalyzeCount: number;
  maxAnalyzeDuration: number;
  mapType: string;
  customMapTile: string;
  minZoom: number;
  maxZoom: number;
  cameraIcon: string;
  carFrame: number;
  personFrame: number;
  faceFrame: number;
  attributionFrame: number;
}

export const OmeyeSettingsInfoInit = {
  threshHold: 0,
  maxResultDuration: 0,
  maxAnalyzeCount: 0,
  maxLiveAnalyzeCount: 0,
  maxAnalyzeDuration: 0,
  mapType: '',
  customMapTile: '',
  minZoom: 0,
  maxZoom: 0,
  cameraIcon: '',
  carFrame: 0,
  personFrame: 0,
  faceFrame: 0,
  attributionFrame: 0
}

export const OmeyeSettingsInfo = atom<GetOmeyeSettingsInfoType>({
  key: 'OmeyeSettingsDataModel/OmeyeSettingsInfo',
  default: OmeyeSettingsInfoInit
})