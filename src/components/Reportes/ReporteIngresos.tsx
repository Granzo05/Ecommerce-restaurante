import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { parseISO, format } from 'date-fns';
import '../../styles/reportes.css';
import { ReportesServices } from '../../services/ReportesServices';
import { formatearFechaDDMMYYYY } from '../../utils/global_variables/functions';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export type IngresoData = {
    fecha: string;
    monto: number;
};

const ReporteIngresos: React.FC = () => {
    const [datosChartBarOriginal, setDatosChartBarOriginal] = useState<any[]>([]);
    const [datosChartBar, setDatosChartBar] = useState<any[]>([]);
    const [fechaDesde, setFechaDesde] = useState<Date>(new Date(2024, 0, 1));
    const [fechaHasta, setFechaHasta] = useState<Date>(new Date(Date.now()));

    const getBarChart = async () => {
        const datos = await ReportesServices.getPedidosGraficoBarraIngresos(fechaDesde.toString(), fechaHasta.toString());
        setDatosChartBarOriginal(datos);
        setDatosChartBar(datos);
    };

    const handleFilter = () => {
        const filtered = datosChartBarOriginal.filter(ingreso => {
            const fechaIngreso = parseISO(ingreso.fecha);
            return fechaIngreso >= fechaDesde && fechaIngreso <= fechaHasta;
        });
        setDatosChartBar(filtered);

        calcularIngresosPorPeriodo();
    };

    const descargarExcel = () => {
        if (!datosChartBar || datosChartBar.length === 0) {
            console.error('No hay datos para exportar.');
            return;
        }

        try {
            // Filtrar datos según fecha
            const datosFiltrados = datosChartBar.filter(ingreso => {
                const fechaIngreso = new Date(ingreso.fecha);
                return fechaIngreso >= new Date(fechaDesde) && fechaIngreso <= new Date(fechaHasta);
            });

            // Preparar datos para el archivo Excel
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(datosFiltrados);
            XLSX.utils.book_append_sheet(wb, ws, 'Ingresos');

            // Generar el archivo Excel
            const nombreArchivo = 'ingresos.xlsx';
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

    useEffect(() => {
        getBarChart();
    }, []);

    const calcularIngresosPorPeriodo = () => {
        if (datosChartBar) {
            const ingresosPorPeriodo = datosChartBar.reduce((acc, ingreso) => {
                const fecha = format(parseISO(ingreso.fecha), 'yyyy-MM-dd');
                if (!acc[fecha]) {
                    acc[fecha] = 0;
                }
                acc[fecha] += ingreso.monto;
                return acc;
            }, {} as Record<string, number>);

            return Object.entries(ingresosPorPeriodo).sort((a, b) => parseISO(a[0]).getTime() - parseISO(b[0]).getTime());
        }
        return [];
    };

    const optionsBar = {
        title: "Ingresos por mes y año:",
    };

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Reporte de ingresos -</h1>
                <hr />
                <div className="filtros">
                    <div className="filtros-container">
                        <div className="fechas">
                            <div style={{ marginRight: '10px' }}>
                                <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha inicio:</label>
                                <input type="date" value={formatearFechaDDMMYYYY(fechaDesde)} onChange={e => setFechaDesde(new Date(e.target.value))} />
                            </div>
                            <div>
                                <label style={{ display: 'flex', fontWeight: 'bold', color: 'black' }}>Fecha fin:</label>
                                <input type="date" value={formatearFechaDDMMYYYY(fechaHasta)} onChange={e => setFechaHasta(new Date(e.target.value))} />
                            </div>
                        </div>
                    </div>
                    <button className='btn-agregar' style={{ marginTop: '7.7px' }} onClick={handleFilter}>Filtrar</button>
                </div>
                <div className="btns-excel">
                    <button className='btn-excel' onClick={descargarExcel}>Generar excel</button>
                </div>
                <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={datosChartBar}
                    options={optionsBar}
                />
            </div>
        </>
    );
};

export default ReporteIngresos;
