const fs = require("fs");
const pexels = require("pexels")
const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");

async function main() {
  const path = __dirname + "\\data.json";
  const frases = read_file(path);
  const frase_anterior = frases[random_number(frases)];
  let nueva_frase = {};
  const img_url = await generate_img()

  if (frase_anterior == frases[random_number(frases)]) {
    nueva_frase = frases[random_number(frases)];
  } else {
    nueva_frase = frase_anterior;
  }

  send_mail(nueva_frase,img_url)
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

async function send_mail(frase,img_url) {
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
    to: "Elvis <elvisgt1999@gmail.com>", // Header To:
    subject: "Frase motivadora del dia",
    html:`
      <h1>${frase_str}</h1>
      <img src='cid:foto'/>
    `,
    attachments:[
      {
        filename:frase_str,
        path:img_url,
        cid:'foto'

      }
    ]
  });


}

async function generate_img() {
  const client = pexels.createClient(process.env.API_KEY)
  const photo = await client.photos.curated({per_page:1})
  return new Promise((res,err) => {
    if(!photo) {
      err('No se ha podido hacer la peticion')
    }
    else{
      res(photo.photos[0].src.original)
    }
  }) 

}
