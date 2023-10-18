import { DetailedHTMLProps, useEffect, useRef } from "react"
import styled from "styled-components"
import { InputBackgroundColor, InputTextColor } from "../../styles/global-styled"

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
    onEnter?: () => void
    tabIndex?: InputType['tabIndex']
    pattern?: InputType['pattern']
    style?: InputType['style']
    disabled?: InputType['disabled']
    onClick?: InputType['onClick']
    onlyNumber?: boolean
}

const _Input = (props?: InputProps) => {
    useEffect(() => {
        if(props?.type === 'textarea') {
            if(!props?.value) {
                const target = props.inputRef?.current
                target.style.height = 30 + 'px'
            }
        }
    },[props?.value, props?.type])
    const attributes = {
        ref: props?.inputRef,
        maxLength: props?.maxLength ?? (props?.type === 'textarea' ? 300 : 16),
        type: props?.type ?? "text",
        value: props?.value,
        defaultValue: props?.defaultValue,
        className: props?.className,
        id: props?.id,
        disabled: props?.disabled,
        placeholder: props?.placeholder
    }
    const inputAttributes = {
        ...attributes,
        tabIndex: props?.tabIndex,
        pattern: props?.pattern,
        style: props?.style
    }
    if (props?.type === 'textarea') return <textarea
        style={{
            resize: 'none',
        }}
        onInput={(e) => {
            const target = e.currentTarget
            target.style.height = 1 + 'px'
            if((4 + target.scrollHeight < target.parentElement?.clientHeight!)) {
                target.style.height = (4 + target.scrollHeight) + 'px'
            } else {
                target.style.height = (target.parentElement?.clientHeight! - 12) + 'px'
            }
        }}
        onChange={(e) => {
            if (props?.onChange) {
                props.onChange(e.currentTarget.value)
            }
        }}
        {...attributes}
    />
    else return <input
        onChange={(e) => {
            if (props?.onChange) {
                props.onChange(e.currentTarget.value)
            }
        }}
        onFocus={props?.onFocus}
        onBlur={props?.onBlur}
        onInput={e => {
            if(props?.onlyNumber) {
                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            }
            if(props?.onInput) {
                props.onInput(e)
            }
        }}
        onClick={props?.onClick}
        onKeyDown={(e) => {
            if(e.key === 'Enter' && props?.onEnter) {
                e.preventDefault()
                props.onEnter()
            } else if(props?.onKeyDown) props.onKeyDown(e)
        }}
        {...inputAttributes}
    />
}

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
`

export default Input