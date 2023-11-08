import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { CustomMap } from "./CustomMap";
import Tile from 'ol/layer/Tile';
import Map from 'ol/Map';
import View from 'ol/View';
import { CameraDataType, SelectedMarkersType, SiteDataType } from '../../../Constants/GlobalTypes';
import Feature, { FeatureLike } from "ol/Feature";
import Point from "ol/geom/Point";
import { Coordinate } from "ol/coordinate";
import { transform } from "ol/proj";
import Cluster from 'ol/source/Cluster';
import { Icon, Style, Fill, Text, Stroke } from "ol/style";
import { defaults as defaultControls } from 'ol/control.js';
import { Attribution } from 'ol/control';
import OSM from 'ol/source/OSM';
import 'ol/ol.css'
import { DragBoxEvent } from "ol/interaction/DragBox";
import { DragBox } from "ol/interaction.js";
import { platformModifierKeyOnly } from "ol/events/condition";
import { ArrayDeduplication } from "../../../Functions/GlobalFunctions";
import { Circle, LineString } from "ol/geom";
import { Overlay } from "ol";
import { getPointResolution, METERS_PER_UNIT } from "ol/proj";
import circleImg from '../../../assets/img/circle.png'
import cctvIcon from '../../../assets/img/CCTVIcon.png'
import cctvSelectedIcon from '../../../assets/img/CCTVSelectedIcon.png'
import cctvStartIcon from '../../../assets/img/CCTVStartIcon.png'
import cctvEndIcon from '../../../assets/img/CCTVEndIcon.png'
import { getDistance } from "ol/sphere";
import { ContentsActivateColor } from "../../../styles/global-styled";
import { CSSProperties } from "react";

enum mapState {
    NORMAL,
    COMPLETE
}

const selectedMarkerDataKey = 'SELECTEDMARKERDATAKEY' // 선택 마커 데이터 키
const selectedMarkerTempDataKey = 'SELECTEDMARKERTEMPDATAKEY' // 지도에서 선택 마커 데이터 변경 잠시 담을 키
const selectedMarkerDataChange = 'SELECTEDMARKERDATACHANGE' // 선택 마커 실제 변경할 이벤트 명
const mapStateKey = 'MAPSTATE'

// const greenMarkerSvg = `<svg id="target" xmlns="http://www.w3.org/2000/svg" width="70" height="105" viewBox="0 0 38 56.55"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3px;}.cls-2{fill:#25af32;stroke:#139926;stroke-miterlimit:10;}</style></defs><g id="_룹_1"><path class="cls-2" d="M19,.5C8.78,.5,.5,8.78,.5,19c0,8.11,11.65,29.26,16.46,35.99,1,1.4,3.08,1.4,4.08,0,4.81-6.73,16.46-27.89,16.46-35.99C37.5,8.78,29.22,.5,19,.5Z"/><path class="cls-1" d="M12.05,15.82c0,.15-.12,.28-.28,.28s-.28-.12-.28-.28,.12-.28,.28-.28,.28,.12,.28,.28Zm2.24-.28c-.15,0-.28,.12-.28,.28s.12,.28,.28,.28,.28-.12,.28-.28-.12-.28-.28-.28Zm17.45-2.6H8.49v10.1h14.34l8.91-10.1Zm-7.4,8.39h7.09v-5.39h-2.34l-4.75,5.39Zm-11.56,8.71h6.61v-7m-10.9,10.95c2.18,0,3.95-1.77,3.95-3.95s-1.77-3.95-3.95-3.95v7.9Z"/></g></svg>`;
const greenClusterSvg = `<svg id="target" width="65" height="65" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.94 57.94"><defs><style>.cls-1{fill:#fff;}.cls-2{fill:#25af32;stroke:#139926;stroke-miterlimit:10;}</style></defs><g id="_룹_1"><circle class="cls-1" cx="27.97" cy="27.97" r="27.47"/><path class="cls-2" d="M27.97,5c12.67,0,22.97,10.31,22.97,22.97s-10.31,22.97-22.97,22.97S5,40.64,5,27.97,15.31,5,27.97,5m0-4.5C12.8,.5,.5,12.8,.5,27.97s12.3,27.47,27.47,27.47,27.47-12.3,27.47-27.47S43.14,.5,27.97,.5h0Z"/></g></svg>`;
const redClusterSvg = `<svg id="target" width="65" height="65" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.94 57.94"><defs><style>.cls-1{fill:#fff;}.cls-2{fill:#ff815a;stroke:#e8623f;stroke-miterlimit:10;}</style></defs><g id="_룹_1"><circle class="cls-1" cx="27.97" cy="27.97" r="27.47"/><path class="cls-2" d="M27.97,5c12.67,0,22.97,10.31,22.97,22.97s-10.31,22.97-22.97,22.97S5,40.64,5,27.97,15.31,5,27.97,5m0-4.5C12.8,.5,.5,12.8,.5,27.97s12.3,27.47,27.47,27.47,27.47-12.3,27.47-27.47S43.14,.5,27.97,.5h0Z"/></g></svg>`;

