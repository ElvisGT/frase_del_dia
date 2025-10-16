const fs = require("fs");
const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");

function main() {
  const path = __dirname + "\\data.json";
  const frases = read_file(path);
  const frase_anterior = frases[random_number(frases)];
  let nueva_frase = {};

  if (frase_anterior == frases[random_number(frases)]) {
    nueva_frase = frases[random_number(frases)];
  } else {
    nueva_frase = frase_anterior;
  }


  send_mail(nueva_frase)
    .then((msg) => console.log("Enviado correctamente"))
    .catch((err) => console.error("Ha ocurrido el error: " + err))
}

main();

function read_file(path) {
  const data = JSON.parse(fs.readFileSync(path));
  const data_arr = data.info;

  return data_arr;
}

function random_number(frases) {
  const random_number = Math.floor(Math.random() * frases.length);
  return random_number;
}

async function send_mail(frase) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const frase_str = Object.values(frase)[0]

  await transporter.sendMail({
    from: "Elvis <elvisgt1999@gmail.com>", // Header From:
    to: ["Elvis <elvisgt1999@gmail.com>","Katherine <katherineperezgarrido@gmail.com>"], // Header To:
    subject: "Frase motivadora del dia",
    text: frase_str,
  });


}
