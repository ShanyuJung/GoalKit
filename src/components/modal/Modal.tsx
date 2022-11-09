import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.75);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 15vh;
  left: 5%;
  width: 90%;
  background-color: white;
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 30;
  animation: slide-down 300ms ease-out forwards;
  max-height: 80vh;
  overflow-y: scroll;

  @media (min-width: 768px) {
    .modal {
      width: 40rem;
      left: calc(50% - 20rem);
    }
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
  onClose: any;
  children: React.ReactNode;
}

const Modal = (props: Props) => {
  if (!portalElement) return <></>;
  const { onClose } = props;
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={onClose} />, portalElement)}
      {props.children &&
        ReactDOM.createPortal(
          <ModalOverlay>
            <div>{props.children}</div>
          </ModalOverlay>,
          portalElement
        )}
    </>
  );
};

export default Modal;
