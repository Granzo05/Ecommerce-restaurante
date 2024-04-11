package main.entities.Restaurante;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurante", schema = "buen_sabor")
public class Restaurante {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "domicilio")
    private String domicilio;
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "telefono")
    private long telefono;
    @Column(name = "email")
    private String email;
    @Column(name = "privilegios")
    private String privilegios;


    public Restaurante() {
    }

    public Restaurante(String domicilio, long telefono) {
        this.domicilio = domicilio;
        this.telefono = telefono;
    }

    public Restaurante(Long id, String domicilio, long telefono) {
        this.id = id;
        this.domicilio = domicilio;
        this.telefono = telefono;
    }


    public String getPrivilegios() {
        return privilegios;
    }

    public void setPrivilegios(String privilegios) {
        this.privilegios = privilegios;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDomicilio() {
        return domicilio;
    }

    public void setDomicilio(String domicilio) {
        this.domicilio = domicilio;
    }

    public long getTelefono() {
        return telefono;
    }

    public void setTelefono(long telefono) {
        this.telefono = telefono;
    }

    @Override
    public String toString() {
        return "Restaurante{" +
                "id=" + id +
                ", domicilio='" + domicilio + '\'' +
                ", contraseña='" + contraseña + '\'' +
                ", telefono=" + telefono +
                ", email='" + email + '\'' +
                ", privilegios='" + privilegios + '\'' +
                '}';
    }
}