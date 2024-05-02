package main.repositories;

import main.entities.Domicilio.Localidad;
import main.entities.Domicilio.Pais;
import main.entities.Restaurante.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {
    @Query("SELECT p FROM Pais p WHERE p.nombre = :nombre")
    Optional<Pais> findByNombre(@Param("nombre") String nombre);

}