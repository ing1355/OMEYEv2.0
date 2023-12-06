import { useRecoilState, useRecoilValue } from "recoil"
import ConditionParamsInputColumnComponent from "./ConditionParamsInputColumnComponent"
import { conditionIsRealTimeData, conditionTargetDatas } from "../../../../Model/ConditionDataModel"
import styled from "styled-components"
import { ButtonBackgroundColor, ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../styles/global-styled"
import useConditionRoutes from "../Hooks/useConditionRoutes"
import { ObjectTypeSelectRoute } from "../Constants/RouteInfo"
import ImageView from "../Constants/ImageView"
import Button from "../../../Constants/Button"
import { useEffect, useRef, useState } from "react"
import IconBtn from "../../../Constants/IconBtn"
import TargetDescriptionByType from "../Constants/TargetDescriptionByType"
import useMessage from "../../../../Hooks/useMessage"
import checkIcon from '../../../../assets/img/checkIcon.png'
import emptyCheckIcon from '../../../../assets/img/emptyCheckIcon.png'
import targetIcon from '../../../../assets/img/targetIcon.png'

export type PlateStatusType = 'none' | 'add' | 'update'

const TargetSelectColumn = () => {
    const [datas, setDatas] = useRecoilState(conditionTargetDatas)
    const isRealTime = useRecoilValue(conditionIsRealTimeData)
    const { routePush } = useConditionRoutes()
    const scrollRef = useRef<HTMLDivElement>(null)
    const datasRef = useRef(datas)
    const message = useMessage()

    const initAction = () => {
        setDatas([])
    }

    const addAction = () => {
        routePush(ObjectTypeSelectRoute.key)
    }

    const allSelectAction = () => {
        setDatas(datas.every(_ => _.selected) ? datas.map(_ => ({ ..._, selected: false })) : datas.map(_ => ({ ..._, selected: true })))
    }

    useEffect(() => {
        if(datasRef.current.length < datas.length) {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
        datasRef.current = datas
    },[datas])

    return <ConditionParamsInputColumnComponent
            title={`대상(${datas.filter(_ => _.selected).length}/${datas.length})`}
            isTarget
            initAction={initAction}
            titleIcon={targetIcon}
            dataAddAction={addAction}
            noDataText="대상 추가"
            isDataExist={datas.length > 0}
            allSelectAction={allSelectAction}
            scrollRef={scrollRef}
            allSelected={datas.length > 0 && datas.every(_ => _.selected)}>
            {datas.map((_, ind) => <ItemContainer key={ind} selected={_.selected || false} onClick={() => {
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
                                <Check selected={_.selected || false}>
                                    <img src={_.selected ? checkIcon : emptyCheckIcon}/>
                                </Check>
                            </ItemHeader>
                            <ImageView src={_.src} style={{
                                height: '300px'
                            }}/>
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
            </ItemContainer>)}
        </ConditionParamsInputColumnComponent>
}

export default TargetSelectColumn

const Container = styled.div`
    ${globalStyles.conditionParamsColumnContainer}
`

const ItemContainer = styled.div<{ selected: boolean }>`
    width: 100%;
    max-height: 340px;
    flex: 0 0 300px;
    ${globalStyles.flex({ gap: '4px' })}
    ${globalStyles.conditionDataItemBox}
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    cursor: pointer;
    &:hover {
        background-color: ${ButtonBackgroundColor};
    }
`

const ItemSubContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row' })}
    height: 100%;
`

const ItemImage = styled.div`
    height: calc(100% - 32px);
`

const ItemDescription = styled.div`
    flex: 0 0 60%;
    height: 100%;
    overflow: auto;
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
    width: 100%;
    flex: 0 0 calc(100% - 28px);
    max-height: 362px;
    padding: 0px 6px;
    ${globalStyles.flex({ gap: '10px', justifyContent:'flex-start' })}
    overflow-wrap: anywhere;
    overflow: auto;
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

const Check = styled.div<{selected: boolean}>`
    height: 100%;
    width: 20px;
    border: 1px solid ${({selected}) => selected ? ContentsActivateColor : 'white'};
    border-radius: 50%;
    padding: 4px;
    & > img {
        width: 100%;
        height: 100%;
    }
`