import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import styled from "styled-components"
import { getAge, getFullfDisplayedBirthday, transFormPhoneNumber } from "../utils/usersUtils"
import { Link, useParams } from "react-router-dom"
import backIcon from "../assets/BackIcon.svg"
import phoneIcon from "../assets/PhoneIcon.svg"
import darkBirthIcon from "../assets/DarkBirthIcon.svg"
import darkPhoneIcon from "../assets/DarkPhoneIcon.svg"
import birthIcon from "../assets/BirthIcon.svg"
import { fetchUsers } from "../store/slices/usersSlice"
import { ThemeState } from "../store/slices/themeSlice"
import { useTranslation } from "react-i18next"

const Container = styled.div<{ $mainBackground: ThemeState["mainBackground"] }>`
    display: flex;
    flex-direction: column;
    background-color: ${({ $mainBackground }) => $mainBackground};
    gap: 8px;
    height: 100vh;
`

const UserCard = styled.div<{ $auxiliaryBackgtound: ThemeState["auxiliaryBackground"] }>`
    background-color: ${({ $auxiliaryBackgtound }) => $auxiliaryBackgtound};
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

const UserName = styled.h2<{ $mainFont: ThemeState["mainFont"] }>`
    font-size: 24px;
    color: ${({ $mainFont }) => $mainFont};
    margin: 0 0 12px 0;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
`

const UserTag = styled.span<{ $minorFont: ThemeState["minorFont"] }>`
    font-size: 17px;
    color: ${({ $minorFont }) => $minorFont};
    font-weight: 400;
`

const UserDepartment = styled.div<{ $auxiliaryFont: ThemeState["auxiliaryFont"] }>`
    font-size: 13px;
    color: ${({ $auxiliaryFont }) => $auxiliaryFont};
    font-weight: 400;
`

const UserDetails = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 16px 0 16px;
`

const DetailItem = styled.div<{ $isSecond: boolean; $mainFont: ThemeState["mainFont"] }>`
    display: grid;
    grid-template-columns: ${({ $isSecond }) => ($isSecond ? "auto 1fr" : "auto 1fr auto")};
    color: ${({ $mainFont }) => $mainFont};
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

const DetailIcon = styled.img<{ $visible: boolean }>`
    display: ${({ $visible }) => ($visible ? "" : "none")};
`

const Age = styled.div<{ $minorFont: ThemeState["minorFont"] }>`
    margin-right: 4px;
    font-size: 16px;
    color: ${({ $minorFont }) => $minorFont};
    font-weight: 500;
`
const PhoneLink = styled.a<{ $mainFont: ThemeState["mainFont"] }>`
    text-decoration: none;
    color: ${({ $mainFont }) => $mainFont};
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
    const { t } = useTranslation()
    const { displayedUsers, loading } = useSelector((state: RootState) => state.users)
    const { theme, mainBackground, auxiliaryBackground, auxiliaryFont, minorFont, mainFont } = useSelector((state: RootState) => state.theme)
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
            <Container $mainBackground={mainBackground}>
                <UserCard $auxiliaryBackgtound={auxiliaryBackground}>
                    <BackButton to={"/"}>
                        <BackIcon src={backIcon} />
                    </BackButton>
                    <SkeletonAvatar />
                    <UserName $mainFont={mainFont}>{t("userDetails.userNotFound")}</UserName>
                </UserCard>
            </Container>
        )
    }

    return (
        <Container $mainBackground={mainBackground}>
            <UserCard $auxiliaryBackgtound={auxiliaryBackground}>
                <BackButton to={"/"}>
                    <BackIcon src={backIcon} />
                </BackButton>
                <Avatar src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                <UserName $mainFont={mainFont}>
                    {`${user.firstName} ${user.lastName}`}
                    <UserTag $minorFont={minorFont}>{user.userTag}</UserTag>
                </UserName>
                <UserDepartment $auxiliaryFont={auxiliaryFont}>{t("common." + user.department)}</UserDepartment>
            </UserCard>

            <UserDetails>
                <DetailItem $isSecond={false} $mainFont={mainFont}>
                    <DetailIconWrapper>
                        <DetailIcon src={birthIcon} $visible={theme === "light"} />
                        <DetailIcon src={darkBirthIcon} $visible={theme === "dark"} />
                    </DetailIconWrapper>
                    {getFullfDisplayedBirthday(user.birthday)}
                    <Age $minorFont={minorFont}>{getAge(user.birthday)}</Age>
                </DetailItem>
                <DetailItem $isSecond={true} $mainFont={mainFont}>
                    <DetailIconWrapper>
                        <DetailIcon src={phoneIcon} $visible={theme === "light"} />
                        <DetailIcon src={darkPhoneIcon} $visible={theme === "dark"} />
                    </DetailIconWrapper>
                    <PhoneLink href={`tel:${user.phone}`} $mainFont={mainFont}>
                        {transFormPhoneNumber(user.phone)}
                    </PhoneLink>
                </DetailItem>
            </UserDetails>
        </Container>
    )
}

export default UserDetailsPage
