import { CameraDataType, ReIDResultType } from "./GlobalTypes";

export const GetAllSitesDataApi = '/api/v2/site/list';
export const LoginApi = '/api/v2/login'
export const FirstConnectionApi = '/api/v1/encryption-key'
export const GetCCTVVideoInfoUrl = (cctvId: CameraDataType['cameraId']) => `/api/v2/camera/url/${cctvId}`;
export const GetCameraVideoUrlApi = (cameraId: CameraDataType['cameraId'], time?: string) => `/api/v1/camera/url/${cameraId}` + (time ? `?startTime=${time}` : '');

export const StopVMSVideoApi = `/api/v2/camera/stop`;
export const StopAllVMSVideoApi = `/api/v2/camera/stop-all`;

export const AutoCaptureApi = '/api/v2/target/detection/auto';

export const GetReIDLogs = '/api/v2/reid/log'

export const GetReidDataApi = (id: ReIDResultType['resultId']) => `/api/v1/reid/${id}`;

export const StartReIdApi = '/api/v1/reid';
export const SubmitTargetInfoApi = '/api/v2/target/save'

export const ReidCancelApi = '/api/v1/reid/cancel';

export const SseStartApi = '/sse/reid/progress';

export const GetReidStatusApi = '/api/v1/reid/status';

export const LogoutApi = '/api/v2/logout';

export const duplicateLoginApi = '/api/v1/login-force';

export const SubmitPersonDescriptionInfoApi = '/api/v2/reid/attribution';

export const RealTimeReidApi = '/api/v1/real-time/reid';

export const SseTestApi = '/test/sse'

export const SubmitCarVrpApi = '/api/v1/target/car/vrp';