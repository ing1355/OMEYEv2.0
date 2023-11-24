import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import Button from "../Constants/Button"
import downArrowIcon from "../../assets/img/downArrowIcon.png"
import { SectionBackgroundColor, TextActivateColor, globalStyles } from "../../styles/global-styled"
import VisibleToggleContainer from "../Constants/VisibleToggleContainer"

export type DropdownItemType<T> = {
    key: T
    value: T
    label: T|string
}

export type DropdownProps<T> = {
    itemList: DropdownItemType<T>[]
    onChange?: (val: DropdownItemType<T>) => void
    className?: string
    defaultValue?: DropdownItemType<T>['value']
    disableFunc?: (val: DropdownItemType<T>) => boolean
    disableCallback?: () => void
    bodyStyle?: React.CSSProperties
}

const Dropdown = <T extends unknown>({ itemList, onChange, className, disableFunc, disableCallback, bodyStyle }: DropdownProps<T>) => {
    const [opened, setOpened] = useState(false)
    const [value, setValue] = useState<DropdownItemType<T>>(itemList[0])
    
    // useEffect(() => {
    //     if(defaultValue) {
    //         setValue(itemList.find(_ => _.value === defaultValue)!)
    //     }
    // },[opened])

    useEffect(() => {
        if (onChange) onChange(value)
    }, [value])

    return <DropdownContainer visible={opened} setVisible={setOpened}>
        <DropdownButton className={className} onClick={(e) => {
            setOpened(!opened)
        }} type="button">
            <>
                {value.label}
                <img src={downArrowIcon} style={{
                    height: '80%'
                }}/>
            </>
        </DropdownButton>
        <DropdownContentContainer opened={opened} style={bodyStyle}>
            {
                itemList.map(_ => <DropdownContentItem key={_.key as string} onClick={() => {
                    setOpened(false)
                    if(disableFunc) {
                        if(disableFunc(_)) {
                            if(disableCallback) return disableCallback()
                        }
                    }
                    setValue(_)
                }}>
                    {String(_.label)}
                </DropdownContentItem>)
            }
        </DropdownContentContainer>
    </DropdownContainer>
}

export default Dropdown

const DropdownContainer = styled(VisibleToggleContainer)`
    position: relative;
    width: 100%;
    height: 100%;
`

const DropdownButton = styled(Button)`
    width: 100%;
    height: 100%;
    padding: 4px 16px;
    ${globalStyles.flex({flexDirection:'row', gap: '8px'})}
`

const DropdownContentContainer = styled.div<{ opened: boolean }>`
    ${({ opened }) => ({
        display: opened ? 'block' : 'none',
    })}
    position: absolute;
    width: 100%;
    background-color: ${SectionBackgroundColor};
    top: 110%;
    border-radius: 12px;
`

const DropdownContentItem = styled.div`
    padding: 6px 0;
    &:hover {
        color: ${TextActivateColor};
        cursor: pointer;
    }
    text-align: center;
`