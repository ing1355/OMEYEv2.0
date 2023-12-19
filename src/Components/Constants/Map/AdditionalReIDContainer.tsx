import styled from "styled-components"
import { SectionBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Button from "../Button"
import ImageView from "../../ReID/Condition/Constants/ImageView"
import { useMemo, useState } from "react"
import { ReIDObjectTypeKeys, setStateType } from "../../../Constants/GlobalTypes"
import { useRecoilValue } from "recoil"
import { conditionListDatas, conditionTargetDatas } from "../../../Model/ConditionDataModel"
import { LeftArrow, RightArrow } from "../../Layout/Arrows"
import { ReIDResultByObjectType } from "../../../Model/ReIdResultModel"

type TargetImageType = {
    src: string
    id: number
    type: ReIDObjectTypeKeys
}

type AdditionalReIDContainerProps = {
    type: ReIDObjectTypeKeys|null
    onChange: setStateType<TargetImageType[]>
    value: TargetImageType[]
}


const AdditionalReIDContainer = ({ type, onChange, value }: AdditionalReIDContainerProps) => {
    const [selectedView, setSelectedView] = useState(0)
    const targetDatas = useRecoilValue(conditionTargetDatas) // 현재 선택한 object type의 대상들
    const listDatas = useRecoilValue(conditionListDatas) // 검색 조건 저장해놓은 object들
    const reidResults = useRecoilValue(ReIDResultByObjectType(type || 'PERSON')) // 현재 검색 결과의 object들

    const targetImages: TargetImageType[] = useMemo(() => {
        let temp: TargetImageType[] = []
        temp = temp.concat(targetDatas.map(_ => ({
            id: _.objectId!,
            type: _.type,
            src: _.src
        })), listDatas.flatMap(_ => _.targets.map(__ => ({
            id: __.objectId!,
            type: __.type,
            src: __.src
        }))), reidResults.flatMap(_ => _.data.flatMap(__ => __.resultList.flatMap(___ => ({
            id: ___.objectId,
            type: ___.objectType,
            src: ___.objectUrl
        })))))
        return temp.deduplication((a,b) => a.id === b.id)
    }, [targetDatas, listDatas, reidResults])

    return <AddReIDObjectContainer>
        <Title>
            대상 선택
        </Title>
        <AddReIDObjectSubContainer>
            <ImageView src={targetImages[selectedView] && targetImages[selectedView].src} />
        </AddReIDObjectSubContainer>
        <ObjectChangeContainer>
            <LeftArrow onClick={() => {
                setSelectedView(selectedView - 1)
            }} disabled={selectedView === 0} />
            {selectedView + 1} / {targetImages.length}
            <RightArrow onClick={() => {
                setSelectedView(selectedView + 1)
            }} disabled={selectedView === targetImages.length - 1} />
        </ObjectChangeContainer>
        <AddReIDObjectSelectedContainer>
            <AddReIDObjectSelectedBtn hover activate={!value.find(_ => targetImages[selectedView].id === _.id)} onClick={() => {
                if (value.find(_ => targetImages[selectedView].id === _.id)) {
                    onChange(value.filter(_ => _.id !== targetImages[selectedView].id))
                } else {
                    onChange(value.concat(targetImages[selectedView]))
                }
            }}>
                {value.find(_ => targetImages[selectedView].id === _.id) ? '해제' : '선택'}
            </AddReIDObjectSelectedBtn>
        </AddReIDObjectSelectedContainer>
    </AddReIDObjectContainer>
}

export default AdditionalReIDContainer

const AddReIDObjectContainer = styled.div`
    width: 100%;
    padding: 12px 4px;
    height: 260px;
    background-color: ${SectionBackgroundColor};
    border-radius: 10px;
    ${globalStyles.flex({ gap: '4px', justifyContent:'flex-start' })}
`

const Title = styled.div`
    height: 28px;
    font-size: 1.2rem;
    width: 100%;
    text-align: start;
    padding: 4px 8px;
`

const AddReIDObjectSubContainer = styled.div`
    ${globalStyles.flex()}
    height: calc(100% - 87px);
    width: 100%;
`

const AddReIDObjectSelectedContainer = styled.div`
    height: 24px;
    width: 100%;
`

const AddReIDObjectSelectedBtn = styled(Button)`
    width: 100%;
`

const ObjectChangeContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    height: 24px;
`