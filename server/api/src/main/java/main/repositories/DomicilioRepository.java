package main.repositories;

import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DomicilioRepository extends JpaRepository<Domicilio, Long> {
    @Query("SELECT NEW main.entities.Domicilio.DomicilioDTO(d.calle, d.codigoPostal, d.numero, d.localidad) FROM Domicilio d WHERE d.cliente.id = :id")
    List<DomicilioDTO> findByIdClienteDTO(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Domicilio.DomicilioDTO(d.calle, d.numero, d.codigoPostal, d.localidad) FROM Domicilio d WHERE d.empleado.id = :id")
    List<DomicilioDTO> findByIdEmpleadoDTO(@Param("id") Long id);

    @Query("SELECT d FROM Domicilio d WHERE d.empleado.id = :id")
    List<Domicilio> findByIdEmpleado(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Domicilio.DomicilioDTO(d.calle, d.numero, d.codigoPostal, d.localidad) FROM Domicilio d WHERE d.sucursal.id = :id")
    DomicilioDTO findByIdSucursal(@Param("id") Long id);
}