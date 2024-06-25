import { ReactNode, useState } from 'react';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { Empresa } from '../types/Restaurante/Empresa';
import NotFound from '../pages/notFound';

export const RutaPrivadaSucursal = ({ children }: { children: ReactNode }) => {
    const [sucursal] = useState<Sucursal | null>(() => {
        const storedUser = localStorage.getItem('sucursal');
        return storedUser ? (JSON.parse(storedUser) as Sucursal) : null;
    });

    const [empresa] = useState<Empresa | null>(() => {
        const storedUser = localStorage.getItem('empresa');
        return storedUser ? (JSON.parse(storedUser) as Empresa) : null;
    });

    if (empresa || sucursal) {
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