
const handlePsqlErrors = ((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: "You've made a Bad Request"})
    }else{
        next(err)
    }
})
const handleCustomErrors = ((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }else{
        next(err)
    }
})
const handlrServerErrors = ((err, req, res, next) => {
console.log("Hello from error Handling Middleware", err)
res.status(500).send({msg: "Internal Server Error"})
})

module.exports = {handlePsqlErrors, handleCustomErrors, handlrServerErrors }