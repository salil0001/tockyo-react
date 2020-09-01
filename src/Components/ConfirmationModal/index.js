import React from 'react'
import './index.scss';
export default function Modal(props) {
    return (
        <div className="confirmation-modal-parent">
           <div className="modal-child">
            {props.children}
           </div>
        </div>
    )
}