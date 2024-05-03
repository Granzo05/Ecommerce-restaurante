package main.repositories;

import main.entities.Productos.ImagenesProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagenesProductoRepository extends JpaRepository<ImagenesProducto, Long> {
    @Query("SELECT i FROM ImagenesProducto i WHERE i.ruta = :nombre")
    ImagenesProducto findByRuta(@Param("nombre") String nombre);


}