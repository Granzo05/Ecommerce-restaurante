package main.repositories;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Ingredientes.IngredienteMenuDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;


@Repository
public interface IngredienteMenuRepository extends JpaRepository<IngredienteMenu, Long> {
    @Query("SELECT i FROM IngredienteMenu i WHERE i.ingrediente.nombre = :nombre")
    IngredienteMenu findByName(@Param("nombre") String nombre);

    @Modifying
    @Query("DELETE FROM IngredienteMenu i WHERE i.articuloMenu.id = :id")
    void deleteAllByIdArticuloMenu(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Ingredientes.IngredienteMenuDTO(i.id, i.cantidad, i.medida, i.ingrediente.nombre) FROM IngredienteMenu i WHERE i.articuloMenu.id = :id")
    List<IngredienteMenuDTO> findByMenuId(@Param("id") Long id);

}