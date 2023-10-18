import styled from "styled-components"
import { memo, useMemo, useRef, useState, PropsWithChildren } from 'react'
import { globalSettings } from '../../../Model/GlobalSettingsModel';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { SitesData } from '../../../Model/SiteDataModel';
import { OlMap } from './OlMap';
import { CameraDataType } from '../../../Constants/GlobalTypes';
import { CustomMap } from './CustomMap';
import Input from "../../Constants/Input"
import { GlobalBackgroundColor, InputBackgroundColor, InputTextColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled";
import Button from "../Button";
import { ArrayDeduplication, convertFullTimeStringToHumanTimeFormat } from "../../../Functions/GlobalFunctions";
import TimeModal, { TimeModalDataType } from "../../ReID/Condition/Constants/TimeModal";
import { reidCancelFunc } from "../../../Functions/NetworkFunctions";
import { REIDSTATUS, ReIDStatus } from "../../../Model/ReIdResultModel";
import { pathColors } from "../../ReID/ReIDResult/MapView/ViewTargetSelect";

type MapComponentProps = PropsWithChildren & {
    selectedCCTVs?: CameraDataType['cameraId'][]
    selectedChange?: (targets: CameraDataType['cameraId'][]) => void
    cameras?: CameraDataType[]
    singleCamera?: CameraDataType['cameraId']
    forSingleCamera?: boolean
    pathCameras?: CameraDataType['cameraId'][][][]
    idForViewChange?: CameraDataType['cameraId']
    forAddtraffic?: boolean
    noSearch?: boolean
}

const MapComponent = ({ selectedChange, selectedCCTVs, pathCameras, idForViewChange, forAddtraffic, children, cameras, singleCamera, forSingleCamera, noSearch }: MapComponentProps) => {
    const [trafficOverlayView, setTrafficOverlayView] = useState(false)
    const [circleSelectOverlayView, setCircleSelectOverlayView] = useState(false)
    const [r, setR] = useState('1')
    const [rUnit, setRUnit] = useState<'m' | 'km'>('m')
    const [searchInputValue, setSearchInputValue] = useState('')
    const [searchInputOpen, setSearchOpen] = useState(false)
    const map = useRef<CustomMap<unknown>>()
    const mapElement = useRef<HTMLDivElement>(null)
    const addTrafficInputContainer = useRef<HTMLDivElement>(null)
    const circleSelectContainer = useRef<HTMLDivElement>(null)
    const { mapPlatformType } = useRecoilValue(globalSettings);
    const sitesData = useRecoilValue(SitesData)
    const cameraList = useMemo(() => ArrayDeduplication(sitesData.flatMap(_ => _.cameras), (__, ___) => __.cameraId === ___.cameraId), [sitesData])
    const [timeVisible, setTimeVisible] = useState(false)
    const [timeValue, setTimeValue] = useState<TimeModalDataType | undefined>(undefined)
    const setReIDStatus = useSetRecoilState(ReIDStatus)

    useEffect(() => {
        switch (mapPlatformType) {
            case 'ol':
            default:
                map.current = new OlMap(mapElement.current!, forAddtraffic, forAddtraffic ? addTrafficInputContainer.current! : circleSelectContainer.current!)
                break;
        }

        map.current.init()
        if(!cameras && !forSingleCamera) map.current.createMarkersBySites(sitesData)
        if (forAddtraffic) {
            map.current?.addTrafficOverlayViewChangeListener(view => {
                setTrafficOverlayView(view)
            })
        } else {
            map.current?.circleSelectOverlayViewChangeListener(view => {
                setCircleSelectOverlayView(view)
            })
            map.current.registerContextMenuHandler()
        }
        if (selectedChange) map.current.addSelectedMarkerChangeEventCallback(selectedChange)
    }, [])

    useEffect(() => {
        if(singleCamera) {
            map.current?.removeAllMarkers()
            map.current?.createMarkersByCameras([sitesData.flatMap(_ => _.cameras).find(_ => _.cameraId === singleCamera)!])
        }
    },[singleCamera])

    // useEffect(() => {
    //     if(cameras && cameras.length > 0) {
    //         map.current?.removeAllMarkers()
    //         map.current?.createMarkersByCameras(cameras)
    //     }
    // },[cameras])

    const valueInit = () => {
        setR('1')
        setRUnit('m')
        setTimeValue(undefined)
    }

    useEffect(() => {
        if (map.current && selectedCCTVs) {
            map.current.selectedMarkerChangeCallback(selectedCCTVs)
        }
    }, [selectedCCTVs])

    useEffect(() => {
        if (forAddtraffic) {
            map.current?.clearPathLines()
            pathCameras?.forEach((_, ind) => {
                _.forEach(__ => {
                    map.current?.createPathLines(__, pathColors[ind])
                })
            })
        }
    }, [forAddtraffic, pathCameras])

    useEffect(() => {
        if (idForViewChange) {
            map.current?.viewChangeById(idForViewChange)
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

    return <>
        <MapContainer ref={mapElement}>
            {children || <></>}
            {forAddtraffic ? <AddReIDInputContainer ref={addTrafficInputContainer} id="addTrafficContainer">
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
                            {timeValue ? convertFullTimeStringToHumanTimeFormat(timeValue.endTime!) : '종료 시간'}
                        </AddReIDTimeInputContent>
                    </AddReIDInputContentContainer>
                </AddReIDInputRow>
                <AddReIDInputBtn onClick={() => {
                    if(!timeValue) return;
                    closeOverlayWrapper()
                    window.addEventListener('unload', reidCancelFunc, {
                        once: true,
                    });
                    setReIDStatus(REIDSTATUS['RUNNING'])
                    // Axios("POST", StartReIdApi, {
                    //     description: reIDResultData?.description,
                    //     rank: reIDResultData?.rank,
                    //     cameraSearchAreaList: map.current?.getFeaturesInCircle().map(_ => {
                    //         return {
                    //             id: _,
                    //             startTime: timeValue.startTime,
                    //             endTime: timeValue.endTime,
                    //             groupId: reIDResultData?.cameras.reduce((a,b) => a > b.groupId ? a : b.groupId,0)
                    //         }
                    //     }),
                    //     objectIdList: reIDResultData?.resultList.map(_ => _.object.objectId),
                    //     originalReIdIdx: reIDResultData?.reidId,
                    // }).then(async (res) => {
                    //     setReIDStatus(REIDSTATUS['IDLE'])
                    //     if(res) addAddedReIDResultData(await Axios('GET', GetReidDataApi(res.id)))
                    //     window.removeEventListener('unload', reidCancelFunc);
                    // }).catch(err => {
                    //     setReIDStatus('IDLE')
                    // })
                }}>
                    더 찾아보기
                </AddReIDInputBtn>
            </AddReIDInputContainer> : <AddReIDInputContainer ref={circleSelectContainer}>
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
            </AddReIDInputContainer>}
            {!noSearch && <SearchControlContainer>
                <SearchInput
                    maxLength={40}
                    value={searchInputValue}
                    onChange={val => {
                        setSearchInputValue(val)
                        setSearchOpen(true)
                    }}
                    onFocus={() => {
                        setSearchOpen(true)
                    }}
                    onEnter={() => {
                        const target = cameraList.find(_ => _.name.includes(searchInputValue))
                        if (target) {
                            map.current?.viewChangeById(target.cameraId)
                            setSearchInputValue(target.name)
                            setSearchOpen(false)
                        }
                    }}
                    placeholder="CCTV 이름으로 검색"
                />
                <SearchAutoCompleteContaier>
                    {
                        searchInputOpen && searchInputValue && cameraList.filter(_ => _.name.includes(searchInputValue)).map(_ => <SearchAutoCompleteItem key={_.cameraId} onClick={() => {
                            map.current?.viewChangeById(_.cameraId)
                            setSearchInputValue(_.name)
                            setSearchOpen(false)
                        }}>
                            {_.name}
                        </SearchAutoCompleteItem>)
                    }
                </SearchAutoCompleteContaier>
            </SearchControlContainer>}
        </MapContainer>
        {forAddtraffic && <TimeModal title="추가 동선 시간 그룹" defaultValue={timeValue} onChange={setTimeValue} visible={timeVisible} setVisible={setTimeVisible} />}
    </>
}

export default memo(MapComponent, (prev, next) => {
    if (JSON.stringify(prev.selectedCCTVs) !== JSON.stringify(next.selectedCCTVs)) return false
    if (JSON.stringify(prev.cameras) !== JSON.stringify(next.cameras)) return false
    if (JSON.stringify(prev.singleCamera) !== JSON.stringify(next.singleCamera)) return false
    if (JSON.stringify(prev.pathCameras) !== JSON.stringify(next.pathCameras)) return false
    if (JSON.stringify(prev.idForViewChange) !== JSON.stringify(next.idForViewChange)) return false
    return true
})

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`

const SearchControlContainer = styled.div`
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 1001;
    height: 30px;
    width: 240px;
`

const SearchInput = styled(Input)`
    width: 100%;
    height: 100%;
    padding: 4px 8px;
`

const SearchAutoCompleteContaier = styled.div`
    position: absolute;
    top: 110%;
    left: 0;
    border-radius: 6px;
    width: 100%;
    min-height: 30px;
    max-height: 180px;
    overflow-x: hidden;
    overflow-y: auto;
`

const SearchAutoCompleteItem = styled.div`
    width: 100%;
    height: 30px;
    background-color: ${GlobalBackgroundColor};
    color: ${InputTextColor};
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    padding: 4px 8px;
    line-height: 26px;
`

const AddReIDInputContainer = styled.div`
    width: 320px;
    background-color: ${SectionBackgroundColor};
    border-radius: 12px;
    padding: 16px;
    ${globalStyles.flex({ gap: '16px' })}
`

const AddReIDInputRow = styled.div`
    height: 30px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
    width: 100%;
`

const AddReIDInputLabel = styled.div`
    font-size: 1.3rem;
    flex: 0 0 45px;
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