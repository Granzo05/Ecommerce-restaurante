package main.repositories;

import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.EmpleadoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    @Query("SELECT e FROM Empleado e WHERE e.email = :email")
    Optional<Empleado> findByEmail(@Param("email") String email);

    @Query("SELECT e FROM Empleado e WHERE e.cuil = :cuil")
    Optional<Empleado> findByCuil(@Param("cuil") String cuil);

    @Query("SELECT NEW main.entities.Restaurante.EmpleadoDTO(e.id, e.nombre, e.email, e.cuil, e.telefono, e.fechaNacimiento, e.sucursal, e.borrado) FROM Empleado e")
    List<EmpleadoDTO> findAllDTO();

    @Query("SELECT NEW main.entities.Restaurante.EmpleadoDTO(e.id, e.nombre, e.email, e.cuil, e.telefono, e.fechaNacimiento, e.sucursal, e.borrado) FROM Empleado e WHERE e.email = :email AND e.contraseña = :contraseña AND e.borrado = 'NO'")
    Optional<EmpleadoDTO> findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String contraseña);


}