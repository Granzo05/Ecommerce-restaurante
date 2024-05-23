package main.repositories;

import main.entities.Productos.Imagenes;
import main.entities.Productos.ImagenesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenesRepository extends JpaRepository<Imagenes, Long> {

    @Query("SELECT i FROM Imagenes i WHERE i.articuloMenu.id = :id ")
    List<Imagenes> findByIdMenu(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Productos.ImagenesDTO(i.id, i.nombre, i.ruta, i.formato, i.borrado) FROM Imagenes i WHERE i.articuloMenu.id = :id ")
    List<ImagenesDTO> findByIdMenuDTO(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i WHERE i.articuloVenta.id = :id")
    List<Imagenes> findByIdArticulo(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Productos.ImagenesDTO(i.id, i.nombre, i.ruta, i.formato, i.borrado) FROM Imagenes i WHERE i.articuloVenta.id = :id")
    List<ImagenesDTO> findByIdArticuloDTO(@Param("id") Long id);
    @Query("SELECT NEW main.entities.Productos.ImagenesDTO(i.id, i.nombre, i.ruta, i.formato, i.borrado) FROM Imagenes i WHERE i.sucursal.id = :id")
    List<ImagenesDTO> findByIdSucursalDTO(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Productos.ImagenesDTO(i.id, i.nombre, i.ruta, i.formato, i.borrado) FROM Imagenes i WHERE i.empresa.id = :id")
    List<ImagenesDTO> findByIdEmpresaDTO(@Param("id") Long id);
}