package main.repositories;

import main.entities.Domicilio.Departamento;
import main.entities.Domicilio.DepartamentoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
    @Query("SELECT NEW main.entities.Domicilio.DepartamentoDTO(d.id, d.nombre) FROM Departamento d WHERE d.nombre = :nombre")
    Optional<DepartamentoDTO> findByNombre(@Param("nombre") String nombre);

    @Query("SELECT NEW main.entities.Domicilio.DepartamentoDTO(d.id, d.nombre) FROM Departamento d")
    List<DepartamentoDTO> findAllDTO();

    @Query("SELECT NEW main.entities.Domicilio.DepartamentoDTO(d.id, d.nombre) FROM Departamento d WHERE d.provincia.id = :id")
    List<DepartamentoDTO> findByProvinciaId(@Param("id") Long id);
}