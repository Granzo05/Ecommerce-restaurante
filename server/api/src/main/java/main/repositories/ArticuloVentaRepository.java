package main.repositories;

import main.entities.Productos.ArticuloVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloVentaRepository extends JpaRepository<ArticuloVenta, Long> {
    @Query("SELECT a FROM ArticuloVenta a WHERE a.nombre = :nombre")
    Optional<ArticuloVenta> findByName(@Param("nombre") String nombre);

    @Query("SELECT a FROM ArticuloVenta a JOIN a.sucursales s WHERE s.id = :idSucursal")
    List<ArticuloVenta> findAllBySucursal(@Param("idSucursal") Long idSucursal);

    @Query("SELECT a FROM ArticuloVenta a JOIN a.sucursales s WHERE a.id = :idMenu AND s.id = :idSucursal")
    Optional<ArticuloVenta> findByIdArticuloAndIdSucursal(@Param("idMenu") Long idMenu, @Param("idSucursal") Long idSucursal);

    @Query("SELECT a FROM ArticuloVenta a JOIN a.sucursales s WHERE a.nombre = :nombre AND s.id = :idSucursal")
    Optional<ArticuloVenta> findByNameArticuloAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT a FROM ArticuloVenta a JOIN a.sucursales s WHERE a.nombre LIKE %:nombre% AND s.id = :idSucursal")
    List<ArticuloVenta> findByNameArticuloAndIdSucursalEquals(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT a FROM ArticuloVenta a JOIN a.sucursales s WHERE a.categoria.nombre = :nombre AND s.id = :idSucursal")
    List<ArticuloVenta> findByCategoriaNameAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT count(a) FROM ArticuloVenta a JOIN a.sucursales sucursal JOIN sucursal.stocksArticulo stock WHERE a.categoria.id = :idCategoria AND sucursal.id = :idSucursal AND stock.articuloVenta.categoria.id = :idCategoria AND stock.cantidadActual > stock.cantidadMinima AND stock.cantidadActual > 0")
    int findCantidadDisponiblesByIdCategoriaAndIdSucursal(@Param("idCategoria") Long idCategoria, @Param("idSucursal") Long idSucursal);
}