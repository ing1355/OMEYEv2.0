import styled from "styled-components"
import DataSelectModal from "./DataSelectModal"
import Calendar from "./Calendar"
import { globalStyles } from "../../../../styles/global-styled"
import Input from "../../../Constants/Input"
import { useEffect, useRef, useState } from "react"
import { AddZeroFunc, convertFullDatestring } from '../../../../Functions/GlobalFunctions'

export type TimeModalDataType = {
    startTime: string
    endTime?: string
}

type TimeModalProps = {
    defaultValue: TimeModalDataType|undefined
    onChange?: (data: TimeModalDataType) => void
    title: string
    visible: boolean
    setVisible: (visible: boolean) => void
    noEndTime?: boolean
}

const TimeModal = ({ defaultValue, onChange, title, visible, setVisible, noEndTime }: TimeModalProps) => {
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [startHour, setStartHour] = useState('00')
    const [startMinute, setStartMinute] = useState('00')
    const [startSecond, setStartSecond] = useState('00')
    const [endHour, setEndHour] = useState('00')
    const [endMinute, setEndMinute] = useState('00')
    const [endSecond, setEndSecond] = useState('00')
    const startMinuteRef = useRef<HTMLInputElement>(null)
    const startSecondRef = useRef<HTMLInputElement>(null)
    const endMinuteRef = useRef<HTMLInputElement>(null)
    const endSecondRef = useRef<HTMLInputElement>(null)
    
    const startTimeInit = () => {
        setStartHour('00')
        setStartMinute('00')
        setStartSecond('00')
    }

    const endTimeInit = () => {
        setEndHour('00')
        setEndMinute('00')
        setEndSecond('00')
    }
    
    useEffect(() => {
        if (!visible) {
            setStartDate(null)
            setEndDate(null)
            startTimeInit()
            endTimeInit()    
        }
    }, [visible])


    useEffect(() => {
        if (defaultValue) {
            const _tempStartDate = defaultValue.startTime.slice(0,8)
            const _tempStartTime = defaultValue.startTime.slice(8,)
            setStartDate(new Date(`${_tempStartDate.slice(0, 4)}-${_tempStartDate.slice(4, 6)}-${_tempStartDate.slice(6,)}`))
            setStartHour(_tempStartTime.slice(0, 2))
            setStartMinute(_tempStartTime.slice(2, 4))
            setStartSecond(_tempStartTime.slice(4,))
            if(!noEndTime) {
                const _tempEndDate = defaultValue.endTime!.slice(0,8)
                const _tempEndTime = defaultValue.endTime!.slice(8,)
                setEndDate(new Date(`${_tempEndDate.slice(0, 4)}-${_tempEndDate.slice(4, 6)}-${_tempEndDate.slice(6,)}`))
                setEndHour(_tempEndTime.slice(0, 2))
                setEndMinute(_tempEndTime.slice(2, 4))
                setEndSecond(_tempEndTime.slice(4,))
            }
        } else {
            const today = new Date()
            setStartDate(today)
            if(!noEndTime) {
                setEndDate(today)
            }
        }
    }, [defaultValue])

    useEffect(() => {
        if (startDate && endDate) {
            if (startDate > endDate) setEndDate(null)
        }
    }, [startDate, endDate])

    return <DataSelectModal visible={visible} title={title} close={() => {
        setVisible(false)
    }} complete={() => {
        if(noEndTime) {
            if(!startDate) return;
            if(onChange) {
                onChange({
                    startTime: convertFullDatestring(startDate) + AddZeroFunc(startHour) + AddZeroFunc(startMinute) + AddZeroFunc(startSecond)
                })
            }
        } else {
            if (!(startDate && endDate)) return;
            if(onChange) {
                onChange({
                    startTime: convertFullDatestring(startDate) + AddZeroFunc(startHour) + AddZeroFunc(startMinute) + AddZeroFunc(startSecond),
                    endTime: convertFullDatestring(endDate) + AddZeroFunc(endHour) + AddZeroFunc(endMinute) + AddZeroFunc(endSecond)
                })
            }
        }
        
        setVisible(false)
    }}>
        <Wrapper>
            <Container>
                <Title>
                    시작 시간
                </Title>
                <InputWrapper>
                    <Calendar value={startDate} onChange={sDate => {
                        setStartDate(sDate)
                    }} otherDate={endDate} />
                    <TextInputWrapper>
                        {/* <TextInputContainer>
                            <TimeSelect onChange={val => {
                                console.log(val)
                            }}/>
                            <TimeSelect/>
                            <TimeSelect/>
                        </TextInputContainer> */}
                        <TextInputContainer>
                            <TimeInput value={startDate ? startDate.getFullYear().toString() : ''} />년
                            <TimeInput value={startDate ? (startDate.getMonth() + 1).toString() : ''} />월
                            <TimeInput value={startDate ? startDate.getDate().toString() : ''} />일
                        </TextInputContainer>
                        <TextInputContainer>
                            <TimeInput value={startHour} onChange={(val) => {
                                setStartHour(val)
                                if(val.length === 2) startMinuteRef.current?.focus()
                            }} maxLength={2} />시
                            <TimeInput inputRef={startMinuteRef} value={startMinute} onChange={(val) => {
                                setStartMinute(val)
                                if(val.length === 2) startSecondRef.current?.focus()
                            }} maxLength={2} />분
                            <TimeInput inputRef={startSecondRef} value={startSecond} onChange={(val) => {
                                setStartSecond(val)
                            }} maxLength={2} />초
                        </TextInputContainer>
                    </TextInputWrapper>
                </InputWrapper>
            </Container>
            {!noEndTime && <Container>
                <Title>
                    종료 시간
                </Title>
                <InputWrapper>
                    <Calendar value={endDate} onChange={eDate => {
                        setEndDate(eDate)
                    }} otherDate={startDate} />
                    <TextInputWrapper>
                        <TextInputContainer>
                            <TimeInput value={endDate ? endDate.getFullYear().toString() : ''} />년
                            <TimeInput value={endDate ? (endDate.getMonth() + 1).toString() : ''} />월
                            <TimeInput value={endDate ? endDate.getDate().toString() : ''} />일
                        </TextInputContainer>
                        <TextInputContainer>
                            <TimeInput value={endHour} onChange={(val) => {
                                setEndHour(val)
                                if(val.length === 2) endMinuteRef.current?.focus()
                            }} maxLength={2} />시
                            <TimeInput inputRef={endMinuteRef} value={endMinute} onChange={(val) => {
                                setEndMinute(val)
                                if(val.length === 2) endSecondRef.current?.focus()
                            }} maxLength={2} />분
                            <TimeInput inputRef={endSecondRef} value={endSecond} onChange={(val) => {
                                setEndSecond(val)
                            }} maxLength={2} />초
                        </TextInputContainer>
                    </TextInputWrapper>
                </InputWrapper>
            </Container>}
        </Wrapper>
    </DataSelectModal >
}

export default TimeModal

const Wrapper = styled.div`

`

const Container = styled.div`
    width: 100%;
    height: 340px;
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
    ${globalStyles.flex({ gap: '12px' })}
`

const TextInputContainer = styled.div`
    color: white;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const TimeInput = styled(Input)`
    width: 80px;
    height: 40px;
    border-radius: 10px;
    border: none;
    outline: none;
    color: white;
    text-align: center;
    font-size: 1.4rem;
`