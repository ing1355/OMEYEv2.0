import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"
import Card from "./Card"
import { ObjectTypes, ReIDObjectTypes } from "../../ConstantsValues"
import { useSetRecoilState } from "recoil"
import useConditionRoutes from "../Hooks/useConditionRoutes"
import { ReIDConditionTargetSelectMethodRoute, ReIDConditionTargetSelectPersonDescriptionRoute } from "../Constants/RouteInfo"
import { ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"
import { conditionSelectedType } from "../../../../Model/ConditionDataModel"

const ObjectTypeSelect = () => {
    const setSelected = useSetRecoilState(conditionSelectedType)
    const { routePush } = useConditionRoutes()
    return <Container>
        {
            ReIDObjectTypes.map(_ => <Card key={_.key} title={_.title} icon={_.icon} onSelect={() => {
                setSelected(_.key)
                if(_.key === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']]) routePush(ReIDConditionTargetSelectPersonDescriptionRoute.key)
                else routePush(ReIDConditionTargetSelectMethodRoute.key)
            }}/>)
        }
    </Container>
}

export default ObjectTypeSelect

const Container = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '32px'})}
    ${globalStyles.fadeOut()}
`