import styled from "styled-components"
import { ReIDLogDataType, ReIDSearchParamsType, SearchReIDLogDatas, useReIDLogDatas } from "../../../Model/ReIDLogModel"
import { ButtonBackgroundColor, ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, SectionBackgroundColor, TextActivateColor, globalStyles } from "../../../styles/global-styled"
import Input from "../../Constants/Input"
import Dropdown, { DropdownProps } from "../../Layout/Dropdown"
import { ReIDMenuKeys, ReIDObjectTypeKeys, ReIDObjectTypes } from "../ConstantsValues"
import Button from "../../Constants/Button"
import { useEffect, useMemo, useRef, useState } from "react"
import { convertFullTimeStringToHumanTimeFormat, getTimeDifference } from "../../../Functions/GlobalFunctions"
import ImageView from "../Condition/Constants/ImageView"
import { useRecoilRefresher_UNSTABLE, useRecoilState } from "recoil"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import TimeModal, { TimeModalDataType } from "../Condition/Constants/TimeModal"
import Form from "../../Constants/Form"
import CollapseArrow from "../../Constants/CollapseArrow"
import searchIcon from '../../../assets/img/searchIcon.png'
import arrowIcon from '../../../assets/img/downArrowIcon.png'

const bottomColStyle = {
    alignItems: 'flex-start'
}

const bottomColTitleStyle = {
    paddingTop: '8px'
}

type ArrowProps = {
    onClick: () => void
}

const LeftArrow = ({ onClick }: ArrowProps) => {
    return <PaginationArrowContainer style={{
        transform: 'rotate(90deg)'
    }} onClick={onClick}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
    </PaginationArrowContainer>
}

const RightArrow = ({ onClick }: ArrowProps) => {
    return <PaginationArrowContainer style={{
        transform: 'rotate(-90deg)'
    }} onClick={onClick}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
    </PaginationArrowContainer>
}

const LeftDoubleArrow = ({ onClick }: ArrowProps) => {
    return <PaginationArrowContainer style={{
        transform: 'rotate(90deg)'
    }} onClick={onClick}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -70%)'
        }} />
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
    </PaginationArrowContainer>
}

const RightDoubleArrow = ({ onClick }: ArrowProps) => {
    return <PaginationArrowContainer style={{
        transform: 'rotate(-90deg)'
    }} onClick={onClick}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -30%)'
        }} />
    </PaginationArrowContainer>
}

type ObjectTypeSearchValues = ReIDObjectTypeKeys | 'all'

