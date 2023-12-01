import styled from "styled-components"
import { globalStyles } from "../../../styles/global-styled"
import CategoryTag from "../CategoryTag"
import { useEffect, useRef, useState } from "react"
import { VideoExportCategoryType, VideoExportSearchParamsType, useVideoExportHistories } from "../../../Model/VideoExportDataModel"
import HistoryItem from "./HistoryItem"
import Pagination from "../../Layout/Pagination"

const categories: VideoExportCategoryType[] = ["영역 비식별화", "얼굴 비식별화", "번호판 비식별화"]

const ExportHistory = ({ visible }: {
    visible: boolean
}) => {
    const [category, setCategory] = useState<VideoExportCategoryType[]>([])
    const [params, _setParams] = useState<VideoExportSearchParamsType>({
        page: 1,
        size: 9
    })
    const { logs, refresh, setParams } = useVideoExportHistories(params)

    useEffect(() => {
        if (visible) setParams(params)
    }, [params])

    useEffect(() => {
        if (visible) refresh()
    }, [visible])

    return <Container>
        {/* <Header>
            <HeaderLabel>
                카테고리로 보기 :
            </HeaderLabel>
            <HeaderCategoryContainer>
                {categories.map((_, ind) => <CategoryTag key={ind} title={_} selected={category.includes(_)} onClick={() => {
                    if (category.includes(_)) {
                        setCategory(category.filter(__ => _ !== __))
                    } else {
                        setCategory(category.concat(_))
                    }
                }} />)}
            </HeaderCategoryContainer>
        </Header> */}
        <Contents>
            {
                logs.state === 'RUNNING' ? <NoDataTitle>
                    반출 영상 이력을 불러오는 중입니다.
                </NoDataTitle> : (logs.data.totalCount > 0 ? <>
                    <ListContainer>
                        {logs.data.results.map((_, ind) => <HistoryItem item={_} key={ind} />)}
                    </ListContainer>
                    <Pagination currentPage={params.page} setCurrentPage={page => {
                        _setParams({ ...params, page })
                    }} totalCount={logs.data.totalCount} dataPerPage={params.size} />
                </> : <NoDataTitle>
                    반출 영상 이력이 존재하지 않습니다.
                </NoDataTitle>)
            }
        </Contents>
    </Container>
}

export default ExportHistory

const Container = styled.div`
    ${globalStyles.flex({ gap: '8px' })}
    height: 100%;
`

const Header = styled.div`
    height: 40px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const HeaderLabel = styled.div`
    font-size: 1.3rem;
`

const HeaderCategoryContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
`

const Contents = styled.div`
    height: 100%;
    width: 100%;
`

const NoDataTitle = styled.div`
    ${globalStyles.flex()}
    width: 100%;
    height: 100%;
    font-size: 2rem;
`

const ListContainer = styled.div`
    height: ${window.innerHeight - 300}px;
    width: 100%;
    overflow: auto;
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', gap: '1%', alignItems: 'stretch', justifyContent: 'flex-start' })}
`