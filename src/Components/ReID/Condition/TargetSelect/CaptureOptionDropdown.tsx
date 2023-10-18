import styled from "styled-components"
import { CaptureType } from "../../../../Constants/GlobalTypes"
import Dropdown, { DropdownItemType } from "../../../Layout/Dropdown"

const dropdownItems: DropdownItemType<CaptureType>[] = [
    {
        key: 'auto',
        value: 'auto',
        label: '자동 탐지'
    },
    {
        key: 'user',
        value: 'user',
        label: '사용자 지정'
    }
]

type CaptureOptionDropdownProps = {
    onChange?: (val: CaptureType) => void
}

const CaptureOptionDropdown = ({ onChange }: CaptureOptionDropdownProps) => {
    return <DropdownContainer>
        <Dropdown<CaptureType> itemList={dropdownItems} onChange={(val) => {
            if (onChange) onChange(val.value)
        }} />
    </DropdownContainer>
}

export default CaptureOptionDropdown

const DropdownContainer = styled.div`
    flex: 0 0 45%;
    height: 40px;
`