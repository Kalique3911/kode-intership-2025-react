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
import birthdayModalIcon from "./../assets/BirthdayModalIcon.svg"
import { displayedDepartments, reverseTransformDepartment, transformDepartment } from "../utils/usersUtils"
import useNetworkStatus from "../hooks/useNetworkStatus"

const Container = styled.div``

const TitleContainer = styled.div<{ $isOnline: boolean; $isLoading: boolean }>`
    padding: 0 32px 0 32px;
    height: 48px;
    align-content: center;
    color: ${({ $isOnline, $isLoading }) => (!$isOnline || $isLoading ? " #ffffff;" : "")}
    background: ${({ $isOnline, $isLoading }) => (!$isOnline && "#f44336") || ($isLoading && "#6534ff")};
`

const Title = styled.h1`
    margin: 8px 0 0 0;
    font-size: 24px;
`

const SearchContainer = styled.div<{ $isOnline: boolean; $isLoading: boolean }>`
    padding: 0 32px 0 32px;
    height: 52px;
    align-content: center;
    background: ${({ $isOnline, $isLoading }) => (!$isOnline && "#f44336") || ($isLoading && "#6534ff")};
`

const SearchWrapper = styled.div<{ $visible: boolean }>`
    display: ${({ $visible }) => ($visible ? "flex" : "none")};
    height: 40px;
    padding: 8px 12px 8px 12px;
    box-sizing: border-box;
    flex-wrap: wrap;
    flex-direction: row;
    border: 0;
    border-radius: 16px;
    background: #f7f7f8;
    align-content: center;
`

const SearchInput = styled.input`
    width: 80%;
    border: none;
    outline: none;
    height: 24px;
    background: #f7f7f8;
    flex: 1;
    font-weight: 400;
    font-size: 15px;
    caret-color: #6534ff;

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

const TabItem = styled.div<{ selected: boolean | undefined }>`
    display: flex;
    font-size: 14px;
    cursor: pointer;
    color: ${({ selected }) => (selected ? "#050510" : "#97979B")};
    border-bottom: ${({ selected }) => (selected ? "2px solid #6534ff" : "2px solid #FFFFFF")};
    align-items: center;
    transition: color 0.3s ease, border-bottom 0.3s ease;
`

const ModalLabel = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
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
    return (
        <Container>
            <TitleContainer $isOnline={isOnline} $isLoading={loading && networkIssues}>
                <Title>Поиск</Title>
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

                <SearchWrapper $visible={!(networkIssues && loading) && isOnline}>
                    <SearchIconWrapper>
                        <InputIcon src={searchIcon} $visible={!inputFocus} />
                        <InputIcon src={focusedSearchIcon} $visible={inputFocus} />
                    </SearchIconWrapper>
                    <SearchInput id="searchInput" onChange={handleInputChange} placeholder={"Введите имя, тег..."} onFocus={() => setInputFocus(true)} onBlur={() => setInputFocus(false)} />
                    <ModalButtonWrapper onClick={filterClickHandler}>
                        <InputIcon src={modalIcon} $visible={sorting === "alphabet"} />
                        <InputIcon src={birthdayModalIcon} $visible={sorting === "birthday"} />
                    </ModalButtonWrapper>
                </SearchWrapper>
            </SearchContainer>

            <Tabs>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment === undefined}>
                    Все
                </TabItem>
                {displayedDepartments.map((department) => (
                    <TabItem onClick={handleDepartmentChange} selected={selectedDepartment && transformDepartment(selectedDepartment) === department} key={department}>
                        {department}
                    </TabItem>
                ))}
            </Tabs>

            <Modal isOpen={modal} onClose={closeModal}>
                <ModalLabel onClick={() => checkBoxClickHandler("alphabet")} htmlFor="alphabet-checkbox">
                    <ModalCheckBox checked={sorting === "alphabet"} readOnly={true} id="alphabet-checkbox" />
                    По алфавиту
                </ModalLabel>
                <ModalLabel onClick={() => checkBoxClickHandler("birthday")} htmlFor="birthday-checkbox">
                    <ModalCheckBox checked={sorting === "birthday"} readOnly={true} id="birthday-checkbox" />
                    По дню рождения
                </ModalLabel>
            </Modal>
        </Container>
    )
}

export default TopAppBar
