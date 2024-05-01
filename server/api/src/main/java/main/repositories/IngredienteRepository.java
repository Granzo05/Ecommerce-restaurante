package main.repositories;

import main.entities.Ingredientes.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    @Query("SELECT i FROM Ingrediente i WHERE i.nombre = :nombre")
    Ingrediente findByName(@Param("nombre") String nombre);


}