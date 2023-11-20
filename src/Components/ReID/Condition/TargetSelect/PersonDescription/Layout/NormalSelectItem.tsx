import styled from "styled-components"
import { DescriptionItemType } from "../DescriptionItems"
import { descriptionDataType } from "../DescriptionType"
import { ButtonActiveBackgroundColor, ContentsBorderColor, globalStyles } from "../../../../../../styles/global-styled"
import { CSSProperties } from "react"

type NormalSelectItemProps<T extends keyof descriptionDataType> = {
    item: DescriptionItemType<T, keyof descriptionDataType[T]>
    flex: CSSProperties['flex']
    selected: boolean
    onClick?: () => void
}

const NormalSelectItem = <T extends keyof descriptionDataType>({ item, flex, selected, onClick }: NormalSelectItemProps<T>) => {
    return <Container flex={flex} selected={selected} onClick={onClick}>
        <Icon src={item.icon} />
        <Title>
            {item.title}
            {
                item.subscription && <Subscription>
                    {item.subscription}
                </Subscription>
            }
        </Title>
    </Container>
}

export default NormalSelectItem

const Container = styled.div<{ flex: CSSProperties['flex'], selected: boolean }>`
    cursor: pointer;
    ${globalStyles.flex({ gap: '8%' })}
    flex: ${({ flex }) => `1 1 ${flex || '20%'}`};
    max-width: ${({ flex }) => flex || '20%'};
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
    height: 100%;
    ${({selected}) => selected && {
        backgroundColor: ButtonActiveBackgroundColor
    }};
    &:hover {
        border: 1px solid ${ButtonActiveBackgroundColor};
    }
`

const Icon = styled.img`
    max-height: 45%;
`

const Title = styled.div`
    font-size: 1.2rem;
    text-align: center;
`

const Subscription = styled.div`
    font-size: 1rem;
    text-align: center;
`