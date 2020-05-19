import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './backdrop';
import './modal.scss';

const ModalOverlay = React.forwardRef(
  (
    {
      className,
      style,
      headerClass,
      header,
      onSubmit,
      contentClass,
      footerClass,
      footer,
      children,
    },
    ref
  ) => {
    const defaultSubmit = (e) => e.preventDefault();

    const content = (
      <div ref={ref} className={`modal ${className}`} style={style}>
        <header className={`modal__header ${headerClass}`}>
          <h2>{header}</h2>
        </header>
        <form onSubmit={onSubmit ? onSubmit : defaultSubmit}>
          <div className={`modal__content ${contentClass}`}>{children}</div>
          <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
        </form>
      </div>
    );

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
  }
);

const Modal = ({ show, onCancel, ...rest }) => {
  const nodeRef = React.useRef(null);

  return (
    <React.Fragment>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        nodeRef={nodeRef}
        in={show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay ref={nodeRef} {...rest} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
