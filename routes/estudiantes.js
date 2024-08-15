import express from 'express'
import admin from 'firebase-admin'
import bcypt from 'bcryptjs'
import serviceAccount from '../config/firebaseServiceAccount.json' with {type: "json"}

//Initialize firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const router = express.Router()
const db = admin.firestore()
const estudiantesColleccion = db.collection('estudiantes')

router.post('/create', async (req,res) => {
    const {nombre, apaterno, amaterno, direccion, telefono, correo, usuario, password} = req.body
    // Validar correo y usuario
    const findUsuario = await estudiantesColleccion.where('usuario', '==', usuario).get()
    const findCorreo = await estudiantesColleccion.where('correo', '==', correo).get()
    if(!findUsuario.empty){
        return res.status(400).json({
            error: 'el usuario ya existe'
        })
    }
    if(!correo.empty){
        return res.status(400).json({
            error: 'el correo ya existe'
        })
    }
    const passHashed = await bcrypt.hash(password,10)
    await estudiantesColleccion.add({
        nombre, apaterno, amaterno, direccion, telefono, correo, password: passHashed
    })
    res.status(201).json({
        message: 'success'
    })
})

export default router 