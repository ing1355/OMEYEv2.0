import styled from "styled-components"
import { memo, useMemo, useRef, useState, PropsWithChildren } from 'react'
import { globalSettings } from '../../../Model/GlobalSettingsModel';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { SitesData } from '../../../Model/SiteDataModel';
import { OlMap } from './OlMap';
import { CameraDataType, ReIDObjectTypeKeys } from '../../../Constants/GlobalTypes';
import { CustomMap } from './CustomMap';
import Input from "../../Constants/Input"
import { GlobalBackgroundColor, InputBackgroundColor, InputTextColor, TextActivateColor, globalStyles } from "../../../styles/global-styled";
import Button from "../Button";
import { ArrayDeduplication, convertFullTimeStringToHumanTimeFormat } from "../../../Functions/GlobalFunctions";
import TimeModal from "../../ReID/Condition/Constants/TimeModal";
import { PROGRESS_STATUS, ProgressRequestParams, ProgressStatus } from "../../../Model/ProgressModel";
import useMessage from "../../../Hooks/useMessage";
import { AdditionalReIDTimeValue, ReIDResultData, SingleReIDSelectedData } from "../../../Model/ReIdResultModel";
import AdditionalReIDContainer from "./AdditionalReIDContainer";
import { menuState } from "../../../Model/MenuModel";
import { conditionMenu } from "../../../Model/ConditionMenuModel";
import CCTVDropdownSearch from "../CCTVDropdownSearch";
import selectedMarkerLocationIcon from '../../../assets/img/selectedMarkerLocationIcon.png'

type MapComponentProps = PropsWithChildren & {
    selectedCCTVs?: CameraDataType['cameraId'][]
    selectedChange?: (targets: CameraDataType['cameraId'][]) => void
    cameras?: CameraDataType[]
    singleCamera?: CameraDataType['cameraId']
    forSingleCamera?: boolean
    pathCameras?: CameraDataType['cameraId'][]
    idForViewChange?: CameraDataType['cameraId'][]
    forAddtraffic?: boolean
    reidId?: number
    onlyMap?: boolean
    noSelect?: boolean
    isDebug?: boolean
}

