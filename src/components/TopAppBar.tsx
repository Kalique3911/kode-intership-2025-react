import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useDebounce } from "../hooks/useDebounce"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import { fetchUsers, inputFilter, reverseTransformDepartment, sortByAlphabet, sortByBirthday, transformDepartment } from "../store/slices/usersSlice"
import { Department } from "../types"
import Modal from "./Modal"
import searchIcon from "./../assets/SearchIcon.svg"
import focusedSearchIcon from "./../assets/FocusedSearchIcon.svg"
import modalIcon from "./../assets/ModalIcon.svg"
import birthdayModalIcon from "./../assets/BirthdayModalIcon.svg"

const Container = styled.div`
    margin: 8px 0 0 0;
    padding: 0 32px 0 32px;
`
const TitleContainer = styled.div`
    margin: 0;
    height: 48px;
    align-content: center;
`

const Title = styled.h1`
    margin: 0;
    font-size: 24px;
`

const SearchContainer = styled.div`
    height: 52px;
    align-content: center;
`

const SearchWrapper = styled.div`
    display: flex;
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

const SearchIcon = styled.img<{ $visible: boolean }>`
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

const ModalButton = styled.img<{ $visible: boolean }>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.3s ease;
`

const Tabs = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 8px;
    height: 36px;
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
    const [searchValue, setSearchValue] = useState("")
    const [inputFocus, setInputFocus] = useState(false)
    const [modal, setModal] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>()
    const { sorting } = useSelector((state: RootState) => state.users)

    const debouncedSearchQuery = useDebounce(searchValue, 400)

    useEffect(() => {
        if (selectedDepartment) {
            dispatch(fetchUsers({ __example: selectedDepartment }))
        } else {
            dispatch(fetchUsers({}))
        }
    }, [dispatch, selectedDepartment])

    useEffect(() => {
        dispatch(inputFilter(debouncedSearchQuery))
    }, [debouncedSearchQuery, dispatch])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }
    const handleDepartmentChange = (event: React.MouseEvent<HTMLDivElement>) => {
        const item = event.target as HTMLDivElement
        setSelectedDepartment(reverseTransformDepartment(item.innerHTML))
        const input = document.getElementById("searchInput") as HTMLInputElement
        input.value = ""
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
            <TitleContainer>
                <Title>Поиск</Title>
            </TitleContainer>

            <SearchContainer>
                <SearchWrapper>
                    <SearchIconWrapper>
                        <SearchIcon src={searchIcon} $visible={!inputFocus} />
                        <SearchIcon src={focusedSearchIcon} $visible={inputFocus} />
                    </SearchIconWrapper>
                    <SearchInput id="searchInput" onChange={handleInputChange} placeholder={"Введите имя, тег..."} onFocus={() => setInputFocus(true)} onBlur={() => setInputFocus(false)} />
                    <ModalButtonWrapper onClick={filterClickHandler}>
                        <ModalButton src={modalIcon} $visible={sorting === "alphabet"} />
                        <ModalButton src={birthdayModalIcon} $visible={sorting === "birthday"} />
                    </ModalButtonWrapper>
                </SearchWrapper>
            </SearchContainer>

            <Tabs>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment === undefined}>
                    Все
                </TabItem>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment && transformDepartment(selectedDepartment) === "Designers"}>
                    Designers
                </TabItem>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment && transformDepartment(selectedDepartment) === "Analysts"}>
                    Analysts
                </TabItem>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment && transformDepartment(selectedDepartment) === "Managers"}>
                    Managers
                </TabItem>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment && transformDepartment(selectedDepartment) === "iOS"}>
                    iOS
                </TabItem>
                <TabItem onClick={handleDepartmentChange} selected={selectedDepartment && transformDepartment(selectedDepartment) === "Android"}>
                    Android
                </TabItem>
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
