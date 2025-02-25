import styled from "styled-components"
import { ReIDLogDataType, ReIDSearchParamsType, SearchReIDLogDatas, useReIDLogDatas } from "../../../Model/ReIDLogModel"
import { ContentsBorderColor, GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Input from "../../Constants/Input"
import Dropdown, { DropdownProps } from "../../Layout/Dropdown"
import { ReIDMenuKeys, ReIDObjectTypes } from "../ConstantsValues"
import Button from "../../Constants/Button"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ReIDLogDataSaveToJSON, convertFullTimeStringToHumanTimeFormat, getTimeDifference } from "../../../Functions/GlobalFunctions"
import ImageView from "../Condition/Constants/ImageView"
import { useRecoilRefresher_UNSTABLE, useRecoilState, useSetRecoilState } from "recoil"
import { conditionMenu } from "../../../Model/ConditionMenuModel"
import TimeModal, { TimeModalDataType } from "../Condition/Constants/TimeModal"
import Form from "../../Constants/Form"
import CollapseArrow from "../../Constants/CollapseArrow"
import searchIcon from '../../../assets/img/searchIcon.png'
import { ReIDObjectTypeKeys } from "../../../Constants/GlobalTypes"
import ForLog from "../../Constants/ForLog"
import { AllReIDSelectedResultData, ReIDResultSelectedCondition, ReIDResultSelectedView } from "../../../Model/ReIdResultModel"
import { Axios } from "../../../Functions/NetworkFunctions"
import { GetReidDataApi } from "../../../Constants/ApiRoutes"
import Pagination from "../../Layout/Pagination"

const bottomColStyle = {
    alignItems: 'flex-start'
}

const bottomColTitleStyle = {
    paddingTop: '8px'
}

type ObjectTypeSearchValues = ReIDObjectTypeKeys | 'all'

