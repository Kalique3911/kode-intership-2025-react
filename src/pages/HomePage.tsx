import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import TopAppBar from "../components/TopAppBar"
import styled from "styled-components"
import YearDivider from "../components/YearDivider"
import { Link } from "react-router-dom"
import { getBriefDisplayedBirthday } from "../utils/usersUtils"
import nothingFoundIcon from "../assets/NothingFoundIcon.png"
import errorIcon from "../assets/ErrorIcon.png"
import useNetworkStatus from "../hooks/useNetworkStatus"
import { ThemeState } from "../store/slices/themeSlice"
import { useTranslation } from "react-i18next"

const Container = styled.div<{ $mainBackground: ThemeState["mainBackground"] }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: ${({ $mainBackground }) => $mainBackground};
    transition: color 0.3s ease, background 0.3s ease;
`

const UserList = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    align-items: center;
    overflow-y: auto;
    gap: 4px;
`

const UserCard = styled(Link)<{ $theme: ThemeState["theme"] }>`
    display: flex;
    align-items: center;
    height: 80px;
    cursor: pointer;
    transition: background-color 0.2s;
    text-decoration: none;
    color: black;
    width: 100%;
    box-sizing: border-box;
    transition: color 0.3s ease, background 0.3s ease;

    &:hover {
        background-color: ${({ $theme }) => ($theme === "light" ? "#f5f5f5" : "rgb(80, 80, 80)")};
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
    box-sizing: border-box;
    padding: 7px 0 7px 0;
    flex-direction: column;
    position: relative;
`

const UserName = styled.div<{ $mainFont: ThemeState["mainFont"] }>`
    height: 20px;
    display: flex;
    align-items: center;
    color: ${({ $mainFont }) => $mainFont};
    gap: 4px;
    font-size: 16px;
    font-weight: 500;
    transition: color 0.3s ease, background 0.3s ease;
`

const UserTag = styled.div<{ $minorFont: ThemeState["minorFont"] }>`
    height: 18px;
    padding-top: 1px;
    box-sizing: border-box;
    display: flex;
    align-self: center;
    font-size: 14px;
    color: ${({ $minorFont }) => $minorFont};
    font-weight: 500;
    transition: color 0.3s ease, background 0.3s ease;
`

const UserDepartment = styled.div<{ $auxiliaryFont: ThemeState["auxiliaryFont"] }>`
    margin-top: 3px;
    font-size: 13px;
    color: ${({ $auxiliaryFont }) => $auxiliaryFont};
    font-weight: 400;
`

const UserBirthday = styled.div<{ $sorting: "alphabet" | "birthday"; $auxiliaryFont: ThemeState["auxiliaryFont"] }>`
    font-size: 14px;
    color: ${({ $auxiliaryFont }) => $auxiliaryFont};
    height: 20px;
    margin: 28px 4px 32px auto;
    font-size: 15px;
    font-weight: 400;
    display: ${({ $sorting }) => ($sorting === "alphabet" ? "none" : "block")};
    transition: color 0.3s ease, background 0.3s ease;
`

const ErrorContainer = styled.div`
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;
    gap: 12px;

    @media (max-height: 400px) {
        top: 152px;
        transform: translate(-50%, 0);
    }
`

const ErrorIcon = styled.img`
    width: 56px;
`

const ErrorTitle = styled.h2<{ $mainFont: ThemeState["mainFont"] }>`
    margin: 0;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    color: ${({ $mainFont }) => $mainFont};
    transition: color 0.3s ease, background 0.3s ease;
`

const ErrorText = styled.div<{ $minorFont: ThemeState["minorFont"] }>`
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: ${({ $minorFont }) => $minorFont};
    transition: color 0.3s ease, background 0.3s ease;
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

const SkeletonAvatar = styled.div<{ $theme: ThemeState["theme"] }>`
    width: 72px;
    height: 72px;
    margin: 6px 16px 6px 0;
    border-radius: 50%;
    margin-right: 16px;
    background: linear-gradient(to right, ${({ $theme }) => ($theme === "light" ? "#f3f3f6, #fafafa" : "#2C2C2C, #1E1E1E")});
