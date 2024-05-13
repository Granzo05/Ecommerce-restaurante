package main.repositories;

import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.EnumTipoArticuloComida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloVentaRepository extends JpaRepository<ArticuloVenta, Long> {
    @Query("SELECT a FROM ArticuloVenta a WHERE a.nombre = :nombre AND a.borrado = 'NO'")
    Optional<ArticuloVenta> findByName(@Param("nombre") String nombre);

    @Query("SELECT a FROM ArticuloVenta a WHERE a.borrado = 'NO'")
    List<ArticuloVenta> findAllByNotBorrado();

    @Query("SELECT a FROM ArticuloVenta a WHERE a.borrado = 'NO' AND a.tipo = :tipo")
    List<ArticuloVenta> findByType(EnumTipoArticuloComida tipo);
}