function arrowStyle(feature: FeatureLike) {
    let styles = [
        new Style({
            stroke: new Stroke({
                color: feature.get('color') || ContentsActivateColor,
                width: 2
            }),
            zIndex: 3
        })
    ]
    return styles
}

/**
 * 
 * @param coord 타겟 좌표
 * @returns 타겟 좌표를 4326 좌표계에서 3857 좌표계로 변환
 */
function transformCoordinateFrom4326To3857(coord: Coordinate) {
    return transform(coord, "EPSG:4326", "EPSG:3857");
}

/**
 * 
 * @param size 클러스터 내부 숫자 길이
 * @param mode hover 상태
 * @returns 클러스터 사이즈 반환
 */
function getClusterSize(size: number, mode: number) {
    switch (size) {
        case 1:
            return mode === 1 ? 0.5 : 0.75;
        case 2:
            return mode === 1 ? 0.65 : 0.95;
        case 3:
            return mode === 1 ? 0.85 : 1.15;
        case 4:
            return mode === 1 ? 0.95 : 1.5;
        default:
            return mode === 1 ? 1 : 1.75;
    }
}

/**
 * 
 * @param features 
 * @returns 마커 스타일 지정
 */
function markerStyle(features: FeatureLike) {
    let size = (features.get("features") || [features]).length;
    if (size > 1) {
        let featureList = features.get("features") as Array<Feature>;
        let mode = featureList.some(_ => _.get("mode") === 2) ? 2 : 1;
        let type = featureList.some(_ => _.get("type") === 2) ? 2 : 1;
        return new Style({
            image: new Icon({
                crossOrigin: "anonymous",
                src: "data:image/svg+xml;utf8," + encodeURIComponent(type === 1 ? greenClusterSvg : redClusterSvg),
                scale: getClusterSize(size.toString().length, mode),
            }),
            text: new Text({
                text: size.toString(),
                textAlign: "center",
                textBaseline: "middle",
                font: mode === 1 ? "bold 16px Arial" : "bold 30px Arial",
                fill: new Fill({
                    color: "#000000",
                }),
                offsetX: size.toString().length * 0.6,
                offsetY: size.toString().length,
            }),
            zIndex: 2,
        });
    } else {
        let feature = (features.get("features") || [features])[0] as Feature;
        if (feature !== undefined) {
            let type = feature.get("type");
            let mode = feature.get("mode");
            const cctvName = feature.get("name");
            let offset = 0;
            let imgByType = ''
            switch(type) {
                case 1:
                    imgByType = cctvIcon
                    break;
                case 2:
                    imgByType = cctvSelectedIcon
                    break;
                case 3:
                    imgByType = cctvStartIcon
                    break;
                case 4:
                    imgByType = cctvEndIcon
                    break;
                default: break;
            }

            return new Style({
                zIndex: 1,
                image: new Icon({
                    crossOrigin: "anonymous",
                    anchor: [0.5, 0.57],
                    src: imgByType,
                    scale: mode === 1 ? 0.5 : 0.75,
                }),
                text: mode === 2 ? new Text({
                    textAlign: "center",
                    textBaseline: "middle",
                    font: mode === 1 ? "bold 12px NotoSansKR" : "bold 14px NotoSansKR",
                    text: cctvName.length > 32 ? cctvName.slice(0, 32) + "..." : cctvName,
                    // text: "(204756) 송파 근린공원 인근 CCTV 21-7",
                    fill: new Fill({ color: "black" }),
                    scale: 1,
                    // backgroundFill: new Fill({ color: "#FFFFFF" }),
                    // backgroundStroke: new Stroke({
                    //     color: "#FFFFFF",
                    //     width: 1,
                    //     lineJoin: "round",
                    //     lineCap: "round",
                    //     lineDash: undefined,
                    //     lineDashOffset: 0,
                    //     miterLimit: 10,
                    // }),
                    padding: cctvName.length > 32 ? [6, 33, 6, 33] : [6, 20, 6, 20],
                    offsetY: offset + (mode === 2 ? 45 : 30),
                }) : undefined,
            });
        }
    }
}

