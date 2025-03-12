import React from "react"
import styled from "styled-components"

interface YearDividerProps {
    text: string
}

const YearDividerContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 68px;
    padding: 24px;
    box-sizing: border-box;
`

const Line = styled.div`
    flex: 1;
    height: 2px;
    background-color: #c3c3c6;
    border-radius: 15px;
`

const Text = styled.span`
    padding: 0 10px;
    color: #c3c3c6;
    font-size: 15px;
    font-weight: 500;
    width: 160px;
    text-align: center;
`

const YearDivider: React.FC<YearDividerProps> = ({ text }) => {
    return (
        <YearDividerContainer>
            <Line />
            <Text>{text}</Text>
            <Line />
        </YearDividerContainer>
    )
}

export default YearDivider
