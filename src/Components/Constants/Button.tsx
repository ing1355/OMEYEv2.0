import React, { DetailedHTMLProps, useRef } from "react"
import styled from "styled-components"
import { ButtonActiveBackgroundColor, ButtonBackgroundColor, ButtonBorderColor, ButtonDisabledBackgroundColor } from "../../styles/global-styled"

export type ButtonType = DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
type ConcepType = "default" | "activate" | "icon"

const Button = ({ icon, children, iconStyle, activate, concept, ...props }: ButtonType & {
    children?: JSX.Element | JSX.Element[] | React.ReactNode | string
    icon?: string
    iconStyle?: React.CSSProperties
    activate?: boolean
    concept?: ConcepType
}) => {
    const btnRef = useRef(null)
    return <StyledButton
        {...props}
        ref={btnRef}
        activate={activate || false}
        concept={concept || "default"}
        style={icon ? {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
        } : {}}
    >
        {icon && <Icon src={icon} style={iconStyle} />}
        {children}
    </StyledButton>
}

export default Button

const StyledButton = styled.button<{ activate: boolean, concept: ConcepType }>`
    ${({ concept, activate }) => concept === 'default' && `
        background-color: ${activate ? ButtonActiveBackgroundColor : ButtonBackgroundColor};
        border: 1px solid ${ButtonBorderColor};
    `}
    ${({ concept, activate }) => concept === 'activate' && `
        background-color: ${ButtonActiveBackgroundColor};
        &:disabled {
            background-color: ${ButtonDisabledBackgroundColor};
          }
    `}
    ${({ concept, activate }) => concept === 'icon' && `
        background-color: transparent;
    `}
    cursor: pointer;
`

const Icon = styled.img`
    height: 100%;
    width: 24px;
`