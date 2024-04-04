package main.repositories;

import main.entities.Restaurante.Menu.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    @Query("SELECT i FROM IngredienteMenu i WHERE i.ingrediente.nombre = :nombre")
    Ingrediente findByName(@Param("nombre") String nombre);

}