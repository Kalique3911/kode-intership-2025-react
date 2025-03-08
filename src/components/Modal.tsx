import React from "react"
import styled from "styled-components"

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
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
    transition: opacity 0.1s ease, visibility 0.1s ease;
`

const ModalWrapper = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(${({ $isOpen }) => ($isOpen ? 1 : 0.8)});
    background: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 1001;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
    transition: opacity 0.1s ease, transform 0.1s ease, visibility 0.1s ease;
`

const ModalCloseButton = styled.button``

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    return (
        <>
            <Overlay $isOpen={isOpen} onClick={onClose} />
            <ModalWrapper $isOpen={isOpen}>
                <ModalCloseButton onClick={onClose}>X</ModalCloseButton>
                {children}
            </ModalWrapper>
        </>
    )
}

export default Modal
