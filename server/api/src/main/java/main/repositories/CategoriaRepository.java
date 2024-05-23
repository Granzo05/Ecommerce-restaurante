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
    @Query("SELECT c FROM Categoria c WHERE c.denominacion = :denominacion AND c.sucursal = :id")
    Optional<Categoria> findByDenominacionAndIdSucursal(@Param("denominacion") String denominacion, @Param("id") Long id);

    @Query("SELECT c FROM Categoria c WHERE c.id = :idCategoria AND c.sucursal = :idSucursal")
    Optional<Categoria> findByIdCategoriaAndIdSucursal(@Param("idCategoria") Long idCategoria, @Param("idSucursal") Long idSucursal);

    @Query("SELECT NEW main.entities.Ingredientes.CategoriaDTO(c.id, c.denominacion, c.borrado) FROM Categoria c WHERE c.sucursal = :id")
    List<CategoriaDTO> findAllDTOByIdSucursal(@Param("id") Long id);
}