const ReIDLogs = () => {
    // const setReIDResultData = useSetRecoilState(ReIDResultData)
    const [menu, setMenu] = useRecoilState(conditionMenu)
    const [currentPage, setCurrentPage] = useState(0)
    const [opened, setOpened] = useState<ReIDLogDataType['reidId']>(0)
    const [timeVisible, setTimeVisible] = useState(false)
    const [timeValue, setTimeValue] = useState<TimeModalDataType | undefined>(undefined)
    const [searchValue, setSearchValue] = useState<ObjectTypeSearchValues>('all')
    const params = useRef<ReIDSearchParamsType>({
        page: currentPage + 1
    })

    const paginationInputRef = useRef<HTMLInputElement>()
    const titleInputRef = useRef<HTMLInputElement>()

    const setReIDResultSelectedView = useSetRecoilState(ReIDResultSelectedView)
    const setReIDSelectedcondition = useSetRecoilState(ReIDResultSelectedCondition)
    const [reidResults, setReidResults] = useRecoilState(AllReIDSelectedResultData)
    const logs = useReIDLogDatas(params.current)
    const refresh = useRecoilRefresher_UNSTABLE(SearchReIDLogDatas(params.current))

    useEffect(() => {
        refresh()
        params.current = { ...params.current, page: currentPage + 1 }
        if (paginationInputRef.current) paginationInputRef.current.value = (currentPage + 1).toString()
    }, [currentPage])

    useEffect(() => {
        if (menu === ReIDMenuKeys['REIDLOGS']) refresh()
        else setOpened(0)
    }, [menu])

    return <Container>
        <TimeModal visible={timeVisible} close={() => {
            setTimeVisible(false)
        }} defaultValue={timeValue} onChange={setTimeValue} title="검색 시간" />
        <Wrapper>
            <Form onSubmit={() => {
                let _: ReIDSearchParamsType = {
                    page: 1
                }
                if (titleInputRef.current && titleInputRef.current.value) _.desc = titleInputRef.current.value
                if (searchValue !== 'all') _.type = searchValue
                if (timeValue) {
                    _.from = timeValue.startTime
                    _.to = timeValue.endTime!
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
                    <SearchButton hover icon={searchIcon} type="submit">
                        검색
                    </SearchButton>
                </SearchContainer>
            </Form>
            {
                logs && logs.results.length > 0 ? <>
                    <ContentsContainer>
                        {
                            logs.results.map((_, ind) => <ContentsItemContainer opened={opened === _.reidId} key={_.reidId}>
                                <ContentsItemTitleContainer onClick={() => {
                                    if (opened === _.reidId) setOpened(0)
                                    else setOpened(_.reidId)
                                }}>
                                    {/* <ForLog data={[_.requestGroups, _.reidId]}/> */}
                                    <ContentsItemTitle>검색 {_.reidId} ({convertFullTimeStringToHumanTimeFormat(_.createdTime)}) - {ReIDObjectTypes.find(__ => __.key === _.requestGroups[0].targetObjects[0].type)?.title}</ContentsItemTitle>
                                    <ContentsItemTitleBtnsContainer>
                                        {/* <ContentsItemTitleBtn hover onClick={() => {

                                        }}>
                                            조건 목록에 전부 추가
                                        </ContentsItemTitleBtn> */}
                                        <ContentsItemTitleBtn hover onClick={async (e) => {
                                            e.stopPropagation()
                                            const newData = await Axios("GET", GetReidDataApi(_.reidId))
                                            if (reidResults.some(r => r.reIdId === _.reidId)) {
                                                setReidResults(reidResults.map(r => r.reIdId === _.reidId ? newData : r))
                                            } else {
                                                setReidResults(reidResults.concat(newData))
                                            }
                                            setReIDSelectedcondition(0)
                                            setReIDResultSelectedView([_.reidId])
                                            setMenu(ReIDMenuKeys['REIDRESULT'])
                                        }}>
                                            결과 바로보기
                                        </ContentsItemTitleBtn>
                                        <Arrow opened={opened === _.reidId} />
                                    </ContentsItemTitleBtnsContainer>
                                </ContentsItemTitleContainer>

                                {
                                    _.requestGroups.map((__, _ind) => <ContentsItemSubContainer opened={true} key={_ind}>
                                        <ContentsItemSubTitleContainer>
                                            <div />
                                            {__.title}
                                            <SubTitleItemsContainer>
                                                <ContentsItemTitleBtn hover onClick={async () => {
                                                    // const resultData = await Axios("GET", GetReidDataApi(_.reidId)) as ReIDResultType
                                                    ReIDLogDataSaveToJSON(__)
                                                    // DownloadSingleConditionJsonData(resultData.data[_ind])
                                                }}>
                                                    데이터 다운로드
                                                </ContentsItemTitleBtn>
                                                {/* <Arrow opened={subOpened.includes(_ind)} onClick={() => {
                                                    if (subOpened.includes(_ind)) setSubOpened(subOpened.filter(___ => ___ !== _ind))
                                                    else setSubOpened(subOpened.concat(_ind))
                                                }} /> */}
                                            </SubTitleItemsContainer>
                                        </ContentsItemSubTitleContainer>
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
                                                                __.targetObjects.map((__, ind) => <div key={ind} style={{
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
                                                        분석 결과 후보 수 :
                                                    </ContentsItemInnerColTitle>
                                                    <ContentsItemInnerColContents style={{
                                                        justifyContent: 'center'
                                                    }}>
                                                        <ContentsItemInnerColContentWrapper>
                                                            {__.rank}
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
                                                            {__.status === 'IN_PROGRESS' && "진행중"}
                                                            {__.status === 'SUCCESS' && getTimeDifference(__.requestStartTime, __.requestEndTime)}
                                                            {__.status === 'CANCEL' && "취소된 요청"}
                                                        </ContentsItemInnerColContentWrapper>
                                                    </ContentsItemInnerColContents>
                                                </ContentsItemInnerColContainer>
                                            </ContentsItemInnerRowContainer>
                                            <ContentsItemInnerRowContainer>
                                                <ContentsItemInnerColContainer style={bottomColStyle}>
                                                    <ContentsItemInnerColTitle style={bottomColTitleStyle}>
                                                        시간 :
                                                    </ContentsItemInnerColTitle>
                                                    <ContentsItemInnerColContents>
                                                        {
                                                            __.timeGroups.map((time, ind) => <ContentsItemInnerColContentWrapper key={ind}>
                                                                {convertFullTimeStringToHumanTimeFormat(time.startTime)} ~ {convertFullTimeStringToHumanTimeFormat(time.endTime)}
                                                            </ContentsItemInnerColContentWrapper>)
                                                        }
                                                    </ContentsItemInnerColContents>
                                                </ContentsItemInnerColContainer>
                                                <ContentsItemInnerColContainer style={bottomColStyle}>
                                                    <ContentsItemInnerColTitle style={bottomColTitleStyle}>
                                                        CCTV 수 :
                                                    </ContentsItemInnerColTitle>
                                                    <ContentsItemInnerColContents>
                                                        {
                                                            __.cameraGroups.map((cctvs, ind) => <ContentsItemInnerColContentWrapper key={ind}>
                                                                CCTV {cctvs.length} 대
                                                            </ContentsItemInnerColContentWrapper>)
                                                        }
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
                                                            {__.etc}
                                                        </ContentsItemInnerColContentWrapper>
                                                    </ContentsItemInnerColContents>
                                                </ContentsItemInnerColContainer>
                                            </ContentsItemInnerRowContainer>
                                        </ContentsItemInnerContainer>
                                    </ContentsItemSubContainer>)
                                }
                            </ContentsItemContainer>)
                        }
                    </ContentsContainer>
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} datas={logs}/>
                </> : <NoDataContentsContainer>
                    서버에 저장된 분석 결과가 존재하지 않습니다.
                </NoDataContentsContainer>
            }
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
    margin-bottom: 12px;
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
    width: 240px;
    background-color: ${GlobalBackgroundColor};
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
    background-color: ${GlobalBackgroundColor};
`

const SearchButton = styled(Button)`
    height: 100%;
`

const NoDataContentsContainer = styled.div`
    ${globalStyles.flex()}
    width: 100%;
    height: 100%;
    font-size: 1.2rem;
    font-weight: 700;
`

const ContentsContainer = styled.div`
    max-height: ${window.innerHeight - 220}px;
    width: 100%;
    overflow: auto;
    color: white;
`

const ContentsItemContainer = styled.div<{ opened: boolean }>`
    height: ${({ opened }) => opened ? 'auto' : (44 + 'px')};
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
    cursor: pointer;
    display: flex !important;
`

const ContentsItemSubContainer = styled.div<{ opened: boolean }>`
    height: ${({ opened }) => opened ? 348 : 40}px;
    transition: height .25s ease-out;
    margin-bottom: 4px;
    overflow: auto;
    padding: 0 16px;
`

const ContentsItemSubTitleContainer = styled.div`
    height: 36px;
    margin-bottom: 8px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    border-radius: 10px;
    background-color: ${ContentsBorderColor};
`

const SubTitleItemsContainer = styled.div`
    height: 100%;
    padding: 0 8px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    & > button {
        height: 90%;
    }
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
    height: 300px;
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
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const ContentsItemInnerColTitle = styled.div`
    flex: 0 0 100px;
    text-align: end;
`

const ContentsItemInnerColContents = styled.div`
    flex: 1;
    border-radius: 8px;
    height: 140px;
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

const Arrow = styled(CollapseArrow)`
    height: 100%;
    padding: 4px;
`