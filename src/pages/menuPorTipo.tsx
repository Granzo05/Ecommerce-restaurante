import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { cargarGrids } from '../js/menusPorTipoComida'

function RestaurantesPorComida() {
  const { tipoComida } = useParams()

  useEffect(() => {
    if (tipoComida)
      cargarGrids(tipoComida)

  }, [tipoComida])
  return (
    <div id="grid-container">
      
    </div>
  )
}

export default RestaurantesPorComida
