const fs = require("fs");
const path = require("path")
const pexels = require("pexels")
const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");

async function main() {
  const phrases_path = path.join(__dirname,"data","phrases.json");
  const words_path = path.join(__dirname,'data','words.json')
  const {phrases} = read_file(phrases_path);
  const {words} = read_file(words_path)
  const last_phrase = phrases[random_number(phrases)];
  let new_phrase = {};
  const random_word = words[random_number(words)]
  const img_url = await generate_img(random_word,words)

  if (last_phrase == phrases[random_number(phrases)]) {
    new_phrase = phrases[random_number(phrases)];
  } else {
    new_phrase = last_phrase;
  }


  send_mail(new_phrase,img_url)
    .then((msg) => console.log("Enviado correctamente"))
    .catch((err) => console.error("Ha ocurrido el error: " + err))

}

main();

function read_file(path) {
  const data = JSON.parse(fs.readFileSync(path))
  const data_arr = data

  return data_arr;
}

function random_number(phrases) {
  const random_number = Math.floor(Math.random() * phrases.length);
  return random_number;
}

async function send_mail(phrase,img_url) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const phrase_str = Object.values(phrase)[0]

  await transporter.sendMail({
    from: "Elvis <elvisgt1999@gmail.com>", // Header From:
    to: "Elvis <elvisgt1999@gmail.com>", // Header To:
    subject: "phrase motivadora del dia",
    html:`
      <h1>${phrase_str}</h1>
      <img src='cid:foto'/>
    `,
    attachments:[
      {
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
