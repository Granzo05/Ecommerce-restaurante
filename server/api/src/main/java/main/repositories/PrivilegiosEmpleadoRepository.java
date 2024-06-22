package main.repositories;

import main.entities.Restaurante.Privilegios;
import main.entities.Restaurante.PrivilegiosEmpleados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrivilegiosEmpleadoRepository extends JpaRepository<PrivilegiosEmpleados, Long> {

    @Query("SELECT p FROM Privilegios p WHERE p.nombre = :nombre")
    Optional<Privilegios> findByNombreAndIdSucursal(@Param("nombre") String nombre);

    @Query("SELECT p FROM Privilegios p WHERE p.id = :idRol")
    Optional<Privilegios> findByIdPrivilegioAndIdSucursal(@Param("idRol") Long idRol);
}