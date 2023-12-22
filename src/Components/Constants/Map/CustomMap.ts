import { CSSProperties } from "react";
import { CameraDataType, ReIDResultDataResultListDataType, SelectedMarkersType, SiteDataType } from "../../../Constants/GlobalTypes";

/**
 * @param   {MapType} MapType 맵 타입 제네릭 요구(ol, 카카오 등)
 */
export abstract class CustomMap<MapType> {
    /**
     * @private @readonly @field    {Map} map 객체 속성
     */
    private readonly _map: MapType

    /** 
     * 지도 첫 셋팅 진행(이벤트 리스너 등)
    */
    public abstract init(): void;

    /**
     * 마우스 이동 시 이벤트 등록
     */
    public abstract registerMouseMoveHandler(): void;

    /**
     * 마커 선택 시 이벤트 등록
     */
    public abstract registerSingleClickHandler(): void;

    /**
     * 마우스 우클릭 시 이벤트 등록
     */
    public abstract registerContextMenuHandler(): void;

    /**
     * 지도 박스 선택 이벤트 등록
     */
    public abstract registerBoxEndHandler(): void;

    /** 
     * @param SiteDataArray 사이트 데이터 리스트를 기반으로 지도 마커 셋팅 진행
    */
    public abstract createMarkersBySites(sitesData: SiteDataType[]): void;

    /** 
     * @param CameraDataArray 카메라 데이터 리스트를 기반으로 지도 마커 셋팅 진행
    */
    public abstract createMarkersByCameras(cameras: CameraDataType[]): void;

    /** 
     * @param CameraData 카메라 데이터 기반으로 지도 마커 생성
    */
    public abstract createMarker(camera: CameraDataType, siteName?: string): unknown;

    /**
     * 전체 마커 지우기
     */
    public abstract removeAllMarkers(): void;

    /**
     * 
     * @function @argument (target: CameraDataType => void) 내부 마커 선택 변화 시 외부에서 사용할 이벤트 리스너 등록
     */
    public abstract addSelectedMarkerChangeEventCallback(callback: (target: CameraDataType['cameraId'][]) => void): void;

    /**
     * 
     * @function @argument (target: CameraDataType => void) 내부 추가 동선 마커 선택 변화 시 외부에서 사용할 이벤트 리스너 등록
     */
    public abstract addAdditionalMarkerChangeEventCallback(callback: (target: CameraDataType['cameraId'][]) => void): void;

    /**
     * 
     * @param currentState 외부에서 마커 변경 시 지도에 전달하는 콜백
     */
    public abstract selectedMarkerChangeCallback(currentState: SelectedMarkersType): void;

    /**
     * 
     * @param currentState 외부에서 동선 구축 마커 변경 시 지도에 전달하는 콜백
     */
    public abstract selectedAdditionalMarkerChangeCallback(currentState: SelectedMarkersType): void;

    /**
     * @param CamerasIds 동선을 표현할 마커들의 ID(순서 보장)
     */
    public abstract createPathLines(cctvIds: ReIDResultDataResultListDataType[], color?: CSSProperties['color']): void;

    /**
     * 동선 마커들 삭제
     */
    public abstract clearPathLines(): void;

    /**
     * 마커 ID값을 사용하여 마커 위치로 지도 뷰 이동
     */
    public abstract viewChangeById(cctvId: CameraDataType['cameraId']): void;

    /**
     * 단일 카메라만 볼 때 사용할 메소드
     */
    public abstract viewForSingleCamera(cctvId: CameraDataType['cameraId']): void;

    /**
     * @param @function callback 추가동선 입력 오버레이 open, close에 따른 리스너 등록
     */
    public abstract addTrafficOverlayViewChangeListener(callback: (view: boolean, targetId: string | number | undefined) => void): void;

    /**
     * @param @function callback 반경 선택 오버레이 open, close에 따른 리스너 등록
     */
    public abstract circleSelectOverlayViewChangeListener(callback: (view: boolean) => void): void;

    /**
     * @param r 반지름 - 원 그릴 반지름
     * @param unit 단위 - 원 그릴 단위 m|km
     * @description 반지름과 단위를 통해 원을 그리는 메소드
     */
    public abstract drawCircleByR(r: number|string, unit: 'm' | 'km'): void;

    /**
     * 추가 동선 시 그려진 원 안에 있는 CCTV 리스트 반환
     */
    public abstract getFeaturesInCircle(): CameraDataType['cameraId'][];

    /**
     * @param show 외부에서 지도 내 오버레이 vsible 해제 위한 메소드
     */
    public abstract closeOverlayView(): void;
    
    /**
     * 현재 선택 혹은 넘긴 CCTV들 전부 보이게 뷰 전환 메소드
     */
    public abstract changeViewToSelectedCCTVs(cameras?: CameraDataType['cameraId'][]): void;

    /**
     * 동선 구축 시 전체 동선이 보이며 해당 마커만 강조되게 뷰 전환 메소드
     */
    public abstract changeViewForPathCamera(camera: CameraDataType['cameraId']): void;

    /**
     * 강제로 현재 강조된 마커 강조 해제 메소드
     */
    public abstract clearHoverMarker(): void;

    /**
     * 겹친 CCTV 클릭 시 콜백 등록 메소드
     */
    public abstract addDuplicatedCCTVsSelectCallback(callback: (cameras: CameraDataType['cameraId'][]) => void): void;
    
    /**
     * CCTV 목록 클릭 시 추가 동선 오버레이 호출 메소드
     */
    public abstract callAdditionalOverlyByCctvId(cctvId: CameraDataType['cameraId']): void;

    /**
     * @param map 맵 객체 할당
     */
    constructor(map: MapType) {
        this._map = map;
    }

    /**
     * @readonly map 객체 Get
     */
    get map() {
        return this._map
    }
}