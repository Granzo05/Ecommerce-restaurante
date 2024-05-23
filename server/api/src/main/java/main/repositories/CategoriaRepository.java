package main.repositories;

import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    @Query("SELECT c FROM Categoria c JOIN c.sucursales s WHERE s.id = :id AND c.denominacion = :denominacion")
    Optional<Categoria> findByDenominacionAndIdSucursal(@Param("denominacion") String denominacion, @Param("id") Long id);

    @Query("SELECT c FROM Categoria c JOIN c.sucursales s WHERE s.id = :idSucursal AND c.id = :idCategoria")
    Optional<Categoria> findByIdCategoriaAndIdSucursal(@Param("idCategoria") Long idCategoria, @Param("idSucursal") Long idSucursal);

    @Query("SELECT NEW main.entities.Ingredientes.CategoriaDTO(c.id, c.denominacion, c.borrado) FROM Categoria c JOIN c.sucursales s WHERE s.id = :id")
    List<CategoriaDTO> findAllDTOByIdSucursal(@Param("id") Long id);
}