import styled from "styled-components"
import Button from "../Constants/Button"
import AllExportIcon from '../../assets/img/allExportIcon.png'
import { SectionBackgroundColor, TextActivateColor, globalStyles } from "../../styles/global-styled"
import { useState } from "react"
import NewExport from "./NewExport"
import ExportHistory from "./ExportHistory"

type VideoExportCategoryType = 'new' | 'list'

const ViewByCategory = ({ type }: {
    type: VideoExportCategoryType
}) => {
    return <>
        <ChangedView selected={type === 'new'}>
            <NewExport />
        </ChangedView>
        <ChangedView selected={type === 'list'}>
            <ExportHistory visible={type === 'list'}/>
        </ChangedView>
    </>
}

const VideoExport = () => {
    const [category, setCategory] = useState<VideoExportCategoryType>('new')
    return <Container>
        <Header>
            <CategoryBtn selected={category === 'new'} onClick={() => {
                setCategory('new')
            }}>
                신규반출
            </CategoryBtn>
            <CategoryBtn selected={category === 'list'} onClick={() => {
                setCategory('list')
            }}>
                반출 이력
            </CategoryBtn>
            {/* {category === 'new' && <>
                <AllExportBtn activate={true} icon={AllExportIcon}>
                    모두 반출하기
                </AllExportBtn>
            </>} */}
        </Header>
        <Contents>
            <ViewByCategory type={category} />
        </Contents>
    </Container>
}

export default VideoExport

const Container = styled.div`
    ${globalStyles.flex({ gap: '12px' })}
    height: 100%;
    width: 100%;
    padding: 12px 24px;
`

const Header = styled.div`
    width: 100%;
    height: 40px;
    position: relative;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const CategoryBtn = styled.div<{ selected: boolean }>`
    padding: 8px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    color: ${({ selected }) => selected ? TextActivateColor : 'white'}
`

const AllExportBtn = styled(Button)`
    position: absolute;
    height: 100%;
    right: 0px;
    top: 0px;
`

const Contents = styled.div`
    width: 100%;
    height: calc(100% - 52px);
`

const ChangedView = styled.div<{ selected: boolean }>`
    width: 100%;
    height: 100%;
    display: ${({ selected }) => selected ? 'block' : 'none'};
    ${globalStyles.fadeOut()}
    padding: 24px;
    border-radius: 10px;
    background-color: ${SectionBackgroundColor};
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
`