import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import TopAppBar from "../components/TopAppBar"
import styled from "styled-components"
import Divider from "../components/Divider"
import { Link } from "react-router-dom"

const Container = styled.div<{ isEmpty: boolean }>`
    font-family: sans-serif;
    height: ${({ isEmpty }) => (isEmpty ? "100vh" : "")};
    display: flex;
    flex-direction: column;
`

const UserList = styled.div<{ isEmpty: boolean }>`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: ${({ isEmpty }) => (isEmpty ? "center" : "flex-start")};
    align-items: center;
    margin: ${({ isEmpty }) => (isEmpty ? "0 8px 30% 8px" : "24px 8px 0 8px")};
`

const UserCard = styled(Link)`
    display: flex;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    text-decoration: none;
    color: black;
    width: 100%;
    box-sizing: border-box;

    &:hover {
        background-color: #f5f5f5;
    }
`

const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 16px;
`

const UserInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
`

const UserName = styled.div`
    display: flex;
    gap: 5px;
    font-size: 16px;
    font-weight: 500;
`

const UserTag = styled.div`
    font-size: 14px;
    color: #666;
`

const UserDepartment = styled.div`
    font-size: 14px;
    color: #666;
`

const UserBirthday = styled.div<{ sorting: "alphabet" | "birthday" }>`
    font-size: 14px;
    color: #666;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: ${({ sorting }) => (sorting === "alphabet" ? "none" : "block")};
`

const NothingFound = styled.h2`
    text-align: center;
`

const HomePage: React.FC = () => {
    const { displayedUsers, sorting } = useSelector((state: RootState) => state.users)

    return (
        <Container isEmpty={!displayedUsers || displayedUsers.length === 0}>
            <TopAppBar />
            <UserList isEmpty={!displayedUsers || displayedUsers.length === 0}>
                {displayedUsers?.length !== 0 ? (
                    displayedUsers?.map((user) => (
                        <>
                            {user.firstNextYear && <Divider text={new Date().getFullYear().toString()} />}
                            <UserCard to={`/${user.id}`}>
                                <Avatar src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                                <UserInfo>
                                    <UserName>
                                        {`${user.firstName} ${user.lastName}`}
                                        <UserTag>{user.userTag}</UserTag>
                                    </UserName>

                                    <UserDepartment>{user.department}</UserDepartment>
                                    <UserBirthday sorting={sorting}>{user.birthday}</UserBirthday>
                                </UserInfo>
                            </UserCard>
                        </>
                    ))
                ) : (
                    <NothingFound>Мы ничего не нашли</NothingFound>
                )}
            </UserList>
        </Container>
    )
}

export default HomePage
