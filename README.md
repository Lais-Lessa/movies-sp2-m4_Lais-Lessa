# Locadora de Filmes

## Introdução

Hoje você recebeu uma demanda inesperada. O gestor de uma _locadora de filmes_ entrou em contato solicitando seus serviços.

O objetivo é elaborar um microsserviço que será utilizado em uma plataforma de streaming. Essa API terá o intuito de gerenciar a coleção de filmes disponíveis.

Abaixo estão todas as regras de negócio definidas pelo cliente, tanto para a entrega quanto para a aplicação. Esse é um cliente muito exigente, portanto siga à risca todas as regras impostas.

Vamos lá?!

#

    O repositório da entrega conta com um arquivo chamado movies_workspace. Esse arquivo é um documento de design utilizado no insomnia.
    Ele contém todas as rotas necessárias para que a aplicação esteja de acordo com as regras impostas.
    Esse arquivo também será utilizado por instrutores e monitores na correção das entregas.

    O workspace em questão possui duas páginas:
      Página para Debug:
        - pode ser utilizado a vontade e ter seus valores para criação, listagem, atualização ou deleção, alterados sem problemas.

      Página para Testes:
        - NUNCA ALTERE NENHUM TESTE OU ROTA DA PÁGINA DE TESTES;
        - ATENÇÃO: sempre REINICIE o servidor e DROP SUA TABELA E RECRIE NOVAMENTE, antes de cada novo teste ou bateria de testes, que for executar;

#

## Regras da entrega

A entrega deve seguir as seguintes regras:

- O código deve estar em TypeScript, caso não esteja a **entrega será zerada**.
- Deverá ser utilizado um banco de dados **_postgres_** para a elaboração da API.
- O nome da tabela, das colunas e demais especificações, devem ser seguidas a risca. Caso tenha divergência, **será descontado nota**.
- Deve conter uma pasta **sql** na **raiz do projeto** com dois arquivos:
  - **create_table.sql**: contendo a criação da tabela **movie**;
    - deve conter **APENAS** a criação da **TABELA**.
  - **diagram.png/jgp**: um arquivo **_.png_** ou **_.jpg_** contendo o diagrama da tabela.
  - caso o arquivo **_create_table.sql_** não exista, **a entrega será zerada**.
- A organização de arquivos deve seguir o que foi visto previamente.

#

## Tabela

O nome da tabela **deve** ser **movies**.

| Coluna       | Especificações                               |
| ------------ | -------------------------------------------- |
| **id**       | inteiro, auto incrementado e chave primária. |
| **name**     | string tamanho 50 e não nulo.                |
| **category** | string tamanho 20 e não nulo.                |
| **duration** | inteiro e não nulo.                          |
| **price**    | inteiro e não nulo.                          |

#

## Endpoints da aplicação

| Método | Endpoint    | Responsabilidade       |
| ------ | ----------- | ---------------------- |
| POST   | /movies     | Criar os filmes        |
| GET    | /movies     | Listar todos os filmes |
| GET    | /movies/:id | Buscar filme por id    |
| PATCH  | /movies/:id | Atualizar filme por id |
| DELETE | /movies/:id | Deletar filme por id   |

#

## Regras da aplicação

### GET /movies

- A rota **GET /movies**, além de listar todos os filmes do cinema, também deve conseguir listar os filmes a partir da categoria específica.
  - Essa categoria deve ser enviada pelo query parameter **category**.
  - Caso a categoria enviada não exista, deve-se retornar todos os filmes do banco.

## Casos de erro

- Na rotas **GET, PATCH e DELETE /movies/:id**, caso **id** não exista, deve-se retornar a mensagem de erro e status code mencionados abaixo:

  - Status code: **_404 NOT FOUND._**
  - Mensagem de retorno:

    ```json
    {
      "message": "Movie not found!"
    }
    ```

- Na rotas **POST e PATCH**, caso **name** já exista, deve retornar a mensagem de erro abaixo. O status code deve ser o mencionado abaixo:

  - Status code: **_409 CONFLICT._**
  - Mensagem de retorno:

    ```json
    {
      "message": "Movie name already exists!"
    }
    ```

#

## Exemplos de requisição

### POST /movies

Rota de criação de filme. Deve ser possível criar um filme.
| **Corpo da requisição:** |
|-|

```json
{
  "name": "Divertidamente",
  "category": "Animação",
  "duration": 120,
  "price": 35
}
```

| **Resposta do servidor:**           |
| ----------------------------------- |
| **Status code:** **_201 CREATED._** |

```json
{
  "id": 1,
  "name": "Divertidamente",
  "category": "Animação",
  "duration": 120,
  "price": 35
}
```

### GET /movies

Rota de listagem de filmes. Deve ser possível retornar todos os filmes do cinema.
| Resposta do servidor: |
| - |
|**Status code:** **_200 OK._**|

```json
[
  {
    "id": 1,
    "name": "Divertidamente",
    "category": "Animação",
    "duration": 120,
    "price": 35
  },
  {
    "id": 2,
    "name": "Matrix",
    "category": "Ficção",
    "duration": 120,
    "price": 35
  }
]
```

#### Com query parameter

O exemplo abaixo foi realizado na seguinte rota: **/movies?category=Animação**.
| Resposta do servidor: |
| - |
| **Status code:** **_200 OK._** |

```json
[
  {
    "id": 1,
    "name": "Divertidamente",
    "category": "Animação",
    "duration": 120,
    "price": 35
  }
]
```

#### Com query parameter

O exemplo abaixo foi realizado na seguinte rota: **/movies?category=outra categoria**.
| Resposta do servidor: |
| - |
| **Status code:** **_200 OK._** |

```json
[
  {
    "id": 1,
    "name": "Divertidamente",
    "category": "Animação",
    "duration": 120,
    "price": 35
  },
  {
    "id": 2,
    "name": "Matrix",
    "category": "Ficção",
    "duration": 120,
    "price": 35
  }
]
```

### GET /movies/:id

Rota de busca de filme. Deve ser possível buscar um filme pelo id.
O exemplo abaixo foi realizado na seguinte rota: **/movies/1**.
| Resposta do servidor: |
| - |
| **Status code:** **_200 OK._** |

```json
[
  {
    "id": 1,
    "name": "Divertidamente",
    "category": "Animação",
    "duration": 120,
    "price": 35
  }
]
```

### PATCH /movies/:id

Rota de atualização de filme. Deve ser possível atualizar um filme pelo id. Todos os campos podem ser atualizados de forma opcional.

O exemplo abaixo foi realizado na seguinte rota: **/movies/2**.
| **Corpo da requisição:** |
|-|

```json
{
  "name": "Matrix 2"
}
```

| Resposta do servidor:          |
| ------------------------------ |
| **Status code:** **_200 OK._** |

```json
{
  "id": 2,
  "name": "Matrix 2",
  "category": "Ficção",
  "duration": 120,
  "price": 35
}
```

### DELETE /movies/:id

Rota de deleção de filme. Deve ser possível deletar um filme pelo id.
O exemplo abaixo foi realizado na seguinte rota: **/movies/1**.
| Resposta do servidor: |
|-|
|**Status code:** **_204 NO CONTENT._**|

## Importante!

Não esqueça de adicionar **_team-m4-correcoes_** no seu repositório do github, para que seja possível realizarmos as correções.

Também não se esqueça de enviar o link do repositório na submissão da entrega.
