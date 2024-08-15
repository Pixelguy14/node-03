import express from 'express'
import bcypt from 'bcryptjs'
import admin from 'firebase-admin'

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
})

