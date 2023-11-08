import styled from "styled-components"
import { TextActivateColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import { useCallback, useMemo, useState } from "react"
import backIcon from '../../../../assets/img/backIcon.png'
import { distanceDaysTwoDate } from "../../../../Functions/GlobalFunctions"
import { useRecoilValue } from "recoil"
import { globalSingleSetting } from "../../../../Model/GlobalSettingsModel"

const weeks = ["일", "월", "화", "수", "목", "금", "토"]

type CalendarProps = {
    value?: Date|null
    onChange?: (date: Date) => void
    otherDate?: Date|null
}

const Calendar = ({ onChange, otherDate, value }: CalendarProps) => {
    const currentDate = new Date()
    const [date, setDate] = useState(new Date())
    const _maxStoredDay = useRecoilValue(globalSingleSetting('maxStoredDay'))
    const maxStoredDay = _maxStoredDay as number
    const firstDay = useMemo(() => new Date(date.getFullYear(), date.getMonth(), 1).getDay(), [date])
    const lastDay = useMemo(() => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), [date])
    
    const isIncludeDate = (_date: Date) => {
        if(otherDate && value) {
            return (value >= _date && otherDate <= _date) || (value <= _date && otherDate >= _date)
        } else return false
    }

    const daySelectFunc = (_date: Date) => {
        if(onChange) onChange(_date)
        setDate(_date)
    }
    
    const getYearAndMonth = useCallback((date: Date) => {
        const month = date.getMonth() + 1
        return date.getFullYear() + '.' + (month < 10 ? ('0' + month) : month).toString()
    }, [date])

    const days = useMemo(() => Array.from({ length: 42 }, (_, ind) => {
        let temp = new Date(date);
        temp.setDate(ind - firstDay + 1)
        return temp
    }).map((_, ind) => <DaysTextContainer
        key={ind}
        disabled={!(distanceDaysTwoDate(currentDate, _) <= maxStoredDay && _.getTime() <= currentDate.getTime())}
        onClick={() => {
            if((distanceDaysTwoDate(currentDate, _) <= maxStoredDay && _.getTime() <= currentDate.getTime())) daySelectFunc(_)
        }}
        enable={distanceDaysTwoDate(currentDate, _) <= maxStoredDay && _.getTime() <= currentDate.getTime()}
        selected={value !== undefined && value !== null && value.getMonth() === _.getMonth() && value.getDate() === _.getDate()}>
        <DaysText
            isInclude={isIncludeDate(_)}
            selected={value !== undefined && value !== null && value.getMonth() === _.getMonth() && value.getDate() === _.getDate()}
        >
            {_.getDate()}
        </DaysText>
    </DaysTextContainer>
    ), [date, value, otherDate])

    const subtractOneMonth = (date: Date) => {
        // 주어진 날짜의 연도, 월, 일 가져오기
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        // 1달 전의 날짜를 생성
        const newDate = new Date(year, month - 1, day);

        return newDate;
    }

    const addOneMonth = (date: Date) => {
        // 주어진 날짜의 연도, 월, 일 가져오기
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        // 1달 전의 날짜를 생성
        const newDate = new Date(year, month + 1, day);

        return newDate;
    }
    
    const hasNotNextMonth = () => {
        return currentDate.getMonth() <= date.getMonth() && currentDate.getFullYear() <= date.getFullYear()
    }
    const hasNotPrevMonth = () => {
        const clone = new Date(currentDate)
        clone.setDate(currentDate.getDate() - maxStoredDay)
        return clone.getMonth() === date.getMonth() && clone.getFullYear() === date.getFullYear()
    }
    
    return <Container>
        <Header>
            <MonthMoveBtn tabIndex={-1} disabled={hasNotPrevMonth()} icon={backIcon} onClick={() => {
                setDate(subtractOneMonth(date))
            }}/>
            <YearMonthText>
                {getYearAndMonth(date)}
            </YearMonthText>
            <MonthMoveBtn tabIndex={-1} disabled={hasNotNextMonth()} icon={backIcon} iconStyle={{
                rotate: '180deg'
            }} onClick={() => {
                setDate(addOneMonth(date))
            }}/>
        </Header>
        <DateContainer>
            <WeekContainer>
                {weeks.map(_ => <WeekText key={_}>{_}</WeekText>)}
            </WeekContainer>
            <DaysContainer>
                {days}
            </DaysContainer>
        </DateContainer>
    </Container>
}

export default Calendar

const Container = styled.div`
    width: 400px;
    height: 300px;
`

const Header = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: 40px;
`

const MonthMoveBtn = styled(Button)`
    background-color: transparent;
    border: none;
    height: 28px;
    &:disabled {
        visibility: hidden;
    }
`

const YearMonthText = styled.div`
    color: white;
    font-size: 1.5rem;
`

const DateContainer = styled.div`
`

const WeekContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const WeekText = styled.div`
    flex: 1;
    color: white;
    height: 32px;
    ${globalStyles.flex()}
`

const DaysContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' })}
`

const DaysTextContainer = styled.div<{ selected: boolean, enable: boolean, disabled: boolean }>`
    flex: 0 1 calc(100%/ 7);
    ${globalStyles.flex()}
    height: 32px;
    ${({ enable, selected, disabled }) => ({
        color: (enable || selected) ? 'white' : 'gray',
        cursor: disabled ? 'default' : 'pointer'
    })}
`

const DaysText = styled.div<{selected: boolean, isInclude: boolean}>`
    width: 80%;
    height: 80%;
    ${({ selected }) => selected && {
        backgroundColor: TextActivateColor,
    }}
    ${({ isInclude }) => isInclude && {
    }}
    backgroundColor: 'rgba(0,0,0,.5)';
    ${globalStyles.flex()}
`