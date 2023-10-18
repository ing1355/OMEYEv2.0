import logo from '../../assets/img/logo.png'

const Logo = ({className, onClick} : {
    className?: string
    onClick?: Function
}) => {
    return <img src={logo} className={className} onClick={() => {
        if(onClick) onClick()
    }}/>
}

export default Logo