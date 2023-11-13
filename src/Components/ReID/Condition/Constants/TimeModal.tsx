import styled from "styled-components"
import DataSelectModal from "./DataSelectModal"
import Calendar from "./Calendar"
import { globalStyles } from "../../../../styles/global-styled"
import Input from "../../../Constants/Input"
import { useCallback, useEffect, useRef, useState } from "react"
import { AddZeroFunc, convertFullDatestring } from '../../../../Functions/GlobalFunctions'
import useMessage from "../../../../Hooks/useMessage"
import TimeSelect from "./TimeSelect"

export type TimeModalDataType = {
    startTime: string
    endTime?: string
}

type TimeModalProps = {
    defaultValue: TimeModalDataType|undefined
    onChange?: (data: TimeModalDataType) => void
    title: string
    visible: boolean
    close: () => void
    noEndTime?: boolean
}

type TimeInputProps = {
    value: string
    label: string
    onChange: (val: string) => void
    maxLength: number
    inputRef?: React.RefObject<any>
    isHour: boolean
}

export const TimeInput = ({value, label, onChange, maxLength, inputRef, isHour}: TimeInputProps) => {
    const [focus, setFocus] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const mouseDownCallback = useCallback((e: MouseEvent) => {
        if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setFocus(false)
        }
    },[])

    useEffect(() => {
        if(focus) {
            document.addEventListener('mousedown', mouseDownCallback)
        } else {
            document.removeEventListener('mousedown', mouseDownCallback)
        }
    },[focus])

    return <TimeInputContainer ref={containerRef}>
        <SingleTimeInput value={value} onlyNumber onChange={onChange} maxLength={maxLength} inputRef={inputRef} onFocus={() => {
            setFocus(true)
        }}/>{label}
        <TimeSelect visible={focus} isHour={isHour} defaultValue={Number(value)} onChange={(val) => {
            setFocus(false)
            onChange(val)
        }}/>
    </TimeInputContainer>
}

const TimeModal = ({ defaultValue, onChange, title, visible, noEndTime, close }: TimeModalProps) => {
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
    const message = useMessage()
    
    const startTimeInit = (d: Date) => {
        setStartHour(AddZeroFunc(d.getHours()).toString())
        setStartMinute(AddZeroFunc(d.getMinutes()).toString())
        setStartSecond(AddZeroFunc(d.getSeconds()).toString())
    }

    const endTimeInit = (d: Date) => {
        setEndHour(AddZeroFunc(d.getHours()).toString())
        setEndMinute(AddZeroFunc(d.getMinutes()).toString())
        setEndSecond(AddZeroFunc(d.getSeconds()).toString())
    }
    
    useEffect(() => {
        if (visible) {
            if(!defaultValue) {
                const temp = new Date()
                setStartDate(temp)
                setEndDate(temp)
                startTimeInit(temp)
                endTimeInit(temp)
            } else if(!defaultValue.endTime) {
                const temp = new Date()
                setEndDate(temp)
                endTimeInit(temp)
            }
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
            if(!noEndTime && defaultValue.endTime) {
                const _tempEndDate = defaultValue.endTime.slice(0,8)
                const _tempEndTime = defaultValue.endTime.slice(8,)
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

    return <DataSelectModal half={noEndTime} visible={visible} title={title} close={close} complete={() => {
        if(!startDate) return message.preset('WRONG_PARAMETER', '시작 시간을 설정해주세요.')
        if(noEndTime) {
            if(!startDate) return;
            if(onChange) {
                onChange({
                    startTime: convertFullDatestring(startDate) + AddZeroFunc(startHour) + AddZeroFunc(startMinute) + AddZeroFunc(startSecond)
                })
            }
        } else {
            if(!endDate) return message.preset('WRONG_PARAMETER', '종료 시간을 설정해주세요.')
            if(startDate.getTime() === endDate.getTime() && startHour === endHour && startMinute === endMinute && startSecond === endSecond) return message.preset('WRONG_PARAMETER', '시작 시간과 종료 시간이 동일합니다.')
            let isOver = false;
            if(startDate > endDate) {
                isOver = true
            } else if (startDate === endDate) {
                const startTemp = new Date()
                const endTemp = new Date()
                startTemp.setHours(Number(startHour))
                startTemp.setMinutes(Number(startMinute))
                startTemp.setSeconds(Number(startSecond))
                endTemp.setHours(Number(endHour))
                endTemp.setMinutes(Number(endMinute))
                endTemp.setSeconds(Number(endSecond))
                if(startTemp > endTemp) isOver = true
            }
            if(isOver) return message.preset('WRONG_PARAMETER', '시작 시간은 종료 시간보다 앞서야 합니다.')
            if(onChange) {
                onChange({
                    startTime: convertFullDatestring(startDate) + AddZeroFunc(startHour) + AddZeroFunc(startMinute) + AddZeroFunc(startSecond),
                    endTime: convertFullDatestring(endDate) + AddZeroFunc(endHour) + AddZeroFunc(endMinute) + AddZeroFunc(endSecond)
                })
            }
        }
        close()
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
                        <TextInputContainer>
                            <SingleTimeInput disabled onlyNumber value={startDate ? startDate.getFullYear().toString() : '--'} />년
                            <SingleTimeInput disabled onlyNumber value={startDate ? (startDate.getMonth() + 1).toString() : '--'} />월
                            <SingleTimeInput disabled onlyNumber value={startDate ? startDate.getDate().toString() : '--'} />일
                        </TextInputContainer>
                        <TextInputContainer>
                            <TimeInput value={startHour} onChange={(val) => {
                                setStartHour(val)
                                // if(val.length === 2) startMinuteRef.current?.focus()
                            }} maxLength={2} label="시" isHour/>
                            <TimeInput inputRef={startMinuteRef} value={startMinute} onChange={(val) => {
                                setStartMinute(val)
                                // if(val.length === 2) startSecondRef.current?.focus()
                            }} maxLength={2} label="분" isHour={false}/>
                            <TimeInput inputRef={startSecondRef} value={startSecond} onChange={(val) => {
                                setStartSecond(val)
                            }} maxLength={2} label="초" isHour={false}/>
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
                            <SingleTimeInput disabled onlyNumber value={endDate ? endDate.getFullYear().toString() : '--'} />년
                            <SingleTimeInput disabled onlyNumber value={endDate ? (endDate.getMonth() + 1).toString() : '--'} />월
                            <SingleTimeInput disabled onlyNumber value={endDate ? endDate.getDate().toString() : '--'} />일
                        </TextInputContainer>
                        <TextInputContainer>
                            <TimeInput value={endHour} onChange={(val) => {
                                setEndHour(val)
                                // if(val.length === 2) endMinuteRef.current?.focus()
                            }} maxLength={2} label="시" isHour/>
                            <TimeInput inputRef={endMinuteRef} value={endMinute} onChange={(val) => {
                                setEndMinute(val)
                                // if(val.length === 2) endSecondRef.current?.focus()
                            }} maxLength={2} label="분" isHour={false}/>
                            <TimeInput inputRef={endSecondRef} value={endSecond} onChange={(val) => {
                                setEndSecond(val)
                            }} maxLength={2} label="초" isHour={false}/>
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
    margin-bottom: 48px;
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
    padding-top: 44px;
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

const TimeInputContainer = styled.div`
    flex: 1;
    ${globalStyles.flex({flexDirection:'row', gap: '12px'})}
    position: relative;
`