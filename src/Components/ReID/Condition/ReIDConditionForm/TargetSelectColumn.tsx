import { useRecoilState, useRecoilValue } from "recoil"
import ConditionParamsInputColumnComponent from "./ConditionParamsInputColumnComponent"
import { conditionIsRealTimeData, conditionTargetDatas, selectedConditionObjectType } from "../../../../Model/ConditionDataModel"
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
import useMessage from "../../../../Hooks/useMessage"
import checkIcon from '../../../../assets/img/checkIcon.png'

export type PlateStatusType = 'none' | 'add' | 'update'

const TargetSelectColumn = () => {
    const [plateStatus, setPlateStatus] = useState<PlateStatusType>('none')
    const [datas, setDatas] = useRecoilState(conditionTargetDatas(null))
    const selectedType = useRecoilValue(selectedConditionObjectType)
    const isRealTime = useRecoilValue(conditionIsRealTimeData)
    const { routePush } = useConditionRoutes()
    const message = useMessage()

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
            title={`대상(${datas.filter(_ => _.selected).length}/${datas.length})`}
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
            {plateStatus === 'add' && selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']] && <PlateTarget status={plateStatus} setStatus={setPlateStatus} />}
            {datas.map(_ => selectedType === ReIDObjectTypeKeys[ObjectTypes['PLATE']] ? <PlateTarget key={_.id} data={_} status={plateStatus} setStatus={setPlateStatus} /> : <ItemContainer key={_.id} selected={_.selected || false} onClick={() => {
                if (_.selected) {
                    setDatas(datas.map(__ => _.objectId !== __.objectId ? __ : {
                        ..._,
                        selected: false
                    }))
                } else if (isRealTime && datas.find(_ => _.selected)) return message.error({ title: "입력값 에러", msg: "실시간 분석은 1개의 대상만 선택 가능합니다." })
                else {
                    setDatas(datas.map(__ => _.objectId !== __.objectId ? __ : {
                        ..._,
                        selected: true
                    }))
                }
            }}>
                <ItemSubContainer>
                    <ItemImageContainer>
                        <ItemImage>
                            <ItemHeader>
                                <Check>
                                    {_.selected && <img src={checkIcon}/>}
                                </Check>
                            </ItemHeader>
                            <ImageView src={_.src} />
                        </ItemImage>
                    </ItemImageContainer>
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
                {/* <ItemSelectBtn hover activate={_.selected}>
                    {_.selected ? '해제' : '선택'}
                </ItemSelectBtn> */}
            </ItemContainer>)}
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
    &:hover {
        border: 1px solid ${ContentsActivateColor};
    }
`

const ItemSubContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row' })}
    flex: 1;
`

const ItemImage = styled.div`
    height: calc(100% - 32px);
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

const ItemImageContainer = styled.div`
    flex: 0 0 40%;
    height: 100%;
    padding: 4px;
`

const ItemHeader = styled.div`
    height: 20px;
    margin-bottom: 8px;
`

const Check = styled.div`
    height: 100%;
    width: 20px;
    border: 1px solid ${ContentsActivateColor};
    border-radius: 50%;
    padding: 4px;
    & > img {
        width: 100%;
        height: 100%;
    }
`