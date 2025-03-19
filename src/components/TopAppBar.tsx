import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useDebounce } from "../hooks/useDebounce"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import { fetchUsers, inputFilter, setSearchQuery, setSelectedDepartment, sortByAlphabet, sortByBirthday } from "../store/slices/usersSlice"
import Modal from "./Modal"
import searchIcon from "./../assets/SearchIcon.svg"
import focusedSearchIcon from "./../assets/FocusedSearchIcon.svg"
import modalIcon from "./../assets/ModalIcon.svg"
import darkThemeIcon from "./../assets/DarkTheme.svg"
import lightThemeIcon from "./../assets/LightTheme.svg"
import birthdayModalIcon from "./../assets/BirthdayModalIcon.svg"
import { displayedDepartments, reverseTransformDepartment, transformDepartment } from "../utils/usersUtils"
import useNetworkStatus from "../hooks/useNetworkStatus"
import { ThemeState, toggleTheme } from "../store/slices/themeSlice"

const Container = styled.div``

const TitleContainer = styled.div<{ $isOnline: boolean; $isLoading: boolean }>`
    padding: 0 32px 0 32px;
    height: 48px;
    align-content: center;
    display: flex;
    flex-wrap: wrap;
    color: ${({ $isOnline, $isLoading }) => (!$isOnline || $isLoading ? " #ffffff;" : "")}
    background: ${({ $isOnline, $isLoading }) => (!$isOnline && "#f44336") || ($isLoading && "#6534ff")};
`

const Title = styled.h1<{ $mainFont: ThemeState["mainFont"] }>`
    margin: 8px 0 0 0;
    font-size: 24px;
    height: 29px;
    color: ${({ $mainFont }) => $mainFont};
    transition: color 0.3s ease, background 0.3s ease;
`

const ThemeBlock = styled.div`
    margin: 8px 0 0 auto;
    width: 29px;
    height: 29px;
    cursor: pointer;
    position: relative;
`

const ThemeIcon = styled.img<{ $visible: boolean }>`
    display: ${({ $visible }) => ($visible ? "" : "none")};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const SearchContainer = styled.div<{ $isOnline: boolean; $isLoading: boolean }>`
    padding: 0 32px 0 32px;
    height: 52px;
    align-content: center;
    background: ${({ $isOnline, $isLoading }) => (!$isOnline && "#f44336") || ($isLoading && "#6534ff")};
`

const SearchWrapper = styled.div<{ $visible: boolean; $auxiliaryBackground: ThemeState["auxiliaryBackground"] }>`
    display: ${({ $visible }) => ($visible ? "flex" : "none")};
    height: 40px;
    padding: 8px 12px 8px 12px;
    box-sizing: border-box;
    flex-wrap: wrap;
    flex-direction: row;
    border: 0;
    border-radius: 16px;
    background: ${({ $auxiliaryBackground }) => $auxiliaryBackground};
    align-content: center;
    transition: color 0.3s ease, background 0.3s ease;
`

const SearchInput = styled.input<{ $auxiliaryBackground: ThemeState["auxiliaryBackground"]; $mainFont: ThemeState["mainFont"] }>`
    width: 80%;
    border: none;
    outline: none;
    height: 24px;
    background: ${({ $auxiliaryBackground }) => $auxiliaryBackground};
    color: ${({ $mainFont }) => $mainFont};
    flex: 1;
    font-weight: 400;
    font-size: 15px;
    caret-color: #6534ff;
    transition: color 0.3s ease, background 0.3s ease;

    &::placeholder {
        color: #c3c3c6;
    }
`

const SearchIconWrapper = styled.div`
    display: grid;
    width: 24px;
    height: 24px;
    align-content: center;
    justify-content: center;
    position: relative;
`

const InputIcon = styled.img<{ $visible: boolean }>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.3s ease;
`

const ModalButtonWrapper = styled.div`
    display: grid;
    width: 24px;
    height: 24px;
    align-content: center;
    justify-content: center;
    cursor: pointer;
    margin-left: auto;
    position: relative;
`

const NetworkStatusElement = styled.div<{ $isOnline: boolean; $isLoading: boolean }>`
    display: flex;
    padding: 8px 24px 12px 24px;
    box-sizing: border-box;
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
    background: ${({ $isOnline, $isLoading }) => (!$isOnline && "#f44336") || ($isLoading && "#6534ff")};
`

const Tabs = styled.div`
    padding: 0 32px 0 32px;
    display: flex;
    gap: 16px;
    margin-top: 8px;
    height: 36px;
    box-shadow: 0 0.3px 0 0.3px #c3c3c6;
`

const TabItem = styled.div<{ selected: boolean | undefined; $mainBackground: ThemeState["mainBackground"]; $mainFont: ThemeState["mainFont"]; $minorFont: ThemeState["minorFont"] }>`
    display: flex;
    font-size: 14px;
    cursor: pointer;
    color: ${({ selected, $mainFont, $minorFont }) => (selected ? $mainFont : $minorFont)};
    border-bottom: ${({ selected, $mainBackground }) => (selected ? "2px solid #6534ff" : `2px solid ${$mainBackground}`)};
    align-items: center;
    transition: color 0.3s ease, border-bottom 0.3s ease;
`

const ModalLabel = styled.label<{ $mainFont: ThemeState["mainFont"] }>`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: ${({ $mainFont }) => $mainFont};
`

const ModalCheckBox = styled.input.attrs({ type: "checkbox" })`
    will-change: border-width;
    appearance: none;
    width: 20px;
    height: 20px;
    margin: 15px 15px 15px 4px;
    border: 2px solid #6534ff;
    border-radius: 18px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:checked {
        border-width: 5px;
    }
`

