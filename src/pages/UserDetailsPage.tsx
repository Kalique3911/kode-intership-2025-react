import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import styled from "styled-components"
import { fetchUsers } from "../store/slices/usersSlice"
import { Link, useParams } from "react-router-dom"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: sans-serif;
`

const UserCard = styled.div`
    background-color: rgb(179, 179, 179);
    color: white;
    height: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
`

const BackButton = styled(Link)`
    position: absolute;
    top: 24px;
    left: 24px;
    color: white;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
`

const Avatar = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 16px;
`

const UserName = styled.div`
    font-size: 24px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
`

const UserTag = styled.span`
    font-size: 16px;
    color: #ccc;
`

const UserDepartment = styled.div`
    font-size: 16px;
    color: #ccc;
    margin-top: 8px;
`

const UserDetails = styled.div`
    flex-grow: 1;
    padding: 24px;
    background-color: #f5f5f5;
    position: relative;
`

const DetailItem = styled.div`
    font-size: 16px;
    margin-bottom: 12px;
`

const Age = styled.div`
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 16px;
    color: #666;
`
const PhoneLink = styled.a`
    text-decoration: none;
    color: black;
`

const UserDetailsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams<{ id: string }>()
    const { displayedUsers } = useSelector((state: RootState) => state.users)
    const user = displayedUsers?.find((u) => u.id === id)

    useEffect(() => {
        if (!displayedUsers) dispatch(fetchUsers({}))
    }, [dispatch, displayedUsers])

    if (!user) {
        return <div>Пользователь не найден</div>
    }

    const calculateAge = (birthday: string): number => {
        const birthDate = new Date(birthday)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    return (
        <Container>
            <UserCard>
                <BackButton to={"/"}>Назад</BackButton>
                <Avatar src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                <UserName>
                    {`${user.firstName} ${user.lastName}`}
                    <UserTag>{user.userTag}</UserTag>
                </UserName>
                <UserDepartment>{user.department}</UserDepartment>
            </UserCard>

            <UserDetails>
                <DetailItem>Дата рождения: {user.birthday}</DetailItem>
                <DetailItem>
                    Телефон: <PhoneLink href={`tel:${user.phone}`}>{user.phone}</PhoneLink>
                </DetailItem>
                <Age>{calculateAge(user.birthday)} лет</Age>
            </UserDetails>
        </Container>
    )
}

export default UserDetailsPage
