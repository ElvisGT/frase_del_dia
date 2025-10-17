const fs = require("fs");
const path = require("path")
const pexels = require("pexels")
const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");

async function main() {
  const phrases_path = path.join(__dirname,"data","phrases.json");
  const words_path = path.join(__dirname,'data','words.json')
  const {frases} = read_file(phrases_path);
  const {words} = read_file(words_path)
  const frase_anterior = frases[random_number(frases)];
  let nueva_frase = {};
  const random_word = words[random_number(words)]
  const img_url = await generate_img(random_word,words)

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
  const data = JSON.parse(fs.readFileSync(path))
  const data_arr = data

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

async function generate_img(word,words) {
  const client = pexels.createClient(process.env.API_KEY)
  let photo = await client.photos.search({query:word,per_page:2})

  while(photo.photos.length == 0){
    query = words[random_number(words)]
    photo = await client.photos.search({query,per_page:2})
  }

  return new Promise((res,err) => {
    if(!photo) {
      err('No se ha podido hacer la peticion')
    }
    else{
      res(photo.photos[0].src.original)
    }
  }) 

}
