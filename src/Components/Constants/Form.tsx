import { DetailedHTMLProps, FormEvent } from "react"

type FormType = DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>

const Form = ({onSubmit, children, ...props}: {
    children?: JSX.Element | JSX.Element[]
    onSubmit?: (evt: FormEvent<HTMLFormElement>) => void
    className?: FormType['className']
    style?: FormType['style']
    id?: FormType['id']
}) => {
    
    return <form
        autoComplete="off"
        onSubmit={e => {
            e.preventDefault()
            if(onSubmit) {
                onSubmit(e)
            }
        }}
        {...props}
    >
        {children}
        </form>
}

export default Form