import { useEffect } from "react"
import { ChildrenType } from "../../global"
import Contents from "./Contents"
import Footer from "./Footer"
import Header from "./Header"

type LayoutProps = {
    children: ChildrenType
}

const Layout = ({ children }: LayoutProps) => {
    useEffect(() => {
        console.debug('layout effect')
        return () => {
            console.debug('layout out')
        }
    },[])
    return <>
        <Header />
        <Contents>
            {children}
        </Contents>
        <Footer/>
    </>
}

export default Layout