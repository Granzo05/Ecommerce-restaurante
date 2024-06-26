
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { format, parseISO } from 'date-fns';
import '../../styles/reportes.css';

interface Ganancia {
    fecha: string;
    venta: number;
    costo: number;
}

const data: Ganancia[] = [
    { fecha: '2023-06-01', venta: 150, costo: 100 },
    { fecha: '2023-06-02', venta: 250, costo: 200 },
    // Agrega más datos de ejemplo según sea necesario
];

const ReporteGanancias: React.FC = () => {
    const [fechaInicio, setFechaInicio] = useState<string>('2023-06-01');
    const [fechaFin, setFechaFin] = useState<string>('2023-06-30');
    const [filteredData, setFilteredData] = useState<Ganancia[]>(data);

    useEffect(() => {
        handleFilter();
    }, [fechaInicio, fechaFin]);

    const handleFilter = () => {
        const inicio = parseISO(fechaInicio);
        const fin = parseISO(fechaFin);
        const filtered = data.filter(ganancia => {
            const fechaGanancia = parseISO(ganancia.fecha);
            return fechaGanancia >= inicio && fechaGanancia <= fin;
        });
        setFilteredData(filtered);
    };

    const calcularGananciasPorFecha = () => {
        const gananciasPorFecha = filteredData.reduce((acc, ganancia) => {
            const fecha = format(parseISO(ganancia.fecha), 'yyyy-MM-dd');
            if (!acc[fecha]) {
                acc[fecha] = { venta: 0, costo: 0 };
            }
            acc[fecha].venta += ganancia.venta;
            acc[fecha].costo += ganancia.costo;
            return acc;
        }, {} as Record<string, { venta: number, costo: number }>);

        return Object.entries(gananciasPorFecha).map(([fecha, { venta, costo }]) => ({
            fecha,
            ganancia: venta - costo
        })).sort((a, b) => parseISO(a.fecha).getTime() - parseISO(b.fecha).getTime());
    };

    const gananciasData = calcularGananciasPorFecha();

    const chartData = [['Fecha', 'Ganancia'],
    ...gananciasData.map(({ fecha, ganancia }) => [fecha, ganancia])
    ];

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Reporte de ganancias -</h1>

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
                    chartType="LineChart"
                    width="100%"
                    height="400px"
                    data={chartData}
                    options={{
                        title: 'Ganancias por Fecha',
                        hAxis: { title: 'Fecha' },
                        vAxis: { title: 'Ganancia' },
                    }}
                />
            </div>
        </>
    );
};

export default ReporteGanancias;
