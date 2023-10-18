import { CSSProperties } from 'react'
import downArrowIcon from '../../assets/img/downArrowIcon.png'

type CollapseArrowProps = {
    opened: boolean
    className?: string
    width?: CSSProperties['width']
    height?: CSSProperties['height']
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
}

const CollapseArrow = ({opened, className, width, height, onClick}: CollapseArrowProps) => {
    return  <img src={downArrowIcon} className={className} style={{
        rotate: opened ? '-180deg' : '0deg',
        transition: 'all .1s ease-out',
        width: width + 'px',
        height: height + 'px',
        cursor: 'pointer'
    }} onClick={onClick} />
}

export default CollapseArrow