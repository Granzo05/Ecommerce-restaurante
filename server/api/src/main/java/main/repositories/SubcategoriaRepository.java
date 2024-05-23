package main.repositories;

import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.MedidaDTO;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Ingredientes.SubcategoriaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Long> {
    @Query("SELECT s FROM Subcategoria s WHERE s.denominacion = :denominacion AND s.sucursal = :id")
    Optional<Subcategoria> findByDenominacionAndIdSucursal(@Param("denominacion") String denominacion, @Param("id") Long id);

    @Query("SELECT NEW main.entities.Ingredientes.SubcategoriaDTO(s.id, s.denominacion, s.borrado) FROM Subcategoria s WHERE s.sucursal = :id")
    List<SubcategoriaDTO> findAllDTOByIdSucursal(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Ingredientes.SubcategoriaDTO(s.id, s.denominacion, s.borrado) FROM Subcategoria s WHERE s.categoria = :id")
    List<SubcategoriaDTO> findAllDTOByIdCategoria(@Param("id") Long id);
}