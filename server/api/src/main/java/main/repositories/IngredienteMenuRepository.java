package main.repositories;

import main.entities.Ingredientes.IngredienteMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashSet;


@Repository
public interface IngredienteMenuRepository extends JpaRepository<IngredienteMenu, Long> {
    @Query("SELECT i FROM IngredienteMenu i WHERE i.ingrediente.nombre = :nombre")
    IngredienteMenu findByName(@Param("nombre") String nombre);

    @Query("SELECT i FROM IngredienteMenu i WHERE i.articuloMenu.id = :id")
    HashSet<IngredienteMenu> findByMenuId(@Param("id") Long id);

}