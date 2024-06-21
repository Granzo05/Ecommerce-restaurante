package main.repositories;

import main.entities.Productos.Imagenes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenesRepository extends JpaRepository<Imagenes, Long> {

    @Query("SELECT i FROM Imagenes i JOIN i.articulosMenu a WHERE a.id = :id AND i.borrado = 'NO'")
    List<Imagenes> findByIdMenu(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i JOIN i.articulosVenta a WHERE a.id = :id AND i.borrado = 'NO'")
    List<Imagenes> findByIdArticulo(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i JOIN i.categorias c WHERE c.id = :id AND i.borrado = 'NO'")
    List<Imagenes> findByIdCategoria(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i JOIN i.sucursales s WHERE s.id = :id AND i.borrado = 'NO'")
    List<Imagenes> findByIdSucursal(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i JOIN i.empresas e WHERE e.id = :id AND i.borrado = 'NO'")
    List<Imagenes> findByIdEmpresa(@Param("id") Long id);
}