import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './side-drawer.scss';

const SideDrawer = (props) => {
  //https://github.com/reactjs/react-transition-group/releases/tag/v4.4.0
  const nodeRef = React.useRef(null);
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
    >
      <aside ref={nodeRef} className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
