package main.repositories;

import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.ArticuloVentaDTO;
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

    @Query("SELECT NEW main.entities.Productos.ArticuloVentaDTO(m.id, m.nombre,m.precioVenta, m.borrado, m.cantidadMedida, m.categoria, m.subcategoria, m.medida) FROM ArticuloVenta m JOIN m.sucursales s WHERE s.id = :idSucursal")
    List<ArticuloVentaDTO> findAllBySucursal(@Param("idSucursal") Long idSucursal);

    @Query("SELECT a FROM ArticuloVenta a JOIN a.sucursales s WHERE a.id = :idMenu AND s.id = :idSucursal")
    Optional<ArticuloVenta> findByIdArticuloAndIdSucursal(@Param("idMenu") Long idMenu, @Param("idSucursal") Long idSucursal);

    @Query("SELECT a FROM ArticuloVenta a JOIN a.sucursales s WHERE a.nombre = :nombre AND s.id = :idSucursal")
    Optional<ArticuloVenta> findByNameArticuloAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);

    @Query("SELECT NEW main.entities.Productos.ArticuloVentaDTO(m.id, m.nombre,m.precioVenta, m.borrado, m.cantidadMedida, m.categoria, m.subcategoria, m.medida) FROM ArticuloVenta m JOIN m.sucursales s WHERE s.id = :idSucursal AND m.nombre = :nombre")
    List<ArticuloVentaDTO> findByCategoriaNameAndIdSucursal(@Param("nombre") String nombre, @Param("idSucursal") Long idSucursal);


}