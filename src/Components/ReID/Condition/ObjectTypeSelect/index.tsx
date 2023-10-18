import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"
import Card from "./Card"
import { ReIDObjectTypes } from "../../ConstantsValues"
import { useSetRecoilState } from "recoil"
import { selectedConditionObjectType } from "../../../../Model/ConditionDataModel"

const ObjectTypeSelect = () => {
    const setSelected = useSetRecoilState(selectedConditionObjectType)
    return <Container>
        {
            ReIDObjectTypes.map(_ => <Card key={_.key} title={_.title} icon={_.icon} onSelect={() => {
                if(setSelected) setSelected(_.key)
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