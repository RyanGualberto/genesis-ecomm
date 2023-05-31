# GENESIS ECOMM
É um pequeno "ecommerce" desenvolvido como teste da Genesis Bank

## Tecnologias 
- NextJS - Usado para a construção da UI, integração e Endpoints da API
- TypeScript - Usado na API construída em conjunto com Next e o Prisma
- PrismaORM - ORM usado para manipular o Banco de Dados PostgreSQL
- PostgreSQL - Linguagem de banco de dados utilizada
- Firebase - Para a hospedagem de imagens
- Vercel - Plataforma usado para fazer o deploy da APP e hospedar o Banco de Dados
- Docker - Usado para armazenar o container com o banco de dados de desenvolvimento
- Tailwind - Usado como biblioteca de estilização

## Para acessar o projeto:
### Produção
  https://genesis-ecomm.vercel.app/
  
### Desenvolvimento
- Requisitos
```
  docker
  docker-compose 
  node
```

```
  git clone https://github.com/RyanGualberto/genesis-ecomm
  cd genesis-ecomm
  docker-compose up -d
  npm install
  npx prisma migrate dev
  npm run dev
``` 

By: Ryan Gualberto
