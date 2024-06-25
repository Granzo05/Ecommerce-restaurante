import { ReactNode, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Cliente } from '../types/Cliente/Cliente';

export const RutaPrivadaCliente = ({ children }: { children: ReactNode }) => {

    const [usuario] = useState<Cliente | null>(() => {
        const storedUser = localStorage.getItem('usuario');
        return storedUser ? (JSON.parse(storedUser) as Cliente) : null;
    });

    if (!usuario) {
        return <Navigate to='/login-cliente' />;
    } else {
        return (
            <>
                {children}
            </>
        );
    }
};