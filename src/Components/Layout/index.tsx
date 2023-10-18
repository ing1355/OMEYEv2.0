import { ChildrenType } from "../../global"
import Contents from "./Contents"
import Header from "./Header"

type LayoutProps = {
    children: ChildrenType
}

const Layout = ({ children }: LayoutProps) => {
    return <>
        <Header />
        <Contents>
            {children}
        </Contents>
    </>
}

export default Layout