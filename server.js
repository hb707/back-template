require('dotenv').config()
const express = require('express')
const { sequelize, User } = require('./models')
//const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt')
const app = express()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({
    origin: ['http://localhost:3000', 'http://hanbin.shop', 'http://www.hanbin.shop'],
    credentials: true
}))

const init = async () => {
    try {
        await sequelize.sync({ force: false })
        console.log('DB Connect')
    } catch (e) {
        console.log('DB Disconnect : ', e)
    }
}

init()

// app.use(router)
app.get('/', (req, res) => {
    res.send('백엔드야')
})

app.post('/join', async (req, res) => {
    const { email, nickname, password } = req.body
    console.log(email, nickname, password)
    try {
        // email 중복체크 : Front 에서 체크하나, Back에서 다시한번 체크
        const check = await User.findOne({ where: { email } })
        if (check) return res.json({ result: null, msg: '아이디 중복' })

        // 패스워드 암호화
        const hash = await bcrypt.hash(password, 7)
        console.log(hash)
        // User 등록하기.
        const user = await User.create({ email, nickname, password: hash })
        res.json({
            result: user,
            msg: ''
        })
    } catch (e) {
        res.status(500).json({
            result: null,
            msg: '예상치 못한 오류가 발생되었습니다.',
        })
    }
})


app.listen(PORT, () => {
    console.log('back server start')
})