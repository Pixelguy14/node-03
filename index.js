import express from 'express'
import bodyParser from 'body-parser'
import admin from 'firebase-admin'
import estudiantesRoutes from './routes/estudiantes.js'
import serviceAccount from './config/firebaseServiceAccount.json' with {type: "json"}

//Initialize firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

//Initialize server
const app = express()
app.use(bodyParser.json())

app.use('api/estudiantes',estudiantesRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('Servidor inicializado en el puerto ${PORT}')
})