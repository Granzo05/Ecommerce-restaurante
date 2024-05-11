package main.repositories;

import main.entities.Productos.ImagenesProducto;
import main.entities.Productos.ImagenesProductoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenesProductoRepository extends JpaRepository<ImagenesProducto, Long> {
    @Query("SELECT NEW main.entities.Productos.ImagenesProductoDTO(i.id, i.nombre, i.ruta, i.formato) FROM ImagenesProducto i WHERE i.ruta = :nombre AND i.borrado = 'NO'")
    ImagenesProductoDTO findByRuta(@Param("nombre") String nombre);

    @Query("SELECT NEW main.entities.Productos.ImagenesProductoDTO(i.id, i.nombre, i.ruta, i.formato) FROM ImagenesProducto i WHERE i.articuloMenu.id = :id AND i.borrado = 'NO'")
    List<ImagenesProductoDTO> findByIdMenu(@Param("id") Long id);
}