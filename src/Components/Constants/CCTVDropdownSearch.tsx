import styled from "styled-components"
import Input from "./Input"
import { GlobalBackgroundColor, InputTextColor, TextActivateColor } from "../../styles/global-styled"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import { GetAllSiteCameras, SitesData } from "../../Model/SiteDataModel"
import { CameraDataType } from "../../Constants/GlobalTypes"
import useThrottle from "../../Hooks/useThrottle"
import VisibleToggleContainer from "./VisibleToggleContainer"

type DropdownSearchProps = {
    onChange: (value: CameraDataType) => void
}

const nodeHeight = 30

const CCTVDropdownSearch = ({ onChange }: DropdownSearchProps) => {
    const [searchInputValue, setSearchInputValue] = useState('')
    const [searchInputOpen, setSearchOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const allCameras = useRecoilValue(GetAllSiteCameras)
    const viewList = useMemo(() => {
        if(searchInputOpen) {
            console.time("viewList")
            const temp = allCameras.filter(_ => searchInputValue ? _.name.includes(searchInputValue) : true)
            console.timeEnd("viewList")
            return temp
        } else {
            return []
        }
    }, [allCameras, searchInputValue, searchInputOpen])
    const viewListRef = useRef(viewList)
    const arrowUpIsDown = useRef(false)
    const arrowDownIsDown = useRef(false)
    const arrowUpTimer = useRef<NodeJS.Timeout>()
    const arrowDownTimer = useRef<NodeJS.Timeout>()
    const arrowUpDownTimer = useRef<NodeJS.Timer>()
    const arrowDownDownTimer = useRef<NodeJS.Timer>()
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const throttling = useThrottle()

    useEffect(() => {
        setSelectedIndex(0)
    }, [searchInputOpen])

    useEffect(() => {
        if (containerRef.current) {
            if (selectedIndex * nodeHeight < containerRef.current.scrollTop) {
                containerRef.current.scrollTo({
                    top: selectedIndex * nodeHeight
                })
            } else if ((selectedIndex - 2) * nodeHeight > containerRef.current.scrollTop) {
                containerRef.current.scrollTo({
                    top: (selectedIndex - 2) * nodeHeight
                })
            }
        }
    }, [selectedIndex])

    const clearArrowDown = useCallback(() => {
        if (arrowDownTimer.current) clearTimeout(arrowDownTimer.current)
        if (arrowDownDownTimer.current) clearInterval(arrowDownDownTimer.current)
        arrowDownIsDown.current = false
    }, [])

    const clearArrowUp = useCallback(() => {
        if (arrowUpTimer.current) clearTimeout(arrowUpTimer.current)
        if (arrowUpDownTimer.current) clearInterval(arrowUpDownTimer.current)
        arrowUpIsDown.current = false
    }, [])

    const keyDownCallback = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' && !arrowDownIsDown.current) {
            if (arrowUpIsDown.current) clearArrowUp()
            arrowDownIsDown.current = true
            setSelectedIndex(_ => viewListRef.current.length === 0 ? 0 : (_ === viewListRef.current.length - 1 ? viewListRef.current.length - 1 : _ + 1))
            arrowDownTimer.current = setTimeout(() => {
                arrowDownDownTimer.current = setInterval(() => {
                    setSelectedIndex(_ => viewListRef.current.length === 0 ? 0 : (_ === viewListRef.current.length - 1 ? viewListRef.current.length - 1 : _ + 1))
                }, 66)
            }, 125);
        } else if (e.key === 'ArrowUp' && !arrowUpIsDown.current) {
            if (arrowDownIsDown.current) clearArrowDown()
            arrowUpIsDown.current = true
            setSelectedIndex(_ => viewListRef.current.length === 0 ? 0 : (_ === 0 ? 0 : _ - 1))
            arrowUpTimer.current = setTimeout(() => {
                arrowUpDownTimer.current = setInterval(() => {
                    setSelectedIndex(_ => viewListRef.current.length === 0 ? 0 : (_ === 0 ? 0 : _ - 1))
                }, 66)
            }, 125);
        }
    }, [])

    const keyUpCallback = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            clearArrowDown()
        } else if (e.key === 'ArrowUp') {
            clearArrowUp()
        }
    }, [])

    useEffect(() => {
        if (viewList.length > 0) {
            document.addEventListener('keydown', keyDownCallback)
            document.addEventListener('keyup', keyUpCallback)
        } else {
            document.removeEventListener('keydown', keyDownCallback)
            document.removeEventListener('keyup', keyUpCallback)
        }
        viewListRef.current = viewList
    }, [viewList])

    useEffect(() => {
        setSelectedIndex(0)
    }, [searchInputValue])

    return <SearchControlContainer visible={searchInputOpen} setVisible={setSearchOpen} callback={() => {
        if(inputRef.current) inputRef.current.blur()
    }}>
        <SearchInput
            maxLength={40}
            defaultValue={searchInputValue}
            inputRef={inputRef}
            onChange={val => {
                setSearchOpen(false)
                throttling(() => {
                    setSearchInputValue(val)
                    setSearchOpen(true)
                }, 400)
            }}
            onFocus={(e) => {
                setSearchInputValue('')
                e.currentTarget.value = ''
                setSearchOpen(true)
            }}
            onEnter={(e) => {
                const target = viewList[selectedIndex]
                if (target) {
                    onChange(target)
                    // setSearchInputValue(target.name)
                    setSearchOpen(false)
                    e.currentTarget!.value = target.name
                    e.currentTarget.blur()
                }
            }}
            onKeyDown={e => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault()
            }}
            placeholder="CCTV 이름으로 검색"
        />
        <SearchAutoCompleteContaier ref={containerRef} opened={searchInputOpen}>
            {
                searchInputOpen && viewList.map((_, ind) => <SearchAutoCompleteItem
                    selected={ind === selectedIndex}
                    key={_.cameraId}
                    onClick={() => {
                        onChange(_)
                        setSearchInputValue(_.name)
                        inputRef.current!.value = _.name
                        setSearchOpen(false)
                    }}>
                    {_.name}
                </SearchAutoCompleteItem>)
            }
        </SearchAutoCompleteContaier>
    </SearchControlContainer>
}

export default CCTVDropdownSearch

const SearchControlContainer = styled(VisibleToggleContainer)`
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 1001;
    height: 30px;
    width: 240px;
    z-index: 1006;
`

const SearchInput = styled(Input)`
    width: 100%;
    height: 100%;
    padding: 4px 8px;
`

const SearchAutoCompleteContaier = styled.div<{ opened: boolean }>`
    position: absolute;
    top: 110%;
    left: 0;
    border-radius: 6px;
    width: 100%;
    min-height: 30px;
    max-height: 180px;
    overflow-x: hidden;
    overflow-y: auto;
    display: ${({ opened }) => opened ? 'block' : 'none'};
`

const SearchAutoCompleteItem = styled.div<{ selected: boolean }>`
    width: 100%;
    height: ${nodeHeight}px;
    background-color: ${GlobalBackgroundColor};
    color: ${({ selected }) => selected ? TextActivateColor : InputTextColor};
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    padding: 4px 8px;
    line-height: 26px;
    &:hover {
        color: ${TextActivateColor};
    }
`