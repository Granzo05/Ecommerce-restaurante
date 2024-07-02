import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import '../../styles/reportes.css';
import { ReportesServices } from '../../services/ReportesServices';
import { formatearFechaReportesYYYYMMDD } from '../../utils/global_variables/functions';
import { convertirFecha } from '../../utils/global_variables/const';
import { toast, Toaster } from 'sonner';

export type IngresoData = {
    fecha: Date;
    monto: number;
};

const ReporteGanancias: React.FC = () => {
    const [datosChartBar, setDatosChartBar] = useState<any[]>([]);
    const [fechaDesde, setFechaDesde] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
    const [fechaHasta, setFechaHasta] = useState<Date>(new Date(Date.now()));

    const getBarChart = async () => {
        if (fechaDesde && fechaHasta) {
            const fechaDesdeForm = convertirFecha(fechaDesde);
            const fechaHastaForm = convertirFecha(fechaHasta);

            if (fechaDesdeForm && fechaHastaForm) {
                const datos = await ReportesServices.getPedidosGraficoBarraGanancias(fechaDesdeForm, fechaHastaForm);
                console.log(datos)
                if (datos.length > 1) {
                    const datosTransformados = datos.map((fila: any, index: number) => {
                        if (index === 0) {
                            return ['Fecha', 'Ganancia del mes'];
                        }
                        return [fila[0], fila[1]];
                    });

                    setDatosChartBar(datosTransformados);
                } else {
                    toast.info('No hay datos para mostrar entre las fechas ingresadas')
                }
            }
        }
    };

    useEffect(() => {
        getBarChart();
    }, []);


    const descargarExcel = async () => {
        if (datosChartBar.length > 0) {
            await ReportesServices.descargarExcelGraficos(datosChartBar, 'Ganancias');
        } else {
            toast.error('No hay datos para exportar');
        }
    };
    
    const options = {
        title: 'Ganancias mensuales',
        legend: { position: 'none' },
        bars: 'horizontal',
        axes: {
            x: {
                0: { side: 'top', label: 'Ganancias en pesos' }
            }
        }
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Reporte de ganancias mensuales -</h1>
            <Toaster />
            <hr />
            <div className="filtros">
                <div className="filtros-container">
                    <div className="fechas">
                        <div style={{ marginRight: '10px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha inicio:</label>
                            <input type="date" onChange={e => setFechaDesde(new Date(e.target.value))} />
                        </div>
                        <div>
                            <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha fin:</label>
                            <input type="date" onChange={e => setFechaHasta(new Date(e.target.value))} />
                        </div>
                    </div>
                </div>
                <button className='btn-agregar' style={{ marginTop: '7.7px' }} onClick={getBarChart}>Buscar</button>
            </div>
            <div className="btns-excel">
                <button className='btn-excel' onClick={descargarExcel}>Generar excel</button>
            </div>
            <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={datosChartBar}
                options={options}
            />
        </div>
    );
};

export default ReporteGanancias;
