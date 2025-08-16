import type {ReactNode} from 'react';
import Sidebar from './Overlay/Sidebar';

interface OverlayProps {
    children:ReactNode;
}

const Overlay = ({children}: OverlayProps) =>{
    return (
    <>
    <Sidebar/>
        {children}
    </>
    )
}

export default Overlay;