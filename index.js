
const express = require("express")
const {open} = require("sqlite")

const sqlite3 = require("sqlite3")
const path = require("path")

const cors = require("cors")
const { request } = require("http")
const { response } = require("express")
// const { request } = require("http")
// const { response } = require("express")
const dbPath = path.join(__dirname,"Leadzen.db")
const app = express()
app.use(express.json())
app.use(cors()) 

let db = null 

const initializeDbAndServer = async () => {
    try{
       db = await open({
        filename:dbPath,
        driver:sqlite3.Database
       })
       app.listen(process.env.PORT || 3003, () => {
        console.log("Server Running at http://localhost:3003/")
       }  )
    } 
    catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
      }
}

initializeDbAndServer()


app.get("/",async(request,response)=>{
    const getTodoApi=`SELECT * from TodoWebaApp;`
    const getAllTasks= await db.all(getTodoApi)
    response.send(getAllTasks.map((eachTask)=>(eachTask)))
})

app.post("/AddTodo/",async(request,response)=>{
  const taskDetails = request.body
  const {
    id,todo,isCompleted
  } = taskDetails
  const addTaksApi = `INSERT INTO TodoWebaApp(id,todo,isCompleted) VALUES('${id}','${todo}','${isCompleted}');`
  const addTasks = await db.run(addTaksApi)
  const newTasks=addTasks.lastID
  response.send(`created TASK sucessfully ${newTasks}`)
})

app.delete("/deleteTodo/:id",async(request,response)=>{
  const {id}=request.params
  const deleteSqlQuery = `DELETE FROM TodoWebaApp WHERE id='${id}';`
  await db.run(deleteSqlQuery)
  response.send(`deleted successFully`)
})


app.put("/update/:id", async(request,response)=>{
const {id}=request.params
const haveData = request.body
const {
  isCompleted
} = haveData
const updateTodoData = `UPDATE  TodoWebaApp SET isCompleted='${isCompleted}' WHERE id='${id}';`
await db.run(updateTodoData)
response.send(`Update SuccessFully`)
})






