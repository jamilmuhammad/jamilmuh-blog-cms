import React, { ReactNode } from 'react';
import c from 'clsx';


interface ModalProps {
    show: boolean,
    children: ReactNode
}

const Modal = ({ show, children }: ModalProps) => {

    return (
        <div className={c('fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5', show ? 'block' : 'hidden')}>
            <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                {children}
            </div>
        </div>
    );
};

export default Modal;