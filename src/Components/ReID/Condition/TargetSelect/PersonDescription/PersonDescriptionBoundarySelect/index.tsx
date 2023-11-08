import styled from "styled-components"
import MapComponent from "../../../../../Constants/Map"
import CCTVTree from "../../../../../Layout/CCTVTree"
import { globalStyles } from "../../../../../../styles/global-styled"
import { useEffect, useRef, useState } from "react"
import Button from "../../../../../Constants/Button"
import Input from "../../../../../Constants/Input"
import Calendar from "../../../Constants/Calendar"
import { useRecoilState } from "recoil"
import { descriptionCCTVsData, descriptionRankData, descriptionTimeData } from "../../../../../../Model/DescriptionDataModel"
import { TimeInput } from "../../../Constants/TimeModal"

const PersonDescriptionBoundarySelect = () => {
    const [isTreeView, setIsTreeView] = useState(false)
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [startHour, setStartHour] = useState('')
    const [startMinute, setStartMinute] = useState('')
    const [startSecond, setStartSecond] = useState('')
    const [endHour, setEndHour] = useState('')
    const [endMinute, setEndMinute] = useState('')
    const [endSecond, setEndSecond] = useState('')
    const [selectedCCTVs, setSelectedCCTVs] = useRecoilState(descriptionCCTVsData)
    const [selectedTime, setSelectedTime] = useRecoilState(descriptionTimeData)
    const [rank, setRank] = useRecoilState(descriptionRankData)
    const startMinuteRef = useRef<HTMLInputElement>(null)
    const startSecondRef = useRef<HTMLInputElement>(null)
    const endMinuteRef = useRef<HTMLInputElement>(null)
    const endSecondRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const start = selectedTime[0] || new Date()
        const end = selectedTime[1] || new Date()
        if (startDate) {
            start.setTime(startDate.getTime())
        }
        if (startHour) start.setHours(Number(startHour))
        if (startMinute) start.setMinutes(Number(startMinute))
        if (startSecond) start.setSeconds(Number(startSecond))
        if (endDate) {
            end.setTime(endDate.getTime())
        }
        if (endHour) end.setHours(Number(endHour))
        if (endMinute) end.setMinutes(Number(endMinute))
        if (endSecond) end.setSeconds(Number(endSecond))
        setSelectedTime([start, end])
    }, [startDate, endDate, startHour, startMinute, startSecond, endHour, endMinute, endSecond])

    useEffect(() => {
        if (startDate) {
            setStartHour('0')
            setStartMinute('0')
            setStartSecond('0')
        }
    }, [startDate])

    useEffect(() => {
        if (endDate) {
            setEndHour(endDate.getHours().toString())
            setEndMinute(endDate.getMinutes().toString())
            setEndSecond(endDate.getSeconds().toString())
        }
    }, [endDate])

    return <>
        <RankContainer>
            <label>
                후보 수 : <RankInput value={rank} onlyNumber maxNumber={100} onChange={val => {
                    setRank(Number(val))
                }} maxLength={3} />
            </label>
        </RankContainer>
        <Container>
            <SubContainer style={{
                flex: 1
            }}>
                <ToggleBtn onClick={() => {
                    setIsTreeView(!isTreeView)
                }}>
                    {isTreeView ? '지도로 보기' : '트리로 보기'}
                </ToggleBtn>
                <CCTVSelectInnerContainer isView={isTreeView}>
                    <TreeContainer>
                        <CCTVTree selectedCCTVs={selectedCCTVs} selectedChange={targets => {
                            setSelectedCCTVs(targets)
                        }} />
                    </TreeContainer>
                </CCTVSelectInnerContainer>
                <CCTVSelectInnerContainer isView={!isTreeView}>
                    <MapComponent selectedCCTVs={selectedCCTVs} selectedChange={targets => {
                        setSelectedCCTVs(targets)
                    }} />
                </CCTVSelectInnerContainer>
            </SubContainer>
            <SubContainer style={{
                flex: '0 0 38%',
                padding: '36px 0'
            }}>
                <Wrapper>
                    <TimeContainer>
                        <Title>
                            시작 시간
                        </Title>
                        <InputWrapper>
                            <Calendar value={startDate} onChange={sDate => {
                                setStartDate(sDate)
                            }} otherDate={endDate} />
                            <TextInputWrapper>
                                <TextInputContainer>
                                    <SingleTimeInput disabled value={startDate ? startDate.getFullYear().toString() : '--'} />년
                                    <SingleTimeInput disabled value={startDate ? (startDate.getMonth() + 1).toString() : '--'} />월
                                    <SingleTimeInput disabled value={startDate ? startDate.getDate().toString() : '--'} />일
                                </TextInputContainer>
                                <TextInputContainer>
                                    <TimeInput value={startHour} onChange={(val) => {
                                        setStartHour(val)
                                        // if(val.length === 2) startMinuteRef.current?.focus()
                                    }} maxLength={2} label="시" isHour />
                                    <TimeInput inputRef={startMinuteRef} value={startMinute} onChange={(val) => {
                                        setStartMinute(val)
                                        // if(val.length === 2) startSecondRef.current?.focus()
                                    }} maxLength={2} label="분" isHour={false} />
                                    <TimeInput inputRef={startSecondRef} value={startSecond} onChange={(val) => {
                                        setStartSecond(val)
                                    }} maxLength={2} label="초" isHour={false} />
                                </TextInputContainer>
                            </TextInputWrapper>
                        </InputWrapper>
                    </TimeContainer>
                    <TimeContainer>
                        <Title>
                            종료 시간
                        </Title>
                        <InputWrapper>
                            <Calendar value={endDate} onChange={eDate => {
                                setEndDate(eDate)
                            }} otherDate={startDate} />
                            <TextInputWrapper>
                                <TextInputContainer>
                                    <SingleTimeInput disabled value={endDate ? endDate.getFullYear().toString() : '--'} />년
                                    <SingleTimeInput disabled value={endDate ? (endDate.getMonth() + 1).toString() : '--'} />월
                                    <SingleTimeInput disabled value={endDate ? endDate.getDate().toString() : '--'} />일
                                </TextInputContainer>
                                <TextInputContainer>
                                    <TimeInput value={endHour} onChange={(val) => {
                                        setEndHour(val)
                                        // if(val.length === 2) endMinuteRef.current?.focus()
                                    }} maxLength={2} label="시" isHour />
                                    <TimeInput inputRef={endMinuteRef} value={endMinute} onChange={(val) => {
                                        setEndMinute(val)
                                        // if(val.length === 2) endSecondRef.current?.focus()
                                    }} maxLength={2} label="분" isHour={false} />
                                    <TimeInput inputRef={endSecondRef} value={endSecond} onChange={(val) => {
                                        setEndSecond(val)
                                    }} maxLength={2} label="초" isHour={false} />
                                </TextInputContainer>
                            </TextInputWrapper>
                        </InputWrapper>
                    </TimeContainer>
                </Wrapper>
            </SubContainer>
        </Container>
    </>
}

