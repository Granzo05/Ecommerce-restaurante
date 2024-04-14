package main.repositories;

import main.entities.Restaurante.Menu.Ingrediente;
import main.entities.Restaurante.Menu.IngredienteMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IngredienteMenuRepository extends JpaRepository<IngredienteMenu, Long> {
    @Query("SELECT i FROM IngredienteMenu i WHERE i.ingrediente.nombre = :nombre")
    IngredienteMenu findByName(@Param("nombre") String nombre);

    @Query("SELECT i FROM IngredienteMenu i WHERE i.menu.id = :id")
    List<IngredienteMenu> findByMenuId(@Param("id") Long id);

}