package main.repositories;

import main.entities.Cliente.ClienteDTO;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DomicilioRepository extends JpaRepository<Domicilio, Long> {
    @Query("SELECT NEW main.entities.Domicilio.DomicilioDTO(d.calle, d.codigoPostal, d.numero, d.localidad) FROM Domicilio d WHERE d.cliente.id = :id")
    List<DomicilioDTO> findByIdClienteDTO(@Param("id") Long id);
}