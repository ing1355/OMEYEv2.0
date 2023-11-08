import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"
import Input from "../../../Constants/Input"
import Button from "../../../Constants/Button"
import { useRecoilState, useRecoilValue } from "recoil"
import { ConditionDataSingleType, conditionData, conditionTitleData, createDefaultConditionData, selectedConditionObjectType } from "../../../../Model/ConditionDataModel"
import TargetSelectColumn from "./TargetSelectColumn"
import ETCColumn from "./ETCColumn"
import TimeBoundaryColumn from "./TimeBoundaryColumn"
import AreaBoundaryColumn from "./AreaBoundaryColumn"
import { DownloadSingleConditionJsonData, UploadSingleConditionJsonData } from "../../../../Functions/GlobalFunctions"
import conditionDataSaveIcon from '../../../../assets/img/conditionDataSaveIcon.png'
import conditionDataUploadIcon from '../../../../assets/img/conditionDataUploadIcon.png'
import resetIcon from '../../../../assets/img/resetDisabledIcon.png'
import useMessage from "../../../../Hooks/useMessage"
import { ReIDObjectTypes } from "../../ConstantsValues"

const ReIDConditionForm = () => {
    const [title, setTitle] = useRecoilState(conditionTitleData)
    const [datas, setDatas] = useRecoilState(conditionData)
    const currentObjectType = useRecoilValue(selectedConditionObjectType)
    const message = useMessage()
    
    return <>
        <TopInputAndButtonsContainer>
                <TitleInput placeholder={datas.isRealTime ? "실시간 검색 요청" : "타이틀을 입력해주세요."} value={title} onChange={value => {
                    setTitle(value)
                }} disabled={datas.isRealTime} maxLength={20}/>
            <TopButtonsContainer>
                <TopButton hover icon={resetIcon} onClick={() => {
                    setDatas(createDefaultConditionData(currentObjectType!))
                    message.success({
                        title: '데이터 초기화',
                        msg: `${ReIDObjectTypes.find(_ => _.key === currentObjectType)?.title} 타입 검색 조건 초기화 되었습니다.`
                    })
                }}>
                    전체 초기화
                </TopButton>
                <TopButton hover icon={conditionDataUploadIcon} onClick={() => {
                    UploadSingleConditionJsonData((json: ConditionDataSingleType) => {
                        if(json.targets[0].type !== currentObjectType) return message.error({
                            title: "입력값 에러",
                            msg: "불러온 데이터의 타입과 현재 선택한 타입이 일치하지 않습니다."
                        })
                        setDatas(json)
                    }, () => {
                        message.error({
                            title: "입력값 에러",
                            msg: "잘못된 JSON 파일 입니다."
                        })
                    })
                }}>
                    가져오기
                </TopButton>
                <TopButton hover icon={conditionDataSaveIcon} onClick={() => {
                    DownloadSingleConditionJsonData(datas)
                }}>
                    내보내기
                </TopButton>
            </TopButtonsContainer>
        </TopInputAndButtonsContainer>
        <ConditionParamsInputContainer>
            <TargetSelectColumn />
            <AreaBoundaryColumn/>
            <TimeBoundaryColumn/>
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