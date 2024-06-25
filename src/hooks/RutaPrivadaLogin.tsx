import { ReactNode, useState } from 'react';
import { Cliente } from '../types/Cliente/Cliente';
import NotFound from '../pages/notFound';

export const RutaPrivadaLogin = ({ children }: { children: ReactNode }) => {

    const [usuario] = useState<Cliente | null>(() => {
        const storedUser = localStorage.getItem('usuario');
        return storedUser ? (JSON.parse(storedUser) as Cliente) : null;
    });

    if (usuario) {
        return (
            <>
                <NotFound />
            </>
        );
    } else {
        return (
            <>
                {children}
            </>
        );
    }
};