const clsuterDistanceByZoomLv = (lv: number) => {
    // return (22 - lv) * 10
    if(lv > 20) {
        return 10
    } else if(lv > 18) {
        return 40
    } else if(lv > 16) {
        return 80
    } else {
        return (22 - lv) * 20
    }
}

/**
 * @generator OSM 저작권 표시
 */
const OSMattribution = new Attribution({
    collapsible: false,
});

/**
 * @class Openlayers Map Class
 */
export class OlMap extends CustomMap<Map> {
    dragBox = new DragBox({ condition: platformModifierKeyOnly });
    /**
     * @field 마커를 포함하는 벡터소스
     */
    VS: VectorSource = new VectorSource({ features: [] })

    /**
     * @field path 그릴 때 출발, 도착을 위한 VectorSource
     */
    pathVS: VectorSource = new VectorSource({ features: [] })

    /**
     * @field 클러스터를 나타내는 클러스터 객체
     */
    CL: Cluster = new Cluster({
        distance: 15,
        // distance: 35, // 송파구청
        // distance: 80, // 강남구청
        // distance: 120, // 태백 시청
        source: this.VS,
    })

    /**
     * @field 마커를 포함한 클러스터 소스를 포함하는 벡터레이어
     */
    VL: VectorLayer<Cluster> = new VectorLayer({
        source: this.CL,
        zIndex: 1,
        style: (feature) => markerStyle(feature),
    })

    /**
     * @field path 그릴 때 출발, 도착을 위한 VectorLayer
     */
    pathVL: VectorLayer<VectorSource> = new VectorLayer({
        source: this.pathVS,
        zIndex: 2,
        style: (feature) => markerStyle(feature)
    })

    arrowVS: VectorSource = new VectorSource({ features: [] })

    arrowVL: VectorLayer<VectorSource> = new VectorLayer({
        source: this.arrowVS,
        zIndex: 2,
        style: (feature) => arrowStyle(feature)
    })

    /**
     * @field {SelectedMarkersType} 선택된 마커 Id 리스트
     */
    selectedMarkers: SelectedMarkersType = []

    /**
     * @field {SelectedMarkersType} 선택된 마커 Id 리스트
     */
    pathMarkers: SelectedMarkersType = []

    /**
     * @field {string | number | undefined} 마우스 오버된 마커 ID
     */
    hoverId: string | number | undefined

    /**
     * @field {string | number | undefined} 마우스 클릭된 마커 ID
     */
    clickId: string | number | undefined

    /**
     * @field 추가동선 입력하는 오버레이
     */
    trafficInputOverlay?: Overlay

    /**
     * @field 추가동선 입력하는 오버레이
     */
    circleSelectOverlay?: Overlay

    /**
     * @field 추가동선 원 Feature
     */
    circleFeature: Feature = new Feature({ geometry: new Point([]), rotate: 0 })

    /**
     * @field 추가동선 원 그리는 레이어
     */
    circleVectorLayer: VectorLayer<VectorSource> = new VectorLayer({
        source: new VectorSource({ features: [this.circleFeature] }),
        visible: false,
        zIndex: 9999,
    })

