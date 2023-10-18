import styled from "styled-components"
import LazyImageViewWithCanvas from "./LazyImageViewWithCanvas"
import { ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Button from "../../Constants/Button"
import ImageView from "../Condition/Constants/ImageView"
import { CameraDataType, ReIDResultDataResultListDataType, ReIDResultDataType, ReIdSSEResponseType } from "../../../Constants/GlobalTypes"
import { useEffect, useMemo, useState } from "react"
import { convertFullTimeStringToHumanTimeFormat } from "../../../Functions/GlobalFunctions"
import LazyVideo from "./LazyVideo"

type ResultItemType = {
    startTime: string
    endTime: string
    cctvs: CameraDataType['cameraId'][]
}

type ResultListViewProps = {
    opened: boolean
    selectedChange: (data: ReIDResultDataResultListDataType[][]) => void
    data: ReIDResultDataType
    added?: boolean
}

const ResultListView = ({ opened, selectedChange, data }: ResultListViewProps) => {
    const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(0)
    const [selectedResult, setSelectedResult] = useState<ReIDResultDataResultListDataType[][]>([])
    // const [filteredCameras, filteredDatas] = useMemo(() => {
    //     if (data && selectedTargetIndex !== null) {
    //         const maxGroupId = data.cameras.reduce((a, b) => b.groupId > a ? b.groupId : a, 0)
    //         let temp: ResultItemType[] = Array.from({ length: maxGroupId + 1 }).map((_, ind) => {
    //             const filteredCameras = data.cameras.filter(__ => __.groupId === ind)
    //             return {
    //                 startTime: filteredCameras[0].startTime,
    //                 endTime: filteredCameras[0].endTime,
    //                 cctvs: filteredCameras.map(__ => __.cameraId)
    //             }
    //         })
    //         return [temp, temp.map((_, ind) => _.cctvs.map(__ => data.resultList[selectedTargetIndex].result.filter(___ => ___.cameraId === __ && ___.groupId === ind).sort((a, b) => a.rank - b.rank)))]
    //     } else {
    //         return [[], []]
    //     }
    // }, [data, selectedTargetIndex])
    
    useEffect(() => {
        if (data) {
            // setSelectedResult(Array.from({ length: data.resultList.length }).map(_ => []))
        }
    }, [data])

    useEffect(() => {
        if (!opened) {
            selectedChange(selectedResult.map(_ => _.sort((a, b) => new Date(a.foundDateTime).getTime() - new Date(b.foundDateTime).getTime())))
        }
    }, [opened])
    
    return <>
        <Container opened={opened}>
            <Description>
                {/* {data.description} */}
            </Description>
            <InnerContents>
                <TargetsContainer>
                    {
                        // data?.resultList.map((_, ind) => <TargetsImageContainer key={ind}>
                        //     <TargetsImage src={_.object.imgUrl} />
                        //     <TargetSelectBtn selected={selectedTargetIndex === ind} onClick={() => {
                        //         setSelectedTargetIndex(ind)
                        //     }}>
                        //         선택
                        //         {/* {selectedTargetIndex === ind ? '해제' : '선택'} */}
                        //     </TargetSelectBtn>
                        // </TargetsImageContainer>)
                    }
                </TargetsContainer>
                <TargetResultsContainer>
                    {/* {
                        filteredCameras.map((_, ind) => <TargetResultItemContainer key={ind}>
                            <TargetResultTimeHeader>
                                {convertFullTimeStringToHumanTimeFormat(_.startTime)} ~ {convertFullTimeStringToHumanTimeFormat(_.endTime)}
                            </TargetResultTimeHeader>
                            {
                                filteredDatas[ind].map((__, _ind: number) => <TargetResultItemCCTVContainer key={_ind}>
                                    <TargetResultItemCCTVTitle>
                                        {__[0] && __[0].cameraName}
                                    </TargetResultItemCCTVTitle>
                                    <TargetResultItemCCTVListContainer>
                                        {__.map(___ => <TargetResultItemCCTVListItem key={___.rank}>
                                            <TargetResultItemCCTVListItemDistanceText>
                                                {___.distance ? <>유사율 {___.distance}%</> : '번호판'}
                                                <TargetResultSelectBtn onClick={() => {
                                                    if (selectedResult[selectedTargetIndex!].some(result => result.resultId === ___.resultId)) {
                                                        setSelectedResult(selectedResult.map((result, resultInd) => resultInd === selectedTargetIndex ? result.filter(_result => _result.resultId !== ___.resultId) : result))
                                                    } else {
                                                        setSelectedResult(selectedResult.map((result, resultInd) => resultInd === selectedTargetIndex ? result.concat(___) : result))
                                                    }
                                                }}>
                                                    {selectedResult.some(result => result.some(_result => _result.resultId === ___.resultId)) ? '해제' : '선택'}
                                                </TargetResultSelectBtn>
                                            </TargetResultItemCCTVListItemDistanceText>
                                            <TargetResultItemCCTVListItemMediaContainer>
                                                <TargetResultItemCCTVListItemMediaImageContainer>
                                                    <TargetResultItemCCTVListItemMediaImage src={___.imageUrl} />
                                                </TargetResultItemCCTVListItemMediaImageContainer>
                                                <TargetResultItemCCTVListItemMediaVideoContainer>
                                                    <LazyVideo poster={___.frameImageUrl} src={___.searchCameraUrl}/>
                                                </TargetResultItemCCTVListItemMediaVideoContainer>
                                            </TargetResultItemCCTVListItemMediaContainer>
                                        </TargetResultItemCCTVListItem>)}
                                    </TargetResultItemCCTVListContainer>
                                </TargetResultItemCCTVContainer>)
                            }
                        </TargetResultItemContainer>)
                    } */}
                </TargetResultsContainer>
            </InnerContents>
        </Container>
    </>
}

export default ResultListView

const Container = styled.div<{ opened: boolean }>`
    position: absolute;
    height: 100%;
    background-color: ${SectionBackgroundColor};
    border-radius: 16px;
    width: 100%;
    border: 1px solid black;
    padding: 16px 24px;
    ${({ opened }) => !opened && `display: none;`}
    ${globalStyles.fadeOut()}
`

const Description = styled.div`
    height: 52px;
    font-size: 2rem;
    color: white;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
`

const InnerContents = styled.div`
    height: calc(100% - 52px);
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const TargetsContainer = styled.div`
    flex: 0 0 200px;
    height: 100%;
    border: 2px solid ${ContentsBorderColor};
    border-radius: 10px;
    padding: 8px 12px;
    overflow: auto;
`

const TargetsImageContainer = styled.div`
    &:not(:last-child) {
        margin-bottom: 8px;
    }
    height: 200px;
    width: 100%;
`

const TargetsImage = styled(ImageView)`
    width: 100%;
    height: calc(100% - 44px);
    margin-bottom: 8px;
    border: 1px solid ${ContentsBorderColor};
`

const TargetSelectBtn = styled(Button) <{ selected: boolean }>`
    width: 100%;
    height: 36px;
    border-radius: 10px;
`

const TargetResultsContainer = styled.div`
    flex: 1;
    height: 100%;
    border-radius: 10px;
    padding: 8px 12px;
    overflow: auto;
`
const TargetResultItemContainer = styled.div`
    max-height: 100%;
    overflow: auto;
`

const TargetResultTimeHeader = styled.div`
    height: 64px;
    font-size: 1.6rem;
    color: white;
    ${globalStyles.flex()}
`

const TargetResultItemCCTVContainer = styled.div`
    margin-bottom: 42px;
`

const TargetResultItemCCTVTitle = styled.div`
    height: 48px;
    font-size: 1.2rem;
    border-radius: 16px;
    padding: 4px 12px;
    ${globalStyles.flex()}
    color: white;
    margin-bottom: 16px;
`

const TargetResultItemCCTVListContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-start' })}
    height: 160px;
    overflow: auto;
    padding-bottom: 20px;
`

const TargetResultItemCCTVListItem = styled.div`
    flex: 0 0 300px;
    height: 100%;
    border-radius: 8px;
    padding: 8px 12px;
`
const TargetResultItemCCTVListItemDistanceText = styled.div`
    height: 32px;
    border-radius: 10px;
    ${globalStyles.flex()}
    color: white;
    margin-bottom: 8px;
    position: relative;
    padding-right: 56px;
`

const TargetResultItemCCTVListItemMediaContainer = styled.div`
    height: calc(100% - 40px);
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '8px' })}
`

const TargetResultItemCCTVListItemMediaImageContainer = styled.div`
    flex: 50%;
    height: 100%;
    position: relative;
    ${globalStyles.flex()}
`

const TargetResultItemCCTVListItemMediaImage = styled(LazyImageViewWithCanvas)`
    width: 100%;
    height: 100%;
`

const TargetResultItemCCTVListItemMediaVideoContainer = styled.div`
    flex: 50%;
    height: 100%;
    border: 1px solid black;
`

const TargetResultSelectBtn = styled(Button)`
    position: absolute;
    right: 4px;
`