export default PersonDescriptionBoundarySelect

const rankHeight = 36

const RankContainer = styled.div`
    height: ${rankHeight}px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end' })}
    padding: 6px 0;
    & > label {
        font-size: 1.2rem;
    }
`

const RankInput = styled(Input)`
    height: 100%;
`

const Container = styled.div`
    width: 100%;
    height: calc(100% - ${rankHeight}px);
    ${globalStyles.flex({ flexDirection: 'row', gap: '2%', justifyContent: 'space-between' })}
`

const SubContainer = styled.div`
    height: 100%;
    position: relative;
    ${globalStyles.flex({ justifyContent: 'flex-start' })}
`

const ToggleBtn = styled(Button)`
    width: 104px;
    height: 48px;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 2;
`

const CCTVSelectInnerContainer = styled.div<{ isView: boolean }>`
    width: 100%;
    height: 100%;
    position: absolute;
    ${({ isView }) => `
        opacity: ${isView ? 1 : 0};
        z-index: ${isView ? 1 : 0};
    `}
`

const TreeContainer = styled.div`
    height: 100%;
    padding: 68px 16px 16px 16px;
    overflow: hidden;
`

const Wrapper = styled.div`

`

const TimeContainer = styled.div`
    width: 100%;
    height: 400px;
`

const Title = styled.div`
    font-size: 1.8rem;
    color: white;
    text-align: center;
    margin-bottom: 12px;
`

const InputWrapper = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '24px', alignItems: 'flex-start' })}
`

const TextInputWrapper = styled.div`
    padding-top: 48px;
    ${globalStyles.flex({ gap: '12px' })}
`

const TextInputContainer = styled.div`
    color: white;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const SingleTimeInput = styled(Input)`
    width: 80px;
    height: 40px;
    border-radius: 10px;
    border: none;
    outline: none;
    color: white;
    text-align: center;
    font-size: 1.4rem;
`