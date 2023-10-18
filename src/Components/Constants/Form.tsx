import { DetailedHTMLProps, FormEvent } from "react"

type FormType = DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>

const Form = (props?: {
    children?: JSX.Element | JSX.Element[]
    onSubmit?: (evt: FormEvent<HTMLFormElement>) => void
    className?: FormType['className']
    style?: FormType['style']
}) => {
    
    return <form
        onSubmit={e => {
            e.preventDefault()
            if(props?.onSubmit) {
                props.onSubmit(e)
            }
        }}
        className={props?.className}
        style={props?.style}
    >
        {props?.children}
        </form>
}

export default Form