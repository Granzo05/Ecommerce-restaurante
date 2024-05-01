package main.repositories;

import main.entities.Restaurante.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    @Query("SELECT e FROM Empleado e WHERE e.email = :email AND e.borrado = 'NO'")
    Optional<Empleado> findByEmail(@Param("email") String email);

    @Query("SELECT e FROM Empleado e WHERE e.cuil = :cuil AND e.borrado = 'NO'")
    Empleado findByCuil(@Param("cuil") String cuil);


    @Query("SELECT e FROM Empleado e WHERE e.email = :email AND e.contraseña = :contraseña AND e.borrado = 'NO'")
    Empleado findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String contraseña);


}