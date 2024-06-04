package main.repositories;

import main.entities.Cliente.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("SELECT c FROM Cliente c WHERE c.email = :email AND c.borrado = 'NO'")
    Optional<Cliente> findByEmail(@Param("email") String email);

    @Query("SELECT c FROM Cliente c WHERE c.email = :email AND c.contraseña = :contraseña")
    Optional<Cliente> findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String contraseña);


}