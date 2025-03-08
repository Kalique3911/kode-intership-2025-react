import React from "react"
import styled from "styled-components"

interface DividerProps {
    text: string
}

const DividerContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin: 20px 0;
`

const Line = styled.div`
    flex: 1;
    height: 1px;
    background-color: #ccc;
`

const Text = styled.span`
    padding: 0 10px;
    color: #666;
    font-size: 14px;
`

const Divider: React.FC<DividerProps> = ({ text }) => {
    return (
        <DividerContainer>
            <Line />
            <Text>{text}</Text>
            <Line />
        </DividerContainer>
    )
}

export default Divider
