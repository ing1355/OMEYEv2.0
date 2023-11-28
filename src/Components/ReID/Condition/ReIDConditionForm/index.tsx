import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"
import Input from "../../../Constants/Input"
import Button from "../../../Constants/Button"
import { useRecoilState, useRecoilValue } from "recoil"
import { ConditionDataType, ConditionListType, conditionData, conditionListDatas, conditionSelectedType, conditionTitleData, createDefaultConditionData } from "../../../../Model/ConditionDataModel"
import TargetSelectColumn from "./TargetSelectColumn"
import ETCColumn from "./ETCColumn"
import TimeBoundaryColumn from "./TimeBoundaryColumn"
import AreaBoundaryColumn from "./AreaBoundaryColumn"
import { DownloadSingleConditionJsonData, UploadSingleConditionJsonData } from "../../../../Functions/GlobalFunctions"
import conditionDataSaveIcon from '../../../../assets/img/conditionDataSaveIcon.png'
import exportIcon from '../../../../assets/img/exportIcon.png'
import conditionDataUploadIcon from '../../../../assets/img/conditionDataUploadIcon.png'
import resetIcon from '../../../../assets/img/resetDisabledIcon.png'
import useMessage from "../../../../Hooks/useMessage"
import { ReIDObjectTypes } from "../../ConstantsValues"
import { ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"
import ForLog from "../../../Constants/ForLog"

let listId = 0

export const createConditionList = () => {
    return listId++
}

const ReIDConditionForm = () => {
    const [title, setTitle] = useRecoilState(conditionTitleData)
    const [datas, setDatas] = useRecoilState(conditionData)
    const [allDatas, setAllDatas] = useRecoilState(conditionData)
    const [conditionList, setConditionList] = useRecoilState(conditionListDatas)
    const message = useMessage()
    const { targets, rank, time, name, cctv, isRealTime, etc } = datas
    
    return <>
        <TopInputAndButtonsContainer>
            <TitleInput placeholder={datas.isRealTime ? "실시간 검색 요청" : "타이틀을 입력해주세요."} value={datas.isRealTime ? "실시간 검색 요청" : title} onChange={value => {
                setTitle(value)
            }} disabled={datas.isRealTime} maxLength={20} />
            <TopButtonsContainer>
                <TopButton hover icon={resetIcon} onClick={() => {
                    setDatas(createDefaultConditionData())
                    message.success({
                        title: '데이터 초기화',
                        msg: `검색 조건이 초기화 되었습니다.`
                    })
                }}>
                    전체 초기화
                </TopButton>
                <TopButton hover icon={conditionDataUploadIcon} onClick={() => {
                    UploadSingleConditionJsonData((json: ConditionDataType) => {
                        setAllDatas(json)
                    }, () => {
                        message.error({
                            title: "입력값 에러",
                            msg: "잘못된 JSON 파일 입니다."
                        })
                    })
                }}>
                    가져오기
                </TopButton>
                <TopButton hover icon={exportIcon} onClick={() => {
                    DownloadSingleConditionJsonData(datas)
                }}>
                    내보내기
                </TopButton>
                <TopButton hover icon={conditionDataSaveIcon} disabled={targets.length === 0 || time.length === 0 || cctv.length === 0 || isRealTime || conditionList.some(_ => JSON.stringify({ ..._ }) === JSON.stringify({ ...datas, targets: targets.filter(_ => _.selected), cctv: cctv.filter(_ => _.selected), time: time.filter(_ => _.selected), name: datas.name || "빈 타이틀", selected: _.selected, id: _.id }))} onClick={() => {
                    if (!(datas.cctv.some(_ => _.selected) && datas.targets.some(_ => _.selected) && datas.time.some(_ => _.selected))) return message.error({ title: "입력값 에러", msg: "조건 저장을 위해선 각 항목별로 최소 1개 이상이 선택되어야 합니다." })
                    let tempConditionData: ConditionListType = { ...datas, selected: false, id: createConditionList() }
                    tempConditionData.cctv = tempConditionData.cctv.filter(_ => _.selected)
                    tempConditionData.targets = tempConditionData.targets.filter(_ => _.selected)
                    tempConditionData.time = tempConditionData.time.filter(_ => _.selected)
                    tempConditionData.name = tempConditionData.name || "빈 타이틀"
                    setConditionList(conditionList.concat(tempConditionData))
                    message.success({
                        title: "저장 성공",
                        msg: '조건 저장에 성공하였습니다.\n저장하신 조건들은 좌측 "검색 조건 목록" 메뉴에서 확인할 수 있습니다.'
                    })
                }}>
                    현재 조건 저장
                </TopButton>
            </TopButtonsContainer>
        </TopInputAndButtonsContainer>
        <ConditionParamsInputContainer>
            <TargetSelectColumn />
            <AreaBoundaryColumn />
            <TimeBoundaryColumn />
            <ETCColumn />
        </ConditionParamsInputContainer>
    </>
}

export default ReIDConditionForm

const TopContainerHeight = 60

const TopInputAndButtonsContainer = styled.div`
    height: ${TopContainerHeight}px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const TitleInput = styled(Input)`
    height: 40px;
    border-radius: 10px;
    border: none;
    outline: none;
    border-radius: 10px
    font-size: 2.3rem;
    text-align: center;
    flex: 0 0 480px;
    color: white;
`

const TopButtonsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '8px' })}
`

const TopButton = styled(Button)`
    height: 40px;
`

const ConditionParamsInputContainer = styled.div`
    height: calc(100% - ${TopContainerHeight}px);
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '24px' })}
`