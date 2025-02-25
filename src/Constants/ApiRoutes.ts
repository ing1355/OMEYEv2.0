import { CameraDataType, ReIDResultType } from "./GlobalTypes";

export const GetAllSitesDataApi = '/api/v2/site/list';
export const LoginApi = '/api/v2/login'
export const FirstConnectionApi = '/api/v1/encryption-key'

export const GetCCTVVideoInfoUrl = (cctvId: CameraDataType['cameraId']) => `/api/v2/camera/url/${cctvId}`;
export const GetCameraVideoUrlApi = (cameraId: CameraDataType['cameraId'], time?: string) => `/api/v2/camera/url/${cameraId}` + (time ? `?startTime=${time}` : '');
export const GetCameraStoredTimeApi = '/api/v2/camera/stored-time'

export const StopVMSVideoApi = `/api/v2/camera/stop`;
export const StopAllVMSVideoApi = `/api/v2/camera/stop-all`;

export const AutoCaptureApi = '/api/v2/target/detection/auto';

export const GetReIDLogs = '/api/v2/reid/log'

export const GetReidDataApi = (id: ReIDResultType['reIdId']) => `/api/v2/reid/result/${id}`;

export const StartReIdApi = '/api/v2/reid';
export const AdditionalReIdApi = (reidId: number) => `/api/v2/reid/additional/${reidId}`

export const SubmitTargetInfoApi = '/api/v2/target/save'

export const ReidCancelApi = '/api/v2/reid/cancel';

export const SseStartApi = '/sse/reid/progress';

export const GetReidStatusApi = '/api/v1/reid/status';

export const LogoutApi = '/api/v2/logout';

export const duplicateLoginApi = '/api/v1/login-force';

export const GetPersonDescriptionInfoApi = (uuid: string) => `/api/v2/reid/attribution/result/${uuid}`
export const SubmitPersonDescriptionInfoApi = '/api/v2/reid/attribution';

export const RealTimeReidApi = '/api/v2/reid/real-time';
export const RealTimeReidCancelApi = '/api/v2/reid/real-time/cancel';
export const UpdateRealTimeThresholdApi = '/api/v2/reid/real-time/update-threshold'

export const SubmitCarVrpApi = '/api/v1/target/car/vrp';

export const VideoExportApi = '/api/v2/export/de-identity-video'
export const GetVideoHistoryApi = '/api/v2/export/get-list'

export const GetThumbnailImageApi = '/api/v2/thumbnail'