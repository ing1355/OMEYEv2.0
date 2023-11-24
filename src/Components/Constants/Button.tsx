import React, { CSSProperties, DetailedHTMLProps, useRef } from "react"
import styled from "styled-components"
import { ButtonActiveBackgroundColor, ButtonBackgroundColor, ButtonBorderColor, ButtonDisabledBackgroundColor, ButtonActivateHoverColor, ButtonDefaultHoverColor } from "../../styles/global-styled"

export type ButtonType = DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
type ConcepType = "default" | "activate" | "icon"

const Button = ({ icon, children, iconStyle, activate, concept, onClick, ...props }: ButtonType & {
    children?: JSX.Element | JSX.Element[] | React.ReactNode | string
    icon?: string
    iconStyle?: CSSProperties
    activate?: boolean
    concept?: ConcepType
    hover?: boolean
    hoverBorder?: boolean
}) => {
    const btnRef = useRef(null)
    const clickedRef = useRef(false)
    
    return <StyledButton
        {...props}
        onClick={(e) => {
            if(!clickedRef.current) {
                clickedRef.current = true
                if(onClick) {
                    onClick(e)
                }
                e.currentTarget.blur()
                setTimeout(() => {
                    clickedRef.current = false
                }, 300);
            }
        }}
        ref={btnRef}
        activate={activate || false}
        concept={concept || "default"}
        type={props.type || "button"}
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

const StyledButton = styled.button<{ activate: boolean, concept: ConcepType, hover?: boolean, hoverBorder?: boolean }>`
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
    ${({ hover, activate }) => hover && `
        &:not(:disabled):hover {
            background-color: ${activate ? ButtonActivateHoverColor : ButtonDefaultHoverColor};
        }
    `}
    ${({ hoverBorder }) => hoverBorder && `
        &:not(:disabled):hover {
            border: 1px solid ${ButtonActiveBackgroundColor};
        }
    `}
    cursor: pointer;
    &:disabled {
        opacity: 0.5;
    }
    outline: none;
`

const Icon = styled.img`
    height: 100%;
    width: 24px;
`