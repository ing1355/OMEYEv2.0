import EditIcon from '../../assets/img/edit.png'
import DeleteIcon from '../../assets/img/delete.png'
import styled from 'styled-components'
import { globalStyles } from '../../styles/global-styled'

type IconBtnProps = {
    type: 'edit' | 'delete'
    onClick?: React.MouseEventHandler<HTMLDivElement>
    disabled?: boolean
}

const IconBtn = ({type, onClick, disabled}: IconBtnProps) => {
    return <IconContainer onClick={(e) => {
        if(onClick && !disabled) onClick(e)
    }} disabled={disabled || false}>
        <Icon src={type === 'edit' ? EditIcon : DeleteIcon}/>
    </IconContainer>
}

export default IconBtn

const IconContainer = styled.div<{disabled: boolean}>`
    height: 28px;
    padding: 4px;
    cursor: ${({disabled}) => disabled ? 'no-drop' : 'pointer'};
    ${globalStyles.flex()}
`

const Icon = styled.img`
    width: 100%;
    height: 100%;
`