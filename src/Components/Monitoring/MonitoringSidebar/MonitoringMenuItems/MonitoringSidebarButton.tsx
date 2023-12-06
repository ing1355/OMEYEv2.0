import { PropsWithChildren, forwardRef } from "react"
import Button, { ButtonType } from "../../../Constants/Button"
import styled from "styled-components"

type MonitoringSidebarButtonProps = PropsWithChildren & ButtonType

const MonitoringSidebarButton = forwardRef(({ children, ...props }: MonitoringSidebarButtonProps, ref) => {
    
    return <SidebarButton {...props} ref={ref as any}>
        {children}
    </SidebarButton>
})

export default MonitoringSidebarButton

const SidebarButton = styled(Button)`
    flex: 0 0 52px;
    width: 52px;
    border-radius: 100%;
    padding: 6px;
    font-size: .8rem;
`