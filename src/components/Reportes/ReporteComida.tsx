import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { PedidoService } from '../../services/PedidoService';
import '../../styles/reportes.css';

const ReporteComidas: React.FC = () => {
    const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
    const [fechaFin, setFechaFin] = useState<Date>(new Date());
    const [rankingData, setRankingData] = useState<[string, number][]>([]);

    function convertirFecha(fecha: Date): string {
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear().toString();
    
        return `${año}-${mes}-${dia}`;
      }

    useEffect(() => {
        handleFilter();
    }, [fechaInicio, fechaFin]);

    const handleFilter = async () => {
        try {
            const data = await PedidoService.getTopComidas(convertirFecha(fechaInicio), convertirFecha(fechaFin));
            setRankingData(data);
        } catch (error) {
            console.error('Error fetching top comidas:', error);
        }
    };

    const chartData: (string | number)[][] = [
        ['Comida', 'Cantidad de Pedidos'],
        ...rankingData.map(item => [item[0], item[1]])
    ];

    return (
        <div className="opciones-pantallas">
            <h1>- Ranking de comidas más pedidas -</h1>
            <hr />

            <div className="filtros">
                <div className="filtros-container">
                    <div className="fechas">
                        <div style={{ marginRight: '10px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha inicio:</label>
                            <input type="date" onChange={e => (setFechaInicio(new Date(e.target.value)))} />
                        </div>
                        <div>
                            <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha fin:</label>
                            <input type="date" onChange={e => setFechaFin(new Date(e.target.value))} />
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
                    title: 'Ranking de Comidas Más Pedidas',
                    hAxis: { title: 'Comida' },
                    vAxis: { title: 'Cantidad de Pedidos' },
                }}
            />
        </div>
    );
};

export default ReporteComidas;
