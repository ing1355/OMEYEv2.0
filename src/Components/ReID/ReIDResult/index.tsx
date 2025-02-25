import styled from "styled-components"
import { ContentsActivateColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { AllReIDSelectedResultData, ReIDAllResultData, ReIDResultDataKeys, ReIDResultSelectedCondition, ReIDResultSelectedView } from "../../../Model/ReIdResultModel"
import { useEffect, useState } from "react"
import Button from "../../Constants/Button"
import ResultContainer from "./ResultContainer"
import mapIcon from '../../../assets/img/mapEmptyIcon.png'
import resultIcon from '../../../assets/img/resultIcon.png'
import deleteIcon from '../../../assets/img/closeIcon.png'
import MapView from "./MapView"
import { GetReIDResultById } from "../../../Functions/NetworkFunctions"
import Modal from "../../Layout/Modal"
import { ReIDObjectTypeEmptyIcons } from "../ConstantsValues"
import { ReIDObjectTypeKeys } from "../../../Constants/GlobalTypes"
import { globalCurrentReIdId } from "../../Layout/ReIDProgress"
import { PROGRESS_STATUS, ProgressStatus } from "../../../Model/ProgressModel"

const ReIDResult = () => {
    const [isMapView, setIsMapView] = useState(false)
    const [modalVisible, setModalVisible] = useState<number|null>(null)
    const [selectedView, setSelectedView] = useRecoilState(ReIDResultSelectedView)
    const reidSelectedDatas = useRecoilValue(AllReIDSelectedResultData)
    const progressStatus = useRecoilValue(ProgressStatus)
    const [reidSelectedCondition, setReidSElectedCondition] = useRecoilState(ReIDResultSelectedCondition)
    const [resultDatas, setResultDatas] = useRecoilState(ReIDAllResultData)
    const reIDResultKeys = useRecoilValue(ReIDResultDataKeys)

    const mapViewToggle = () => {
        setIsMapView(!isMapView)
    }

    useEffect(() => {
        setIsMapView(false)
    }, [selectedView, reidSelectedCondition])

    const test = async () => {
        const res = await GetReIDResultById(170)
        if (res) setResultDatas([res])
    }

    useEffect(() => {
        // if(process.env.NODE_ENV === 'development') test()
    }, [])

    return <>
        <Container>
            {reidSelectedDatas.length === 0 && <EmptyText>
                분석 결과가 존재하지 않습니다.<br />
                검색 조건 설정 메뉴에서 분석을 진행해주세요.
            </EmptyText>}
            <Header>
                <TitleContainer>
                    {
                        resultDatas.map((_, ind, arr) => <Title key={ind} isSelected={selectedView[0] === _.reIdId} onClick={() => {
                            setSelectedView([_.reIdId])
                            setReidSElectedCondition(0)
                        }}>
                            <img src={ReIDObjectTypeEmptyIcons[ReIDObjectTypeKeys.findIndex(__ => __ === _.data[0].resultList[0].objectType)]} style={{
                                height: '80%',
                                width: '30px'
                            }}/>
                            {ind+1}
                            {!((globalCurrentReIdId === _.reIdId) && (progressStatus.status === PROGRESS_STATUS['RUNNING'])) ? <DeleteIconContainer onClick={(e) => {
                                e.stopPropagation()
                                setModalVisible(_.reIdId)
                            }}>
                                <DeleteIcon src={deleteIcon} />
                            </DeleteIconContainer> : <div style={{
                                width: '26px'
                            }}/>}
                        </Title>)
                    }
                </TitleContainer>
                {reidSelectedDatas.length !== 0 && <BtnContainer>
                    {!isMapView && <BtnDescription>
                        원하는 결과를 선택하여 동선을 확인할 수 있습니다.
                    </BtnDescription>}
                    <Btn hover onClick={mapViewToggle} icon={isMapView ? resultIcon : mapIcon}>
                        {isMapView ? '결과 보기' : '지도로 동선 확인'}
                    </Btn>
                </BtnContainer>}
            </Header>
            <ContentsContainer>
                {
                    reIDResultKeys.map((_, ind) => <ResultContainer key={ind} reidId={_} visible={!isMapView && (selectedView[0] === _)} />)
                }
                <MapView opened={isMapView} reidId={selectedView[0]} />
            </ContentsContainer>
        </Container>
        <Modal isConfirm title="분석 결과 삭제" complete={() => {
            if (selectedView[0] === modalVisible) {
                if (resultDatas.length === 1) setSelectedView([0])
                else setSelectedView([resultDatas[0].reIdId === modalVisible ? resultDatas[1].reIdId : resultDatas[0].reIdId])
            }
            setResultDatas(resultDatas.filter(__ => __.reIdId !== modalVisible))
        }} visible={modalVisible !== null} close={() => {
            setModalVisible(null)
        }}>
            <ModalContainer>
                선택한 내용이 모두 삭제됩니다.<br />
                정말로 삭제하시겠습니까?
            </ModalContainer>
        </Modal>
    </>
}

export default ReIDResult

const innerHeaderHeight = 45

const Container = styled.div`
    height: 100%;
    position: relative;
`

const Header = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    width: 100%;
    height: ${innerHeaderHeight}px;
`

const TitleContainer = styled.div`
    flex: 1;
    max-width: calc(100% - 560px);
    overflow: auto;
    height: 100%;
    padding: 6px 0;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '6px' })}
    position: relative;
`

const Title = styled.div<{ isSelected: boolean }>`
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    height: 100%;
    padding: 0;
    z-index: ${({ isSelected }) => isSelected ? 10 : 9};
    border-radius: 6px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px' })}
    background-color: ${({ isSelected }) => isSelected ? ContentsActivateColor : SectionBackgroundColor};
`

const BtnContainer = styled.div`
    height: 100%;
    flex: 0 0 530px;
    padding: 6px 0;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-end' })}
`

const Btn = styled(Button)`
    height: 100%;
`

const BtnDescription = styled.div`
    color: rgba(255,255,255,.4);
    font-size: 1rem;
`

const ContentsContainer = styled.div`
    height: calc(100% - ${innerHeaderHeight}px);
    position: relative;
`

const EmptyText = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1004;
    ${globalStyles.flex()}
    text-align: center;
    line-height: 2.5rem;
    font-size: 1.5rem;
    pointer-events: none;
`

const DeleteIconContainer = styled.div`
    height: 100%;
    width: 26px;
    cursor: pointer;
    ${globalStyles.flex()}
`

const DeleteIcon = styled.img`
    height: 25%;
`

const ModalContainer = styled.div`
    ${globalStyles.flex()}
    width: 360px;
    height: 200px;
    text-align: center;
    line-height: 2rem;
    font-size: 1.2rem;
`