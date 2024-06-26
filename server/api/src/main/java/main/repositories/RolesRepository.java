package main.repositories;

import main.entities.Restaurante.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface RolesRepository extends JpaRepository<Roles, Long> {
    @Query("SELECT r FROM Roles r JOIN r.sucursales s WHERE s.id = :id AND r.nombre = :nombre")
    Optional<Roles> findByDenominacionAndIdSucursal(@Param("nombre") String nombre, @Param("id") Long id);

    @Query("SELECT r FROM Roles r JOIN r.sucursales s WHERE s.id = :idSucursal AND r.id = :idRol")
    Optional<Roles> findByIdRolAndIdSucursal(@Param("idRol") Long idRol, @Param("idSucursal") Long idSucursal);

    @Query("SELECT r FROM Roles r JOIN r.sucursales s WHERE s.id = :id")
    List<Roles> findAllByIdSucursal(@Param("id") Long id);

    @Query("SELECT r FROM Roles r JOIN r.sucursales s WHERE s.id = :id AND r.borrado = 'NO'")
    List<Roles> findAllByIdSucursalNotBorrado(@Param("id") Long id);
}