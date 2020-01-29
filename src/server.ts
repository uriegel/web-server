import express from 'express'
import * as process from 'process'
import http from 'http'

const app = express()

const dir = __dirname + '/..'

app.use('/auth', (req: express.Request, res: express.Response) => {
	const email = req.originalUrl.substring(req.originalUrl.indexOf("email=") + 6)
	if (email.toLocaleLowerCase() == "uwriegel@gmail.com")
		res.sendStatus(200)    
	else
  		res.sendStatus(403)    
})
app.use('/', express.static(dir))

http.createServer(app).listen(9865, () => console.log('Listening', dir))
console.log('Elektron', process.pid)

