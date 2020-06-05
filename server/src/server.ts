//When TypeScript, express needs:
// "npm install @types/express" -D
// -D means "Developer" Dependency
import express, { response, Router } from 'express'

import routes from './routes'

import path from 'path'

import cors from 'cors'

import { errors } from 'celebrate'

//Run express...
const app = express();

app.use(cors({}))

//One alternative is to use bodyParser
//Why does exists bodyParser and express.json()?
//In the beginning, express had express.json()
//But then people want that feature separeted
//But still after, people want it back, so they dont need to import it
app.use(express.json())

//Use routes (from "routes.ts")
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors());

//Listen to port 3333
app.listen(3333);


