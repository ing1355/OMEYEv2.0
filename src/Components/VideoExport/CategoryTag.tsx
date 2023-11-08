import styled from "styled-components"
import { ButtonActiveBackgroundColor, ButtonInActiveBackgroundColor } from "../../styles/global-styled"

type CategoryTagProps = {
    selected: boolean
    title: string
    onClick?: () => void
}

const CategoryTag = ({title, selected, onClick}: CategoryTagProps) => {
    return <Tag selected={selected} onClick={onClick}>
        {title}
    </Tag>
}

export default CategoryTag

const Tag = styled.div<{selected: boolean}>`
    background-color: ${({selected}) => selected ? ButtonActiveBackgroundColor : ButtonInActiveBackgroundColor};
    padding: 6px 12px;
    border: 0.5pt solid ${ButtonActiveBackgroundColor};
    border-radius: 16px;
    cursor: pointer;
`