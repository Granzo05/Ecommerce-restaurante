package main.repositories;

import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    @Query("SELECT c FROM Categoria c WHERE c.denominacion = :nombre")
    Optional<Categoria> findByName(@Param("nombre") String nombre);

    @Query("SELECT NEW main.entities.Ingredientes.CategoriaDTO(c.id, c.denominacion, c.borrado) FROM Categoria c")
    List<CategoriaDTO> findAllDTO();

    @Query("SELECT c FROM Categoria c WHERE c.id = :id AND c.borrado = 'NO'")
    Optional<Categoria> findByIdNotBorrado(@Param("id") Long id);

    @Query("SELECT c FROM Categoria c WHERE c.denominacion = :nombre AND c.borrado = 'NO'")
    Optional<Categoria> findByNombreNotBorrado(@Param("nombre") String nombre);
}