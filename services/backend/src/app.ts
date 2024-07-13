import express from "express";

const router = express();

router.get("/", (request, response) => response.send("Hello world!"));

router.listen(8080, () => {});
