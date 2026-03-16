import { render } from "@testing-library/react";
import { AuthProvider } from '../context/AuthContext';
import { TimeoutProvider } from "../context/TimeoutContext";
import { HashRouter } from 'react-router-dom';


export const rtRender = ( children ) => {

    return render(
        <HashRouter>
            <AuthProvider>
                <TimeoutProvider>
                    {children}
                </TimeoutProvider>
            </AuthProvider>
        </HashRouter>

    );

};