const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
const path = require('path');
const axios = require('axios');

var datosCompra = {};

const tokenMP = "";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/compra", async (req, res) => {
	try {
		const response = await axios.post(`http://localhost:8080/pago_correcto`, JSON.stringify(datosCompra));

		const idVenta = response.data;

		res.redirect(`/compra.html?idVenta=${idVenta}`);

		//res.status(200).sendFile(path.join(__dirname, "..", "..", "client", "html-js", "compra.html"));

	} catch (error) {
		console.error("Error al manejar el resultado del pago:", error);

		res.status(200).sendFile(path.join(__dirname, "..", "..", "client", "html-js", "compra.html"));
	}
});



mercadopago.configure({
	access_token: tokenMP,
});

app.post("/create_preference", async (req, res) => {
	const items = [];

	for (let i = 0; i < req.body.requestBody.items.length; i++) {
		const item = req.body.requestBody.items[i];

		if (item.title && item.unit_price && item.quantity) {
			items.push({
				title: item.title,
				unit_price: Number(item.unit_price),
				quantity: Number(item.quantity),
			});
		}
	}

	var preference = {
		items: items,
		back_urls: {
			"success": "http://localhost:3000/compra",
			"failure": "http://localhost:3000/pago_error"
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			// Devuelvo el id de la preferencia para crear el boton de MP
			res.json({
				id: response.body.id
			});
			// Almaceno los datos del cliente y de la compra
			datosCompra = {
				id: response.body.id,
				nombre: req.body.requestBody.items.map(item => item.title),
				cantidad: req.body.requestBody.items.map(item => item.quantity),
				precio: req.body.requestBody.items.map(item => item.unit_price),
				metodoPago: 'mercadopago',
				email: req.body.requestBody.cliente.email,
				celular: req.body.requestBody.cliente.celular,
				nombreCliente: req.body.requestBody.cliente.nombreCliente,
			};
		})
		.catch(function (error) {
			console.error("Error al crear la preferencia de pago:", error);
			res.status(500).json({ error: "Error al crear la preferencia de pago" });
		});
});

// Envio de consulta por gmail
const sendMail = require('./gmail');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const EMAIL_EMISOR = 'contactodelbuensabor@gmail.com';

app.post('/enviar-email', async (req, res) => {
	try {
		const { nombre, email, celular, mensaje, servicio } = req.body;

		const options = {
			to: email,
			from: EMAIL_EMISOR,
			subject: servicio,
			text: `Nombre: ${nombre}\nEmail: ${email}\nCelular: ${celular}\nMensaje: ${mensaje}`,
			textEncoding: 'base64'
		};

		const messageId = await sendMail(options);
		console.log('Correo enviado');
		return messageId;
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al enviar el correo' });
	}
});

app.listen(3000, () => {
	console.log("The server is now running on Port 3000");
});