    /**
     * @field 추가동선 원 회전 타이머
     */
    circleTimerId: NodeJS.Timer = 0 as unknown as NodeJS.Timer

    /**
     * @field 추가동선 원 Feature
     */
    circleRadius: number = 0

    /**
     * @field 추가동선 원 Feature
     */
    circleUnit: 'm' | 'km' = 'm'

    /**
     * @field 단일 선택 카메라 flag
     */
    singleSelected: boolean = false

    /**
     * @field 단일 카메라 view Id
     */
    singleCameraId: number = 0

    /**
     * @field viewChangeById에 의해 강조된 Marker
     */
    viewId: number = 0

    /**
     * @field 선택 하지 않는 시나리오(RealTime 등)
     */
    noSelect: boolean = false

    /**
     * 
     * @param target 지도를 할당할 Element 또는 Element의 id값
     * @description 맵 객체를 생성하여 부모 클래스에 전달
     */
    constructor(target: string | HTMLElement, forAddTraffic?: boolean, overlayEl?: HTMLDivElement, singleSelect?: boolean, noSelect?: boolean) {
        super(new Map({
            target: target,
            layers: [new Tile({ source: new OSM() })],
            controls: defaultControls({
                attribution: false,
                zoom: false,
                rotate: false,
            }).extend([OSMattribution]),
            view: new View({
                center: [14229930.931785274, 4357704.4413243886], //좌표계 변환
                minZoom: 7,
                maxZoom: 20,
                zoom: 14,
                projection: 'EPSG:3857'
            })
        }))
        this.singleSelected = singleSelect || false
        this.noSelect = noSelect || false
        this.map.addLayer(this.VL)
        this.map.addLayer(this.arrowVL)
        this.map.addLayer(this.pathVL)
        this.map.set(selectedMarkerDataKey, [])
        this.map.set(selectedMarkerTempDataKey, [])
        this.map.set(mapStateKey, mapState['NORMAL'])
        this.map.getView().on('change:resolution', () => {
            this.CL.setDistance(clsuterDistanceByZoomLv(this.map.getView().getZoom() as number))
            
        })
        if (forAddTraffic) {
            const addTrafficOverlay = new Overlay({
                id: "addTraffic",
                element: overlayEl,
                autoPan: true,
            });
            this.trafficInputOverlay = addTrafficOverlay;
            this.map.addOverlay(addTrafficOverlay)
        } else {
            const circleSelectOverlay = new Overlay({
                id: "addTraffic",
                element: overlayEl,
                autoPan: true,
            });
            this.circleSelectOverlay = circleSelectOverlay;
            this.map.addOverlay(circleSelectOverlay)
        }
        this.map.addLayer(this.circleVectorLayer)
    }

    init() {
        // 사이트데이터 기반으로 피쳐 생성 후 좌표 이동
        this.registerMouseMoveHandler();
        this.registerSingleClickHandler();
        if(!this.noSelect) this.registerBoxEndHandler();
    }

    registerMouseMoveHandler(): void {
        this.map.on("pointermove", (evt) => {
            if (this.singleCameraId) return;
            if (this.hoverId) {
                if(this.pathVS.getFeatureById(this.hoverId)) {
                    this.pathVS.getFeatureById(this.hoverId)?.set('mode', 1)
                } else if(this.VS.getFeatureById(this.hoverId)){
                    this.VS.getFeatureById(this.hoverId)?.set('mode', 1)
                }
                this.hoverId = undefined
            }
            if (this.map.hasFeatureAtPixel(evt.pixel)) {
                let feature = this.map.forEachFeatureAtPixel(
                    evt.pixel,
                    (feature) => feature
                )! as Feature;
                let features: Feature[] = feature.get("features");
                if (features) {
                    this.hoverId = features[0].getId()
                    features[0].set('mode', 2)
                    this.map.getTargetElement().style.cursor = "pointer";
                } else if(feature.getId()) {
                    this.hoverId = feature.getId()
                    feature.set('mode', 2)
                    this.map.getTargetElement().style.cursor = "pointer";
                }
            } else {
                this.map.getTargetElement().style.cursor = "";
            }
        });
    }

