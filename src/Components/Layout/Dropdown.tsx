import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import Button from "../Constants/Button"
import downArrowIcon from "../../assets/img/downArrowIcon.png"
import { SectionBackgroundColor, TextActivateColor, globalStyles } from "../../styles/global-styled"

export type DropdownItemType<T> = {
    key: T
    value: T
    label: string
}

export type DropdownProps<T> = {
    itemList: DropdownItemType<T>[]
    onChange?: (val: DropdownItemType<T>) => void
    className?: string
    value?: DropdownItemType<T>['value']
}

const Dropdown = <T extends unknown>({ itemList, onChange, className, value }: DropdownProps<T>) => {
    const [opened, setOpened] = useState(false)
    const openedRef = useRef(opened)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [_value, _setValue] = useState<DropdownItemType<T>>(itemList[0])
    
    useEffect(() => {
        if(value) {
            _setValue(itemList.find(_ => _.value === value)!)
        }
    },[value])

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            event.preventDefault()
            event.stopPropagation()
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpened(false);
            }
        }
    }, []);

    useLayoutEffect(() => {
        openedRef.current = opened
        if (opened) {
            window.addEventListener('click', handleMouseDown)
        } else {
            window.removeEventListener('click', handleMouseDown)
        }
    }, [opened])

    useEffect(() => {
        if (onChange) onChange(_value)
    }, [_value])

    return <DropdownContainer ref={dropdownRef}>
        <DropdownButton className={className} onClick={(e) => {
            setOpened(!opened)
        }} type="button">
            <>
                {_value.label}
                <img src={downArrowIcon} style={{
                    height: '80%'
                }}/>
            </>
        </DropdownButton>
        <DropdownContentContainer opened={opened}>
            {
                itemList.map(_ => <DropdownContentItem key={_.key as string} onClick={() => {
                    setOpened(false)
                    _setValue(_)
                }}>
                    {_.label}
                </DropdownContentItem>)
            }
        </DropdownContentContainer>
    </DropdownContainer>
}

export default Dropdown

const DropdownContainer = styled.div`
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
        display: opened ? 'block' : 'none'
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