import { ReactNode, useState } from 'react';
import { Empresa } from '../types/Restaurante/Empresa';
import NotFound from '../pages/notFound';

export const RutaPrivadaEmpresa = ({ children }: { children: ReactNode }) => {

    const [empresa] = useState<Empresa | null>(() => {
        const storedUser = localStorage.getItem('empresa');
        return storedUser ? (JSON.parse(storedUser) as Empresa) : null;
    });

    if (empresa) {
        return (
            <>
                {children}
            </>
        );
    } else {
        return (
            <>
                <NotFound />
            </>
        );
    }
};