    registerSingleClickHandler(): void {
        this.map.on("singleclick", (e) => {
            let feature = this.map.forEachFeatureAtPixel(e.pixel, (feature) => feature) as Feature;
            if (feature) {
                let features: Feature[] = feature.get("features");
                if (features) {
                    this.map.getView().fit(new VectorSource({ features: features }).getExtent());
                } else {
                    this.clickId = feature.getId()
                    switch (this.map.get(mapStateKey)) {
                        case mapState['NORMAL']:
                            const selectedMarker: SelectedMarkersType = this.map.get(selectedMarkerDataKey)
                            let temp = []
                            if (this.singleSelected) {
                                temp = [feature.getId()]
                            } else {
                                if (selectedMarker.includes(feature.getId() as number)) {
                                    temp = selectedMarker.filter(_ => _ !== (features[0] || feature).getId())
                                } else {
                                    temp = selectedMarker.concat(feature.getId() as number)
                                }
                            }
                            this.dispatchSelectedMarkerChangeEvent(temp)
                            break;
                        case mapState['COMPLETE']:
                            const geom = feature.getGeometry()
                            this.trafficInputOverlay?.setPosition((geom as Point).getCoordinates())
                            this.circleFeature.setGeometry(geom)
                            break;
                    }
                }
            } else {
                this.closeOverlayView()
            }
        });
    }

    registerContextMenuHandler(): void {
        this.map.getTargetElement().addEventListener('contextmenu', (e) => {
            e.preventDefault()
            if(!this.noSelect) {
                const geom = new Point(this.map.getEventCoordinate(e))
                this.trafficInputOverlay?.setPosition((geom as Point).getCoordinates())
                this.circleSelectOverlay?.setPosition((geom as Point).getCoordinates())
                this.circleFeature.setGeometry(geom)
            }
        })
    }

    registerBoxEndHandler(): void {
        this.dragBox.on("boxend", (e: DragBoxEvent) => {
            if (this.map.get(mapStateKey) === mapState['NORMAL']) {
                const clusters = this.CL.getFeaturesInExtent(this.dragBox.getGeometry().getExtent());
                let featuresArray = clusters.flatMap(cluster => cluster.get("features"));
                const currentFeatureIds = this.map.get(selectedMarkerDataKey) as SelectedMarkersType;
                const targetIds = featuresArray.map(_ => _.getId());
                let result = ArrayDeduplication((currentFeatureIds.filter(_ => !targetIds.includes(_))).concat(targetIds.filter(_ => !currentFeatureIds.includes(_))))
                this.dispatchSelectedMarkerChangeEvent(result)
            }
        });
        this.map.addInteraction(this.dragBox);
    }

    createMarkersByCameras(cameras: CameraDataType[]): void {
        let featureTemp: Feature[] = []
        cameras.forEach(camera => {
            featureTemp.push(this.createMarker(camera))
        })
        if (featureTemp.length) {
            this.VS.addFeatures(featureTemp)
            this.map.getView().fit(this.VS.getExtent());
        }
    }

    createMarkersBySites(sitesData: SiteDataType[]): void {
        let featureTemp: Feature[] = []
        sitesData.forEach(siteData => {
            const { cameras } = siteData
            cameras.forEach(camera => {
                featureTemp.push(this.createMarker(camera, siteData.siteName))
            })
        })
        if (featureTemp.length) {
            this.VS.addFeatures(featureTemp)
            this.map.getView().fit(this.VS.getExtent());
        }
    }

    createMarker(camera: CameraDataType, siteName?: string): Feature {
        const { name, longitude, latitude, cameraId, vmsType, address } = camera;
        let feature = new Feature({
            geometry: new Point(
                transformCoordinateFrom4326To3857([longitude, latitude])
            ),
            // geometry: new Point(transformCoordinateFrom4326To3857([longitude + 0.078,latitude])),
            name: name,
            siteName: siteName ? [siteName] : [],
            address,
            mode: 1,
            type: 1,
            vmsType,
            searched: false,
        });
        feature.setId(camera.cameraId)
        return feature
    }

