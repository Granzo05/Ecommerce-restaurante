package main.repositories;

import main.entities.Restaurante.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    @Query("SELECT e FROM Empresa e WHERE e.cuit = :cuit")
    Optional<Empresa> findByCuit(@Param("cuit") String cuit);

    @Query("SELECT e FROM Empresa e WHERE e.nombre = :nombre")
    Optional<Empresa> findByName(@Param("nombre") String nombre);

    @Query("SELECT e FROM Empresa e WHERE e.razonSocial = :razonSocial")
    Optional<Empresa> findByRazonSocial(@Param("razonSocial") String razonSocial);

    @Query("SELECT e FROM Empresa e WHERE (e.cuit = :variable OR e.nombre = :variable) AND e.contraseña = :contraseña")
    Optional<Empresa> findByCuitOrNombreAndPassword(@Param("variable") String variable, @Param("contraseña") String contraseña);

    @Query("SELECT e FROM Empresa e")
    List<Empresa> findAllDTO();
}