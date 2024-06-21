package main.entities.Pedidos;

public enum EnumTipoEnvio {
    DELIVERY(0),
    RETIRO_EN_TIENDA(1);

    private final int value;

    EnumTipoEnvio(int value) {
        this.value = value;
    }

    public static EnumEstadoPedido fromValue(int value) {
        for (EnumEstadoPedido estado : EnumEstadoPedido.values()) {
            if (estado.getValue() == value) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Invalid EnumEstadoPedido value: " + value);
    }

    public int getValue() {
        return value;
    }
}
