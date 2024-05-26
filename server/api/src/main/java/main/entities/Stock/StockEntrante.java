package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "stock_entrante", schema = "buen_sabor")
public class StockEntrante {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "fecha_llegada", nullable = false)
    public LocalDate fechaLlegada;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnoreProperties(value = {"empleados", "empresa", "stocksSucursal", "stocksEntranteSucursal", "promociones", "articulosMenu", "articulosVenta", "medidas", "categorias"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;
    @JsonIgnoreProperties(value = {"sucursal", "stockEntrante"})
    @OneToMany(fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "stockEntrante", cascade = CascadeType.ALL)
    private Set<DetalleStock> detallesStock = new HashSet<>();
}