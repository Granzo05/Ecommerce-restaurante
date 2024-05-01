package main.repositories;

import main.entities.Domicilio.Localidad;
import main.entities.Restaurante.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {


}