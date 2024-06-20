package main.repositories;

import main.entities.Domicilio.Domicilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DomicilioRepository extends JpaRepository<Domicilio, Long> {
    @Query("SELECT d FROM Domicilio d WHERE d.cliente.id = :id")
    List<Domicilio> findByIdCliente(@Param("id") Long id);

    @Query("SELECT d FROM Domicilio d WHERE d.empleado.id = :id")
    List<Domicilio> findByIdEmpleadoDTO(@Param("id") Long id);

    @Query("SELECT d FROM Domicilio d WHERE d.empleado.id = :id AND d.borrado = 'NO'")
    List<Domicilio> findByIdEmpleadoNotBorrado(@Param("id") Long id);

    @Query("SELECT d FROM Domicilio d WHERE d.sucursal.id = :id")
    Domicilio findByIdSucursal(@Param("id") Long id);

    @Query("SELECT d FROM Domicilio d WHERE d.sucursal.id = :id AND d.borrado = 'NO'")
    Domicilio findByIdSucursalNotBorrado(@Param("id") Long id);
}