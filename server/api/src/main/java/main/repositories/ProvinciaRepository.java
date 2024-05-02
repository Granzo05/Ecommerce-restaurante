package main.repositories;

import main.entities.Domicilio.Pais;
import main.entities.Domicilio.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProvinciaRepository extends JpaRepository<Provincia, Long> {

    @Query("SELECT p FROM Provincia p WHERE p.nombre = :nombre")
    Optional<Provincia> findByNombre(@Param("nombre") String nombre);
}