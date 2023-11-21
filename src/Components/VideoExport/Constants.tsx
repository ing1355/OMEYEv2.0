import styled from "styled-components"
import { VideoExportRowDataType } from "../../Model/VideoExportDataModel"
import { ButtonActiveBackgroundColor, ButtonInActiveBackgroundColor } from "../../styles/global-styled"
import CategoryTag from "./CategoryTag"

export const OptionTags = ({ options }: {
    options: VideoExportRowDataType['options']
}) => {
    if (!options) return <></>
    const { masking, password, description } = options
    return <>
        {/* {description && <CategoryTag selected title="비고" description={description}/>} */}
        {masking.includes('area') && <CategoryTag title="영역 비식별화"/>}
        {masking.includes('head') && <CategoryTag title="얼굴 비식별화"/>}
        {masking.includes('carplate') && <CategoryTag title="번호판 비식별화"/>}
        {password && <CategoryTag title="암호화"/>}
    </>
}

const Tag = styled.div`
    background-color: ${ButtonInActiveBackgroundColor};
    padding: 2px 10px;
    border: 0.5pt solid ${ButtonActiveBackgroundColor};
    border-radius: 16px;
`