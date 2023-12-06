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
    flex: 0 0 48px;
    border-radius: 100%;
`