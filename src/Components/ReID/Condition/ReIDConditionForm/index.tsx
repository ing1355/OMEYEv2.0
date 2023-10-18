import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"
import Input from "../../../Constants/Input"
import Button from "../../../Constants/Button"
import { useRecoilState } from "recoil"
import { conditionData, conditionTitleData, createDefaultConditionData } from "../../../../Model/ConditionDataModel"
import TargetSelectColumn from "./TargetSelectColumn"
import ETCColumn from "./ETCColumn"
import TimeBoundaryColumn from "./TimeBoundaryColumn"
import AreaBoundaryColumn from "./AreaBoundaryColumn"
import { DownloadSingleConditionJsonData, UploadSingleConditionJsonData } from "../../../../Functions/GlobalFunctions"
import conditionDataSaveIcon from '../../../../assets/img/conditionDataSaveIcon.png'
import conditionDataUploadIcon from '../../../../assets/img/conditionDataUploadIcon.png'
import resetIcon from '../../../../assets/img/resetDisabledIcon.png'

const ReIDConditionForm = () => {
    const [title, setTitle] = useRecoilState(conditionTitleData)
    const [datas, setDatas] = useRecoilState(conditionData)
    
    return <>
        <TopInputAndButtonsContainer>
                <TitleInput placeholder={datas.isRealTime ? "실시간 검색 요청" : "타이틀을 입력해주세요."} value={title} onChange={value => {
                    setTitle(value)
                }} disabled={datas.isRealTime}/>
            <TopButtonsContainer>
                <TopButton icon={resetIcon} onClick={() => {
                    setDatas(createDefaultConditionData())
                }}>
                    전체 초기화
                </TopButton>
                <TopButton icon={conditionDataUploadIcon} onClick={() => {
                    UploadSingleConditionJsonData((json) => {
                        setDatas(json as any)
                    })
                }}>
                    불러오기
                </TopButton>
                <TopButton icon={conditionDataSaveIcon} onClick={() => {
                    DownloadSingleConditionJsonData(datas)
                }}>
                    저장하기
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