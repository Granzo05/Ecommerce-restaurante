package main.repositories;

import main.entities.Ingredientes.Ingrediente;
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

    @Query("SELECT i FROM Ingrediente i WHERE i.borrado = 'NO'")
    List<Ingrediente> findAllByNotBorrado();

    @Query("SELECT i FROM Ingrediente i WHERE i.id = :id AND i.borrado = 'NO'")
    Optional<Ingrediente> findByIdNotBorrado(@Param("id") Long id);
}