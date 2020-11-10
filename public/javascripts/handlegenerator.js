let jwt = require("jsonwebtoken");
let config = require("./config");
const conn = require("../../lib/MongoUtils");

// Clase encargada de la creación del token
class HandlerGenerator {
  login(req, res) {
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = req.body.password;

    // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD
    conn
      .then((client) => {
        client
          .db("messages")
          .collection("users")
          .find({ username })
          .toArray((err, data) => {
            console.log(data);
            console.log(data[0].username);
            console.log(data[0].password);

            let mockedUsername = data[0].username;
            let mockedPassword = data[0].password;

            //res.status(200).send(data);
            //console.log(data);
            // ADDED
            // Si se especifico un usuario y contraseña, proceda con la validación
            // de lo contrario, un mensaje de error es retornado
            if (username && password) {
              // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
              // de lo contrario, un mensaje de error es retornado
              if (username === mockedUsername && password === mockedPassword) {
                // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
                let token = jwt.sign({ username: username }, config.secret, {
                  expiresIn: "24h",
                });

                // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
                conn.then((client) => {
                  client
                    .db("messages")
                    .collection("users")
                    .updateOne(
                      { username: username }, // Filter
                      { $set: { token: token } } // Update
                    )
                    .then((obj) => {
                      console.log("Updated - " + obj);
                    })
                    .catch((err) => {
                      console.log("Error: " + err);
                    });
                });

                res.json({
                  success: true,
                  message: "Authentication successful!",
                  token: token,
                });
              } else {
                // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
                res.send(403).json({
                  success: false,
                  message: "Incorrect username or password",
                });
              }
            } else {
              // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
              res.send(400).json({
                success: false,
                message: "Authentication failed! Please check the request",
              });
            }
          });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  index(req, res) {
    // Retorna una respuesta exitosa con previa validación del token
    res.json({
      success: true,
      message: "Index page",
    });
  }
}

module.exports = HandlerGenerator;
