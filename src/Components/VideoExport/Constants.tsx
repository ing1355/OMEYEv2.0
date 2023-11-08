import styled from "styled-components"
import { VideoExportRowDataType } from "../../Model/VideoExportDataModel"
import { ButtonActiveBackgroundColor, ButtonInActiveBackgroundColor } from "../../styles/global-styled"

export const OptionTags = ({ options }: {
    options: VideoExportRowDataType['options']
}) => {
    if (!options) return <></>
    const { masking, password } = options
    return <>
        {masking.includes('area') && <Tag>영역 비식별화</Tag>}
        {masking.includes('head') && <Tag>얼굴 비식별화</Tag>}
        {masking.includes('carplate') && <Tag>번호판 비식별화</Tag>}
        {password && <Tag>암호화</Tag>}
    </>
}

const Tag = styled.div`
    background-color: ${ButtonInActiveBackgroundColor};
    padding: 2px 10px;
    border: 0.5pt solid ${ButtonActiveBackgroundColor};
    border-radius: 16px;
`