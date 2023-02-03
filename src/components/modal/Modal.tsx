import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 80;
  background-color: rgba(0, 0, 0, 0.75);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 15vh;
  left: calc(50vw - 350px);
  width: 700px;
  background-color: #eee;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 90;
  animation: slide-down 300ms ease-out forwards;
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 808px) {
    width: 100%;
    left: 0;
  }
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const portalElement: HTMLElement | null = document.getElementById("overlays");

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ onClose, children }) => {
  if (!portalElement) return <></>;

  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={onClose} />, portalElement)}
      {children &&
        ReactDOM.createPortal(
          <ModalOverlay>
            <div>{children}</div>
          </ModalOverlay>,
          portalElement
        )}
    </>
  );
};

export default Modal;
