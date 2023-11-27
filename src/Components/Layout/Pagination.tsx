import styled from "styled-components"
import { ButtonBackgroundColor, ContentsActivateColor, TextActivateColor, globalStyles } from "../../styles/global-styled"
import Input from "../Constants/Input"
import Form from "../Constants/Form"
import { LeftArrow, LeftDoubleArrow, RightArrow, RightDoubleArrow } from "./Arrows"
import { useMemo, useRef } from "react"

type PaginationProps = {
    currentPage: number
    setCurrentPage: (page: number) => void
    totalCount: number
    dataPerPage: number
}

const Pagination = ({ currentPage, setCurrentPage, totalCount, dataPerPage }: PaginationProps) => {
    const paginationInputRef = useRef<HTMLInputElement>()
    const pageNums = useMemo(() => {
        const _ = Array.from({ length: 5 }).map((_, ind) => currentPage + (ind - 2)).filter(_ => _ > 0 && (Math.ceil((totalCount / dataPerPage)) >= _))
        return _.length === 0 ? [1] : _
    }, [totalCount, currentPage])
    
    return <PaginationContainer>
        <PaginationNumbersContainer>
            <LeftDoubleArrow disabled={currentPage <= 1} onClick={() => {
                setCurrentPage(1)
                paginationInputRef.current!.value = '1'
            }} />
            <LeftArrow onClick={() => {
                if (currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                    paginationInputRef.current!.value = (currentPage - 1).toString()
                }
            }} disabled={currentPage <= 1} />
            <PaginationNumbersInnerContainer>
                {
                    pageNums.map((_, ind) => <PaginationNumbersItem key={ind} selected={currentPage === _} onClick={() => {
                        setCurrentPage(_)
                        paginationInputRef.current!.value = _.toString()
                    }}>
                        {_}
                    </PaginationNumbersItem>)
                }
            </PaginationNumbersInnerContainer>
            <RightArrow onClick={() => {
                if (currentPage <= (totalCount / dataPerPage)) setCurrentPage(currentPage + 1)
                paginationInputRef.current!.value = (currentPage + 1).toString()
            }} disabled={currentPage >= (totalCount / dataPerPage)} />
            <RightDoubleArrow onClick={() => {
                if ((currentPage) <= (totalCount / dataPerPage)) setCurrentPage(Math.ceil(totalCount / dataPerPage))
                paginationInputRef.current!.value = (Math.ceil(totalCount / dataPerPage)).toString()
            }} disabled={currentPage >= (totalCount / dataPerPage)} />
        </PaginationNumbersContainer>
        <PaginationInputContainer>
            <Form style={{
                height: '100%'
            }} onSubmit={(e) => {
                const result = Number(paginationInputRef.current!.value)
                const lastPage = Math.ceil(totalCount / dataPerPage)
                const _ = result <= 1 ? 1 : (result > lastPage ? lastPage : result)
                setCurrentPage(_)
                if (paginationInputRef.current) paginationInputRef.current.value = (_).toString()
            }}>
                <PaginationInput maxLength={3} onlyNumber defaultValue={currentPage} inputRef={paginationInputRef} />
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