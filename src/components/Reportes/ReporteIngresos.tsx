import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { format, parseISO } from 'date-fns';
import '../../styles/reportes.css';

interface Ingreso {
    fecha: string;
    monto: number;
}

const data: Ingreso[] = [
    { fecha: '2023-06-01', monto: 100 },
    { fecha: '2023-06-02', monto: 200 },
    // Agrega más datos de ejemplo según sea necesario
];

const ReporteIngresos: React.FC = () => {
    const [fechaInicio, setFechaInicio] = useState<string>('2023-06-01');
    const [fechaFin, setFechaFin] = useState<string>('2023-06-30');
    const [filteredData, setFilteredData] = useState<Ingreso[]>(data);

    useEffect(() => {
        handleFilter();
    }, [fechaInicio, fechaFin]);

    const handleFilter = () => {
        const inicio = parseISO(fechaInicio);
        const fin = parseISO(fechaFin);
        const filtered = data.filter(ingreso => {
            const fechaIngreso = parseISO(ingreso.fecha);
            return fechaIngreso >= inicio && fechaIngreso <= fin;
        });
        setFilteredData(filtered);
    };

    const calcularIngresosPorPeriodo = () => {
        const ingresosPorPeriodo = filteredData.reduce((acc, ingreso) => {
            const fecha = format(parseISO(ingreso.fecha), 'yyyy-MM-dd');
            if (!acc[fecha]) {
                acc[fecha] = 0;
            }
            acc[fecha] += ingreso.monto;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(ingresosPorPeriodo).sort((a, b) => parseISO(a[0]).getTime() - parseISO(b[0]).getTime());
    };

    const ingresosData = calcularIngresosPorPeriodo();

    const chartData = [
        ['Fecha', 'Ingresos'],
        ...ingresosData.map(([fecha, monto]) => [fecha, monto])
    ];

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Reporte de ingresos -</h1>

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
                        title: 'Ingresos por Fecha',
                        hAxis: { title: 'Fecha' },
                        vAxis: { title: 'Ingresos' },
                    }}
                />
            </div>
        </>
    );
};

export default ReporteIngresos;
