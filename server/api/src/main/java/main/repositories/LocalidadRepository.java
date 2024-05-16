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

    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l WHERE l.departamento.id = :id")
    List<LocalidadDTO> findByIdDepartamento(@Param("id") Long id);

    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l")
    List<LocalidadDTO> findAllDTO();

    @Query("SELECT NEW main.entities.Domicilio.LocalidadDTO(l.id, l.nombre, l.departamento) FROM Localidad l WHERE l.nombre = :nombre")
    Optional<LocalidadDTO> findByNombre(@Param("nombre") String nombre);


}