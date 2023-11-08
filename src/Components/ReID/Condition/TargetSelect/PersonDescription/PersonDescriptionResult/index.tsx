import styled from "styled-components"
import { DescriptionCategories, DescriptionCategoryKeyType } from "../DescriptionType"
import { SectionBackgroundColor, globalStyles } from "../../../../../../styles/global-styled"
import ImageView from "../../../Constants/ImageView"
import { CameraDataType } from "../../../../../../Constants/GlobalTypes"
import { useRecoilState, useRecoilValue } from "recoil"
import { GetCameraById } from "../../../../../../Model/SiteDataModel"
import { descriptionItemLabels, descriptionItemLabelsKeyType } from "../DescriptionItems"
import { descriptionResultData, descriptionSelectedResult } from "../../../../../../Model/DescriptionDataModel"
import { useEffect, useState } from "react"
import { convertFullTimeStringToHumanTimeFormat } from "../../../../../../Functions/GlobalFunctions"
import { PROGRESS_STATUS, ProgressStatus } from "../../../../../../Model/ProgressModel"

const CCTVName = ({ cctvId }: {
    cctvId: CameraDataType['cameraId']
}) => {
    const name = useRecoilValue(GetCameraById(cctvId))?.name
    return <>{name}</>
}

const ItemContent = ({ title, subscription }: {
    title: string
    subscription?: string | JSX.Element | JSX.Element[] | number
}) => {
    return <ItemContentRow>
        <ItemContentTitle>
            {title}
        </ItemContentTitle>
        <ItemContentSubscription>
            {subscription}
        </ItemContentSubscription>
    </ItemContentRow>
}

const getAttributionList = (data: string[]): {
    [key in DescriptionCategoryKeyType]: string[]
} => {
    return data.reduce((pre: any, cur) => {
        const splited = cur.split("_");
        if (pre[splited[0]]) {
            pre[splited[0]].push(splited[1]);
        } else {
            pre[splited[0]] = [splited[1]];
        }
        return pre;
    }, {})
}

let timerId: NodeJS.Timer

const PersonDescriptionResult = () => {
    const data = useRecoilValue(descriptionResultData)
    const progressStatus = useRecoilValue(ProgressStatus)
    const [count, setCount] = useState(0)
    const [selectedResult, setSelectedResult] = useRecoilState(descriptionSelectedResult)
    
    useEffect(() => {
        if(progressStatus.status === PROGRESS_STATUS['RUNNING']) {
            timerId = setInterval(() => {
                setCount(_ => (_ + 1)%3)
            },1000)
        } else {
            if(timerId) clearInterval(timerId)
        }
    },[progressStatus])
    
    return <Container>
        {
            progressStatus.status === PROGRESS_STATUS['RUNNING'] ? <LoadingText>
                <div>
                    인상착의 분석 진행 중입니다.{Array.from({length: count}).map(_ => '.')}
                </div>
                <div>
                    우측 상단에서 진행률을 확인하실 수 있습니다.
                </div>
            </LoadingText> :
            data.map(_ => {
                const attributionList = getAttributionList(_.detectedAttributionList)
                return <ItemBox selected={selectedResult.find(_result => _result.id === _.id) !== undefined} key={_.id} onClick={() => {
                    if(selectedResult.find(_result => _result.id === _.id)) {
                        setSelectedResult(selectedResult.filter(_result => _result.id !== _.id))
                    } else {
                        setSelectedResult(selectedResult.concat(_))
                    }
                }}>
                    <ItemImg src={_.img} />
                    <ItemContents>
                        <ItemContent title="CCTV 이름" subscription={<CCTVName cctvId={_.cameraId} />} />
                        <ItemContent title="유사율" subscription={_.accuracy + '%'} />
                        <ItemContent title="시간" subscription={convertFullTimeStringToHumanTimeFormat(_.time)} />
                        <ItemContent title="탐지 결과" />
                        <AttributionResultListContainer>
                            <AttributionResultListRow>
                                <AttributionResultListCol>
                                    카테고리
                                </AttributionResultListCol>
                                <AttributionResultListCol>
                                    속성
                                </AttributionResultListCol>
                            </AttributionResultListRow>
                            {
                                Object.keys(attributionList).map(__ => <AttributionResultListRow key={__}>
                                    <AttributionResultListCol>
                                        {DescriptionCategories.find(categories => categories.key === __)?.title}
                                    </AttributionResultListCol>
                                    <AttributionResultListCol>
                                        {attributionList[__ as DescriptionCategoryKeyType].map(_attr => {
                                            const attrTxt = _attr as descriptionItemLabelsKeyType
                                            return descriptionItemLabels[attrTxt]
                                        }).join(', ')}
                                    </AttributionResultListCol>
                                </AttributionResultListRow>)
                            }
                        </AttributionResultListContainer>
                    </ItemContents>
                </ItemBox>
            })
        }
    </Container>
}

export default PersonDescriptionResult

const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: 24px;
    position: relative;
    background-color: ${SectionBackgroundColor};
    overflow: auto;
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', gap: '1%', justifyContent: 'flex-start', alignItems: 'flex-start' })}
`

const ItemBox = styled.div<{selected: boolean}>`
    flex: 0 0 24.2%;
    max-width: 24.2%;
    height: 24.6%;
    border-radius: 16px;
    border: ${({selected}) => selected ? '3px solid red' : '1px solid white'};
    padding: 8px 16px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '5%', justifyContent: 'flex-start' })}
    cursor: pointer;
`

const ItemImg = styled(ImageView)`
    flex: 0 0 30%;
    width: 100%;
    height: 100%;
`

const ItemContents = styled.div`
    flex: 0 0 65%;
    max-height: 100%;
    overflow-y: auto;
`

const ItemContentRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '2%' })}
    margin-bottom: 4px;
`

const ItemContentTitle = styled.div`
    flex: 0 0 30%;
`

const ItemContentSubscription = styled.div`
    flex: 0 0 70%;
`

const AttributionResultListContainer = styled.div`
    
`

const AttributionResultListRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    border: 1px solid white;
    &:first-child {
        border-bottom: none;
    }
`

const AttributionResultListCol = styled.div`
    flex: 1;
    &:last-child {
        flex: 1.5;
    }
    text-align: center;
    padding: 2px 4px;
`

const LoadingText = styled.div`
    ${globalStyles.flex()}
    width: 100%;
    height: 100%;
    line-height: 3rem;
    & > div {
        font-size: 2rem;
    }
`