import express from 'express'
import * as process from 'process'
import http from 'http'

const app = express()

const dir = __dirname + '/../site'

app.use('/auth', (req: express.Request, res: express.Response) => {
    console.log("Aua", req)
    console.log(req.params.msg);
})
app.use('/', express.static(dir))

http.createServer(app).listen(9865, () => console.log('Listening', dir))

console.log('Elektron', process.pid)
