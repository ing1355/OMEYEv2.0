import { useRecoilState, useRecoilValue } from "recoil"
import ConditionParamsInputColumnComponent from "./ConditionParamsInputColumnComponent"
import { conditionTargetDatas, selectedConditionObjectType } from "../../../../Model/ConditionDataModel"
import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../styles/global-styled"
import useConditionRoutes from "../Hooks/useConditionRoutes"
import { ReIDConditionTargetSelectMethodRoute, ReIDConditionTargetSelectPersonDescriptionRoute } from "../Constants/RouteInfo"
import ImageView from "../Constants/ImageView"
import Button from "../../../Constants/Button"
import { useState } from "react"
import PlateTarget from "./PlateTarget"
import IconBtn from "../../../Constants/IconBtn"
import { ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"
import { ObjectTypes, ReIDObjectTypeEmptyIcons, ReIDObjectTypes } from "../../ConstantsValues"
import TargetDescriptionByType from "../Constants/TargetDescriptionByType"

export type PlateStatusType = 'none' | 'add' | 'update'

const TargetSelectColumn = () => {
    const [plateStatus, setPlateStatus] = useState<PlateStatusType>('none')
    const { routePush } = useConditionRoutes()
    const [datas, setDatas] = useRecoilState(conditionTargetDatas(null))
    const selectedType = useRecoilValue(selectedConditionObjectType)

    const initAction = () => {
        setDatas([])
        setPlateStatus('none')
    }

    const addAction = () => {
        if (selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']]) setPlateStatus('add')
        else if (selectedType === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']]) routePush(ReIDConditionTargetSelectPersonDescriptionRoute.key)
        else routePush(ReIDConditionTargetSelectMethodRoute.key)
    }

    const allSelectAction = () => {
        setDatas(datas.every(_ => _.selected) ? datas.map(_ => ({ ..._, selected: false })) : datas.map(_ => ({ ..._, selected: true })))
    }

    return <Container>
        <ConditionParamsInputColumnComponent
            title={`대상(${datas.length})`}
            titleIcon={ReIDObjectTypeEmptyIcons[ReIDObjectTypes.findIndex(_ => _.key === selectedType)]}
            isTarget
            initAction={initAction}
            dataAddAction={addAction}
            noDataText="대상 추가"
            isDataExist={datas.length > 0 || (selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']] && plateStatus === 'add')}
            dataAddDelete={selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']] && plateStatus === 'add'}
            disableAllSelect={(selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']] && plateStatus === 'add')}
            allSelectAction={allSelectAction}
            allSelected={datas.length > 0 && datas.every(_ => _.selected)}>
            <ItemsScrollContainer>
                {plateStatus === 'add' && selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']] && <PlateTarget status={plateStatus} setStatus={setPlateStatus} />}
                {datas.map(_ => selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']] ? <PlateTarget key={_.id} data={_} status={plateStatus} setStatus={setPlateStatus} /> : <ItemContainer key={_.id} selected={_.selected || false} onClick={() => {
                    setDatas(datas.map(__ => _.objectId !== __.objectId ? __ : {
                        ..._,
                        selected: !_.selected
                    }))
                }}>
                    <ItemSubContainer>
                        <ItemImage src={_.src} />
                        <ItemDescription>
                            <ItemDescriptionHeader>
                                <IconBtn type="delete" onClick={(e) => {
                                    e.stopPropagation()
                                    setDatas(datas.filter(__ => _.objectId !== __.objectId))
                                }} />
                            </ItemDescriptionHeader>
                            <ItemDescriptionContents>
                                <TargetDescriptionByType data={_} />
                            </ItemDescriptionContents>
                        </ItemDescription>
                    </ItemSubContainer>
                    <ItemSelectBtn hover activate={_.selected}>
                        {_.selected ? '해제' : '선택'}
                    </ItemSelectBtn>
                </ItemContainer>)}
            </ItemsScrollContainer>
        </ConditionParamsInputColumnComponent>
    </Container>
}

export default TargetSelectColumn

const Container = styled.div`
    ${globalStyles.conditionParamsColumnContainer}
`

const ItemsScrollContainer = styled.div`
    overflow-y: auto;
    width: 100%;
    height: calc(100% - 170px);
    ${globalStyles.conditionParamsColumnContainer}
    justify-content: flex-start;
`

const ItemContainer = styled.div<{ selected: boolean }>`
    width: 100%;
    flex: 0 0 300px;
    ${globalStyles.flex({ gap: '4px' })}
    ${globalStyles.conditionDataItemBox}
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    cursor: pointer;
`

const ItemSubContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row' })}
    flex: 1;
`

const ItemImage = styled(ImageView)`
    flex: 0 0 40%;
    height: 100%;
    padding: 4px;
`

const ItemDescription = styled.div`
    flex: 0 0 60%;
    height: 100%;
    ${globalStyles.flex()}
`

const ItemDescriptionHeader = styled.div`
    flex: 0 0 28px;
    width: 100%;
    ${globalStyles.flex({ alignItems: 'flex-end' })}
`

const ItemSelectBtn = styled(Button)`
    flex: 0 0 24px;
    width: 100%;
    ${globalStyles.conditionDataItemBoxSelectBtn}
`

const ItemDescriptionContents = styled.div`
    flex: 0 0 calc(100% - 28px);
    padding: 0px 6px;
    ${globalStyles.flex({ gap: '8px' })}
    overflow-wrap: anywhere;
`

const ItemDescriptionContentText = styled.div`
    color: white;
    width: 100%;
`