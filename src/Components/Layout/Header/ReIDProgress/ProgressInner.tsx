import ProgressTimeIcon from '../../../../assets/img/ProgressTimeIcon.png'
import ProgressVideoIcon from '../../../../assets/img/ProgressVideoIcon.png'
import ProgressLocationIcon from '../../../../assets/img/ProgressLocationIcon.png'
import ProgressAIIcon from '../../../../assets/img/ProgressAIIcon.png'
import { CameraDataType } from '../../../../Constants/GlobalTypes'
import { ProgressDataParamsTimesDataType, ProgressDataPercentType, ProgressDataType } from '../../../../Model/ProgressModel'
import CollapseArrow from '../../../Constants/CollapseArrow'
import styled from 'styled-components'
import { ContentsBorderColor, GlobalBackgroundColor, ProgressCCTVErrorColor, SectionBackgroundColor, globalStyles, loadingAIAnalysisColor, loadingVideoDownloadColor } from '../../../../styles/global-styled'
import Progress from '../../Progress'
import CCTVNameById from '../../../Constants/CCTVNameById'
import { Suspense, useEffect, useState } from 'react'
import { getConditionPercent, getTimeGroupPercent } from '.'
import Button from '../../../Constants/Button'

const getSuccessByTimeGroup = (data: ProgressDataParamsTimesDataType['data']) => {
    const cctvIds = Object.keys(data)
    const success = cctvIds.filter(_ => data[Number(_)].status === 'SUCCESS').length
    return success
}

const getFailByTimeGroup = (data: ProgressDataParamsTimesDataType['data']) => {
    const cctvIds = Object.keys(data)
    const fail = cctvIds.filter(_ => data[Number(_)].status === 'FAIL').length
    return fail
}


export const CCTVProgressRow = ({ data, cctvId }: {
    cctvId: CameraDataType['cameraId']
    data: ProgressDataPercentType
}) => {
    const { aiPercent, videoPercent, status, errReason } = data
    return <CCTVProgressContainer>
        <CCTVProgressDataContainer style={{
            position: 'relative'
        }}>
            <CCTVProgressDataIconContainer>
                <CCTVProgressDataIconContents src={ProgressLocationIcon} />
            </CCTVProgressDataIconContainer>
            <CCTVProgressDataTitleContainer isFail={status === 'FAIL'} data-tooltip={errReason}>
                <Suspense fallback={<></>}>
                    <CCTVNameById cctvId={cctvId} />
                </Suspense>
            </CCTVProgressDataTitleContainer>
        </CCTVProgressDataContainer>
        <CCTVProgressDataContainer>
            <CCTVProgressDataIconContainer>
                <CCTVProgressDataIconContents src={ProgressVideoIcon} />
            </CCTVProgressDataIconContainer>
            <ProgressWrapper noString percent={videoPercent} color={loadingVideoDownloadColor} />
            <CCTVProgressDataLabelContainer>
                {videoPercent}%
            </CCTVProgressDataLabelContainer>
        </CCTVProgressDataContainer>
        <CCTVProgressDataContainer>
            <CCTVProgressDataIconContainer>
                <CCTVProgressDataIconContents src={ProgressAIIcon} />
            </CCTVProgressDataIconContainer>
            <ProgressWrapper noString percent={aiPercent || 0} color={loadingAIAnalysisColor} />
            <CCTVProgressDataLabelContainer>
                {aiPercent}%
            </CCTVProgressDataLabelContainer>
        </CCTVProgressDataContainer>
    </CCTVProgressContainer>
}

export const ConditionGroupContainer = ({ num, progressData, visible }: {
    num: number
    progressData: ProgressDataType
    visible: boolean
}) => {
    const [opened, setOpened] = useState(false)
    const [timeGroupOpened, setTimeGroupOpened] = useState<number[]>([])

    useEffect(() => {
        setOpened(false)
        setTimeGroupOpened([])
    }, [visible])

    return <Contents opened={opened}>
        <ConditionTitle onClick={() => {
            setOpened(!opened)
        }}>
            <ConditionTitleText>
                {progressData.title}
            </ConditionTitleText>
            <ConditionTitleSubContainer>
                <ConditionTitleSubContentOne>
                    <LabelWithValue>
                        진행률
                    </LabelWithValue>
                    <ValueWithLabel>
                        {Math.floor(getConditionPercent(progressData.times))}%
                    </ValueWithLabel>
                </ConditionTitleSubContentOne>
                {/* <ConditionTitleSubContentTwo hover disabled={true}>
                    분석 취소
                </ConditionTitleSubContentTwo> */}
                <ConditionTitleSubContentThree>
                    <TimeGroupCollapse opened={opened} />
                </ConditionTitleSubContentThree>
            </ConditionTitleSubContainer>
        </ConditionTitle>
        {
            progressData.times.map((__, _ind) => <TimeGroupContainer key={_ind} opened={timeGroupOpened.includes(_ind)} rowNum={Math.ceil(Object.keys(__.data).length / 2)}>
                <TimeGroupHeader onClick={() => {
                    if (timeGroupOpened.includes(_ind)) setTimeGroupOpened(timeGroupOpened.filter(t => t !== _ind))
                    else setTimeGroupOpened(timeGroupOpened.concat(_ind))
                }}>
                    <TimeGroupIcon>
                        <CCTVProgressDataIconContents src={ProgressTimeIcon} />
                    </TimeGroupIcon>
                    <TimeGroupTitle>
                        {__.time}
                    </TimeGroupTitle>
                    <TimeGroupProgress>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                진행률
                            </LabelWithValue>
                            <ValueWithLabel>
                                {getTimeGroupPercent(__)}%
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                전체
                            </LabelWithValue>
                            <ValueWithLabel>
                                {Object.keys(__.data).length}
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                성공
                            </LabelWithValue>
                            <ValueWithLabel>
                                {getSuccessByTimeGroup(__.data)}
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                        <TimeGroupProgressItem>
                            <LabelWithValue>
                                실패
                            </LabelWithValue>
                            <ValueWithLabel>
                                {getFailByTimeGroup(__.data)}
                            </ValueWithLabel>
                        </TimeGroupProgressItem>
                    </TimeGroupProgress>
                    <TimeGroupCollapse opened={timeGroupOpened.includes(_ind)} style={{
                        flex: '0 0 40px',
                        height: '40px',
                        padding: '8px'
                    }} />
                </TimeGroupHeader>
                <TimeGroupContents>
                    {progressData && Object.keys(__.data).map((___, __ind) => <CCTVProgressRow key={__ind} cctvId={Number(___)} data={__.data[Number(___)]} />)}
                </TimeGroupContents>
            </TimeGroupContainer>)
        }
    </Contents>
}