    removeAllMarkers(): void {
        this.map.set(selectedMarkerDataKey, [])
        this.VS.clear()
    }

    addSelectedMarkerChangeEventCallback(callback: (target: SelectedMarkersType) => void) {
        this.map.addEventListener(selectedMarkerDataChange, () => {
            if (callback) callback(this.map.get(selectedMarkerTempDataKey))
        })
    }

    selectedMarkerChangeCallback(currentState: SelectedMarkersType) {
        const currentSelectedMarkers = currentState
        const addedMarkers = currentSelectedMarkers.filter(_ => !this.selectedMarkers.includes(_))
        const deletedMarkers = this.selectedMarkers.filter(_ => !currentSelectedMarkers.includes(_))
        addedMarkers.forEach(_ => {
            this.VS.getFeatureById(_)?.set('type', 2)
        })
        deletedMarkers.forEach(_ => {
            this.VS.getFeatureById(_)?.set('type', 1)
        })
        this.selectedMarkers = currentSelectedMarkers
        this.map.set(selectedMarkerDataKey, currentSelectedMarkers)
    }

    createPathLines(cctvIds: CameraDataType['cameraId'][], color?: CSSProperties['color']): void {
        // this.arrowVS.clear()
        this.trafficInputOverlay?.setPosition(undefined)
        if (cctvIds.length >= 2) {
            this.pathMarkers = cctvIds
            cctvIds.forEach((_, ind, arr) => {
                if (ind !== arr.length - 1) {
                    const targetFeature = this.VS.getFeatureById(_)
                    const nextTargetFeature = this.VS.getFeatureById(arr[ind + 1])
                    const resultFeature = new Feature({
                        geometry: new LineString([
                            (targetFeature?.getGeometry() as Point).getCoordinates(),
                            (nextTargetFeature?.getGeometry() as Point).getCoordinates()
                        ]),
                        color
                    });
                    targetFeature?.set('type', 2)
                    resultFeature.setId(_ + "_" + arr[ind + 1])
                    this.arrowVS.addFeature(resultFeature)
                }
            })
            this.map.getView().fit(this.arrowVS.getExtent());
        }
        if(cctvIds.length > 0) {
            const startFeature = this.VS.getFeatureById(cctvIds[0])
            const endFeature = this.VS.getFeatureById(cctvIds[cctvIds.length - 1])
            if(endFeature) {
                this.pathVS.addFeature(endFeature)
                this.pathVS.getFeatureById(endFeature.getId()!)?.set("type", 4)
            }
            if(cctvIds.length > 1 && startFeature) {
                this.pathVS.addFeature(startFeature!)
                this.pathVS.getFeatureById(startFeature.getId()!)?.set("type", 3)
            }
        }
        this.map.set(mapStateKey, mapState['COMPLETE'])
        this.map.removeInteraction(this.dragBox)
    }

    clearPathLines(): void {
        if(this.pathVS) {
            this.pathVS.forEachFeature(_ => {
                _.set("type", 1)
            })
            this.pathVS.clear()
        }
        if (this.arrowVS) {
            this.arrowVS.clear()
        }
    }

    viewChangeById(cctvId: number): void {
        const target = this.VS.getFeatureById(cctvId)
        if(this.viewId) {
            this.VS.getFeatureById(this.viewId)?.set('mode',1)
        }
        this.viewId = cctvId
        target?.set('mode', 2)
        this.map.getView().fit(target?.getGeometry()?.getExtent()!)
        this.map.once('click', () => {
            target?.set('mode', 1)
        })
    }

    addTrafficOverlayViewChangeListener(callback: (view: boolean, targetId: string | number | undefined) => void): void {
        this.trafficInputOverlay?.on("change:position", () => {
            const opened = this.trafficInputOverlay?.getPosition() ? true : false
            this.circleVectorLayer.setVisible(opened)
            callback(opened, this.clickId)
        })
    }

