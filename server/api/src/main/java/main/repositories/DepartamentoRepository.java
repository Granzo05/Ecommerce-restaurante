package main.repositories;

import main.entities.Domicilio.Departamento;
import main.entities.Domicilio.Pais;
import main.entities.Domicilio.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
    @Query("SELECT d FROM Departamento d WHERE d.nombre = :nombre")
    Optional<Departamento> findByNombre(@Param("nombre") String nombre);

    @Query("SELECT d FROM Departamento d WHERE d.provincia.id = :id")
    List<Departamento> findByProvinciaId(@Param("id") Long id);
}