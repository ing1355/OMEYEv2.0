import styled from "styled-components"
import { memo, useMemo, useRef, useState, PropsWithChildren } from 'react'
import { globalSettings } from '../../../Model/GlobalSettingsModel';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { SitesData, SitesDataForTreeView } from '../../../Model/SiteDataModel';
import { OlMap } from './OlMap';
import { CameraDataType, ReIDObjectTypeKeys, ReIDResultDataResultListDataType, SiteDataType } from '../../../Constants/GlobalTypes';
import { CustomMap } from './CustomMap';
import Input from "../../Constants/Input"
import { ButtonDefaultHoverColor, ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, InputBackgroundColor, InputTextColor, SectionBackgroundColor, TextActivateColor, globalStyles } from "../../../styles/global-styled";
import Button from "../Button";
import { convertFullTimeStringToHumanTimeFormat } from "../../../Functions/GlobalFunctions";
import TimeModal from "../../ReID/Condition/Constants/TimeModal";
import { PROGRESS_STATUS, ProgressRequestParams, ProgressStatus, ReIdRequestFlag } from "../../../Model/ProgressModel";
import useMessage from "../../../Hooks/useMessage";
import { AdditionalReIDTimeValue, ReIDResultData, SingleReIDSelectedData } from "../../../Model/ReIdResultModel";
import AdditionalReIDContainer from "./AdditionalReIDContainer";
import { menuState } from "../../../Model/MenuModel";
import { conditionMenu } from "../../../Model/ConditionMenuModel";
import CCTVDropdownSearch from "../CCTVDropdownSearch";
import selectedMarkerLocationIcon from '../../../assets/img/selectedMarkerLocationIcon.png'
import cctvIcon from '../../../assets/img/treeCCTVIcon.png'
import rankIcon from '../../../assets/img/rankIcon.png'
import timeIcon from '../../../assets/img/ProgressTimeIcon.png'
import CollapseArrow from "../CollapseArrow";
import AreaSelect from "../../ReID/Condition/Constants/AreaSelect";

type MapComponentProps = PropsWithChildren & {
    selectedCCTVs?: CameraDataType['cameraId'][]
    selectedChange?: (targets: CameraDataType['cameraId'][]) => void
    cameras?: CameraDataType[]
    singleCamera?: CameraDataType['cameraId']
    forSingleCamera?: boolean
    pathCameras?: ReIDResultDataResultListDataType[]
    idForViewChange?: CameraDataType['cameraId']
    forAddtraffic?: boolean
    reIdId?: number
    onlyMap?: boolean
    noSelect?: boolean
    isDebug?: boolean
    initEvent?: boolean
    viewChangeForPath?: CameraDataType['cameraId'][]
    visible?: boolean
}

const hasCameraInSite = (siteData: SiteDataType) => {
    return siteData.cameras.length > 0 || (siteData.sites && siteData.sites.some(_ => _.cameras.length > 0))
}

const findSiteByDuplicatedCCTVs = (cctvs: CameraDataType['cameraId'][], siteData: SiteDataType[]): SiteDataType[] => {
    const filteredTreeData = siteData.map(_ => ({
        ..._,
        cameras: _.cameras.filter(__ => cctvs.includes(__.cameraId)),
        sites: _.sites ? findSiteByDuplicatedCCTVs(cctvs, _.sites) : []
    }))
    return filteredTreeData.filter(_ => hasCameraInSite(_))
}

