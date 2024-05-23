package main.repositories;

import main.entities.Restaurante.Empresa;
import main.entities.Restaurante.EmpresaDTO;
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

    @Query("SELECT NEW main.entities.Restaurante.EmpresaDTO(e.id, e.cuit, e.razonSocial, e.email, e.borrado) FROM Empresa e WHERE e.email = :email AND e.contraseña = :contraseña")
    Optional<EmpresaDTO> findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String contraseña);

    @Query("SELECT NEW main.entities.Restaurante.EmpresaDTO(e.id, e.cuit, e.razonSocial, e.email, e.borrado) FROM Empresa e")
    List<EmpresaDTO> findAllDTO();
}