import styled from "styled-components"
import { globalStyles } from "../../../styles/global-styled"
import Button from "../Button"
import ImageView from "../../ReID/Condition/Constants/ImageView"
import { useEffect, useMemo, useState } from "react"
import { ReIDObjectTypeKeys, setStateType } from "../../../Constants/GlobalTypes"
import { useRecoilValue } from "recoil"
import { conditionTargetDatas, conditionTargetDatasListByObjectType } from "../../../Model/ConditionDataModel"
import { LeftArrow, RightArrow } from "../../Layout/Arrows"
import { ArrayDeduplication } from "../../../Functions/GlobalFunctions"
import { ReIDAllResultData, ReIDResultByObjectType } from "../../../Model/ReIdResultModel"

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
    const targetDatas = useRecoilValue(conditionTargetDatas(type)) // 현재 선택한 object type의 대상들
    const listDatas = useRecoilValue(conditionTargetDatasListByObjectType(type || 'PERSON')) // 검색 조건 저장해놓은 object들
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
        return ArrayDeduplication(temp, (a,b) => a.id === b.id)
    }, [targetDatas, listDatas, reidResults])

    return <AddReIDObjectContainer>
        <AddReIDObjectSubContainer>
            <ImageView src={targetImages[selectedView] && targetImages[selectedView].src} />
        </AddReIDObjectSubContainer>
        <AddReIDObjectSelectedContainer>
            <AddReIDObjectSelectedBtn activate={!value.find(_ => targetImages[selectedView].id === _.id)} onClick={() => {
                if (value.find(_ => targetImages[selectedView].id === _.id)) {
                    onChange(value.filter(_ => _.id !== targetImages[selectedView].id))
                } else {
                    onChange(value.concat(targetImages[selectedView]))
                }
            }}>
                {value.find(_ => targetImages[selectedView].id === _.id) ? '해제' : '선택'}
            </AddReIDObjectSelectedBtn>
        </AddReIDObjectSelectedContainer>
        <ObjectChangeContainer>
            <LeftArrow onClick={() => {
                setSelectedView(selectedView - 1)
            }} disabled={selectedView === 0} />
            {selectedView + 1} / {targetImages.length}
            <RightArrow onClick={() => {
                setSelectedView(selectedView + 1)
            }} disabled={selectedView === targetImages.length - 1} />
        </ObjectChangeContainer>
    </AddReIDObjectContainer>
}

export default AdditionalReIDContainer

const AddReIDObjectSubContainer = styled.div`
    ${globalStyles.flex()}
    height: 250px;
    width: 100%;
    padding: 8px 0;
`

const AddReIDObjectSelectedContainer = styled.div`
    height: 30px;
    width: 100%;
`

const AddReIDObjectSelectedBtn = styled(Button)`
    width: 100%;
`

const AddReIDObjectContainer = styled.div`
    width: 190px;
    padding: 0 4px;
    height: 300px;
    ${globalStyles.flex({ justifyContent: 'space-between' })}
`

const ObjectChangeContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    height: 20px;
`