import { Request, Response } from "express";
import format from "pg-format";
import { ListMovie } from "./interfaces";
import { client } from "./database";

export const insertMovie = async (req: Request, res: Response) => {

  const { name, category, duration, price } = req.body as ListMovie;

  try {
    const insertQuery = format(
      "INSERT INTO movies (name, category, duration, price) VALUES (%L) RETURNING *;",
      [name, category, duration, price]
    );
    const returning = await client.query(insertQuery);
    return res.status(201).json(returning.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const listMovies = async (req: Request, res: Response) => {

  const { category } = req.query

  try{
    const categoryQuery = format(
      "SELECT category FROM movies GROUP BY category"
    )
    const categoryResult = await client.query(categoryQuery)

    const categories = categoryResult.rows.map((movie) => movie.category)


    let selectedMovies = category && categories.includes(category) ? format("SELECT * FROM movies WHERE category = %L", category)
     : "SELECT * FROM movies"

     const result = await client.query(selectedMovies)

     return res.status(200).json(result.rows)

  }catch(error){
    return res.status(500).json({message: "Internal server error", error})
  }
}

export const listMoviesById = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  try{
    const query = format("SELECT * FROM movies WHERE id = %L", id)
    const resultQuery = await client.query(query)
    if(resultQuery.rowCount === 0){
      return res.status(404).json({message:'Movie not found!'})
    }
    return res.status(200).json(resultQuery.rows[0])

  }catch(error){
    return res.status(500).json({message:"Internal server error!"})
  }
}

export const updateMovies = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const {name, category, duration, price} = req.body 
  const updatedColumns: string[] = [];

  const updatedMovieData: Partial<ListMovie> = {
    name,
    category,
    duration,
    price
  }


  Object.entries(updatedMovieData).forEach(([key, value],_) => {
    if (value !== undefined) { 
      updatedColumns.push(format("%I = %L", key, value));
    }
  });

  const updateValues = Object.values(updatedMovieData);

  const updateQuery = format(`
    UPDATE movies 
    SET ${updatedColumns.join(', ')}
    WHERE id = %L
    RETURNING *;
  `, id);

  try {
    const result = await client.query(updateQuery);

  
    return res.status(200).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the movie.' });
  }
};

export const deleteMovies = async (req: Request, res: Response) => {

  const id = Number(req.params.id)

  const deleteQuery = format('DELETE FROM movies WHERE id = %L', id) 

  try{
    const result = await client.query(deleteQuery)
    res.status(204).end()
  } catch(error){
    res.status(500).json({ error: 'An error occurred while deleting the movie.'})
  }
}