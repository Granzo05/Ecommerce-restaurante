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

    const descargarExcel = () => {
        if (!datosChartBar || datosChartBar.length === 0) {
            console.error('No hay datos para exportar.');
            return;
        }

        try {
            let datosFiltrados: any[] = [];

            if (fechaDesde && fechaHasta === null) {
                datosFiltrados = datosChartBar.filter(ingreso => {
                    const fechaIngreso = new Date(ingreso.fecha);
                    return fechaIngreso >= fechaDesde && fechaIngreso <= new Date(Date.now());
                });
            } else if (fechaHasta && fechaDesde === null) {
                datosFiltrados = datosChartBar.filter(ingreso => {
                    const fechaIngreso = new Date(ingreso.fecha);
                    return fechaIngreso >= new Date(2020 - 1900, 0, 1) && fechaIngreso <= fechaHasta;
                });
            } else if (fechaDesde && fechaHasta) {
                datosFiltrados = datosChartBar.filter(ingreso => {
                    const fechaIngreso = new Date(ingreso.fecha);
                    return fechaIngreso >= fechaDesde && fechaIngreso <= fechaHasta;
                });
            }

            // Preparar datos para el archivo Excel
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(datosFiltrados);
            XLSX.utils.book_append_sheet(wb, ws, 'ComidasPopulares');

            // Generar el archivo Excel
            const nombreArchivo = 'comidasPopulares.xlsx';
            XLSX.writeFile(wb, nombreArchivo);

            // Descargar el archivo generado
            saveAs(new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], { type: "application/octet-stream" }), nombreArchivo);
        } catch (error) {
            console.error('Error al generar el archivo Excel:', error);
        }
    };

    // Función auxiliar para convertir una cadena de caracteres a una matriz de bytes
    function s2ab(s: string): ArrayBuffer {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const options = {
        title: 'Ranking de Comidas Más Pedidas',
        legend: { position: 'none' },
        bars: 'horizontal',
        axes: {
            x: {
                0: { side: 'top', label: 'Cantidad de Pedidos' }
            }
        }
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Reporte de Comidas Famosas -</h1>
            <Toaster/>
            <hr />
            <div className="filtros">
                <div className="filtros-container">
                    <div className="fechas">
                        <div style={{ marginRight: '10px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha inicio:</label>
                            <input type="date" value={formatearFechaReportesYYYYMMDD(fechaDesde)} onChange={e => setFechaDesde(new Date(e.target.value))} />
                        </div>
                        <div>
                            <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha fin:</label>
                            <input type="date" value={formatearFechaReportesYYYYMMDD(fechaHasta)} onChange={e => setFechaHasta(new Date(e.target.value))} />
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

export default ReporteComidas;
