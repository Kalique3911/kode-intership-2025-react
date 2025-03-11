import React from "react"
import styled from "styled-components"
import exitIcon from "../assets/ExitIcon.svg"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Overlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
    z-index: 1000;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
    transition: opacity 0.1s ease, visibility 0.1s ease;
`

const ModalWrapper = styled.div<{ $isOpen: boolean }>`
    width: 373px;
    height: 192px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(${({ $isOpen }) => ($isOpen ? 1 : 0.8)});
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 120px;
    row-gap: 16px;
    background: white;
    padding: 24px 16px 8px 16px;
    box-sizing: border-box;
    border-radius: 20px;
    z-index: 1001;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
    transition: opacity 0.1s ease, transform 0.1s ease, visibility 0.1s ease;
`

const ModalTitle = styled.h2`
    justify-self: center;
    margin: 0;
    font-size: 20px;
    font-weight: 600;
`

const ModalCloseButton = styled.button`
    grid-column: 2;
    grid-row: 1;
    border: 0;
    height: 24px;
    width: 24px;
    background: #f7f7f8;
    border-radius: 50%;
    cursor: pointer;
`

const ModalExitIcon = styled.img``

const ModalInputs = styled.div`
    display: grid;
    grid-template-rows: 50% 50%;
`

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    return (
        <>
            <Overlay $isOpen={isOpen} onClick={onClose} />
            <ModalWrapper $isOpen={isOpen}>
                <ModalTitle>Сортировка</ModalTitle>
                <ModalCloseButton onClick={onClose}>
                    <ModalExitIcon src={exitIcon} />
                </ModalCloseButton>
                <ModalInputs>{children}</ModalInputs>
            </ModalWrapper>
        </>
    )
}

export default Modal
