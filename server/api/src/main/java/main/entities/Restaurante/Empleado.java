package main.entities.Restaurante;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "empleados", schema = "buen_sabor")
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "nombre")
    private String nombre;

    @Column(name = "email")
    private String email;

    @Column(name = "contraseña")
    private String contraseña;

    @Column(name = "cuit")
    private long cuit;
    @Column(name = "telefono")
    private long telefono;
    @Column(name = "fecha_ingreso", updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    public Date fechaIngreso;
    @Column(name = "borrado")
    private String borrado;
    @Column(name = "privilegios")
    private String privilegios;
    @ManyToOne
    @JoinColumn(name = "id_restaurante")
    private Restaurante idRestaurante;
    
    public Empleado() {
    }

    public Empleado(String nombre, long cuit, long telefono, Restaurante idRestaurante) {
        this.nombre = nombre;
        this.cuit = cuit;
        this.telefono = telefono;
        this.idRestaurante = idRestaurante;
    }

    public String getPrivilegios() {
        return privilegios;
    }

    public void setPrivilegios(String privilegios) {
        this.privilegios = privilegios;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getBorrado() {
        return borrado;
    }

    public void setBorrado(String borrado) {
        this.borrado = borrado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public long getCuit() {
        return cuit;
    }

    public void setCuit(long cuit) {
        this.cuit = cuit;
    }

    public long getTelefono() {
        return telefono;
    }

    public void setTelefono(long telefono) {
        this.telefono = telefono;
    }

    public Date getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(Date fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public Restaurante getIdRestaurante() {
        return idRestaurante;
    }

    public void setIdRestaurante(Restaurante idRestaurante) {
        this.idRestaurante = idRestaurante;
    }

    @Override
    public String toString() {
        return "Empleado{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", contraseña='" + contraseña + '\'' +
                ", cuit=" + cuit +
                ", telefono=" + telefono +
                ", fechaIngreso=" + fechaIngreso +
                ", borrado='" + borrado + '\'' +
                ", privilegios='" + privilegios + '\'' +
                ", idRestaurante=" + idRestaurante +
                '}';
    }
}