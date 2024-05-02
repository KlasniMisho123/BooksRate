import path from 'path';
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookrate",
    password: "",
    port: 5432,
})
db.connect();



app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended : true}))

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    try {
        const selectedBook = req.query.bookName;

        if (selectedBook) {
            const options = {
                method: 'GET',
                url: 'https://book-finder1.p.rapidapi.com/api/search',
                params: {
                    title: `${selectedBook}`
                },
                headers: {
                    'X-RapidAPI-Key': '5ba0357bc5msh6de1db32af2eae1p1ce101jsnbe6f471549ae',
                    'X-RapidAPI-Host': 'book-finder1.p.rapidapi.com'
                }
            };

            const axiosResult = await axios.get(options.url, {
                params: options.params,
                headers: options.headers
            });
            const selectedBookInfo = axiosResult.data

            const bookArray = [
                selectedBookInfo.results[0].title,
                selectedBookInfo.results[0].authors[0],
                selectedBookInfo.results[0].copyright,
                selectedBookInfo.results[0].published_works[0].cover_art_url
            ];

            await db.query("INSERT INTO have_read (title, author, published, cover) VALUES ($1, $2, $3, $4)", bookArray);
        }

        const result = await db.query("SELECT * FROM have_Read ORDER BY id ASC");
        const books = result.rows;

        res.render("index.ejs", {
            books: books
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/', async (req, res) => {
    try {
        const bookId = req.body.bookId;
        console.log(`Deleting book with ID: ${bookId}`);
        await db.query('DELETE FROM have_read WHERE id = $1', [bookId]);

        const result = await db.query("SELECT * FROM have_Read ORDER BY id ASC");
        const books = result.rows;

        res.render("index.ejs", {
            books: books
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });