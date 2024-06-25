package main.repositories;

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

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE s.id = :idSucursal AND m.borrado = 'NO'")
    List<ArticuloMenu> findAllBySucursalNotBorrado(@Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.id = :idMenu AND s.id = :idSucursal")
    Optional<ArticuloMenu> findByIdMenuAndIdSucursal(@Param("idMenu") Long idMenu, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.nombre = :nombre AND s.id = :idSucursal")
    Optional<ArticuloMenu> findByNameMenuAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.nombre LIKE %:nombre% AND s.id = :idSucursal AND m.borrado = 'NO'")
    List<ArticuloMenu> findByNameMenuAndIdSucursalEqualsNotBorrado(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.categoria.nombre LIKE %:nombre% AND s.id = :idSucursal")
    List<ArticuloMenu> findByNameCategoriaMenuAndIdSucursalEquals(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s WHERE m.subcategoria.nombre LIKE %:nombre% AND s.id = :idSucursal")
    List<ArticuloMenu> findByNameSubcategoriaMenuAndIdSucursalEquals(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s JOIN m.ingredientesMenu ing WHERE m.categoria.id = :idCategoria AND s.id = :idSucursal")
    List<ArticuloMenu> findByIdCategoriaAndIdSucursal(@Param("idCategoria") Long idCategoria, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM ArticuloMenu m JOIN m.sucursales s JOIN m.ingredientesMenu ing WHERE m.categoria.id = :idCategoria AND s.id = :idSucursal AND m.borrado = 'NO'")
    List<ArticuloMenu> findByIdCategoriaAndIdSucursalNotBorrado(@Param("idCategoria") Long idCategoria, @Param("idSucursal") Long idSucursal);

    @Query("SELECT COUNT(m) FROM ArticuloMenu m LEFT JOIN m.sucursales sucursal LEFT JOIN StockIngredientes stock ON stock.ingrediente.id = :idIngrediente WHERE m.categoria.id = :idCategoria AND sucursal.id = :idSucursal " +
            "AND stock.cantidadActual > stock.cantidadMinima AND stock.cantidadActual > 0 AND stock.ingrediente.id = :idIngrediente"
    )
    int findCantidadDisponiblesByIdCategoriaAndIdSucursal(@Param("idCategoria") Long idCategoria, @Param("idIngrediente") Long idIngrediente, @Param("idSucursal") Long idSucursal);

}