import { Dispatch, SetStateAction } from 'react'
import { ConditionDataSingleType } from '../Model/ConditionDataModel';
import { ReIDMenuKeys } from '../Components/ReID/ConstantsValues';
import { ConditionDataTargetSelectMethodTypeKeys } from '../Components/ReID/Condition/Constants/Params';
import { descriptionParamType } from '../Components/ReID/Condition/TargetSelect/PersonDescription/DescriptionType';

export type setStateType<T> = Dispatch<SetStateAction<T>>

export type CaptureType = 'user' | 'auto'

export type SiteVmsType = "OMEYE" | "VMS";

export type ReIDObjectTypeKeys = 'PERSON' | 'FACE' | 'CARPLATE' | 'ATTRIBUTION'

export const ReIDObjectTypeKeys: ReIDObjectTypeKeys[] = ["PERSON", "FACE", "ATTRIBUTION", "CARPLATE"]

export type ObjectType = "all" | ReIDObjectTypeKeys | "car" | 'crowd' | 'falldown' | 'illegal_parking' | 'faces' | 'noneFind';

export type CameraDataType = {
  cameraId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  vmsId: string;
  vmsType: SiteVmsType;
  created_at: string;
};

export type SiteDataType = {
  cameras: Array<CameraDataType>;
  created_at: string;
  siteId: number;
  siteName: string;
  siteType?: SiteVmsType;
  sites?: SiteDataType[]
  fullName?: string
};

export type SelectedMarkersType = CameraDataType['cameraId'][]

export type PointType = [number, number, number, number];

export type RefType<T> = React.MutableRefObject<T>;

export type ReIDMenuKeysType = keyof typeof ReIDMenuKeys

export type CaptureResultType = {
  type: ReIDObjectTypeKeys
  points: PointType | number[]
}

export type ReIDResultDataResultListDataType = {
  resultId: number;
  accuracy: number;
  imgUrl: string;
  rank: number;
  frameImgUrl: string;
  searchCameraUrl: string;
  foundDateTime: string;
  timestamp: string;
  cctvId?: CameraDataType['cameraId']
  objectId?: number
};

export type ReIDResultType = {
  reIdId: number
  data: ReIDResultConditionDataType[]
}

export type ReIDResultConditionDataType = {
  title: string
  etc: string
  rank: number
  resultList: {
    objectUrl: string
    objectId: number
    objectType: ReIDObjectTypeKeys
    timeAndCctvGroup: (TimeDataType & {
      startTime: string
      endTime: string
      results: Map<number, ReIDResultDataResultListDataType[]>
      // {
      //   [key: number]: ReIDResultDataResultListDataType[]
      // }
    })[]
  }[]
}

export type SavedJSONType = { selectedType: ReIDObjectTypeKeys } & {
  [key in ReIDObjectTypeKeys]?: ConditionDataSingleType
}

export type CaptureResultListItemType = {
  id: number
  src: string
  type: ReIDObjectTypeKeys
  accuracy?: number
  time?: string
  cctvId?: CameraDataType['cameraId']
  mask?: boolean
  method?: ConditionDataTargetSelectMethodTypeKeys
  objectId?: number
  selected?: boolean
  cctvName?: CameraDataType['name']
  attributionList?: string[]
  ocr?: string
  description?: descriptionParamType
}

export type ReIdSSEResponseType = {
  statusCode: number;
  percent: number;
  status: string;
  reidId: number;
  error: string;
};

export type BasicLogDataType<T> = {
  results: T
  totalCount: number
}

export type TimeDataType = {
  startTime: string
  endTime: string
}