const MapComponent = ({ selectedChange, selectedCCTVs, pathCameras, idForViewChange, forAddtraffic, children, cameras, singleCamera, forSingleCamera, reidId, onlyMap, noSelect, isDebug }: MapComponentProps) => {
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
    const [timeVisible, setTimeVisible] = useState(false)
    const [timeValue, setTimeValue] = useRecoilState(AdditionalReIDTimeValue)
    const [rankInput, setRankInput] = useState(10)
    const [titleInput, setTitleinput] = useState('추가 동선')
    const [etcInput, setEtcInput] = useState('')
    const [selectedAddtionalTarget, setSelectedAddtionalTarget] = useState<{
        src: string,
        id: number,
        type: ReIDObjectTypeKeys
    }[]>([])
    const targetReidresult = useRecoilValue(ReIDResultData(reidId!))
    const progressStatus = useRecoilValue(ProgressStatus)
    const selectedReIdResultData = useRecoilValue(SingleReIDSelectedData(reidId!))
    const globalMenuState = useRecoilValue(menuState)
    const conditionMenuState = useRecoilValue(conditionMenu)
    const setProgressRequestParams = useSetRecoilState(ProgressRequestParams)
    const message = useMessage()
    const selectedReIdResultDataRef = useRef(selectedReIdResultData)

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
        if (!cameras && !(singleCamera && forSingleCamera)) map.current.createMarkersBySites(sitesData)
        if (forAddtraffic) {
            map.current?.addTrafficOverlayViewChangeListener((view, targetId) => {
                if (targetId) {
                    console.log(selectedReIdResultDataRef.current)
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
        if (map.current && selectedCCTVs) {
            map.current.selectedMarkerChangeCallback(selectedCCTVs)
        }
    }, [selectedCCTVs])

    useEffect(() => {
        if (forAddtraffic && pathCameras && pathCameras.length > 0) {
            map.current?.clearPathLines()
            map.current?.createPathLines(pathCameras, TextActivateColor)
        } else if(pathCameras && pathCameras.length === 0) {
            map.current?.clearPathLines()
        }
    }, [forAddtraffic, pathCameras])

    useEffect(() => {
        if (idForViewChange) {
            map.current?.viewChangeById(idForViewChange[0])
        }
    }, [idForViewChange])

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
        selectedChange!(ArrayDeduplication(selectedCCTVs!.concat(map.current?.getFeaturesInCircle() || [])))
        map.current?.closeOverlayView()
    }

    const openTimeModal = () => {
        setTimeVisible(true)
    }

    const closeOverlayWrapper = () => {
        map.current?.closeOverlayView()
        valueInit()
    }

    useEffect(() => {
        if (map.current) map.current?.closeOverlayView()
    }, [globalMenuState, conditionMenuState])

    useEffect(() => {
        valueInit()
    }, [trafficOverlayView])

    return <>
        <MapContainer ref={mapElement}>
            {onlyMap && <CCTVDropdownSearch onChange={(target) => {
                if(map.current) map.current.viewChangeById(target.cameraId)
            }} />}
            <SelectedViewBtn hover onClick={() => {
                if (map.current) map.current?.changeViewToSelectedCCTVs()
            }}>
                <img src={selectedMarkerLocationIcon} style={{
                    width: '100%',
                    height: '100%'
                }}/>
            </SelectedViewBtn>
            {children || <></>}
            {forAddtraffic ? <AddReIDInputContainer forAddTraffic={true} ref={addTrafficInputContainer} id="addTrafficContainer">
                <AdditionalReIDContainer type={targetReidresult ? targetReidresult.data[0].resultList[0].objectType : null} onChange={data => {
                    setSelectedAddtionalTarget(data)
                }} value={selectedAddtionalTarget} />
                <AddReIDInputSubContainer>
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
                    <AddReIDInputRow>
                        <AddReIDInputLabel>
                            랭크
                        </AddReIDInputLabel>
                        <AddReIDInputContentContainer>
                            <AddReIDInputContent value={rankInput} onChange={(val) => {
                                setRankInput(Number(val))
                            }} onlyNumber />
                        </AddReIDInputContentContainer>
                    </AddReIDInputRow>
                    <AddReIDInputRow>
                        <AddReIDInputLabel>
                            반경
                        </AddReIDInputLabel>
                        <AddReIDInputContentContainer>
                            <AddReIDInputContent onlyNumber maxLength={5} value={r} onChange={val => {
                                setR(val)
                            }} style={{
                                paddingRight: '60px'
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
                    <AddReIDInputRow>
                        <AddReIDInputLabel>
                            시간
                        </AddReIDInputLabel>
                        <AddReIDInputContentContainer>
                            <AddReIDTimeInputContent onClick={openTimeModal}>
                                {timeValue ? convertFullTimeStringToHumanTimeFormat(timeValue.startTime) : '시작 시간'}
                            </AddReIDTimeInputContent>
                        </AddReIDInputContentContainer>
                    </AddReIDInputRow>
                    <AddReIDInputRow>
                        <AddReIDInputLabel>
                            ~
                        </AddReIDInputLabel>
                        <AddReIDInputContentContainer>
                            <AddReIDTimeInputContent onClick={openTimeModal}>
                                {timeValue && timeValue.endTime ? convertFullTimeStringToHumanTimeFormat(timeValue.endTime!) : '종료 시간'}
                            </AddReIDTimeInputContent>
                        </AddReIDInputContentContainer>
                    </AddReIDInputRow>
                    <AddReIDInputRow>
                        <AddReIDInputLabel>
                            비고
                        </AddReIDInputLabel>
                        <AddReIDInputContentContainer>
                            <AddReIDInputContent value={etcInput} onChange={(val) => {
                                setEtcInput(val)
                            }} maxLength={100} />
                        </AddReIDInputContentContainer>
                    </AddReIDInputRow>
                    <AddReIDInputBtn onClick={() => {
                        if (selectedAddtionalTarget.length === 0) return message.error({ title: '입력값 에러', msg: '대상이 선택되지 않았습니다.' });
                        if (map.current!.getFeaturesInCircle().length === 0) return message.error({ title: '입력값 에러', msg: '해당 반경 안에 CCTV가 존재하지 않습니다.' })
                        if (!r) return message.error({ title: '입력값 에러', msg: '반경을 입력해주세요.' })
                        if (!timeValue || (timeValue && !timeValue.endTime)) return message.error({ title: '입력값 에러', msg: '시간이 설정되지 않았습니다.' });
                        if (progressStatus.status === PROGRESS_STATUS['RUNNING']) return message.error({ title: '분석 요청 에러', msg: '이미 진행중인 요청이 존재합니다.' });
                        closeOverlayWrapper()
                        setProgressRequestParams({
                            type: 'ADDITIONALREID',
                            params: {
                                reidId,
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
                </AddReIDInputSubContainer>
            </AddReIDInputContainer> : <AddReIDInputContainer forAddTraffic={false} ref={circleSelectContainer}>
                <AddReIDInputSubContainer>
                    <AddReIDInputRow>
                        <AddReIDInputLabel>
                            반경
                        </AddReIDInputLabel>
                        <AddReIDInputContentContainer>
                            <AddReIDInputContent maxLength={6} onInput={e => {
                                if (e.currentTarget.value.length === 0 || e.currentTarget.value === '0') e.currentTarget.value = '1'
                                else if (e.currentTarget.value.slice(0, 1) === '0') e.currentTarget.value = e.currentTarget.value.slice(1,)
                                else e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')
                            }} value={r} onChange={val => {
                                setR(val)
                            }} style={{
                                paddingRight: '60px'
                            }} onEnter={selectCCTVsInCircle} />
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
            </AddReIDInputContainer>}
        </MapContainer>
        {forAddtraffic && <TimeModal title="추가 동선 시간" defaultValue={timeValue} onChange={setTimeValue} visible={timeVisible} close={() => {
            setTimeVisible(false)
        }} />}
    </>
}

export default memo(MapComponent, (prev, next) => {
    if (JSON.stringify(prev.selectedCCTVs) !== JSON.stringify(next.selectedCCTVs)) return false
    if (JSON.stringify(prev.cameras) !== JSON.stringify(next.cameras)) return false
    if (JSON.stringify(prev.pathCameras) !== JSON.stringify(next.pathCameras)) return false
    if (prev.idForViewChange !== next.idForViewChange) return false
    return true
})

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`

const AddReIDInputContainer = styled.div<{ forAddTraffic: boolean }>`
    width: ${({ forAddTraffic }) => forAddTraffic ? 510 : 320}px;
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
    height: 30px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
    width: 100%;
`

const AddReIDInputLabel = styled.div`
    font-size: 1.2rem;
    flex: 0 0 60px;
    text-align: center;
`

const AddReIDInputContentContainer = styled.div`
    flex: 1;
    height: 100%;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
`

const AddReIDInputContent = styled(Input)`
    font-size: 1.2rem;
    width: 220px;
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
    ${globalStyles.flex()}
    text-align: center;
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
    padding: 10px 16px;
`

const SelectedViewBtn = styled(Button)`
    position: absolute;
    top: 48px;
    right: 12px;
    width: 42px;
    height: 42px;
    z-index: 1005;
    border: none;
    padding: 8px;
`