const rowHeight = 72

const ConditionTitle = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    height: 36px;
    width: 100%;
    cursor: pointer;
    margin-bottom: 12px;
`

const ConditionTitleText = styled.div`
    font-weight: bold;
    font-size: 1.2rem;
    flex: 1;
    padding-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const ConditionTitleSubContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'space-around' })}
    flex: 0 0 120px;
    padding: 0 0 0 16px;
    border-left: 1px solid ${ContentsBorderColor};
    height: 100%;
`

const ConditionTitleSubContentOne = styled.div`
    flex: 1;
    height: 100%;
`

const LabelWithValue = styled.div`
    font-size: .8rem;
    text-align: center;
`
const ValueWithLabel = styled.div`
    font-size: 1.3rem;
    text-align: center;
    font-weight: bold;
`

const ConditionTitleSubContentThree = styled.div`
    height: 100%;
    flex: 0 0 36px;
`

const Contents = styled.div<{ opened: boolean }>`
    width: 100%;
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
    padding: 12px;
    max-height: 100%;
    height: ${({ opened }) => opened ? 'auto' : '60px'};
    overflow-y: ${({ opened }) => opened ? 'auto' : 'hidden'};
    overflow-y: hidden;
    transition: height .1s ease;
    margin-bottom: 4px;
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '6px' })}
`

const CCTVProgressContainer = styled.div`
    flex: 0 0 49%;
    max-width: 49%;
    height: ${rowHeight}px;
    ${globalStyles.flex({ gap: '4px' })}
`

const CCTVProgressDataContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '4px' })}
`

const CCTVProgressDataIconContainer = styled.div`
    flex: 0 0 16px;
    height: 16px;
`

const CCTVProgressDataIconContents = styled.img`
    width: 100%;
    height: 100%;
`

const CCTVProgressDataTitleContainer = styled.div<{ isFail: boolean }>`
    font-size: .8rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 0 0 calc(90% - 16px)%;
    font-weight: 300;
    font-family: NanumGothicLight;
    ${({ isFail }) => isFail && `
        color: ${ProgressCCTVErrorColor};
        cursor: pointer;
        &:before,&:after {
            visibility:hidden;
            opacity:0;
            position:absolute;
            z-index: 9995;
            left:50%;
            transform:translateX(-50%);
            white-space:nowrap;
            transition:all .2s ease;
            font-size:11px;
            letter-spacing:-1px;
        }
        &:before {
            content:attr(data-tooltip);
            height:13px;
            position:absolute;
            top: 30px;
            padding: 5px 10px;
            border-radius:5px;
            color:#fff;
            background: ${SectionBackgroundColor};
            box-shadow:0 3px 8px rgba(165, 165, 165, 0.5);
        }
        &:after {
            content: '';
            border-left: 5px solid transparent;
            top:20px;
            border-right: 5px solid transparent;
            border-bottom: 5px solid ${SectionBackgroundColor};
        }
        &:hover:before {
            visibility:visible;
            opacity:1;
            top: 25px
        }
        &:hover:after {
            visibility:visible;
            opacity:1;
            top: 18px
        }
    `}
`

const CCTVProgressDataLabelContainer = styled.div`
    flex: 0 0 36px;
`

const ProgressWrapper = styled(Progress)`
    flex: 1;
    height: 35%;
`

const TimeGroupContainer = styled.div<{ opened: boolean, rowNum: number }>`
    background-color: ${GlobalBackgroundColor};
    border-radius: 8px;
    width: 100%;
    height: ${({ opened, rowNum }) => opened ? (60 + (rowNum * rowHeight)) : 60}px;
    overflow: hidden;
    transition: height .3s ease-out;
`

const TimeGroupHeader = styled.div`
    cursor: pointer;
    height: 60px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
    padding: 0 6px;
`

const TimeGroupIcon = styled.div`
    flex: 0 0 18px;
    height: 18px;
`

const TimeGroupTitle = styled.div`
    letter-spacing: -0.5px;
    font-size: 1rem;
    font-weight: bold;
    flex: 1;
`

const TimeGroupCollapse = styled(CollapseArrow)`
    height: 100%;
    cursor: pointer;
`

const TimeGroupProgress = styled.div`
    flex: 0 0 200px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '12px' })}
`

const TimeGroupProgressItem = styled.div`
    flex: 1;
`

const TimeGroupContents = styled.div`
    width: 100%;
    max-height: calc(100% - 28px);
    overflow-y: hidden;
    padding: 0 6px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '1%', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start' })}
`