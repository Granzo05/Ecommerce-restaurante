import { ReactNode, useState } from 'react';
import { Empleado } from '../types/Restaurante/Empleado';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { Empresa } from '../types/Restaurante/Empresa';
import NotFound from '../pages/notFound';

export const RutaPrivadaEmpleado = ({ children }: { children: ReactNode }) => {
    const [empleado] = useState<Empleado | null>(() => {
        const storedUser = localStorage.getItem('empleado');
        return storedUser ? (JSON.parse(storedUser) as Empleado) : null;
    });

    const [sucursal] = useState<Sucursal | null>(() => {
        const storedUser = localStorage.getItem('sucursal');
        return storedUser ? (JSON.parse(storedUser) as Sucursal) : null;
    });

    const [empresa] = useState<Empresa | null>(() => {
        const storedUser = localStorage.getItem('empresa');
        return storedUser ? (JSON.parse(storedUser) as Empresa) : null;
    });

    if (empleado || sucursal || empresa) {
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