    circleSelectOverlayViewChangeListener(callback: (view: boolean) => void): void {
        this.circleSelectOverlay?.on("change:position", () => {
            const opened = this.circleSelectOverlay?.getPosition() ? true : false
            this.circleVectorLayer.setVisible(opened)
            callback(opened)
        })
    }

    drawCircleByR(r: string | number, unit: 'm' | 'km'): void {
        this.circleRadius = Number(r)
        this.circleUnit = unit
        clearInterval(this.circleTimerId)
        this.circleVectorLayer.setStyle((feature) =>
            new Style({
                image: new Icon({
                    crossOrigin: "anonymous",
                    src: circleImg,
                    rotateWithView: true,
                    scale:
                        (this.circleRadius *
                            (this.circleUnit === "m" ? 1 : 1000) *
                            0.0219) /
                        Math.pow(2, 20 - this.map.getView().getZoom()!),
                    rotation: feature.get("rotate"),
                    opacity: 1,
                }),
            }))
        let count = 0
        this.circleTimerId = setInterval(() => {
            this.circleVectorLayer.getSource()!.getFeatures()[0].set("rotate", count);
            count += 0.5;
        }, 75);
    }

    getFeaturesInCircle(): CameraDataType['cameraId'][] {
        const view = this.map.getView();
        var proj = view.getProjection();
        var resolutionAtEquator = view.getResolution()!;
        const geom = this.circleFeature.getGeometry() as Point;
        var center = geom.getCoordinates();
        var pointResolution = getPointResolution(proj, resolutionAtEquator, center, 'm');
        const val = this.circleRadius
        var r = this.circleUnit === "m" ? val : (val * 1000);
        var resolutionFactor = resolutionAtEquator / pointResolution;
        r = (r / METERS_PER_UNIT.m) * resolutionFactor;
        const c = new Circle(geom.getCoordinates(), r);
        return this.VS.getFeaturesInExtent(c.getExtent()).filter(_ => {
            var geometry = _.getGeometry(); // feature의 Geometry를 가져옴
            if (geometry instanceof Point) { // Geometry가 Point일 경우
                var point = geometry.getCoordinates(); // Point의 좌표를 가져옴
                var distance = getDistance(center, point); // 중심과 Point 사이의 거리를 계산
                var dx = point[0] - center[0];
                var dy = point[1] - center[1];
                var distance = dx * dx + dy * dy; // 유클리드 거리 계산
                if (distance <= r * r) { // Point가 원 내부에 있는 경우
                    return true
                }
            }
            return false
        }).map(_ => _.getId() as number)
    }

    closeOverlayView(): void {
        if (this.trafficInputOverlay) this.trafficInputOverlay.setPosition(undefined)
        if (this.circleSelectOverlay) this.circleSelectOverlay.setPosition(undefined)
    }

    viewForSingleCamera(cctvId: number): void {
        const pre = this.VS.getFeatureById(this.singleCameraId)
        if (pre) {
            pre.set('mode', 1)
            pre.set('type', 1)
        }
        this.selectedMarkerChangeCallback([cctvId])
        this.viewChangeById(cctvId)
        this.VS.getFeatureById(cctvId)?.set('mode', 2)
        this.VS.getFeatureById(cctvId)?.set('type', 2)
        this.singleCameraId = cctvId
    }

    dispatchSelectedMarkerChangeEvent = (data: (CameraDataType['cameraId'] | string | undefined)[]) => {
        this.map.set(selectedMarkerTempDataKey, data)
        this.map.dispatchEvent(selectedMarkerDataChange)
    }

    changeViewToSelectedCCTVs = () => {
        const selectedFeatuerIds = this.map.get(selectedMarkerDataKey)
        if(selectedFeatuerIds.length > 0) {
            const temp = new VectorSource({features: []})
            temp.addFeatures(selectedFeatuerIds.map((_: CameraDataType['cameraId']) => this.VS.getFeatureById(_)))
            this.map.getView().fit(temp.getExtent())
        }
    }
}