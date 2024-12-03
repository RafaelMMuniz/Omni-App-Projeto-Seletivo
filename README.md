
# Omni App - Projeto Seletivo  

Este projeto foi desenvolvido como parte do processo seletivo para desenvolver back-end.  

## Tecnologias Utilizadas  
- **NestJS**  
- **Prisma**  
- **PostgreSQL**  
- **Vitest**  
- **Docker**  

## Instalação e Configuração  
1. Clone o repositório:  
   ```bash
   git clone https://github.com/RafaelMMuniz/Omni-App-Projeto-Seletivo.git
   cd Omni-App-Projeto-Seletivo
   ```  

2. Instale as dependências:  
   ```bash
   pnpm install
   ```  

3. Configure o arquivo `.env` com base no modelo `.env.example`.  

4. Suba os containers Docker:  
   ```bash
   docker-compose up
   ```  

## Como Rodar o Projeto  
1. Inicie o servidor:  
   ```bash
   pnpm run start:dev
   ```  

2. Use o cliente HTTP no arquivo `client.http` para testar as rotas da API.  

## Testes  
Execute os testes utilizando:  
```bash
pnpm test
```  

## Documentação da API  
Acesse a documentação das rotas através do arquivo `client.http` ou utilize ferramentas como Postman.  

