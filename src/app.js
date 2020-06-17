const express = require('express');
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const app = express();
app.use(express.json());
app.use(cors());

const  repositories = [];

function idValidate(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid identificator" });
  }

  next();
}

function doesNotExistRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((rep) => rep.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  return next();
}

app.get("/repositories",(request, response) => {
  response.status(200).json(repositories)
});


app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {id: uuid(),title,url,techs,likes: 0};
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", idValidate, doesNotExistRepository, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  console.log(id);

  const repository = repositories.find((rep) => rep.id === id);
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
}
);

app.delete("/repositories/:id", idValidate, doesNotExistRepository, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", idValidate, doesNotExistRepository, (request, response) => {
  const { id } = request.params;
  const repository = repositories.find((rep) => rep.id === id);
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;