import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Router } from "express";
import { randomUUID } from "node:crypto";

import { Review } from "../../../app";
import pg from "../../../pg";
import { reject, respond } from "../../../util/response";

const ReviewHandler = Router({
  mergeParams: true,
});

const ReviewSchema = Type.Object({
  description: Type.String(),
  score: Type.Number(),
});

ReviewHandler.get("/", async (request, response) => {
  const data = await pg<Review>("reviews").select("*");

  return respond(
    response,
    200,
    data.filter((d) => d.product_id === request.params.product_id),
  );
});

ReviewHandler.post("/", async (request, response) => {
  console.log(request.params);

  if (!Value.Check(ReviewSchema, request.body)) {
    return reject(response, 400);
  }

  const newReview: Review = {
    id: randomUUID(),
    created_at: new Date(),
    product_id: request.params.product_id,
    ...request.body,
  };

  await pg<Review>("reviews").insert(newReview);

  return respond(response, 200, newReview);
});

ReviewHandler.delete("/:id", async (request, response) => {
  await pg<Review>("reviews")
    .where({
      id: request.params.id,
    })
    .delete();

  return respond(response, 200);
});

export default ReviewHandler;
