import { useRecoilState, useRecoilValue } from "recoil"
import { contextMenuVisible } from "../../Model/ContextMenuModel"
import { useCallback, useEffect } from "react"
import styled from "styled-components"
import { GlobalBackgroundColor, TextActivateColor, globalStyles } from "../../styles/global-styled"
import { GetObjectIdByImage } from "../../Functions/NetworkFunctions"
import { conditionTargetDatas } from "../../Model/ConditionDataModel"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "./Condition/Constants/Params"
import { getLastTargetListId } from "./Condition/Constants/ImageViewWithCanvas"
import { ReIDObjectTypeKeys } from "../../Constants/GlobalTypes"
import { ObjectTypes } from "./ConstantsValues"

const ContextMenu = () => {
    const [contextVisible, setContextVisible] = useRecoilState(contextMenuVisible)
    const filteredType = contextVisible ? (contextVisible.type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']] ? ReIDObjectTypeKeys[ObjectTypes['PERSON']] : contextVisible.type) : null
    const [targetDatas, setTargetDatas] = useRecoilState(conditionTargetDatas(filteredType))

    const clickCallback = useCallback((e: MouseEvent) => {
        setContextVisible(null)
    }, [])

    useEffect(() => {
        if (contextVisible) {
            window.addEventListener('click', clickCallback, {
                once: true
            })
        }
    }, [contextVisible])
    
    return <>
        {contextVisible && <ContextContainer style={{
            left: contextVisible.left,
            top: contextVisible.top
        }} onClick={async () => {
            const res = await GetObjectIdByImage([{
                type: filteredType!,
                image: contextVisible.data.imgUrl
            }])
            if(res) {
                const {data} = contextVisible
                const {cctvId, imgUrl, accuracy} = data
                setTargetDatas([...targetDatas, {
                    type: filteredType!,
                    cctvId,
                    selected: false,
                    src: imgUrl,
                    objectId: res[0],
                    accuracy,
                    id: getLastTargetListId(),
                    method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['REIDRESULT']]
                }])
            }
            setContextVisible(null)
        }}>
            대상으로 추가
        </ContextContainer>}
    </>
}

export default ContextMenu

const ContextContainer = styled.div`
    width: 100px;
    height: 30px;
    background-color: ${GlobalBackgroundColor};
    ${globalStyles.flex()}
    position: absolute;
    z-index: 1100;
    color: white;
    border-radius: 4px;
    &:hover {
        cursor: pointer;
        color: ${TextActivateColor};
    }
`