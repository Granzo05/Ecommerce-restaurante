package main.repositories;

import main.entities.Ingredientes.Categoria;
import main.entities.Productos.ArticuloMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloMenuRepository extends JpaRepository<ArticuloMenu, Long> {
    @Query("SELECT m FROM ArticuloMenu m WHERE m.nombre = :nombre")
    Optional<ArticuloMenu> findByName(@Param("nombre") String nombre);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE s.id = :idSucursal")
    List<ArticuloMenu> findAllBySucursal(@Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.id = :idMenu AND s.id = :idSucursal")
    Optional<ArticuloMenu> findByIdMenuAndIdSucursal(@Param("idMenu") Long idMenu, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.nombre = :nombre AND s.id = :idSucursal")
    Optional<ArticuloMenu> findByNameMenuAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.categoria.id = :idCategoria AND s.id = :idSucursal")
    List<ArticuloMenu> findByCategoriaAndIdSucursal(@Param("idCategoria") Long idCategoria, @Param("idSucursal") Long idSucursal);
}