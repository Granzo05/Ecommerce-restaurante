package main.repositories;

import main.entities.Restaurante.FechaContratacionEmpleado;
import main.entities.Restaurante.FechaContratacionEmpleadoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FechaContratacionRepository extends JpaRepository<FechaContratacionEmpleado, Long> {
    @Query("SELECT f FROM FechaContratacionEmpleado f WHERE f.empleado.id = :id")
    List<FechaContratacionEmpleado> findByIdEmpleado(@Param("id") Long id);

}