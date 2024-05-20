package main.repositories;

import main.entities.Domicilio.Localidad;
import main.entities.Domicilio.LocalidadDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {

    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l WHERE l.departamento.nombre = :nombreDepartamento AND l.departamento.provincia.nombre = :nombreProvincia")
    List<LocalidadDTO> findByNombreDepartamentoAndProvincia(@Param("nombreDepartamento") String nombreDepartamento, @Param("nombreProvincia") String nombreProvincia);

    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l WHERE l.departamento.provincia.nombre = :nombreProvincia")
    List<LocalidadDTO> findByNombreProvincia(@Param("nombreProvincia") String nombreProvincia);
    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l WHERE l.departamento.nombre = :nombreDepartamento")
    List<LocalidadDTO> findByNombreDepartamento(@Param("nombreDepartamento") String nombreDepartamento);

    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l")
    List<LocalidadDTO> findAllDTO();

    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l WHERE l.nombre = :nombre")
    Optional<LocalidadDTO> findByNombre(@Param("nombre") String nombre);

    @Query("SELECT l FROM Localidad l WHERE l.nombre = :nombre")
    Optional<Localidad> findByName(@Param("nombre") String nombre);
}