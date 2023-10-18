import { Dispatch, SetStateAction } from 'react'
import { ConditionDataSingleType, ConditionDataType } from '../Model/ConditionDataModel';
import { ReIDObjectTypeKeys } from '../Components/ReID/ConstantsValues';
import { ConditionDataTargetSelectMethodTypeKeys } from '../Components/ReID/Condition/Constants/Params';

export type setStateType<T> = Dispatch<SetStateAction<T>>

export type CaptureType = 'user' | 'auto'

export type SiteVmsType = "OMEYE" | "VMS";

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

export type ObjectType = "all" | "person" | "face" | "car" | 'crowd' | 'car_plate' | 'falldown' | 'illegal_parking' | 'faces' | 'noneFind';

export type CaptureResultType = {
  type: ReIDObjectTypeKeys
  points: PointType | number[]
}

export type ReIDResultDataResultListDataType = {
  resultId: number;
  distance: number;
  imageUrl: string;
  rank: number;
  frameImageUrl: string;
  searchCameraUrl: string;
  foundDateTime: string;
  timestamp: string;
  cctvId?: CameraDataType['cameraId']
};

export type ReIDResultType = {
  resultId: number
  uuid: string
  title: string
  data: ReIDResultDataType[]
}

export type ReIDResultDataType = {
  title: string
  etc: string
  resultList: {
    objectUrl: string
    objectId: number
    timeAndCctvGroup: {
      startTime: string
      endTime: string
      results: {
        [key: number]: ReIDResultDataResultListDataType[]
      }
    }[]
  }[]
}
// export type ReIDResultDataType = {
//   cameras: Array<{
//     cameraId: number;
//     downloadResult: string;
//     startTime: string;
//     endTime: string;
//     groupId: number;
//   }>;
//   reidId: number;
//   rank: number;
//   description: string;
//   status: string;
//   userId: string;
//   userName: string;
//   resultList: Array<{
//     object: {
//       imgUrl: string;
//       objectId: number;
//       type: ObjectType;
//     };
//     result: Array<ReIDResultDataResultListDataType>;
//   }>;
//   created_at: string;
// };

export type SavedJSONType = { selectedType: ReIDObjectTypeKeys } & {
  [key in ReIDObjectTypeKeys]?: ConditionDataSingleType
}

export type CaptureResultListItemType = {
  id: number
  src: string
  type: ReIDObjectTypeKeys
  occurancy?: number
  time?: string
  cctvId?: CameraDataType['cameraId']
  mask?: boolean
  method?: ConditionDataTargetSelectMethodTypeKeys
  objectId?: number
  selected?: boolean
  cctvName?: CameraDataType['name']
  attributionList?: string[]
  vrp?: string
}

export type ReIdSSEResponseType = {
  statusCode: number;
  percent: number;
  status: string;
  reidId: number;
  error: string;
};