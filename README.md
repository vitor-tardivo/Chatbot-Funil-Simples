# Chatbot MVP – Ferramenta de Criação de Fluxos de Mensagens

Este é um protótipo MVP de uma ferramenta de criação de fluxos de mensagens. Trata-se de um chatbot simples sendo assim um não senciente, desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do curso de Análise e Desenvolvimento de Sistemas da UNORTE.

O chatbot foi projetado para funcionar com fluxos definidos manualmente em arquivos JSON, simulando um assistente de atendimento automatizado ou qualquer outro motivo aplicavel com estrutura condicional.

## Tecnologias Utilizadas

- Linguagem **Node.js** (JavaScript não tipado) no back-end
- Linguagens **HTML**, **CSS** e **JavaScript** (puro) no front-end
- **Banco de dados** em arquivos **JSON** (local)
- Principais bibliotecas ChatBot **puppeteer** + **whatsapp-web.js: 1.26.0**

## Como instalar o ChatBot

### 1. Clone, baixe ou dê um fork no repositório

Você pode obter o código de qualquer uma das seguintes maneiras:

```bash
git clone https://github.com/vitor-tardivo/Chatbot-Funil-Simples.git
```
Ou faça o download do ZIP diretamente no GitHub e extraia os arquivos.

- Instalando as dependências você pode usar yarn ou npm:
```bash
yarn install
```
```bash
npm install
```

- Executando o projeto existem dois modos principais de execução:

Modo debug
```bash
yarn debug
```
```bash
npm run debug
```

Modo normal
```bash
yarn start
```
```bash
npm start
```

## 2. Organização de arquivos
Todos os arquivos do projeto devem estar dentro de uma única pasta, pois o chatbot irá criar e gerenciar arquivos adicionais automaticamente durante a execução, como pastas e arquivos JSON.

## 3. Como usar o ChatBot

- Clique no botão "INICIAR" napós rodar o projeto.
- Será exibido um QR Code na tela.
- No seu celular, abra o WhatsApp, vá em ... > Dispositivos conectados > Conectar um dispositivo.
- Escaneie o QR-Code com a câmera para conectar seu WhatsApp ao chatbot.

Após a conexão:

- Aparecerá uma tabela com os números dos chats já interagidos, onde você poderá visualizar, editar ou excluir os registros (CRUD).
- Abaixo da tabela, está localizada a ferramenta de criação de fluxos de mensagens.

- - Você criará um funil, e dentro dele, um template.
- - No template, há um layout estruturado em forma de fila, com posições ordenadas, onde você adicionará os passos da conversa.
- - Cada posição representa uma etapa da interação com o usuário, podendo incluir atraso entre as mensagens, mensagens de texto escrito na hora, arquivos de texto audios sendo enviados como se fosse na hora video imagem e legendas escritas na hora dos arquivos compativeis, com mensagens de texto e audio é possivel selecionar um tempo que ira mostrar Digitando... ou Gravando..., decisões condicionais para redirecionamentos a outros templates.

#### Observação
Este chatbot é um protótipo experimental com fins acadêmicos e não representa inteligência artificial real. Não possui aprendizado de máquina, apenas segue fluxos de decisão definidos previamente pelo proprio usuario.

#### Licença
Este projeto é de uso livre para fins acadêmicos. Para usos comerciais, entre em contato com o autor.
