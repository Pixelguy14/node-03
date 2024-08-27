import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import estudiantesRoutes from './routes/estudiantes.js'

//Initialize server
const app = express()
const corsOptions = {
    origin: '*',
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json())

app.use('/api/estudiantes',estudiantesRoutes)

const PORT = process.env.PORT || 4010

app.listen(PORT, () => {
    console.log(`Escuchando el puerto: ${PORT}`)
})