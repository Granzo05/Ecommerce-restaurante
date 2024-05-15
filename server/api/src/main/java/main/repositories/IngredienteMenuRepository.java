package main.repositories;

import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Ingredientes.IngredienteMenuDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;


@Repository
public interface IngredienteMenuRepository extends JpaRepository<IngredienteMenu, Long> {
    @Query("SELECT i FROM IngredienteMenu i WHERE i.ingrediente.nombre = :nombre")
    IngredienteMenu findByName(@Param("nombre") String nombre);

    @Query("SELECT NEW main.entities.Ingredientes.IngredienteMenuDTO(i.id, i.cantidad, i.medida, i.ingrediente.nombre) FROM IngredienteMenu i WHERE i.articuloMenu.id = :id")
    List<IngredienteMenuDTO> findByMenuId(@Param("id") Long id);

}