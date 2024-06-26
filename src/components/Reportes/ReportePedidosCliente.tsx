import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { format, parseISO } from 'date-fns';
import '../../styles/reportes.css';

interface PedidoCliente {
    fecha: string;
    cliente: string;
}

const data: PedidoCliente[] = [
    { fecha: '2023-06-01', cliente: 'Cliente A' },
    { fecha: '2023-06-02', cliente: 'Cliente B' },
    // Agrega más datos de ejemplo según sea necesario
];

const ReportePedidosCliente: React.FC = () => {
    const [fechaInicio, setFechaInicio] = useState<string>('2023-06-01');
    const [fechaFin, setFechaFin] = useState<string>('2023-06-30');
    const [filteredData, setFilteredData] = useState<PedidoCliente[]>(data);

    useEffect(() => {
        handleFilter();
    }, [fechaInicio, fechaFin]);

    const handleFilter = () => {
        const inicio = parseISO(fechaInicio);
        const fin = parseISO(fechaFin);
        const filtered = data.filter(pedido => {
            const fechaPedido = parseISO(pedido.fecha);
            return fechaPedido >= inicio && fechaPedido <= fin;
        });
        setFilteredData(filtered);
    };

    const calcularPedidosPorCliente = () => {
        const pedidosPorCliente = filteredData.reduce((acc, pedido) => {
            if (!acc[pedido.cliente]) {
                acc[pedido.cliente] = 0;
            }
            acc[pedido.cliente]++;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(pedidosPorCliente).sort((a, b) => b[1] - a[1]);
    };

    const pedidosData = calcularPedidosPorCliente();

    const chartData = [
        ['Cliente', 'Cantidad de Pedidos'],
        ...pedidosData.map(([cliente, cantidad]) => [cliente, cantidad])
    ];

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Reporte de pedidos por cliente -</h1>
                <hr />
                <div className="filtros">
                    <div className="filtros-container">
                        <div className="fechas">
                            <div style={{ marginRight: '10px', }}>
                                <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha inicio:</label>
                                <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                            </div>

                            <div>
                                <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha fin:</label>
                                <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <button className='btn-agregar' style={{ marginTop: '7.7px' }} onClick={handleFilter}>Filtrar</button>
                </div>
                <div className="btns-excel">

                    <button className='btn-excel'>Generar excel</button>
                </div>

                <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={chartData}
                    options={{
                        title: 'Cantidad de Pedidos por Cliente',
                        hAxis: { title: 'Cliente' },
                        vAxis: { title: 'Cantidad de Pedidos' },
                    }}
                />
            </div>
        </>
    );
};

export default ReportePedidosCliente;
