## Mememaker

Criando memes a partir de lambda functions na aws utilizando binários linux injetados pelos layers!

- Layers são pacotes que podemos versionar e com isso podemos reutilizar alguma biblioteca ou binários dentro de várias lambdas.

- Essa aplicação tem o intuito de realizar o download de uma imagem do seu interesse, adicionar conteúdo (frases) tanto em cima e em baixo da imagem para criar seu meme.

## Como rodar?
 ```bash 
bash install.sh
npm run invoke-local
sls deploy 
```