const MapComponent = ({ selectedChange, selectedCCTVs, pathCameras, idForViewChange, forAddtraffic, children, cameras, singleCamera, forSingleCamera, reIdId, onlyMap, noSelect, initEvent, viewChangeForPath, visible }: MapComponentProps) => {
    const [trafficOverlayView, setTrafficOverlayView] = useState(false)
    const [circleSelectOverlayView, setCircleSelectOverlayView] = useState(false)
    const [r, setR] = useState('1')
    const [rUnit, setRUnit] = useState<'m' | 'km'>('m')
    const map = useRef<CustomMap<unknown>>()
    const mapElement = useRef<HTMLDivElement>(null)
    const addTrafficInputContainer = useRef<HTMLDivElement>(null)
    const circleSelectContainer = useRef<HTMLDivElement>(null)
    const { mapPlatformType } = useRecoilValue(globalSettings);
    const sitesData = useRecoilValue(SitesData)
    const treeData = useRecoilValue(SitesDataForTreeView)
    const [timeVisible, setTimeVisible] = useState(false)
    const [areaVisible, setAreaVisible] = useState(false)
    const [timeValue, setTimeValue] = useRecoilState(AdditionalReIDTimeValue)
    const [rankInput, setRankInput] = useState(10)
    const [titleInput, setTitleinput] = useState('추가 동선')
    const [etcInput, setEtcInput] = useState('')
    const [selectedAddtionalTarget, setSelectedAddtionalTarget] = useState<{
        src: string,
        id: number,
        type: ReIDObjectTypeKeys
    }[]>([])
    const [selectedAddtionalCCTVs, setSelectedAdditionalCCTVs] = useState<CameraDataType['cameraId'][]>([])
    const [duplicatedCCTVs, setDuplicatedCCTVs] = useState<CameraDataType['cameraId'][]>([])
    const targetReidresult = useRecoilValue(ReIDResultData(reIdId!))
    const progressStatus = useRecoilValue(ProgressStatus)
    const selectedReIdResultData = useRecoilValue(SingleReIDSelectedData(reIdId!))
    const globalMenuState = useRecoilValue(menuState)
    const conditionMenuState = useRecoilValue(conditionMenu)
    const setProgressRequestParams = useSetRecoilState(ProgressRequestParams)
    const setRequestFlag = useSetRecoilState(ReIdRequestFlag)
    const message = useMessage()
    const selectedReIdResultDataRef = useRef(selectedReIdResultData)

    useEffect(() => {
        if (duplicatedCCTVs.length > 0) {

        }
    }, [duplicatedCCTVs])

    useEffect(() => {
        selectedReIdResultDataRef.current = selectedReIdResultData
    }, [selectedReIdResultData])

    useEffect(() => {
        switch (mapPlatformType) {
            case 'ol':
            default:
                map.current = new OlMap(mapElement.current!, forAddtraffic, forAddtraffic ? addTrafficInputContainer.current! : circleSelectContainer.current!, forSingleCamera, noSelect)
                break;
        }
        map.current.init()
        if (forAddtraffic) {
            map.current?.addTrafficOverlayViewChangeListener((view, targetId) => {
                if (targetId) {
                    const temp = selectedReIdResultDataRef.current?.flatMap(_ => Object.keys(_).flatMap(__ => _[Number(__)])).sort((a, b) => a.foundDateTime < b.foundDateTime ? -1 : 1)
                    if (temp && temp.length > 0) {
                        setTimeValue({
                            startTime: temp[temp.length - 1].foundDateTime,
                            endTime: undefined
                        })
                    } else {
                        setTimeValue(undefined)
                    }
                } else {
                    valueInit()
                }
                setTrafficOverlayView(view)
            })
        } else {
        }
        map.current?.circleSelectOverlayViewChangeListener((view) => {
            setCircleSelectOverlayView(view)
        })
        map.current.registerContextMenuHandler()
        if (selectedChange) map.current.addSelectedMarkerChangeEventCallback(selectedChange)
        if (!noSelect) map.current.addDuplicatedCCTVsSelectCallback((cctvs) => {
            setDuplicatedCCTVs(cctvs)
        })
    }, [])

    const valueInit = () => {
        setR('1')
        setRUnit('m')
        setTitleinput('추가 동선')
        setEtcInput('')
        setSelectedAddtionalTarget([])
        if (timeValue && timeValue.endTime) setTimeValue(undefined)
    }

    useEffect(() => {
        if (map.current) {
            map.current.selectedMarkerChangeCallback(selectedCCTVs || [])
        }
    }, [selectedCCTVs])

    useEffect(() => {
        if (forAddtraffic && pathCameras && pathCameras.length > 0) {
            map.current?.clearPathLines()
            map.current?.createPathLines(pathCameras)
        } else if (pathCameras && pathCameras.length === 0) {
            map.current?.clearPathLines()
        }
    }, [forAddtraffic, pathCameras])

    useEffect(() => {
        // if(map.current && visible) {
        //     setTimeout(() => {
        //         if(map.current) map.current.changeViewToSelectedCCTVs(pathCameras)
        //     }, 500);
        // }
    }, [visible])

    useEffect(() => {
        if (idForViewChange) {
            map.current?.viewChangeById(idForViewChange)
        }
    }, [idForViewChange])

    useEffect(() => {
        if (viewChangeForPath && viewChangeForPath.length > 0) {
            map.current?.changeViewForPathCamera(viewChangeForPath[0])
        } else {
            map.current?.clearHoverMarker()
        }
    }, [viewChangeForPath])

    useEffect(() => {
        if (!trafficOverlayView || !circleSelectOverlayView) {
            valueInit()
        }
    }, [trafficOverlayView, circleSelectOverlayView])

    useEffect(() => {
        setR('1')
    }, [rUnit])

    useEffect(() => {
        if (trafficOverlayView || circleSelectOverlayView) {
            map.current?.drawCircleByR(r, rUnit)
        }
    }, [trafficOverlayView, circleSelectOverlayView, r, rUnit])

    const selectCCTVsInCircle = () => {
        const targets = map.current?.getFeaturesInCircle() || []
        if (forAddtraffic) {
            setSelectedAdditionalCCTVs(selectedAddtionalCCTVs.concat(targets).deduplication())
        } else {
            if (selectedCCTVs) selectedChange!(selectedCCTVs.concat(targets).deduplication())
        }
        map.current?.closeOverlayView()
    }

    const openTimeModal = () => {
        setTimeVisible(true)
    }

    const openAreaModal = () => {
        setAreaVisible(true)
    }

    const closeOverlayWrapper = (duplicatedFlag?: boolean) => {
        map.current?.closeOverlayView()
        valueInit()
    }

    useEffect(() => {
        if (map.current) map.current?.closeOverlayView()
    }, [globalMenuState, conditionMenuState])

    useEffect(() => {
        valueInit()
    }, [trafficOverlayView])

    useEffect(() => {
        if (initEvent && selectedChange) selectedChange([])
    }, [initEvent])

    useEffect(() => {
        if (!cameras && !(singleCamera && forSingleCamera)) map.current?.createMarkersBySites(sitesData)
    }, [sitesData])

    const createCameraRow = (camera: CameraDataType) => {
        return <CCTVItemContainer selected={selectedCCTVs?.includes(camera.cameraId) || false} key={camera.cameraId} onClick={() => {
            if (map.current) {
                if (forAddtraffic) {
                    closeOverlayWrapper()
                    map.current.callAdditionalOverlyByCctvId(camera.cameraId)
                } else {
                    if (selectedCCTVs?.includes(camera.cameraId)) {
                        if (selectedChange) selectedChange(selectedCCTVs.filter(_ => _ !== camera.cameraId))
                    } else {
                        if (selectedChange) selectedChange(selectedCCTVs!.concat(camera.cameraId))
                    }
                }
            }
        }}>
            {camera.name}
        </CCTVItemContainer>
    }

    const duplicatedCCTVSelect = useMemo(() => {
        return findSiteByDuplicatedCCTVs(duplicatedCCTVs, treeData)
    }, [duplicatedCCTVs, treeData])

    const duplicatedCCTVSelectView = useMemo(() => {
        return duplicatedCCTVSelect.flatMap(_ => _.cameras).deduplication((a, b) => a.cameraId === b.cameraId).map(_ => createCameraRow(_))
    }, [duplicatedCCTVSelect, selectedCCTVs])

    return <>
        <MapContainer ref={mapElement}
            onMouseEnter={e => {
                e.stopPropagation()
            }}
            onMouseDown={e => {
                e.stopPropagation()
            }}
            onMouseUp={e => {
                e.stopPropagation()
            }}
            onMouseLeave={e => {
                e.stopPropagation()
            }}
            onMouseMove={e => {
                e.stopPropagation()
            }}
        >
            {onlyMap && <CCTVDropdownSearch onChange={(target) => {
                if (map.current) map.current.viewChangeById(target.cameraId)
            }} />}
            <ControlsContainer>
                <SelectedViewBtn hover onClick={() => {
                    if (map.current) {
                        if (forAddtraffic) {
                            map.current?.changeViewToSelectedCCTVs(pathCameras?.map(_ => _.cctvId!))
                        }
                        else map.current?.changeViewToSelectedCCTVs()
                    }
                }}>
                    <img src={selectedMarkerLocationIcon} style={{
                        width: '100%',
                        height: '100%'
                    }} />
                </SelectedViewBtn>
                <ControlRowContainer>
                    {duplicatedCCTVs.length > 0 && <CCTVListContainer>
                        <CCTVListHeader>
                            CCTV
                        </CCTVListHeader>
                        <CCTVContentsContainer>
                            {duplicatedCCTVSelectView}
                        </CCTVContentsContainer>
                    </CCTVListContainer>}
                    {
                        forAddtraffic && <AddReIDInputContainer>
                            <AddReIDInputTitle>
                                <div>
                                    추가 동선 분석
                                </div>
                                <Button>
                                    접기
                                </Button>
                            </AddReIDInputTitle>
                            <AdditionalReIDContainer type={targetReidresult ? targetReidresult.data[0].resultList[0].objectType : null} onChange={data => {
                                setSelectedAddtionalTarget(data)
                            }} value={selectedAddtionalTarget} />
                            <AddReIDInputRow>
                                <AddReIDInputLabel>
                                    타이틀
                                </AddReIDInputLabel>
                                <AddReIDInputContentContainer>
                                    <AddReIDInputContent value={titleInput} onChange={(val) => {
                                        setTitleinput(val)
                                    }} maxLength={20} />
                                </AddReIDInputContentContainer>
                            </AddReIDInputRow>
                            <AddReIDInputRowDoubleCol>
                                <AddReIDInputCol>
                                    <AddReIDInputLabel>
                                        <img src={rankIcon} />
                                    </AddReIDInputLabel>
                                    <AddReIDInputContentContainer>
                                        <AddReIDInputContent value={rankInput} onChange={(val) => {
                                            setRankInput(Number(val))
                                        }} onlyNumber />
                                    </AddReIDInputContentContainer>
                                </AddReIDInputCol>
                                <AddReIDInputCol>
                                    <AddReIDInputLabel>
                                        <img src={cctvIcon} />
                                    </AddReIDInputLabel>
                                    <AddReIDInputContentContainer>
                                        <AdditionalCCTVValueContainer onClick={openAreaModal}>
                                            {selectedAddtionalCCTVs.length} 대
                                        </AdditionalCCTVValueContainer>
                                    </AddReIDInputContentContainer>
                                </AddReIDInputCol>
                            </AddReIDInputRowDoubleCol>
                            <AddReIDInputRow>
                                <AddReIDInputLabel>
                                    <img src={timeIcon} />
                                </AddReIDInputLabel>
                                <AddReIDInputContentContainer isDouble>
                                    <AddReIDTimeInputContent onClick={openTimeModal}>
                                        <TimeValueContainer>
                                            <div>
                                                시작
                                            </div>
                                            <div>
                                                {timeValue && timeValue.startTime ? convertFullTimeStringToHumanTimeFormat(timeValue.startTime) : 'YYYY-MM-DD HH:mm:ss'}
                                            </div>
                                        </TimeValueContainer>
                                        <TimeValueContainer>
                                            <div>
                                                종료
                                            </div>
                                            <div>
                                                {timeValue && timeValue.endTime ? convertFullTimeStringToHumanTimeFormat(timeValue.endTime) : 'YYYY-MM-DD HH:mm:ss'}
                                            </div>
                                        </TimeValueContainer>
                                    </AddReIDTimeInputContent>
                                </AddReIDInputContentContainer>
                            </AddReIDInputRow>
                            <AddReIDInputRow>
                                <AddReIDInputLabel>
                                    비고
                                </AddReIDInputLabel>
                                <AddReIDInputContentContainer isDouble>
                                    <AddReIDInputContent value={etcInput} onChange={(val) => {
                                        setEtcInput(val)
                                    }} maxLength={100} type="textarea" />
                                </AddReIDInputContentContainer>
                            </AddReIDInputRow>
                            <AddReIDInputBtn hover onClick={() => {
                                if (selectedAddtionalTarget.length === 0) return message.error({ title: '입력값 에러', msg: '대상이 선택되지 않았습니다.' });
                                if (map.current!.getFeaturesInCircle().length === 0) return message.error({ title: '입력값 에러', msg: '해당 반경 안에 CCTV가 존재하지 않습니다.' })
                                if (!r) return message.error({ title: '입력값 에러', msg: '반경을 입력해주세요.' })
                                if (!timeValue || (timeValue && !timeValue.endTime)) return message.error({ title: '입력값 에러', msg: '시간이 설정되지 않았습니다.' });
                                if (progressStatus.status === PROGRESS_STATUS['RUNNING']) return message.error({ title: '분석 요청 에러', msg: '이미 진행중인 요청이 존재합니다.' });
                                closeOverlayWrapper()
                                setRequestFlag(true)
                                setProgressRequestParams({
                                    type: 'ADDITIONALREID',
                                    params: {
                                        reIdId,
                                        title: titleInput,
                                        etc: etcInput,
                                        rank: rankInput,
                                        objects: selectedAddtionalTarget,
                                        timeGroups: [
                                            {
                                                startTime: timeValue.startTime,
                                                endTime: timeValue.endTime!
                                            }
                                        ],
                                        cctvIds: [
                                            map.current!.getFeaturesInCircle().map(_ => _)
                                        ]
                                    }
                                })
                            }}>
                                더 찾아보기
                            </AddReIDInputBtn>
                        </AddReIDInputContainer>
                    }
                </ControlRowContainer>
            </ControlsContainer>
            {children || <></>}
            <CircleSelectInputContianer ref={forAddtraffic ? addTrafficInputContainer : circleSelectContainer}>
                <AddReIDInputSubContainer>
                    <AddReIDInputRow>
                        <AddReIDInputLabel>
                            반경
                        </AddReIDInputLabel>
                        <AddReIDInputContentContainer>
                            <AddReIDInputContent onlyNumber maxLength={5} value={r} onChange={val => {
                                setR(val)
                            }} style={{
                                paddingRight: '60px'
                            }} onEnter={selectCCTVsInCircle} onBlur={() => {
                                if (!r) {
                                    setR('1')
                                }
                            }} />
                            <AddReIDInputContentLabel>
                                <AddReIDInputContentLabelItem selected={rUnit === 'm'} onClick={() => {
                                    setRUnit('m')
                                }}>
                                    m
                                </AddReIDInputContentLabelItem>
                                <AddReIDInputContentLabelItemLine />
                                <AddReIDInputContentLabelItem selected={rUnit === 'km'} onClick={() => {
                                    setRUnit('km')
                                }}>
                                    km
                                </AddReIDInputContentLabelItem>
                            </AddReIDInputContentLabel>
                        </AddReIDInputContentContainer>
                    </AddReIDInputRow>
                    <AddReIDInputBtn onClick={selectCCTVsInCircle}>
                        범위 내 선택
                    </AddReIDInputBtn>
                </AddReIDInputSubContainer>
            </CircleSelectInputContianer>
        </MapContainer>
        {forAddtraffic && <>
            <TimeModal title="추가 동선 시간" defaultValue={timeValue} onChange={setTimeValue} visible={timeVisible} close={() => {
                setTimeVisible(false)
            }} />
            <AreaSelect
                visible={areaVisible}
                title="추가 동선 CCTV"
                defaultSelected={selectedAddtionalCCTVs}
                complete={values => {
                    setSelectedAdditionalCCTVs(values)
                }}
                close={() => {
                    setAreaVisible(false)
                }}
            />
        </>}
    </>
}

