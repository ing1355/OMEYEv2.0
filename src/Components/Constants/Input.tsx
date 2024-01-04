import { DetailedHTMLProps, useEffect, useRef } from "react"
import styled from "styled-components"
import { InputBackgroundColor, InputTextColor, globalStyles } from "../../styles/global-styled"

type InputType = DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
type InputProps = {
    id?: string
    onChange?: (value: string) => void
    onInput?: InputType['onInput']
    maxLength?: InputType['maxLength']
    type?: InputType['type'] | 'textarea'
    value?: InputType['value']
    defaultValue?: InputType['defaultValue']
    className?: InputType['className']
    inputRef?: React.RefObject<any>
    placeholder?: InputType['placeholder']
    onKeyDown?: InputType['onKeyDown']
    onFocus?: InputType['onFocus']
    onBlur?: InputType['onBlur']
    onEnter?: InputType['onKeyDown']
    tabIndex?: InputType['tabIndex']
    pattern?: InputType['pattern']
    style?: InputType['style']
    disabled?: InputType['disabled']
    onClick?: InputType['onClick']
    onlyNumber?: boolean
    autoComplete?: InputType['autoComplete']
    autoFocus?: InputType['autoFocus']
    enableAsterisk?: boolean
    maxNumber?: number
    canEmpty?: boolean
    enableDot?: boolean
}

const _Input = (props?: InputProps) => {

    // useEffect(() => {
    //     if (props?.type === 'textarea') {
    //         if (!props?.value) {
    //             const target = props.inputRef?.current
    //             if (target) target.style.height = 36 + 'px'
    //         }
    //     }
    // }, [props?.value, props?.type])

    const attributes = {
        ref: props?.inputRef,
        maxLength: props?.maxLength ?? (props?.type === 'textarea' ? 300 : 16),
        type: props?.type ?? "text",
        value: props?.value,
        defaultValue: props?.defaultValue,
        className: props?.className,
        id: props?.id,
        disabled: props?.disabled,
        placeholder: props?.placeholder,
        autoComplete: props?.autoComplete || 'one-time-code',
        autoFocus: props?.autoFocus
    }
    const inputAttributes = {
        ...attributes,
        tabIndex: props?.tabIndex,
        pattern: props?.pattern
    }
    if (props?.type === 'textarea') return <TextAreaContainer className={props.className}>
        <textarea
        style={{
            resize: 'none',
            ...props.style,
            height: '36px'
        }}
        onInput={(e) => {
            const target = e.currentTarget
            const parent = e.currentTarget.parentElement
            target.style.height = '1px'
            if (target.scrollHeight < parent?.parentElement?.clientHeight!) {
                target.style.height = target.scrollHeight + 'px'
            } else {
                target.style.height = (parent?.parentElement?.clientHeight! - 12) + 'px'
            }
        }}
        onChange={(e) => {
            if (props?.onChange) {
                props.onChange(e.currentTarget.value)
            }
        }}
        onKeyDown={e => {
            e.stopPropagation()
        }}
        {...attributes}
    />
    </TextAreaContainer>
    else return <>
        <input
            onChange={(e) => {
                if (props?.onChange) {
                    props.onChange(e.currentTarget.value)
                }
            }}
            onFocus={props?.onFocus}
            onBlur={(e) => {
                if (props) {
                    if (props.onBlur) props.onBlur(e)
                    if (props.onlyNumber && props.onChange) {
                        if (e.currentTarget.value.length === 0 && !props.canEmpty) props.onChange('1')
                    }
                }
            }}
            role="presentation"
            style={{
                ...props?.style,
                letterSpacing: props?.type === 'password' ? '-4px' : 0
            }}
            onInput={e => {
                if (props?.onlyNumber) {
                    console.debug("test1 : ", e.currentTarget.value)
                    if (props?.enableAsterisk) e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\*]/g, '').replace(/(\..*)\./g, '$1')
                    else if (props.enableDot) {
                        let temp = e.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                        if (props.maxNumber) {
                            if (Number(temp) > props.maxNumber) temp = props.maxNumber.toString()
                        }
                        // if(temp.length === 0) temp = '0'
                        e.currentTarget.value = temp
                    } else {
                        let temp = e.currentTarget.value.replace(/[^0-9]/g, '')
                        if (props.maxNumber) {
                            if (Number(temp) > props.maxNumber) temp = props.maxNumber.toString()
                        }
                        // if(temp.length === 0) temp = '0'
                        e.currentTarget.value = temp
                    }
                    console.debug("test2 : ", e.currentTarget.value)
                }
                if (props?.onInput) {
                    props.onInput(e)
                }
            }}
            onClick={props?.onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && props?.onEnter) {
                    e.preventDefault()
                    e.stopPropagation()
                    props.onEnter(e)
                } else if (props?.onKeyDown) props.onKeyDown(e)
            }}
            {...inputAttributes}
        />
    </>
}

const TextAreaContainer = styled.div`
    ${globalStyles.flex()}
    max-height: 100%;
    min-height: 56px;
    background-color: ${InputBackgroundColor};
`

const Input = styled(_Input)`
    border: none;
    outline: none;
    border-radius: 6px;
    position: relative;
    text-align: center;
    color: ${InputTextColor};
    background-color: ${InputBackgroundColor};
    &:focus::-webkit-input-placeholder {
        color: transparent;
    }
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
        -webkit-transition-delay: 9999s;
    }
    &:disabled {
        opacity: 0.5;
    }
`

export default Input