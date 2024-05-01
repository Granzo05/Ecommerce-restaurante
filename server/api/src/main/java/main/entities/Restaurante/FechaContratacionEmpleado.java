package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "fecha_contratacion_empleado")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FechaContratacionEmpleado {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaContratacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;

    public FechaContratacionEmpleado(Date fecha, Empleado empleado) {
        this.fechaContratacion = fecha;
        this.empleado = empleado;
    }
}
