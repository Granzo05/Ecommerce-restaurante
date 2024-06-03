package main.entities.Pedidos;

public enum EnumEstadoPedido {
    ENTRANTES(0),
    ACEPTADOS(1),
    COCINADOS(2),
    ENTREGADOS(3),
    RECHAZADOS(4),
    EN_CAMINO(5);

    private final int value;

    EnumEstadoPedido(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static EnumEstadoPedido fromValue(int value) {
        for (EnumEstadoPedido estado : EnumEstadoPedido.values()) {
            if (estado.getValue() == value) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Invalid EnumEstadoPedido value: " + value);
    }
}


