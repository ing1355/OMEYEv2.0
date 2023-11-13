import styled from "styled-components"
import { ButtonActiveBackgroundColor, ButtonInActiveBackgroundColor, InputBackgroundColor } from "../../styles/global-styled"

type CategoryTagProps = {
    selected: boolean
    title: string
    onClick?: () => void
    description?: string
}

const CategoryTag = ({ title, selected, onClick, description }: CategoryTagProps) => {
    return <Tag selected={selected} onClick={onClick}>
        {title}
        {description && <DescriptionContainer>
            {description}
        </DescriptionContainer>}
    </Tag>
}

export default CategoryTag

const Tag = styled.div<{ selected: boolean }>`
    background-color: ${({ selected }) => selected ? ButtonActiveBackgroundColor : ButtonInActiveBackgroundColor};
    padding: 6px 12px;
    border: 0.5pt solid ${ButtonActiveBackgroundColor};
    border-radius: 16px;
    cursor: pointer;
    position: relative;
    & > div {
        display: none;
    }
    &:hover {
        & > div {
            display: block;
        }
    }
`

const DescriptionContainer = styled.div`
    position: absolute;
    left: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
    background-color: ${InputBackgroundColor};
    padding: 8px 16px;
    border-radius: 6px;
    max-width: 100px;
    word-break: keep-all;
    z-index: 1100;
`