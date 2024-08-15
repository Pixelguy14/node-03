import express from 'express'
import bodyParser from 'body-parser'
import estudiantesRoutes from './routes/estudiantes.js'

//Initialize server
const app = express()
app.use(bodyParser.json())

app.use('api/estudiantes',estudiantesRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Escuchando el puerto: ${PORT}`)
})