export default memo(MapComponent, (prev, next) => {
    if (JSON.stringify(prev.selectedCCTVs) !== JSON.stringify(next.selectedCCTVs)) return false
    if (JSON.stringify(prev.cameras) !== JSON.stringify(next.cameras)) return false
    if (JSON.stringify(prev.pathCameras) !== JSON.stringify(next.pathCameras)) return false
    if (prev.idForViewChange !== next.idForViewChange) return false
    if (prev.viewChangeForPath !== next.viewChangeForPath) return false
    if (prev.initEvent !== next.initEvent) return false
    if (prev.reIdId !== next.reIdId) return false
    if (prev.visible !== next.visible) return false
    return true
})

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`

const AddReIDInputContainer = styled.div`
    width: 300px;
    background-color: ${GlobalBackgroundColor};
    border-radius: 12px;
    padding: 16px;
    ${globalStyles.flex({ gap: '12px' })}
`

const AddReIDInputTitle = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    font-size: 1.3rem;
    font-weight: bold;
    width: 100%;
    text-align: start;
`

const CircleSelectInputContianer = styled.div`
    width: 320px;
    background-color: ${GlobalBackgroundColor};
    border-radius: 12px;
    padding: 16px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px' })}
`

const AddReIDInputSubContainer = styled.div`
    width: 320px;
    ${globalStyles.flex({ gap: '16px' })}
`

