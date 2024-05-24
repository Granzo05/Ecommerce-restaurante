package main.repositories;

import main.entities.Ingredientes.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Long> {
    @Query("SELECT sc FROM Subcategoria sc JOIN sc.sucursales s WHERE s.id = :id AND sc.nombre = :nombre")
    Optional<Subcategoria> findByDenominacionAndIdSucursal(@Param("nombre") String nombre, @Param("id") Long id);

    @Query("SELECT NEW main.entities.Ingredientes.SubcategoriaDTO(sc.id, sc.nombre, sc.borrado) FROM Subcategoria sc JOIN sc.sucursales s WHERE s.id = :id")
    List<SubcategoriaDTO> findAllDTOByIdSucursal(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Ingredientes.SubcategoriaDTO(sc.id, sc.nombre, sc.borrado) FROM Subcategoria sc WHERE sc.categoria.id = :id")
    List<SubcategoriaDTO> findAllDTOByIdCategoria(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Ingredientes.SubcategoriaDTO(sc.id, sc.nombre, sc.borrado) FROM Subcategoria sc WHERE sc.id = :id")
    List<SubcategoriaDTO> findByIdDTO(@Param("id") Long id);
}