const ReIDLogs = () => {
    // const setReIDResultData = useSetRecoilState(ReIDResultData)
    const [menu, setMenu] = useRecoilState(conditionMenu)
    const [currentPage, setCurrentPage] = useState(0)
    const [opened, setOpened] = useState<ReIDLogDataType['reidId'][]>([])
    const [timeVisible, setTimeVisible] = useState(false)
    const [timeValue, setTimeValue] = useState<TimeModalDataType | undefined>(undefined)
    const [searchValue, setSearchValue] = useState<ObjectTypeSearchValues>('all')
    const params = useRef<ReIDSearchParamsType>({
        page: currentPage + 1
    })
    
    const paginationInputRef = useRef<HTMLInputElement>()
    const titleInputRef = useRef<HTMLInputElement>()

    const logs = useReIDLogDatas(params.current)
    const refresh = useRecoilRefresher_UNSTABLE(SearchReIDLogDatas(params.current))
    const pageNums = useMemo(() => {
        const _ = Array.from({ length: 5 }).map((_, ind) => currentPage + 1 + (ind - 2)).filter(_ => _ > 0 && ((logs!.totalCount / 10) > _))
        return _.length === 0 ? [1] : _
    }, [logs?.totalCount, currentPage])

    useEffect(() => {
        refresh()
        params.current = { ...params.current, page: currentPage + 1 }
        if (paginationInputRef.current) paginationInputRef.current.value = (currentPage + 1).toString()
    }, [currentPage])

    useEffect(() => {
        if (menu === ReIDMenuKeys['REIDLOGS']) refresh()
    }, [menu])

    useEffect(() => {
        setOpened([])
    }, [logs])

    return <Container>
        <TimeModal visible={timeVisible} setVisible={setTimeVisible} defaultValue={timeValue} onChange={setTimeValue} title="검색 시간" />
        <Form onSubmit={() => {
            let _: ReIDSearchParamsType = {
                page: 1
            }
            if (titleInputRef.current && titleInputRef.current.value) _.desc = titleInputRef.current.value
            if (searchValue !== 'all') _.type = searchValue
            if (timeValue) {
                _.from = convertFullTimeStringToHumanTimeFormat(timeValue.startTime)
                _.to = convertFullTimeStringToHumanTimeFormat(timeValue.endTime!)
            }
            params.current = _
            refresh()
        }}>
            <SearchContainer>
                <DropdownContainer>
                    <ObjectSearchDropdown itemList={[{
                        key: 'all',
                        value: 'all',
                        label: '전체'
                    }, ...ReIDObjectTypeKeys.map(_ => ({
                        key: _,
                        value: _,
                        label: ReIDObjectTypes.find(__ => __.key === _)!.title
                    }))]} onChange={val => {
                        setSearchValue(val.value as ObjectTypeSearchValues)
                    }} />
                </DropdownContainer>
                <TitleSearch placeholder="검색명" inputRef={titleInputRef} />
                <DateSearch onClick={() => {
                    setTimeVisible(true)
                }}>
                    {timeValue ? `${convertFullTimeStringToHumanTimeFormat(timeValue.startTime)} ~ ${convertFullTimeStringToHumanTimeFormat(timeValue.endTime!)}` : '시간을 입력해주세요.'}
                </DateSearch>
                <SearchButton icon={searchIcon} type="submit">
                    검색
                </SearchButton>
            </SearchContainer>
        </Form>
        <Wrapper>
            {
                logs ? <ContentsContainer>
                    {
                        logs.result.map(_ => <ContentsItemContainer opened={opened.includes(_.reidId)} key={_.reidId}>
                            <ContentsItemTitleContainer>
                                <ContentsItemTitle>{_.description} ({convertFullTimeStringToHumanTimeFormat(_.createdTime)})</ContentsItemTitle>
                                <ContentsItemTitleBtnsContainer>
                                    <ContentsItemTitleBtn onClick={async (e) => {
                                        e.preventDefault()
                                    }}>
                                        데이터 다운로드
                                    </ContentsItemTitleBtn>
                                    <ContentsItemTitleBtn onClick={async () => {
                                        // setReIDResultData(await Axios("GET", GetReidDataApi(_.reidId)))
                                        setMenu(ReIDMenuKeys['REIDRESULT'])
                                    }}>
                                        결과 바로보기
                                    </ContentsItemTitleBtn>
                                    <Arrow opened={opened.includes(_.reidId)} onClick={() => {
                                        if (opened.includes(_.reidId)) setOpened(opened.filter(__ => __ !== _.reidId))
                                        else setOpened(opened.concat(_.reidId))
                                    }} />
                                </ContentsItemTitleBtnsContainer>
                            </ContentsItemTitleContainer>
                            <ContentsItemInnerContainer>
                                <ContentsItemInnerRowContainer>
                                    <ContentsItemInnerColContainer>
                                        <ContentsItemInnerColTitle>
                                            대상 :
                                        </ContentsItemInnerColTitle>
                                        <ContentsItemInnerColContents style={{
                                            backgroundColor: GlobalBackgroundColor
                                        }}>
                                            <ContentsItemInnerTargetImageBoxContainer>
                                                {
                                                    _.object.map((__, ind) => <div key={ind} style={{
                                                        height: '100%'
                                                    }}>
                                                        <ContentsItemInnerHeadItemImageBox src={__.imgUrl} />
                                                    </div>)
                                                }
                                            </ContentsItemInnerTargetImageBoxContainer>
                                        </ContentsItemInnerColContents>
                                    </ContentsItemInnerColContainer>
                                    <ContentsItemInnerColContainer>
                                        <ContentsItemInnerColTitle>
                                            후보 수 :
                                        </ContentsItemInnerColTitle>
                                        <ContentsItemInnerColContents style={{
                                            justifyContent: 'center'
                                        }}>
                                            <ContentsItemInnerColContentWrapper>
                                                5
                                            </ContentsItemInnerColContentWrapper>
                                        </ContentsItemInnerColContents>
                                    </ContentsItemInnerColContainer>
                                    <ContentsItemInnerColContainer>
                                        <ContentsItemInnerColTitle>
                                            소요 시간 :
                                        </ContentsItemInnerColTitle>
                                        <ContentsItemInnerColContents style={{
                                            justifyContent: 'center'
                                        }}>
                                            <ContentsItemInnerColContentWrapper>
                                                {getTimeDifference(_.createdTime, _.closedTime)}
                                            </ContentsItemInnerColContentWrapper>
                                        </ContentsItemInnerColContents>
                                    </ContentsItemInnerColContainer>
                                </ContentsItemInnerRowContainer>
                                <ContentsItemInnerRowContainer>
                                    <ContentsItemInnerColContainer style={bottomColStyle}>
                                        <ContentsItemInnerColTitle style={bottomColTitleStyle}>
                                            시간 그룹 :
                                        </ContentsItemInnerColTitle>
                                        <ContentsItemInnerColContents>
                                            <ContentsItemInnerColContentWrapper>
                                                YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss
                                            </ContentsItemInnerColContentWrapper>
                                            <ContentsItemInnerColContentWrapper>
                                                YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss
                                            </ContentsItemInnerColContentWrapper>
                                            <ContentsItemInnerColContentWrapper>
                                                YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss
                                            </ContentsItemInnerColContentWrapper>
                                            <ContentsItemInnerColContentWrapper>
                                                YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss
                                            </ContentsItemInnerColContentWrapper>
                                            <ContentsItemInnerColContentWrapper>
                                                YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss
                                            </ContentsItemInnerColContentWrapper>
                                            <ContentsItemInnerColContentWrapper>
                                                YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss
                                            </ContentsItemInnerColContentWrapper>
                                        </ContentsItemInnerColContents>
                                    </ContentsItemInnerColContainer>
                                    <ContentsItemInnerColContainer style={bottomColStyle}>
                                        <ContentsItemInnerColTitle style={bottomColTitleStyle}>
                                            대상 그룹 :
                                        </ContentsItemInnerColTitle>
                                        <ContentsItemInnerColContents>
                                            <ContentsItemInnerColContentWrapper>
                                                CCTV 56 대
                                            </ContentsItemInnerColContentWrapper>
                                            <ContentsItemInnerColContentWrapper>
                                                CCTV 32 대
                                            </ContentsItemInnerColContentWrapper>
                                        </ContentsItemInnerColContents>
                                    </ContentsItemInnerColContainer>
                                    <ContentsItemInnerColContainer style={bottomColStyle}>
                                        <ContentsItemInnerColTitle style={bottomColTitleStyle}>
                                            비고 :
                                        </ContentsItemInnerColTitle>
                                        <ContentsItemInnerColContents style={{
                                            height: '100%'
                                        }}>
                                            <ContentsItemInnerColContentWrapper style={{
                                                height: '100%'
                                            }}>
                                                test
                                            </ContentsItemInnerColContentWrapper>
                                        </ContentsItemInnerColContents>
                                    </ContentsItemInnerColContainer>
                                </ContentsItemInnerRowContainer>
                            </ContentsItemInnerContainer>
                        </ContentsItemContainer>)
                    }
                </ContentsContainer> : <NoDataContentsContainer>
                    서버에 데이터가 존재하지 않습니다.
                </NoDataContentsContainer>
            }

            <PaginationContainer>
                <PaginationNumbersContainer>
                    <LeftDoubleArrow onClick={() => {
                        setCurrentPage(0)
                    }} />
                    <LeftArrow onClick={() => {
                        if (currentPage > 0) {
                            setCurrentPage(currentPage - 1)
                        }
                    }} />
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
                        if (currentPage < Math.floor(logs!.totalCount / 10) - 1) setCurrentPage(currentPage + 1)
                    }} />
                    <RightDoubleArrow onClick={() => {
                        if (currentPage < Math.floor(logs!.totalCount / 10)) setCurrentPage(Math.floor(logs!.totalCount / 10) - 1)
                    }} />
                </PaginationNumbersContainer>
                <PaginationInputContainer>
                    <Form style={{
                        height: '100%'
                    }} onSubmit={(e) => {
                        const result = Number((e.currentTarget.elements[0] as HTMLInputElement).value)
                        const lastPage = logs!.totalCount / 10
                        const _ = result <= 0 ? 0 : (result > lastPage ? (lastPage < 1 ? 0 : (Math.floor(lastPage) - 1)) : result - 1)
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
        </Wrapper>
    </Container>
}

export default ReIDLogs

const Container = styled.div`
    height: 100%;
    ${globalStyles.flex({ justifyContent: 'flex-start', gap: '12px' })}
`

const SearchContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    width: 100%;
    height: 48px;
    padding: 6px;
`

const Wrapper = styled.div`
    padding: 24px 64px 0 64px;
    width: 100%;
    flex: 1;
    border-radius: 8px;
    background-color: ${SectionBackgroundColor};
    ${globalStyles.flex({ justifyContent: 'flex-start' })}
`

const TitleSearch = styled(Input)`
    text-align: center;
    height: 100%;
    border: none;
    outline: none;
    border-radius: 10px;
    color: white;
    &::placeholder {
        color:white;
    }
`

const DropdownContainer = styled.div`
    height: 100%;
`

const ObjectSearchDropdown = styled(Dropdown) <DropdownProps<ObjectTypeSearchValues>>`
    border-radius: 10px;
`

const DateSearch = styled.div`
    color: white;
    border-radius: 10px;
    padding: 4px 12px;
    height: 100%;
    ${globalStyles.flex()}
    width: 400px;
    cursor: pointer;
`

const SearchButton = styled(Button)`
    height: 100%;
`

const NoDataContentsContainer = styled.div`
    flex: 0 0 320px;
    ${globalStyles.flex()}
    width: 100%;
    border: 1px solid black;
`

const ContentsContainer = styled.div`
    max-height: ${window.innerHeight - 220}px;
    width: 100%;
    overflow: auto;
    color: white;
`

const ContentsItemContainer = styled.div<{ opened: boolean }>`
    height: ${({ opened }) => opened ? 320 : 44}px;
    transition: height .25s ease-out;
    border: 2px solid ${ContentsBorderColor};
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 4px;
`

const ContentsItemTitleContainer = styled.div`
    border-radius: 10px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    padding: 4px 8px;
`

const ContentsItemTitle = styled.div`
    font-size: 1.3rem;
    ${globalStyles.flex()}
    height: 32px;
`

const ContentsItemTitleBtnsContainer = styled.div`
    height: 32px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
`

const ContentsItemTitleBtn = styled(Button)`
    height: 100%;
`

const ContentsItemInnerContainer = styled.div`
    height: 260px;
    padding: 8px 16px;
    overflow: auto;
    border-radius: 10px;
`

const ContentsItemInnerRowContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '36px' })}
    margin-bottom: 16px;
`

const ContentsItemInnerColContainer = styled.div`
    flex: 1;
    height: 120px;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const ContentsItemInnerColTitle = styled.div`
    flex: 0 0 64px;
`

const ContentsItemInnerColContents = styled.div`
    flex: 1;
    border-radius: 8px;
    height: 120px;
    overflow: auto;
    ${globalStyles.flex({ justifyContent: 'flex-start', gap: '4px' })}
`

const ContentsItemInnerTargetImageBoxContainer = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
    padding: 6px;
    width: 100%;
    background-color: ${GlobalBackgroundColor};
`

const ContentsItemInnerHeadItemImageBox = styled(ImageView)`
    flex: 0 0 36px;
    height: 36px;
`

const ContentsItemInnerColContentWrapper = styled.div`
    width: 100%;
    ${globalStyles.flex()}
    background-color: ${GlobalBackgroundColor};
    padding: 8px;
    border-radius: 6px;
    text-align: center;
`

const PaginationContainer = styled.div`
    flex: 0 0 100px;
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

const Arrow = styled(CollapseArrow)`
    height: 100%;
    padding: 4px;
`

const PaginationArrowContainer = styled.div`
    height: 24px;
    width: 24px;
    cursor: pointer;
    position: relative;
`

const PaginationArrow = styled.img`
    width: 80%;
    height: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
`