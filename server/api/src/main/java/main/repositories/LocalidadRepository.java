package main.repositories;

import main.entities.Domicilio.Localidad;
import main.entities.Domicilio.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {


}