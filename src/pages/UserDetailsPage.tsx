import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import styled from "styled-components"
import { getAge, getFullfDisplayedBirthday, transFormPhoneNumber } from "../utils/usersUtils"
import { Link, useParams } from "react-router-dom"
import backIcon from "../assets/BackIcon.svg"
import phoneIcon from "../assets/PhoneIcon.svg"
import birthIcon from "../assets/BirthIcon.svg"
import { fetchUsers } from "../store/slices/usersSlice"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100vh;
`

const UserCard = styled.div`
    background-color: #f7f7f8;
    display: flex;
    height: 280px;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    position: relative;
`

const BackButton = styled(Link)`
    position: absolute;
    width: 24px;
    height: 24px;
    top: 22px;
    left: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const BackIcon = styled.img`
    width: 8px;
    height: 12px;
`

const Avatar = styled.img`
    margin: 72px 0 24px 0;
    width: 104px;
    height: 104px;
    border-radius: 64px;
`

const UserName = styled.h2`
    font-size: 24px;
    margin: 0 0 12px 0;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
`

const UserTag = styled.span`
    font-size: 17px;
    color: #97979f;
    font-weight: 400;
`

const UserDepartment = styled.div`
    font-size: 13px;
    color: #55555c;
    font-weight: 400;
`

const UserDetails = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 16px 0 16px;
`

const DetailItem = styled.div<{ $isSecond: boolean }>`
    display: grid;
    grid-template-columns: ${({ $isSecond }) => ($isSecond ? "auto 1fr" : "auto 1fr auto")};
    width: 100%;
    height: 60px;
    font-size: 16px;
    font-weight: 500;
    align-items: center;
    border-top: ${({ $isSecond }) => ($isSecond ? "0.5px solid #f7f7f8" : "")};
`

const DetailIconWrapper = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 12px;
`

const DetailIcon = styled.img``

const Age = styled.div`
    margin-right: 4px;
    font-size: 16px;
    color: #97979b;
    font-weight: 500;
`
const PhoneLink = styled.a`
    text-decoration: none;
    color: black;
`

const SkeletonAvatar = styled.div`
    margin: 72px 0 24px 0;
    width: 104px;
    height: 104px;
    border-radius: 64px;
`

const UserDetailsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams<{ id: string }>()
    const { displayedUsers, loading } = useSelector((state: RootState) => state.users)
    const user = displayedUsers?.find((u) => u.id === id)

    useEffect(() => {
        if (!displayedUsers) dispatch(fetchUsers({}))
    }, [dispatch, displayedUsers])
    useEffect(() => {
        if (user) {
            document.title = user.firstName
        }
    }, [user])

    if (loading) {
        return <></>
    }
    if (!user) {
        return (
            <Container>
                <UserCard>
                    <BackButton to={"/"}>
                        <BackIcon src={backIcon} />
                    </BackButton>
                    <SkeletonAvatar />
                    <UserName>Пользователь не найден</UserName>
                </UserCard>
            </Container>
        )
    }

    return (
        <Container>
            <UserCard>
                <BackButton to={"/"}>
                    <BackIcon src={backIcon} />
                </BackButton>
                <Avatar src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                <UserName>
                    {`${user.firstName} ${user.lastName}`}
                    <UserTag>{user.userTag}</UserTag>
                </UserName>
                <UserDepartment>{user.department}</UserDepartment>
            </UserCard>

            <UserDetails>
                <DetailItem $isSecond={false}>
                    <DetailIconWrapper>
                        <DetailIcon src={birthIcon} />
                    </DetailIconWrapper>
                    {getFullfDisplayedBirthday(user.birthday)}
                    <Age>{getAge(user.birthday)}</Age>
                </DetailItem>
                <DetailItem $isSecond={true}>
                    <DetailIconWrapper>
                        <DetailIcon src={phoneIcon} />
                    </DetailIconWrapper>
                    <PhoneLink href={`tel:${user.phone}`}>{transFormPhoneNumber(user.phone)}</PhoneLink>
                </DetailItem>
            </UserDetails>
        </Container>
    )
}

export default UserDetailsPage
