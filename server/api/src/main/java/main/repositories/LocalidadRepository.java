package main.repositories;

import main.entities.Domicilio.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {

    @Query("SELECT l FROM Localidad l WHERE l.departamento.nombre = :nombreDepartamento AND l.departamento.provincia.nombre = :nombreProvincia")
    List<Localidad> findByNombreDepartamentoAndProvincia(@Param("nombreDepartamento") String nombreDepartamento, @Param("nombreProvincia") String nombreProvincia);

    @Query("SELECT l FROM Localidad l WHERE l.departamento.provincia.nombre = :nombreProvincia")
    List<Localidad> findByNombreProvincia(@Param("nombreProvincia") String nombreProvincia);

    @Query("SELECT l FROM Localidad l WHERE l.departamento.nombre = :nombreDepartamento")
    List<Localidad> findByNombreDepartamento(@Param("nombreDepartamento") String nombreDepartamento);

    @Query("SELECT l FROM Localidad l WHERE l.nombre = :nombre")
    Optional<Localidad> findByName(@Param("nombre") String nombre);
}