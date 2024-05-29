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

    @Query("SELECT e FROM Empresa e WHERE e.email = :email")
    Optional<Empresa> findByEmail(@Param("email") String email);

    @Query("SELECT e FROM Empresa e WHERE e.razonSocial = :razonSocial")
    Optional<Empresa> findByRazonSocial(@Param("razonSocial") String razonSocial);

    @Query("SELECT e FROM Empresa e WHERE e.email = :email AND e.contraseña = :contraseña")
    Optional<Empresa> findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String contraseña);

    @Query("SELECT e FROM Empresa e")
    List<Empresa> findAllDTO();
}