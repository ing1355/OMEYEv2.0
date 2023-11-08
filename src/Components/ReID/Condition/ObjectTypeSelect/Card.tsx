import styled from "styled-components"
import { TextActivateColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"

type CardProps = {
    title: string
    onSelect: Function
    icon: string
}

const Card = ({title, onSelect, icon}: CardProps) => {
    return <Container onClick={() => {
        if(onSelect) onSelect()
    }}>
        <Icon src={icon} width="80%" height="45%"/>
        {title}
    </Container>
}

export default Card

const Container = styled(Button)`
    height: 60%;
    flex: 0 0 20%;
    ${globalStyles.flex({gap: '8rem'})}
    cursor: pointer;
    font-size: 2rem;
    &:hover {
        border-color: ${TextActivateColor};
    }
`

const Icon = styled.img`
`