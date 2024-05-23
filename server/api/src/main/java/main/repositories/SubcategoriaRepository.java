package main.repositories;

import main.entities.Ingredientes.Subcategoria;
import main.entities.Ingredientes.IngredienteDTO;
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
    @Query("SELECT s FROM Subcategoria s WHERE s.denominacion = :nombre")
    Optional<Subcategoria> findByName(@Param("nombre") String nombre);

    @Query("SELECT NEW main.entities.Ingredientes.SubcategoriaDTO(s.id, s.denominacion, s.borrado) FROM Subcategoria s")
    List<SubcategoriaDTO> findAllDTO();

    @Query("SELECT NEW main.entities.Ingredientes.SubcategoriaDTO(s.id, s.denominacion, s.borrado) FROM Subcategoria s WHERE s.categoria.id = :id")
    List<SubcategoriaDTO> findByCategoriaId(@Param("id") Long id);

    @Query("SELECT s FROM Subcategoria s WHERE s.denominacion = :nombre AND s.borrado = 'NO'")
    Optional<Subcategoria> findByNombreNotBorrado(@Param("nombre") String nombre);
}