package main.repositories;

import main.entities.Users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<User, Long> {

    @Query("SELECT c FROM User c WHERE c.email = :email AND c.borrado = 'NO'")
    Optional<User> findByEmail(@Param("email") String email);


    @Query("SELECT c FROM User c WHERE c.email = :email AND c.contraseña = :contraseña AND c.borrado = 'NO'")
    Optional<User> findByEmailAndPassword(@Param("email") String email, @Param("contraseña") String contraseña);


}