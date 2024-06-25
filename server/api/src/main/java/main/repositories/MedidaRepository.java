package main.repositories;

import main.entities.Ingredientes.Medida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface MedidaRepository extends JpaRepository<Medida, Long> {
    @Query("SELECT m FROM Medida m JOIN m.sucursales s WHERE s.id = :id AND m.nombre = :nombre")
    Optional<Medida> findByDenominacionAndIdSucursal(@Param("nombre") String nombre, @Param("id") Long id);

    @Query("SELECT m FROM Medida m JOIN m.sucursales s WHERE s.id = :idSucursal AND m.id = :idMedida")
    Optional<Medida> findByIdMedidaAndIdSucursal(@Param("idMedida") Long idMedida, @Param("idSucursal") Long idSucursal);

    @Query("SELECT m FROM Medida m JOIN m.sucursales s WHERE s.id = :id")
    List<Medida> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT m FROM Medida m JOIN m.sucursales s WHERE s.id = :id AND m.borrado = 'NO'")
    List<Medida> findAllByIdSucursalNotBorrado(@Param("id") Long id);
}