package main.repositories;

import main.entities.Restaurante.Roles;
import main.entities.Restaurante.RolesEmpleados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Repository
public interface RolesEmpleadoRepository extends JpaRepository<RolesEmpleados, Long> {
    @Query("SELECT r FROM RolesEmpleados r WHERE r.rol.nombre = :nombre")
    Optional<RolesEmpleados> findByDenominacion(@Param("nombre") String nombre);

}