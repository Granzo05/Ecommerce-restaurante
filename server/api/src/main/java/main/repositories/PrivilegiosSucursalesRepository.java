package main.repositories;

import main.entities.Restaurante.Privilegios;
import main.entities.Restaurante.PrivilegiosSucursales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrivilegiosSucursalesRepository extends JpaRepository<PrivilegiosSucursales, Long> {

    @Query("SELECT p FROM PrivilegiosSucursales p JOIN p.sucursales s WHERE s.id = :id AND p.nombre = :nombre")
    Optional<PrivilegiosSucursales> findByNombreAndIdSucursal(@Param("nombre") String nombre, @Param("id") Long id);

    @Query("SELECT p FROM PrivilegiosSucursales p JOIN p.sucursales s WHERE s.id = :idSucursal AND p.id = :idRol")
    Optional<PrivilegiosSucursales> findByIdPrivilegioAndIdSucursal(@Param("idRol") Long idRol, @Param("idSucursal") Long idSucursal);

    @Query("SELECT p FROM PrivilegiosSucursales p JOIN p.sucursales s WHERE s.id = :id")
    List<PrivilegiosSucursales> findAllByIdSucursal(@Param("id") Long id);
}