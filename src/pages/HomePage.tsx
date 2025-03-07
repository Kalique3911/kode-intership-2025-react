import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import TopAppBar from "../components/TopAppBar"
import styled from "styled-components"
import Divider from "../components/Divider"

const Container = styled.div`
    font-family: sans-serif;
`

const UserList = styled.div`
    margin-top: 24px;
`

const UserCard = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    transition: background-color 0.2s;

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
    position: absolute; /* Позиционируем по центру справа */
    top: 50%; /* Смещаем на 50% вниз */
    right: 0; /* Прижимаем к правому краю */
    transform: translateY(-50%); /* Центрируем по вертикали */
    display: ${({ sorting }) => (sorting === "alphabet" ? "none" : "block")};
`

const HomePage: React.FC = () => {
    const { displayedUsers, sorting } = useSelector((state: RootState) => state.users)

    return (
        <Container>
            <TopAppBar />
            <UserList>
                {displayedUsers?.map((user) => (
                    <>
                        {user.firstNextYear && <Divider text={new Date().getFullYear().toString()} />}
                        <UserCard>
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
                ))}
            </UserList>
        </Container>
    )
}

export default HomePage
