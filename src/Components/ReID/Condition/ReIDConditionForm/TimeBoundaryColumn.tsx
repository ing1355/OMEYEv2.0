import { useRecoilState, useSetRecoilState } from "recoil"
import ConditionParamsInputColumnComponent from "./ConditionParamsInputColumnComponent"
import { conditionIsRealTimeData, conditionTimeDatas } from "../../../../Model/ConditionDataModel"
import styled from "styled-components"
import { ButtonBackgroundColor, ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../styles/global-styled"
import { TimeSelectIndex, TimeSelectVisible } from "../../../../Model/ConditionParamsModalModel"
import Button from "../../../Constants/Button"
import { convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions"
import IconBtn from "../../../Constants/IconBtn"
import timeIcon from '../../../../assets/img/ProgressTimeIcon.png'
import checkIcon from '../../../../assets/img/checkIcon.png'
import emptyCheckIcon from '../../../../assets/img/emptyCheckIcon.png'

const TimeBoundaryColumn = () => {
    const [timeData, setTimeData] = useRecoilState(conditionTimeDatas)
    const [isRealTime, setIsRealTime] = useRecoilState(conditionIsRealTimeData)
    const setTimeModalVisible = useSetRecoilState(TimeSelectVisible)
    const setTimeIndex = useSetRecoilState(TimeSelectIndex)

    const initAction = () => {
        setTimeData([])
        setIsRealTime(false)
    }

    const addAction = () => {
        setTimeModalVisible(true)
    }

    const modifyAction = (index: number) => {
        setTimeIndex(index)
        setTimeModalVisible(true)
    }

    const deleteAction = (index: number) => {
        setTimeData(timeData.filter((_, ind) => ind !== index))
    }

    const allSelectAction = () => {
        setTimeData(timeData.every(_ => _.selected) ? timeData.map(_ => ({ ..._, selected: false })) : timeData.map(_ => ({ ..._, selected: true })))
    }
    
    return <>
        <Container>
            <ConditionParamsInputColumnComponent
                title={`시간(${isRealTime ? '실시간' : `${timeData.filter(_ => _.selected).length}/${timeData.length}`})`}
                titleIcon={timeIcon}
                isDataExist={timeData.length > 0}
                initAction={initAction}
                dataAddAction={addAction}
                realtimeBtn={true}
                noDataText="시간 추가"
                allSelectAction={allSelectAction}
                allSelected={timeData.every(_ => _.selected)}>
                {
                    timeData.map((_, ind) => <TimeDataContainer key={ind} selected={_.selected || false} onClick={() => {
                        setTimeData(timeData.map((__, _ind) => ind === _ind ? {
                            ...__,
                            selected: !__.selected
                        } : __))
                    }}>
                        <TimeDataItemTitle>
                            <TitleContainer>
                                <Check selected={_.selected || false}>
                                    {<img src={_.selected ? checkIcon : emptyCheckIcon}/>}
                                </Check>
                                <div style={{
                                    fontSize: '1rem'
                                }}>
                                    그룹 {ind + 1}
                                </div>
                            </TitleContainer>
                            <HeaderBtnsContainer>
                                <IconBtn disabled={isRealTime} type="edit" onClick={(e) => {
                                    e.stopPropagation()
                                    modifyAction(ind)
                                }} />
                                <IconBtn disabled={isRealTime} type="delete" onClick={(e) => {
                                    e.stopPropagation()
                                    deleteAction(ind)
                                }} />
                            </HeaderBtnsContainer>
                        </TimeDataItemTitle>
                        <ContentsContainer>
                            {convertFullTimeStringToHumanTimeFormat(_.time[0])}&nbsp;~&nbsp;{convertFullTimeStringToHumanTimeFormat(_.time[1])}
                        </ContentsContainer>
                        {/* <BtnsContainer>
                            <Btn disabled={isRealTime} activate={_.selected}>
                                {_.selected ? '해제' : '선택'}
                            </Btn>
                        </BtnsContainer> */}
                    </TimeDataContainer>)
                }
            </ConditionParamsInputColumnComponent>
        </Container>
    </>
}

export default TimeBoundaryColumn

const Container = styled.div`
    ${globalStyles.conditionParamsColumnContainer}
`

const TimeDataContainer = styled.div<{ selected: boolean }>`
    flex: 0 0 120px;
    color: white;
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    width: 100%;
    ${globalStyles.conditionDataItemBox}
    ${globalStyles.flex()}
    position: relative;
    cursor: pointer;
    &:hover {
        background-color: ${ButtonBackgroundColor};
    }
`

const ContentsContainer = styled.div`
    flex: 1;
    padding: 28px 0;
    text-align: center;
    ${globalStyles.flex()}
`

const BtnsContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end', gap: '4px' })}
`

const TimeDataItemTitle = styled.div`
    color: white;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    & > div {
        font-size: 1.1rem;
        padding-left: 4px;
    }
    padding: 1px;
`

const HeaderBtnsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px', justifyContent: 'flex-end' })}
`

const Btn = styled(Button)`
    flex: 1;
    ${globalStyles.conditionDataItemBoxSelectBtn}
`

const TitleContainer = styled.div`
    ${globalStyles.flex({flexDirection:'row', gap: '8px'})}
    height: 24px;
`

const Check = styled.div<{selected: boolean}>`
    height: 20px;
    width: 20px;
    border: 1px solid ${({selected}) => selected ? ContentsActivateColor : 'white'};
    border-radius: 50%;
    padding: 4px;
    & > img {
        width: 100%;
        height: 100%;
    }
`