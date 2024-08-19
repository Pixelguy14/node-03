import express, { request } from 'express'
import admin from 'firebase-admin'
import bcrypt from 'bcryptjs'
import serviceAccount from '../config/firebaseServiceAccount.json' with {type: "json"}
import { verifyToken, generateToken } from './auth.js'

//Initialize firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

//Middleware o intermediario
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.spit(' ')[1]
    if(!token){
        return res.status(401).json({
            message: 'Not authorized'
        })
    }
    try{
        const user = verifyToken(token)
        req.user = user
        next()
    } catch(error){
        res.sendStatus(403)
    }
}

const router = express.Router()
const db = admin.firestore()
const estudiantesColleccion = db.collection('estudiantes')

//Create User //we add auth to the function because once creating an user you should have a token
router.post('/create', /*authenticateToken,*/ async (req,res) => {
    const {nombre, apaterno, amaterno, direccion, telefono, correo, usuario, password} = req.body
    // Validar correo y usuario
    const findUsuario = await estudiantesColleccion.where('usuario', '==', usuario).get()
    const findCorreo = await estudiantesColleccion.where('correo', '==', correo).get()
    if(!findUsuario.empty){
        return res.status(400).json({
            error: 'el nombre de usuario ya existe'
        })
    }
    if(!findCorreo.empty){
        return res.status(400).json({
            error: 'el correo ya existe'
        })
    }
    const passHashed = await bcrypt.hash(password,10)
    await estudiantesColleccion.add({
        nombre, apaterno, amaterno, direccion, telefono, correo, usuario, password: passHashed
    })
    res.status(201).json({
        message: 'success'
    })
})

//Get all
router.get('/all', async(req, res)=>{
    const colEstudiantes = await estudiantesColleccion.get()
    const estudiantes = colEstudiantes.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()
    }))
    res.status(201).json({
        message: 'success',
        estudiantes
    })
})

//Get one
router.get('/estudiante/:id', async(req, res)=>{
    const id = req.params.id
    const colEstudiantes = await estudiantesColleccion.doc(id).get()
    if(!colEstudiantes.exists){
        return res.status(401).json({
            message: 'El estudiante no se encuentra'
        })
    }
    res.status(201).json({
        message: 'success',
        estudiante: {
            id: colEstudiantes.id,
            ...colEstudiantes.data()
        }
    })
})

//add update and delete //later add token to both functions

//delete an estudiante
router.delete('/estudiante/:id', async (req, res) => {
    const id = req.params.id
    const colEstudiantes = await estudiantesColleccion.doc(id).get()
    if (!colEstudiantes.exists) {
        return res.status(401).json({
            message: 'El estudiante no se encuentra'
        })
    }
    await estudiantesColleccion.doc(id).delete()
    res.status(200).json({
        message: 'Estudiante eliminado con éxito'
    })
})

//update an estudiante
router.put('/estudiante/:id', async (req, res) => {
    const id = req.params.id
    const {nombre, apaterno, amaterno, direccion, telefono, correo, usuario, password} = req.body
    const colEstudiantes = await estudiantesColleccion.doc(id).get()
    if (!colEstudiantes.exists) {
        return res.status(401).json({
            message: 'El estudiante no se encuentra'
        })
    }
    // Validar correo y usuario
    const findUsuario = await estudiantesColleccion.where('usuario', '==', usuario).get()
    const findCorreo = await estudiantesColleccion.where('correo', '==', correo).get()
    if(!findUsuario.empty){
        return res.status(400).json({
            error: 'el nombre de usuario ya existe'
        })
    }
    if(!findCorreo.empty){
        return res.status(400).json({
            error: 'el correo ya existe'
        })
    }
    const passHashed = await bcrypt.hash(password,10)
    await estudiantesColleccion.doc(id).update({
        nombre, apaterno, amaterno, direccion, telefono, correo, usuario, password: passHashed
    })
    res.status(200).json({
        message: 'Estudiante actualizado con éxito'
    })
})


export default router 