const AddReIDInputRow = styled.div`
    ${globalStyles.flex({ gap: '4px' })}
    width: 100%;
`

const AddReIDInputRowDoubleCol = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
    width: 100%;
`

const AddReIDInputCol = styled.div`
    flex: 1;
    ${globalStyles.flex({ gap: '4px' })}
`

const AddReIDInputLabel = styled.div`
    font-size: 1.1rem;
    height: 20px;
    text-align: start;
    width: 100%;
    & > img {
        height: 100%;
    }
`

const AddReIDInputContentContainer = styled.div<{ isDouble?: boolean }>`
    height: ${({ isDouble }) => isDouble ? 56 : 32}px;
    width: 100%;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
`

const AdditionalCCTVValueContainer = styled.div`
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: ${InputBackgroundColor};
    ${globalStyles.flex()}
`

const AddReIDInputContent = styled(Input)`
    font-size: 1rem;
    width: 100%;
    height: 100%;
    max-width: 100%;
    color: white;
`

const AddReIDTimeInputContent = styled.div`
    font-size: 1.1rem;
    width: 100%;
    height: 100%;
    color: white;
    cursor: pointer;
    background-color: ${InputBackgroundColor};
    ${globalStyles.flex({ gap: '6px' })}
    text-align: center;
`

const TimeValueContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
    & > div {
        font-size: 1rem;
        font-weight: bold;
    }
`

