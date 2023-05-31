import express from 'express';
import cors from 'cors'
import api from './apis/index.js';
import  cookieParser  from "cookie-parser";
const app = express();
const port = 7777;

app.use(cors({origin:"*"}));
app.use(express.json());
app.use(cookieParser());

app.use("/", api);
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});
app.use("/upload",express.static('./uploads'));
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
