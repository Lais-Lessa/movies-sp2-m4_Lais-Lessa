import express from "express"
import { startDatabase } from "./database"
import { deleteMovies, insertMovie, listMovies, listMoviesById, updateMovies } from "./logic"
import { checkIdMovie, checkNameMovie } from "./middlewares"

const app = express()

app.use(express.json())

const PORT = 3000

app.post("/movies",checkNameMovie, insertMovie)
app.get("/movies", listMovies)
app.get("/movies/:id",checkIdMovie, listMoviesById)
app.patch("/movies/:id",checkIdMovie,checkNameMovie, updateMovies)
app.delete("/movies/:id", checkIdMovie, deleteMovies)


app.listen(PORT,async (): Promise<void> => {
    await startDatabase();
    console.log(`Application is running on: http://localhost:${PORT}`)
})