const TopAppBar = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [inputFocus, setInputFocus] = useState(false)
    const [modal, setModal] = useState(false)
    const { sorting, loading, searchQuery, selectedDepartment } = useSelector((state: RootState) => state.users)
    const { theme, mainFont, mainBackground, auxiliaryBackground, minorFont } = useSelector((state: RootState) => state.theme)
    const [networkIssues, setNetworkIssues] = useState(false)
    const isOnline = useNetworkStatus()

    const debouncedSearchQuery = useDebounce(searchQuery, 400)

    useEffect(() => {
        if (selectedDepartment) {
            dispatch(fetchUsers({ __example: selectedDepartment }))
        } else {
            dispatch(fetchUsers({}))
        }
        const input = document.getElementById("searchInput") as HTMLInputElement
        if (input && searchQuery) {
            input.value = searchQuery
        }
    }, [dispatch, selectedDepartment])

    useEffect(() => {
        if (!debouncedSearchQuery) {
            dispatch(inputFilter(""))
        } else {
            dispatch(inputFilter(debouncedSearchQuery))
        }
    }, [debouncedSearchQuery, dispatch])

    useEffect(() => {
        if (!isOnline) {
            setNetworkIssues(true)
        }
        if (isOnline && !loading) {
            if (selectedDepartment) {
                dispatch(fetchUsers({ __example: selectedDepartment })).finally(() => setNetworkIssues(false))
            } else {
                dispatch(fetchUsers({})).finally(() => setNetworkIssues(false))
            }
        }
    }, [isOnline, dispatch])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(event.currentTarget.value))
    }
    const handleDepartmentChange = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isOnline) {
            const item = event.currentTarget as HTMLDivElement
            dispatch(setSelectedDepartment(reverseTransformDepartment(item.innerHTML)))
            const input = document.getElementById("searchInput") as HTMLInputElement
            if (input && searchQuery) {
                input.value = searchQuery
            }
        }
    }
    const filterClickHandler = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false)
    }
    const checkBoxClickHandler = (value: "alphabet" | "birthday") => {
        if (value === "alphabet") {
            dispatch(sortByAlphabet())
        } else {
            dispatch(sortByBirthday())
        }
        closeModal()
    }
    const ThemeBlokClickHandler = () => {
        dispatch(toggleTheme())
    }
    return (
        <Container>
            <TitleContainer $isOnline={isOnline} $isLoading={loading && networkIssues}>
                <Title $mainFont={mainFont}>Поиск</Title>
                <ThemeBlock onClick={ThemeBlokClickHandler}>
                    <ThemeIcon src={darkThemeIcon} $visible={theme === "light"} />
                    <ThemeIcon src={lightThemeIcon} $visible={theme === "dark"} />
                </ThemeBlock>
            </TitleContainer>

            <SearchContainer $isOnline={isOnline} $isLoading={loading && networkIssues}>
                {!isOnline && (
                    <NetworkStatusElement $isOnline={isOnline} $isLoading={loading && networkIssues}>
                        Не могу обновить данные. Проверь соединение с интернетом.
                    </NetworkStatusElement>
                )}
                {networkIssues && loading && (
                    <NetworkStatusElement $isOnline={isOnline} $isLoading={loading && networkIssues}>
                        Секундочку, гружусь...
                    </NetworkStatusElement>
                )}

                <SearchWrapper $visible={!(networkIssues && loading) && isOnline} $auxiliaryBackground={auxiliaryBackground}>
                    <SearchIconWrapper>
                        <InputIcon src={searchIcon} $visible={!inputFocus} />
                        <InputIcon src={focusedSearchIcon} $visible={inputFocus} />
                    </SearchIconWrapper>
                    <SearchInput
                        id="searchInput"
                        onChange={handleInputChange}
                        placeholder={"Введите имя, тег..."}
                        onFocus={() => setInputFocus(true)}
                        onBlur={() => setInputFocus(false)}
                        $auxiliaryBackground={auxiliaryBackground}
                        $mainFont={mainFont}
                    />
                    <ModalButtonWrapper onClick={filterClickHandler}>
                        <InputIcon src={modalIcon} $visible={sorting === "alphabet"} />
                        <InputIcon src={birthdayModalIcon} $visible={sorting === "birthday"} />
                    </ModalButtonWrapper>
                </SearchWrapper>
            </SearchContainer>

            <Tabs>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment === undefined} $mainBackground={mainBackground} $mainFont={mainFont} $minorFont={minorFont}>
                    Все
                </TabItem>
                {displayedDepartments.map((department) => (
                    <TabItem onClick={handleDepartmentChange} selected={selectedDepartment && transformDepartment(selectedDepartment) === department} key={department} $mainBackground={mainBackground} $mainFont={mainFont} $minorFont={minorFont}>
                        {department}
                    </TabItem>
                ))}
            </Tabs>

            <Modal isOpen={modal} onClose={closeModal}>
                <ModalLabel onClick={() => checkBoxClickHandler("alphabet")} htmlFor="alphabet-checkbox" $mainFont={mainFont}>
                    <ModalCheckBox checked={sorting === "alphabet"} readOnly={true} id="alphabet-checkbox" />
                    По алфавиту
                </ModalLabel>
                <ModalLabel onClick={() => checkBoxClickHandler("birthday")} htmlFor="birthday-checkbox" $mainFont={mainFont}>
                    <ModalCheckBox checked={sorting === "birthday"} readOnly={true} id="birthday-checkbox" />
                    По дню рождения
                </ModalLabel>
            </Modal>
        </Container>
    )
}

export default TopAppBar
