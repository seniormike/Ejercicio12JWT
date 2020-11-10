let jwt = require("jsonwebtoken");
const config = require("./config.js");
const conn = require("../../lib/MongoUtils");

// Función encargada de realizar la validación del token y que es directamente consumida por server.js
let checkToken = (req, res, next) => {
  // Extrae el token de la solicitud enviado a través de cualquiera de los dos headers especificados
  // Los headers son automáticamente convertidos a lowercase
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  // Si existe algún valor para el token, se analiza
  // de lo contrario, un mensaje de error es retornado
  if (token) {
    // Si el token incluye el prefijo 'Bearer ', este debe ser removido
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      // Llama la función verify del paquete jsonwebtoken que se encarga de realizar la validación del token con el secret proporcionado
      jwt.verify(token, config.secret, (err, decoded) => {
        // Si no pasa la validación, un mensaje de error es retornado
        // de lo contrario, permite a la solicitud continuar
        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid",
          });
        } else {
          req.decoded = decoded;

          // Consultar a la db con el token generado
          // verificar roles del usuario
          // poner condicionales

          conn
            .then((client) => {
              client
                .db("messages")
                .collection("users")
                .find({ token })
                .toArray((err, data) => {
                  console.log(data);
                  let user = data.user;

                  if (req.type === "GET") {
                    if (user.role === "admin" || user.role === "viewer") {
                      next();
                    }
                  } else if (req.type === "POST") {
                    if (user.role === "admin" || user.role === "publisher") {
                      next();
                    }
                  }

                  res.status(200).send(data);
                  console.log(data);
                });
            })
            .catch((err) => {
              res.status(400).send(err);
            });
        }
      });
    }
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

module.exports = {
  checkToken: checkToken,
};
