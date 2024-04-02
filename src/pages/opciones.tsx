import { useState } from 'react';
import PedidosEntrantes from '../components/Pedidos/PedidosEntrantesRestaurante';
import PedidosAceptados from '../components/Pedidos/PedidosAceptadosRestaurante';
import PedidosEntregados from '../components/Pedidos/PedidosEntregadosRestaurante';
import Stock from '../components/Stock/Stock';
import Empleados from '../components/Empleados/Empleados';
import Menus from '../components/Menus/Menus';

const Opciones = () => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(1);

    const handleOpcionClick = (opcion: number) => {
        setOpcionSeleccionada(opcion);
    };

    const renderInformacion = () => {

        if (opcionSeleccionada === 1) {
            return <PedidosEntrantes />;
        } else if (opcionSeleccionada === 2) {
            return <PedidosAceptados />;
        } else if (opcionSeleccionada === 3) {
            return <PedidosEntregados />;
        } else if (opcionSeleccionada === 4) {
            return <Stock />;
        } else if (opcionSeleccionada === 5) {
            return <Menus />;
        } else if (opcionSeleccionada === 6) {
            return <Empleados />;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '350px', backgroundColor: '#f0f0f0', color: 'black', cursor: 'pointer', padding: '25px' }}>
                <p onClick={() => handleOpcionClick(1)}>Pedidos entrantes</p>
                <p onClick={() => handleOpcionClick(2)}>Pedidos aceptados</p>
                <p onClick={() => handleOpcionClick(3)}>Pedidos entregados</p>
                <p onClick={() => handleOpcionClick(4)}>Stock</p>
                <p onClick={() => handleOpcionClick(5)}>Menus</p>
                <p onClick={() => handleOpcionClick(6)}>Empleados</p>
            </div>
            <div style={{ flex: 1 }}>
                {renderInformacion()}
            </div>
        </div>
    );
};

export default Opciones;
