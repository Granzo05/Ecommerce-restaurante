package main.repositories;

import main.entities.Domicilio.Provincia;
import main.entities.Domicilio.ProvinciaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProvinciaRepository extends JpaRepository<Provincia, Long>  {

    @Query("SELECT NEW main.entities.Domicilio.ProvinciaDTO(p.id, p.nombre) FROM Provincia p WHERE p.nombre = :nombre")
    Optional<ProvinciaDTO> findByNombre(@Param("nombre") String nombre);

    @Query("SELECT NEW main.entities.Domicilio.ProvinciaDTO(p.id, p.nombre) FROM Provincia p")
    List<ProvinciaDTO> findAllDTO();

    @Query("SELECT COUNT(p) FROM Provincia p")
    int getCantidadProvincias();
}