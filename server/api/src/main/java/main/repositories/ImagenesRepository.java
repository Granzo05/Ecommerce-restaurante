package main.repositories;

import main.entities.Productos.Imagenes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenesRepository extends JpaRepository<Imagenes, Long> {

    @Query("SELECT i FROM Imagenes i WHERE i.articuloMenu.id = :id ")
    List<Imagenes> findByIdMenu(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i WHERE i.articuloVenta.id = :id")
    List<Imagenes> findByIdArticulo(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i WHERE i.categoria.id = :id")
    List<Imagenes> findByIdCategoria(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i WHERE i.sucursal.id = :id")
    List<Imagenes> findByIdSucursal(@Param("id") Long id);

    @Query("SELECT i FROM Imagenes i WHERE i.empresa.id = :id")
    List<Imagenes> findByIdEmpresa(@Param("id") Long id);
}