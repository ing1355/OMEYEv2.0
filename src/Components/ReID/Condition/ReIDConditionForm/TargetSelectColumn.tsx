import { useRecoilState, useRecoilValue } from "recoil"
import ConditionParamsInputColumnComponent from "./ConditionParamsInputColumnComponent"
import { ObjectTypes, conditionTargetDatas, selectedConditionObjectType } from "../../../../Model/ConditionDataModel"
import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../styles/global-styled"
import useConditionRoutes from "../Hooks/useConditionRoutes"
import { ReIDConditionTargetSelectMethodRoute } from "../Constants/RouteInfo"
import ImageView from "../Constants/ImageView"
import Button from "../../../Constants/Button"
import { ReIDObjectTypeKeys } from "../../ConstantsValues"
import { useState } from "react"
import PlateTarget from "./PlateTarget"
import IconBtn from "../../../Constants/IconBtn"
import { getMethodNameByKey } from "../../../../Functions/GlobalFunctions"
import CCTVNameById from "../../../Constants/CCTVNameById"

export type PlateStatusType = 'none' | 'add' | 'update'

const TargetSelectColumn = () => {
    const [plateStatus, setPlateStatus] = useState<PlateStatusType>('none')
    const { routePush } = useConditionRoutes()
    const [datas, setDatas] = useRecoilState(conditionTargetDatas)
    const selectedType = useRecoilValue(selectedConditionObjectType)

    const initAction = () => {
        setDatas([])
        setPlateStatus('none')
    }

    const addAction = () => {
        if (selectedType === 'car_plate') setPlateStatus('add')
        else routePush(ReIDConditionTargetSelectMethodRoute.key)
    }

    const allSelectAction = () => {
        setDatas(datas.every(_ => _.selected) ? datas.map(_ => ({ ..._, selected: false })) : datas.map(_ => ({ ..._, selected: true })))
    }

    return <Container>
        <ConditionParamsInputColumnComponent
            title={`대상(${datas.length})`}
            initAction={initAction}
            dataAddAction={addAction}
            noDataText="대상 추가"
            isDataExist={datas.length > 0 || (selectedType === 'car_plate' && plateStatus === 'add')}
            dataAddDelete={selectedType === 'car_plate' && plateStatus === 'add'}
            allSelectAction={allSelectAction}
            allSelected={datas.every(_ => _.selected)}>
            <ItemsScrollContainer>
                {plateStatus === 'add' && selectedType === 'car_plate' && <PlateTarget status={plateStatus} setStatus={setPlateStatus} />}
                {datas.map(_ => selectedType === 'car_plate' ? <PlateTarget key={_.id} data={_} status={plateStatus} setStatus={setPlateStatus} /> : <ItemContainer key={_.id} selected={_.selected || false}>
                    <ItemSubContainer>
                        <ItemImage src={_.src} />
                        <ItemDescription>
                            <ItemDescriptionHeader>
                                <IconBtn type="delete" onClick={() => {
                                    setDatas(datas.filter(__ => _.id !== __.id))
                                }} />
                            </ItemDescriptionHeader>
                            <ItemDescriptionContents>
                                <ItemDescriptionContentText>
                                    선택 방법 : {getMethodNameByKey(_.method!)}
                                </ItemDescriptionContentText>
                                {
                                    _.cctvName && <ItemDescriptionContentText>
                                        CCTV 이름 : {_.cctvName}
                                    </ItemDescriptionContentText>
                                }
                                {
                                    _.cctvId && <ItemDescriptionContentText>
                                        CCTV 이름 : <CCTVNameById cctvId={_.cctvId} />
                                    </ItemDescriptionContentText>
                                }
                                {
                                    _.time && <ItemDescriptionContentText>
                                        발견 시각 : {_.time}
                                    </ItemDescriptionContentText>
                                }
                                {
                                    _.occurancy && <ItemDescriptionContentText>
                                        유사율 : {(_.occurancy * 100).toFixed(0)}%
                                    </ItemDescriptionContentText>
                                }
                                {selectedType === ReIDObjectTypeKeys[ObjectTypes['FACE']] && <ItemDescriptionContentText>
                                    마스크 착용 여부 : 미착용
                                </ItemDescriptionContentText>}
                            </ItemDescriptionContents>
                        </ItemDescription>
                    </ItemSubContainer>
                    <ItemSelectBtn activate={_.selected} onClick={() => {
                        setDatas(datas.map(__ => _.id !== __.id ? __ : {
                            ..._,
                            selected: !_.selected
                        }))
                    }}>
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
    flex: 0 0 250px;
    ${globalStyles.flex({ gap: '4px' })}
    ${globalStyles.conditionDataItemBox}
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
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
`

const ItemDescriptionContentText = styled.div`
    color: white;
    width: 100%;
`