import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { cargarMenu } from '../js/menu'

function RestaurantesPorComida() {
  const { idMenu } = useParams()

  useEffect(() => {
    if (idMenu)
      cargarMenu(parseInt(idMenu))

  }, [idMenu])
  return (
    <div id="grid-container">
      
    </div>
  )
}

export default RestaurantesPorComida
