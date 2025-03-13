import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import TopAppBar from "../components/TopAppBar"
import styled from "styled-components"
import YearDivider from "../components/YearDivider"
import { Link } from "react-router-dom"
import { getBriefDisplayedBirthday } from "../store/slices/usersSlice"
import nothingFoundIcon from "../assets/NothingFoundIcon.png"
import errorIcon from "../assets/ErrorIcon.png"

const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`

const UserList = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    align-items: center;
    overflow-y: auto;
`

const UserCard = styled(Link)`
    display: flex;
    align-items: center;
    height: 80px;
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
    width: 72px;
    height: 72px;
    margin: 6px 16px 6px 0;
    border-radius: 50%;
    margin-right: 16px;
`

const UserInfo = styled.div`
    display: flex;
    height: 60px;
    align-self: center;
    box-sizing: border-box;
    padding: 7px 0 7px 0;
    flex-direction: column;
    position: relative;
`

const UserName = styled.div`
    height: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    font-weight: 500;
`

const UserTag = styled.div`
    height: 18px;
    padding-top: 1px;
    box-sizing: border-box;
    display: flex;
    align-self: center;
    font-size: 14px;
    color: #97979b;
    font-weight: 500;
`

const UserDepartment = styled.div`
    margin-top: 3px;
    font-size: 13px;
    color: #55555c;
    font-weight: 400;
`

const UserBirthday = styled.div<{ $sorting: "alphabet" | "birthday" }>`
    font-size: 14px;
    color: #55555c;
    height: 20px;
    margin: 28px 4px 32px auto;
    font-size: 15px;
    font-weight: 400;
    display: ${({ $sorting }) => ($sorting === "alphabet" ? "none" : "block")};
`

const ErrorContainer = styled.div`
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;

    @media (max-height: 400px) {
        top: 152px;
        transform: translate(-50%, 0);
    }
`

const ErrorIcon = styled.img`
    width: 56px;
`

const ErrorTitle = styled.h2`
    margin: 0;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    color: #050510;
`

const ErrorText = styled.div`
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #97979b;
`

const ErrorRetry = styled.div`
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #6534ff;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`

const Skeleton = styled.div`
    display: flex;
    align-items: center;
    height: 80px;
    cursor: pointer;
    transition: background-color 0.2s;
    text-decoration: none;
    color: black;
    width: 100%;
    box-sizing: border-box;
`

const SkeletonAvatar = styled.div`
    width: 72px;
    height: 72px;
    margin: 6px 16px 6px 0;
    border-radius: 50%;
    margin-right: 16px;
    background: linear-gradient(to right, #f3f3f6, #fafafa);
`

const SkeletonInfo = styled.div`
    display: flex;
    height: 60px;
    align-self: center;
    box-sizing: border-box;
    padding: 7px 0 7px 0;
    flex-direction: column;
    position: relative;
`

const SkeletonName = styled.div`
    height: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 16px;
    width: 144px;
    border-radius: 50px;
    background: linear-gradient(to right, #f3f3f6, #fafafa);
`

const SkeletonDepartment = styled.div`
    margin-top: 3px;
    height: 12px;
    width: 80px;
    border-radius: 50px;
    background: linear-gradient(to right, #f3f3f6, #fafafa);
`

const HomePage: React.FC = () => {
    const { displayedUsers, sorting, loading, error } = useSelector((state: RootState) => state.users)
    const [skeletonCount, setSkeletonCount] = useState(0)

    useEffect(() => {
        const calculateSkeletons = () => {
            const windowHeight = window.innerHeight
            const topOffset = 168
            const skeletonHeight = 80
            const availableHeight = windowHeight - topOffset
            const count = Math.ceil(availableHeight / skeletonHeight)
            setSkeletonCount(count)
        }

        calculateSkeletons()
        window.addEventListener("resize", calculateSkeletons)

        return () => {
            window.removeEventListener("resize", calculateSkeletons)
        }
    }, [])

    if (loading) {
        return (
            <Container>
                <TopAppBar />
                <UserList>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <React.Fragment key={index}>
                            <Skeleton>
                                <SkeletonAvatar />
                                <SkeletonInfo>
                                    <SkeletonName />
                                    <SkeletonDepartment />
                                </SkeletonInfo>
                            </Skeleton>
                        </React.Fragment>
                    ))}
                </UserList>
            </Container>
        )
    }

    if (error) {
        return (
            <Container>
                <TopAppBar />
                <ErrorContainer>
                    <ErrorIcon src={errorIcon} />
                    <ErrorTitle>Какой-то сверхразум всё сломал</ErrorTitle>
                    <ErrorText>Постараемся быстро починить</ErrorText>
                    <ErrorRetry onClick={() => window.location.reload()}>Попробовать снова</ErrorRetry>
                </ErrorContainer>
            </Container>
        )
    }

    return (
        <Container>
            <TopAppBar />

            {displayedUsers?.length !== 0 ? (
                <UserList>
                    {displayedUsers?.map((user) => (
                        <React.Fragment key={user.id}>
                            {user.firstNextYear && <YearDivider text={new Date().getFullYear().toString()} />}
                            <UserCard to={`/${user.id}`}>
                                <Avatar src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                                <UserInfo>
                                    <UserName>
                                        {`${user.firstName} ${user.lastName}`}
                                        <UserTag>{user.userTag}</UserTag>
                                    </UserName>

                                    <UserDepartment>{user.department}</UserDepartment>
                                </UserInfo>
                                <UserBirthday $sorting={sorting}>{getBriefDisplayedBirthday(user.birthday)}</UserBirthday>
                            </UserCard>
                        </React.Fragment>
                    ))}
                </UserList>
            ) : (
                <ErrorContainer>
                    <ErrorIcon src={nothingFoundIcon} />
                    <ErrorTitle>Мы ничего не нашли</ErrorTitle>
                    <ErrorText>Попробуй скорректировать запрос</ErrorText>
                </ErrorContainer>
            )}
        </Container>
    )
}

export default HomePage
