package main.repositories;

import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloMenuDTO;
import main.entities.Productos.EnumTipoArticuloComida;
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

    @Query("SELECT NEW main.entities.Productos.ArticuloMenuDTO(m.id, m.nombre,m.precioVenta ,m.tiempoCoccion, m.tipo, m.comensales, m.descripcion, m.borrado) FROM ArticuloMenu m JOIN m.sucursales s WHERE s.id = :idSucursal")
    List<ArticuloMenuDTO> findAllBySucursal( @Param("idSucursal") Long idSucursal);

    @Query("SELECT NEW main.entities.Productos.ArticuloMenuDTO(m.id, m.nombre,m.precioVenta ,m.tiempoCoccion, m.tipo, m.comensales, m.descripcion, m.borrado) FROM ArticuloMenu m JOIN m.sucursales s WHERE m.id = :idMenu AND s.id = :idSucursal")
    Optional<ArticuloMenu> findByIdMenuAndIdSucursal(@Param("idMenu") Long idMenu, @Param("idSucursal") Long idSucursal);

    @Query("SELECT NEW main.entities.Productos.ArticuloMenuDTO(m.id, m.nombre,m.precioVenta ,m.tiempoCoccion, m.tipo, m.comensales, m.descripcion, m.borrado) FROM ArticuloMenu m JOIN m.sucursales s WHERE m.id = :idMenu AND s.id = :idSucursal")
    Optional<ArticuloMenuDTO> findByIdMenuAndIdSucursalDTO(@Param("idMenu") Long idMenu, @Param("idSucursal") Long idSucursal);

    @Query("SELECT NEW main.entities.Productos.ArticuloMenuDTO(m.id, m.nombre,m.precioVenta ,m.tiempoCoccion, m.tipo, m.comensales, m.descripcion, m.borrado) FROM ArticuloMenu m JOIN m.sucursales s WHERE m.tipo = :tipo AND s.id = :idSucursal")
    List<ArticuloMenuDTO> findByTipoAndIdSucursal(EnumTipoArticuloComida tipo,@Param("idSucursal") Long idSucursal);
}