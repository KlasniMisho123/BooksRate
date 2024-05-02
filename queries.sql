CREATE TABLE have_read (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    author VARCHAR(50),
    published INT,
    cover VARCHAR(255)
);

INSERT INTO have_read (title, author, published, cover)
VALUES ('The Hunger Games', 'Suzzane Collins', 2008, "https://s3.amazonaws.com/mm-static-media/books/cover-art/9780439023481.jpeg");

