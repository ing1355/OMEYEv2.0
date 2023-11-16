import styled from "styled-components"
import { DescriptionColorItemType } from "../DescriptionItems"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../../../styles/global-styled"
import { descriptionColorType } from "../DescriptionType"

type ColorSelectItemProps = {
    _key: descriptionColorType
    title: DescriptionColorItemType['title']
    value: DescriptionColorItemType['value']
    onClick: () => void
    selected: boolean
}

const ColorSelectItem = ({ title, _key, value, onClick, selected }: ColorSelectItemProps) => {
    return <Container onClick={onClick}>
        <Color value={value} selected={selected}/>
        <Title>
            {title}
        </Title>
    </Container>
}

export default ColorSelectItem

const Container = styled.div`
    cursor: pointer;
    ${globalStyles.flex()}
    flex: 0 0 ${100 / 8}%;
    height: 50%;
`

const Color = styled.div<{value: DescriptionColorItemType['value'], selected: boolean}>`
    background-color: ${({value}) => value};
    ${({selected}) => selected && `border: 3px solid ${ContentsActivateColor};`}
    width: 100%;
    flex: 1;
    border-radius: 12px;
    border: 1px solid ${ContentsBorderColor};
`

const Title = styled.div`
    font-size: 1.2rem;
    ${globalStyles.flex()}
    flex: 0 0 36px;
`