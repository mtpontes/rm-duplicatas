# 📌 Comandos do CLI Removedor de Duplicadas

Este CLI remove arquivos duplicados no formato `nome (1).ext`, `nome (2).ext`, etc., economizando espaço em disco.

## Uso básico
Execute o CLI diretamente no diretório alvo:
```sh
node index.js
```
👉 Executa no **modo padrão** (somente no diretório atual, sem recursão).

---

## Opções

### 🔹 `-r`
```sh
node index.js -r
```
- Executa no **modo recursivo**, varrendo **subdiretórios**.
- Remove arquivos duplicados encontrados em toda a árvore de pastas.
- Mostra:
  - Lista de arquivos excluídos.
  - Quantidade total de arquivos removidos.
  - Espaço liberado em MB.

---

### 🔹 `--help`
```sh
node index.js --help
```
Mostra instruções rápidas:
```
Execute diretamente do diretório alvo
Use -r para recursivo
```

---

## Fluxos

- **Padrão (sem argumentos)**  
  - Apenas o diretório alvo.  
  - Lista os arquivos removidos e soma o espaço liberado.

- **Recursivo (`-r`)**  
  - Percorre todos os subdiretórios.  
  - Lista e remove duplicados.  
  - Mostra quantos foram excluídos e o espaço liberado.

