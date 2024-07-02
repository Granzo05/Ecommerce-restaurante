import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { parseISO, format } from 'date-fns';
import '../../styles/reportes.css';
import { ReportesServices } from '../../services/ReportesServices';
import { formatearFechaReportesYYYYMMDD, formatearFechaYYYYMMDD } from '../../utils/global_variables/functions';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { convertirFecha } from '../../utils/global_variables/const';
import { toast, Toaster } from 'sonner';

export type IngresoData = {
    fecha: Date;
    monto: number;
};

const ReporteComidas: React.FC = () => {
    const [datosChartBar, setDatosChartBar] = useState<any[]>([]);
    const [fechaDesde, setFechaDesde] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
    const [fechaHasta, setFechaHasta] = useState<Date>(new Date(Date.now()));

    const getBarChart = async () => {
        if (fechaDesde && fechaHasta) {
            const fechaDesdeForm = convertirFecha(fechaDesde);
            const fechaHastaForm = convertirFecha(fechaHasta);

            if (fechaDesdeForm && fechaHastaForm) {
                const datos = await ReportesServices.getPedidosGraficoBarraComidas(fechaDesdeForm, fechaHastaForm);
                /*
                const datos = [
                    ['Fecha', 'Cantidad de Pedidos', "{ role: 'annotation' }"],
                    ['2024-01', 110, 'Pizza muzzarella'],
                    ['2024-01', 100, 'Hamburguesa'],
                    ['2024-01', 90, 'Lomo'],
                    ['2024-02', 150, 'Pizza muzzarella'],
                    ['2024-02', 158, 'Hamburguesa'],
                    ['2024-02', 153, 'Lomo'],
                    ['2024-03', 522, 'Pizza muzzarella'],
                    ['2024-03', 534, 'Hamburguesa'],
                    ['2024-03', 455, 'Lomo'],
                    ['2024-04', 325, 'Pizza muzzarella'],
                    ['2024-04', 482, 'Hamburguesa'],
                    ['2024-04', 452, 'Lomo'],
                    ['2024-05', 486, 'Pizza muzzarella'],
                    ['2024-05', 420, 'Hamburguesa'],
                    ['2024-05', 137, 'Lomo'],
                    ['2024-06', 867, 'Lomo'],
                    ['2024-06', 537, 'Hamburguesa'],
                    ['2024-06', 563, 'Pizza muzzarella'],
                    ['2024-07', 786, 'Lomo'],
                    ['2024-07', 576, 'Pizza muzzarella'],
                    ['2024-07', 78, 'Hamburguesa'],
                    ['2024-08', 687, 'Pizza muzzarella'],

                ];
                */
                if (datos.length > 1) {
                    const datosTransformados = datos.map((fila: any, index: number) => {
                        if (index === 0) {
                            return ['Fecha', 'Cantidad de Pedidos', { role: 'annotation' }];
                        }
                        return [fila[0], fila[1], fila[2]];
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
            await ReportesServices.descargarExcelGraficos(datosChartBar, 'Ranking de comidas');
        } else {
            toast.error('No hay datos para exportar');
        }
    };

    const options = {
        title: 'Ranking de Comidas Más Pedidas',
        legend: { position: 'none' },
        bars: 'horizontal',
        axes: {
            x: {
                0: { side: 'top', label: 'Cantidad de Pedidos' }
            }
        },
        bar: { groupWidth: '35%' }
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Reporte de Comidas Famosas -</h1>
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
                height="800px"
                data={datosChartBar}
                options={options}
            />
        </div>
    );
};

export default ReporteComidas;