`

const SkeletonInfo = styled.div`
    display: flex;
    height: 60px;
    box-sizing: border-box;
    padding: 7px 0 7px 0;
    flex-direction: column;
    position: relative;
`

const SkeletonName = styled.div<{ $theme: ThemeState["theme"] }>`
    height: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 16px;
    width: 144px;
    border-radius: 50px;
    background: linear-gradient(to right, ${({ $theme }) => ($theme === "light" ? "#f3f3f6, #fafafa" : "#2C2C2C, #1E1E1E")});
`

const SkeletonDepartment = styled.div<{ $theme: ThemeState["theme"] }>`
    margin-top: 3px;
    height: 12px;
    width: 80px;
    border-radius: 50px;
    background: linear-gradient(to right, ${({ $theme }) => ($theme === "light" ? "#f3f3f6, #fafafa" : "#2C2C2C, #1E1E1E")});
`

const HomePage: React.FC = () => {
    const { theme, mainFont, auxiliaryFont, minorFont, mainBackground } = useSelector((state: RootState) => state.theme)
    const { displayedUsers, sorting, loading, error } = useSelector((state: RootState) => state.users)
    const [skeletonCount, setSkeletonCount] = useState(0)
    const isOnline = useNetworkStatus()
    const { t, i18n } = useTranslation()

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
    useEffect(() => {
        document.title = i18n.language === "ru" ? "Главная" : "Main"
    }, [i18n.language])

    if (loading) {
        return (
            <Container $mainBackground={mainBackground}>
                <TopAppBar />
                <UserList>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <React.Fragment key={index}>
                            <Skeleton>
                                <SkeletonAvatar $theme={theme} />
                                <SkeletonInfo>
                                    <SkeletonName $theme={theme} />
                                    <SkeletonDepartment $theme={theme} />
                                </SkeletonInfo>
                            </Skeleton>
                        </React.Fragment>
                    ))}
                </UserList>
            </Container>
        )
    }

    if (error && isOnline) {
        return (
            <Container $mainBackground={mainBackground}>
                <TopAppBar />
                <ErrorContainer>
                    <ErrorIcon src={errorIcon} />
                    <ErrorTitle $mainFont={mainFont}>{t("home.error")}</ErrorTitle>
                    <ErrorText $minorFont={minorFont}>{t("home.promise")}</ErrorText>
                    <ErrorRetry onClick={() => window.location.reload()}>{t("home.retry")}</ErrorRetry>
                </ErrorContainer>
            </Container>
        )
    }

    return (
        <Container $mainBackground={mainBackground}>
            <TopAppBar />

            {displayedUsers?.length !== 0 ? (
                <UserList>
                    {displayedUsers?.map((user) => (
                        <React.Fragment key={user.id}>
                            {user.firstNextYear && <YearDivider text={new Date().getFullYear().toString()} />}
                            <UserCard to={`/${user.id}`} $theme={theme}>
                                <Avatar src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                                <UserInfo>
                                    <UserName $mainFont={mainFont}>
                                        {`${user.firstName} ${user.lastName}`}
                                        <UserTag $minorFont={minorFont}>{user.userTag}</UserTag>
                                    </UserName>

                                    <UserDepartment $auxiliaryFont={auxiliaryFont}>{t("common." + user.department)}</UserDepartment>
                                </UserInfo>
                                <UserBirthday $sorting={sorting} $auxiliaryFont={auxiliaryFont}>
                                    {getBriefDisplayedBirthday(user.birthday)}
                                </UserBirthday>
                            </UserCard>
                        </React.Fragment>
                    ))}
                </UserList>
            ) : (
                <ErrorContainer>
                    <ErrorIcon src={nothingFoundIcon} />
                    <ErrorTitle $mainFont={mainFont}>{t("home.nothingFound")}</ErrorTitle>
                    <ErrorText $minorFont={minorFont}>{t("home.adjustQuery")}</ErrorText>
                </ErrorContainer>
            )}
        </Container>
    )
}

export default HomePage
