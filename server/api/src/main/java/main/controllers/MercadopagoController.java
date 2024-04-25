package main.controllers;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.Pedido;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class MercadopagoController {

    @Value("${MERCADOLIBRE.ACCESS_TOKEN}")
    private String ACCESS_TOKEN;

    public MercadopagoController() {
    }


    @PostMapping("/mercadopago/preference")
    public String getPreference(@RequestBody Pedido pedido) {
        try {
            com.mercadopago.MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);
            com.mercadopago.MercadoPagoConfig.setConnectionRequestTimeout(2000);
            MercadoPagoConfig.setSocketTimeout(2000);

            List<PreferenceItemRequest> items = new ArrayList<>();
            for (DetallesPedido detalle : pedido.getDetallesPedido()) {
                PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                        .title(detalle.getMenu().getNombre())
                        .quantity(detalle.getCantidad())
                        .unitPrice(detalle.getMenu().getPrecio())
                        .currencyId("ARS")
                        .build();

                items.add(itemRequest);
            }

            PreferenceBackUrlsRequest backUrl = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5173/")
                    .failure("http://localhost:5173/acceso-denegado").build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrl)
                    .build();

            PreferenceClient client = new PreferenceClient();

            Preference preference = client.create(preferenceRequest);

            return preference.getId();
        } catch (MPException | MPApiException e) {
            return e.toString();
        }
    }
}
