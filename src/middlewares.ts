import { NextFunction, Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";

export const checkNameMovie = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { name } = req.body
    
        const query = format(
            "SELECT id FROM movies WHERE name = %L;", name 
        );
        
        const queryResult = await client.query(query)
       
        if(queryResult.rows.length > 0){
            return res.status(409).json({message: "Movie name already exists"})
        }
        
        return next()
    } catch(error){
        return res.status(500).json("Internal server error!")
    }
}

export const checkIdMovie = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const  id  = Number(req.params.id)

        const query = format(
            "SELECT id FROM movies WHERE id =%L;", id
        )

        const queryResult = await client.query(query)

        if(queryResult.rowCount === 0){
            return res.status(404).json({message: "Movie not found!"})
        }
        return next()
    } catch(error){
        return res.status(500).json("Internal server error!")
    }
}