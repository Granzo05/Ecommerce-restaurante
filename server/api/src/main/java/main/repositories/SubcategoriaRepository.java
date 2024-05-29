package main.repositories;

import main.entities.Ingredientes.Subcategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Repository
public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Long> {
    @Query("SELECT sc FROM Subcategoria sc JOIN sc.sucursales s WHERE s.id = :id AND sc.nombre = :nombre")
    Optional<Subcategoria> findByDenominacionAndIdSucursal(@Param("nombre") String nombre, @Param("id") Long id);

    @Query("SELECT sc FROM Subcategoria sc JOIN sc.sucursales s WHERE s.id = :id")
    List<Subcategoria> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT sc FROM Subcategoria sc WHERE sc.categoria.id = :id")
    List<Subcategoria> findAllByIdCategoria(@Param("id") Long id);

    @Query("SELECT sc FROM Subcategoria sc JOIN sc.sucursales s WHERE sc.categoria.id = :idCategoria AND s.id = :idSucursal")
    List<Subcategoria> findAllByIdCategoriaAndIdSucursal(@Param("idCategoria") Long idCategoria, @Param("idSucursal") Long idSucursal);

    @Modifying
    @Transactional
    @Query("DELETE FROM Subcategoria sc WHERE sc.id IN :ids")
    void deleteAllByIds(@Param("ids") List<Long> ids);

}