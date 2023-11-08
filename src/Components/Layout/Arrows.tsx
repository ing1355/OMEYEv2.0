import styled from "styled-components"
import arrowIcon from '../../assets/img/downArrowIcon.png'
import { CSSProperties, PropsWithChildren } from "react"

type ArrowProps = {
    onClick: () => void
    disabled: boolean
}

const Arrow = ({style, children, onClick, disabled}: PropsWithChildren & ArrowProps & {
    style: CSSProperties
}) => {
    return <PaginationArrowContainer onClick={onClick} style={{...style, visibility: disabled ? 'hidden' : 'visible'}}>
        {children}
    </PaginationArrowContainer>
}

export const LeftArrow = ({ onClick, disabled }: ArrowProps) => {
    return <Arrow style={{
        transform: 'rotate(90deg)'
    }} onClick={onClick} disabled={disabled}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
    </Arrow>
}

export const RightArrow = ({ onClick, disabled }: ArrowProps) => {
    return <Arrow style={{
        transform: 'rotate(-90deg)'
    }} onClick={onClick} disabled={disabled}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
    </Arrow>
}

export const LeftDoubleArrow = ({ onClick, disabled }: ArrowProps) => {
    return <Arrow style={{
        transform: 'rotate(90deg)'
    }} onClick={onClick} disabled={disabled}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -70%)'
        }} />
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
    </Arrow>
}

export const RightDoubleArrow = ({ onClick, disabled }: ArrowProps) => {
    return <Arrow style={{
        transform: 'rotate(-90deg)'
    }} onClick={onClick} disabled={disabled}>
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -50%)'
        }} />
        <PaginationArrow src={arrowIcon} style={{
            transform: 'translate(-50%, -30%)'
        }} />
    </Arrow>
}

const PaginationArrowContainer = styled.div`
    height: 24px;
    width: 24px;
    cursor: pointer;
    position: relative;
`

const PaginationArrow = styled.img`
    width: 80%;
    height: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
`