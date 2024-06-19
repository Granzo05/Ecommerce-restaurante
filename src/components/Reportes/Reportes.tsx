import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { format, parseISO } from 'date-fns';
import '../../styles/reportes.css';

interface Venta {
  fecha: string;
  promocion: boolean;
}

const data: Venta[] = [
  { fecha: '2023-06-01', promocion: false },
  { fecha: '2023-06-02', promocion: true },
  // Agrega más datos de ejemplo según sea necesario
];

const Reportes: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>('2023-06-01');
  const [fechaFin, setFechaFin] = useState<string>('2023-06-30');
  const [filteredData, setFilteredData] = useState<Venta[]>(data);

  useEffect(() => {
    handleFilter();
  }, [fechaInicio, fechaFin]);

  const handleFilter = () => {
    const inicio = parseISO(fechaInicio);
    const fin = parseISO(fechaFin);
    const filtered = data.filter(venta => {
      const fechaVenta = parseISO(venta.fecha);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });
    setFilteredData(filtered);
  };

  const calcularEstadisticas = () => {
    const totalIngresos = filteredData.length;
    const cantidadPromociones = filteredData.filter(venta => venta.promocion).length;
    return { totalIngresos, cantidadPromociones };
  };

  const { totalIngresos, cantidadPromociones } = calcularEstadisticas();

  const groupedData = filteredData.reduce((acc, venta) => {
    const fecha = format(parseISO(venta.fecha), 'yyyy-MM-dd');
    if (!acc[fecha]) {
      acc[fecha] = 0;
    }
    acc[fecha]++;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    ['Fecha', 'Cantidad de Ventas'],
    ...Object.keys(groupedData).map(fecha => [fecha, groupedData[fecha]])
  ];

  return (
    <>
      <div className="opciones-pantallas">
        <h1>- Reporte de ventas -</h1>
        
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
          
          <button className='btn-agregar' style={{marginTop: '7.7px'}} onClick={handleFilter}>Filtrar</button>


        </div>

        <div className="estadisticas-container">
          <p>Total Ventas: {totalIngresos}</p>
          <p>Ventas con Promoción: {cantidadPromociones}</p>
        </div>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            title: 'Cantidad de Ventas por Fecha',
            hAxis: { title: 'Fecha' },
            vAxis: { title: 'Cantidad de Ventas' },
          }}
        />
      </div>
    </>

  );
};

export default Reportes;
