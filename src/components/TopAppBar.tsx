import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useDebounce } from "../hooks/useDebounce"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import { fetchUsers, inputFilter, reverseTransformDepartment, sortByAlphabet, sortByBirthday } from "../store/slices/usersSlice"
import { Department } from "../types"
import Modal from "./Modal"

const Container = styled.div`
    font-family: sans-serif;
`
const Title = styled.h1``

const SearchWrapper = styled.div`
    display: flex;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px 12px;
`

const SearchInput = styled.input`
    width: 100%;
    border: none;
    outline: none;
`

const ModalButton = styled.div`
    width: 20px;
    height: 20px;
    background: #666;
    cursor: pointer;
`

const ModalLabel = styled.div``

const ModalCheckBox = styled.input.attrs({ type: "checkbox" })`
    type: checkbox;
`

const ModalTitle = styled.h2`
    justify-self: center;
`

const Tabs = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 16px;
`

const TabItem = styled.div`
    font-size: 14px;
    cursor: pointer;
`

const TopAppBar = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [searchValue, setSearchValue] = useState("")
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
        if (debouncedSearchQuery.length > 2 || debouncedSearchQuery.trim() === "") dispatch(inputFilter(debouncedSearchQuery))
    }, [debouncedSearchQuery, dispatch])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }
    const handleDepartmentChange = (event: React.MouseEvent<HTMLDivElement>) => {
        const item = event.target as HTMLDivElement
        setSelectedDepartment(reverseTransformDepartment(item.innerHTML))
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
    }
    return (
        <Container>
            <Title>Поиск</Title>

            <SearchWrapper>
                <SearchInput onChange={handleInputChange} />
                <ModalButton onClick={filterClickHandler} />
            </SearchWrapper>

            <Tabs>
                <TabItem onClick={handleDepartmentChange}>Все</TabItem>
                <TabItem onClick={handleDepartmentChange}>Designers</TabItem>
                <TabItem onClick={handleDepartmentChange}>Analysts</TabItem>
                <TabItem onClick={handleDepartmentChange}>Managers</TabItem>
                <TabItem onClick={handleDepartmentChange}>iOS</TabItem>
                <TabItem onClick={handleDepartmentChange}>Android</TabItem>
            </Tabs>

            <Modal isOpen={modal} onClose={closeModal}>
                <ModalTitle>Сортировка</ModalTitle>
                <ModalLabel onClick={() => checkBoxClickHandler("alphabet")}>
                    <ModalCheckBox checked={sorting === "alphabet"} readOnly={true} />
                    По алфавиту
                </ModalLabel>
                <ModalLabel onClick={() => checkBoxClickHandler("birthday")}>
                    <ModalCheckBox checked={sorting === "birthday"} readOnly={true} />
                    По дню рождения
                </ModalLabel>
            </Modal>
        </Container>
    )
}

export default TopAppBar
