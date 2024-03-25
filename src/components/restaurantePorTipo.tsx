// RestaurantesPorComida.js
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { cargarGrids } from '../js/restaurantePorTipo'

function RestaurantesPorComida() {
  const { tipoComida } = useParams()

  useEffect(() => {
    if (tipoComida)
      cargarGrids(tipoComida)
  }, [tipoComida])
  console.log(tipoComida)
  return (
    <div id="grid-container">
      { }
    </div>
  )
}

export default RestaurantesPorComida
