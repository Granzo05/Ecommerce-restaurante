package main.repositories;

import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {

    @Query("SELECT l FROM Localidad l WHERE l.departamento.id = :id")
    List<Localidad> findByIdDepartamento(@Param("id") Long id);

    @Query("SELECT l FROM Localidad l WHERE l.nombre = :nombre")
    Optional<Localidad> findByNombre(@Param("nombre") String nombre);
}