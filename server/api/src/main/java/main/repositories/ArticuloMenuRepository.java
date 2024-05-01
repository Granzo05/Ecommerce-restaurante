package main.repositories;

import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Productos.ArticuloMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloMenuRepository extends JpaRepository<ArticuloMenu, Long> {
    @Query("SELECT m FROM ArticuloMenu m WHERE m.nombre = :nombre AND m.borrado = 'NO'")
    Optional<ArticuloMenu> findByName(@Param("nombre") String nombre);

    @Query("SELECT m FROM ArticuloMenu m WHERE m.borrado = 'NO'")
    List<ArticuloMenu> findAllByNotBorrado();

    @Query("SELECT m FROM ArticuloMenu m WHERE m.borrado = 'NO' AND m.tipo = :tipo")
    List<ArticuloMenu> findByType(EnumTipoEnvio tipo);
}