const AddReIDInputContentLabel = styled.div`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    text-align: center;
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px' })}
`

const AddReIDInputContentLabelItem = styled.div<{ selected: boolean }>`
    flex: 0 0 22px;
    ${({ selected }) => `color: ${selected ? 'white' : 'rgba(255,255,255,.5)'};`}
    cursor: pointer;
`

const AddReIDInputContentLabelItemLine = styled.div`
    border-left: 2px solid white;
    height: 50%;
    flex: 0 0 4px;
`

const AddReIDInputBtn = styled(Button)`
    width: 100%;
    padding: 10px 16px;
`

const SelectedViewBtn = styled(Button)`
    position: relative;
    width: 42px;
    height: 42px;
    border: none;
    padding: 8px;
`

const ControlsContainer = styled.div`
    position: absolute;
    top: 48px;
    right: 12px;
    & > * {
        z-index: 1005;
    }
    ${globalStyles.flex({ gap: '6px', alignItems: 'flex-end' })}
`

const CCTVListContainer = styled.div`
    background-color: ${SectionBackgroundColor};
    padding: 8px;
    border-radius: 12px;
    width: 340px;
`

const CCTVListHeader = styled.div`
    padding: 4px 8px;
    font-weight: bold;
`

const CCTVContentsContainer = styled.div`
    max-height: 250px;
    overflow: auto;
    padding: 10px 6px;
`

const CCTVRowContainer = styled.div<{ opened: boolean }>`
    max-height: ${({ opened }) => opened ? '200px' : '28px'};
    transition: all .1s ease-out;
    overflow: hidden;
    padding: 2px 10px;
    border: 1px solid ${ContentsBorderColor};
    border-radius: 6px;
    &:not(:last-child) {
        margin-bottom: 8px;
    }
`

const CCTVTitleContainer = styled.div`
    cursor: pointer;
    height: 24px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const CollapseContainer = styled.div`
    height: 100%;
`

const CCTVRowContentsContainer = styled.div`
    padding: 10px 0;
    ${globalStyles.flex({ justifyContent: 'flex-start' })}
`

const CCTVItemContainer = styled.div<{ selected: boolean }>`
    width: 100%;
    border: none;
    background-color: ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    border-radius: 8px;
    height: 24px;
    line-height: 20px;
    padding: 2px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    font-family: NanumGothicLight;
    &:not(:last-child) {
        margin-bottom: 4px;
    }
    &:hover {
        background-color: ${ButtonDefaultHoverColor};
    }
`

const ControlRowContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', alignItems:'flex-start', gap: '4px' })}
`