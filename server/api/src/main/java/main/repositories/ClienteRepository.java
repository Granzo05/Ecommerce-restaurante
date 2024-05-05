package main.repositories;

import main.entities.Cliente.Cliente;
import main.entities.Cliente.ClienteDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("SELECT c FROM Cliente c WHERE c.email = :email AND c.borrado = 'NO'")
    Optional<Cliente> findByEmail(@Param("email") String email);


    @Query("SELECT NEW main.entities.Cliente.ClienteDTO(c.id, c.nombre, c.email, c.telefono) FROM Cliente c WHERE c.email = :email AND c.contraseña = :contraseña AND c.borrado = 'NO'")
    ClienteDTO findByEmailAndPasswordDTO(@Param("email") String email, @Param("contraseña") String contraseña);


}