import styled from "styled-components"
import { ContentsActivateColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import { useRecoilValue } from "recoil"
import { AllReIDResultData, ReIDResultDataKeys } from "../../../Model/ReIdResultModel"
import { useEffect, useState } from "react"
import Button from "../../Constants/Button"
import ResultContainer from "./ResultContainer"
import mapIcon from '../../../assets/img/mapEmptyIcon.png'
import resultIcon from '../../../assets/img/resultIcon.png'
import MapView from "./MapView"

const ReIDResult = () => {
    const [isMapView, setIsMapView] = useState(false)
    const [selectedView, setSelectedView] = useState(0)
    const resultDatas = useRecoilValue(AllReIDResultData)
    const reIDResultKeys = useRecoilValue(ReIDResultDataKeys)
    
    const mapViewToggle = () => {
        setIsMapView(!isMapView)
    }

    useEffect(() => {
        if(!selectedView && resultDatas.length > 0) setSelectedView(resultDatas[0].resultId)
    },[resultDatas])

    return <Container>
        {resultDatas.length === 0 && <EmptyText>
            분석 결과가 존재하지 않습니다.<br/>
            조건 입력 메뉴에서 분석을 진행해주세요.
        </EmptyText>}
        <Header>
            <TitleContainer>
                {
                    reIDResultKeys.map((_, ind) => <Title key={ind} isSelected={selectedView === _} onClick={() => {
                        setSelectedView(_)
                    }}>
                        {_}
                    </Title>)
                }
            </TitleContainer>
            {resultDatas.length !== 0 && <BtnContainer>
                {!isMapView && <BtnDescription>
                    원하는 결과를 선택하여 동선을 확인할 수 있습니다.
                </BtnDescription>}
                <Btn onClick={mapViewToggle} icon={isMapView ? resultIcon : mapIcon}>
                    {isMapView ? '결과 보기' : '지도로 동선 확인'}
                </Btn>
            </BtnContainer>}
        </Header>
        <ContentsContainer>
            {
                reIDResultKeys.map((_, ind) => <ResultContainer key={ind} reidId={_} visible={!isMapView && (selectedView === _)}/>)
            }
            <MapView opened={isMapView} reidId={selectedView} />
        </ContentsContainer>
    </Container>
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
    padding: 4px 16px;
    z-index: ${({ isSelected }) => isSelected ? 10 : 9};
    border-radius: 6px;
    ${globalStyles.flex()}
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