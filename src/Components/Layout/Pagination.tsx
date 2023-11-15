import styled from "styled-components"
import { ButtonBackgroundColor, ContentsActivateColor, TextActivateColor, globalStyles } from "../../styles/global-styled"
import Input from "../Constants/Input"
import Form from "../Constants/Form"
import { LeftArrow, LeftDoubleArrow, RightArrow, RightDoubleArrow } from "./Arrows"
import { BasicLogDataType, setStateType } from "../../Constants/GlobalTypes"
import { useMemo, useRef } from "react"

type PaginationProps = {
    currentPage: number
    setCurrentPage: setStateType<number>
    datas: BasicLogDataType<unknown>
}

const Pagination = ({ currentPage, setCurrentPage, datas }: PaginationProps) => {
    const paginationInputRef = useRef<HTMLInputElement>()
    const pageNums = useMemo(() => {
        const _ = Array.from({ length: 5 }).map((_, ind) => currentPage + 1 + (ind - 2)).filter(_ => _ > 0 && (Math.ceil((datas.totalCount / 10)) >= _))
        return _.length === 0 ? [1] : _
    }, [datas.totalCount, currentPage])

    return <PaginationContainer>
        <PaginationNumbersContainer>
            <LeftDoubleArrow disabled={currentPage <= 0} onClick={() => {
                setCurrentPage(0)
            }} />
            <LeftArrow onClick={() => {
                if (currentPage > 0) {
                    setCurrentPage(currentPage - 1)
                }
            }} disabled={currentPage <= 0} />
            <PaginationNumbersInnerContainer>
                {
                    pageNums.map((_, ind) => <PaginationNumbersItem key={ind} selected={currentPage + 1 === _} onClick={() => {
                        setCurrentPage(_ - 1)
                    }}>
                        {_}
                    </PaginationNumbersItem>)
                }
            </PaginationNumbersInnerContainer>
            <RightArrow onClick={() => {
                if (currentPage < Math.floor(datas.totalCount / 10) - 1) setCurrentPage(currentPage + 1)
            }} disabled={!(currentPage < Math.floor(datas.totalCount / 10))} />
            <RightDoubleArrow onClick={() => {
                if (currentPage < Math.floor(datas.totalCount / 10)) setCurrentPage(Math.floor(datas.totalCount / 10))
            }} disabled={!(currentPage < Math.floor(datas.totalCount / 10))} />
        </PaginationNumbersContainer>
        <PaginationInputContainer>
            <Form style={{
                height: '100%'
            }} onSubmit={(e) => {
                const result = Number((e.currentTarget.elements[0] as HTMLInputElement).value)
                const lastPage = datas.totalCount / 10
                const _ = result <= 0 ? 0 : (result > lastPage ? (lastPage < 1 ? 0 : (Math.floor(lastPage))) : result - 1)
                setCurrentPage(_)
                if (paginationInputRef.current) paginationInputRef.current.value = (_ + 1).toString()
            }}>
                <PaginationInput maxLength={3} onlyNumber defaultValue={currentPage + 1} inputRef={paginationInputRef} />
                <PaginationInputCompleteBtn type="submit">
                    이동
                </PaginationInputCompleteBtn>
            </Form>
        </PaginationInputContainer>
    </PaginationContainer>
}

export default Pagination

const PaginationContainer = styled.div`
    height: 66px;
    width: 100%;
    ${globalStyles.flex({ gap: '8px' })}
`

const PaginationNumbersContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '2px' })}
    height: 30px;
`

const PaginationNumbersInnerContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: 100%;
`

const PaginationNumbersItem = styled.div<{ selected: boolean }>`
    cursor: pointer;
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border-radius: 100%;
    color: white;
    ${globalStyles.flex()}
    background-color: ${({ selected }) => selected ? ContentsActivateColor : ButtonBackgroundColor};
    &:hover {
        background-color: ${ContentsActivateColor};
    }
`

const PaginationInputContainer = styled.div`
    height: 28px;
    width: 100%;
    & > form {
        ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
    }
`

const PaginationInput = styled(Input)`
    width: 64px;
    height: 100%;
    text-align: center;
`

const PaginationInputCompleteBtn = styled.button`
    color: ${TextActivateColor};
    background-color: transparent;
    border: none;
    width: 30px;
    padding: 0;
    font-weight: bold;
`