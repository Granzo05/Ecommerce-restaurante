package main.repositories;

import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    @Query("SELECT i FROM Ingrediente i WHERE i.nombre = :nombre AND i.borrado = 'NO'")
    Optional<Ingrediente> findByName(@Param("nombre") String nombre);

    @Query("SELECT NEW main.entities.Ingredientes.IngredienteDTO(i.id, i.nombre, i.borrado) FROM Ingrediente i")
    List<IngredienteDTO> findAllDTO();

    @Query("SELECT i FROM Ingrediente i WHERE i.id = :id AND i.borrado = 'NO'")
    Optional<Ingrediente> findByIdNotBorrado(@Param("id") Long id);

    @Query("SELECT i FROM Ingrediente i WHERE i.nombre = :nombre AND i.borrado = 'NO'")
    Optional<Ingrediente> findByNombreNotBorrado(@Param("nombre") String nombre);
}