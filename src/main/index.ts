import path from 'path'
import fs, { Dirent } from 'node:fs'

const ENCODING: BufferEncoding = 'utf8'
const REGEX: RegExp = /^(.*) \(\d+\)\.\w+$/;


let args: string[] = process.argv;
const ARG: string = args[2]
// const PATH_FILES: string = path.resolve(ARG)
const TESTE = 'E:/projetos/solucoes-pessoais/removedor-de-duplicadas/files2'
// const TESTE = 'E:/projetos/solucoes-pessoais/removedor-de-duplicadas/files2'
const PATH_FILES: string = path.resolve(TESTE)

function remove(path: string): void {
  fs.rmSync(path, { force: true })
}

function calcularTamanhoEmMegabytes(path: string): number {
  const stat: number = fs.statSync(path).size
  return stat / (1024 * 1024)
}

// PADRAO
function fluxoPadrao(): void {
  let tamanhoTotal: number = 0
  const filesToExclude: string[] = fs.readdirSync(PATH_FILES, { encoding: ENCODING, recursive: true })
    .filter(file => REGEX.test(file))
    .map(file => path.join(PATH_FILES, file))

  filesToExclude.forEach(file => {
    const size = calcularTamanhoEmMegabytes(file)
    remove(file)
    tamanhoTotal = tamanhoTotal + size
  })

  console.log('Arquivos excluídos: ', filesToExclude)
  console.log(`Tamanho total: ${tamanhoTotal.toFixed(2)} MB`)
}

// RECURSIVO
function listarArquivosRecursivamente(diretorio: string): string[] {
  let arquivos: string[] = []
  const itens: Dirent[] = fs.readdirSync(diretorio, { withFileTypes: true })

  for (const item of itens) {
    const caminhoCompleto = path.join(diretorio, item.name)

    if (item.isDirectory()) {
      // Se for um diretório, chama a função recursivamente
      arquivos = arquivos.concat(listarArquivosRecursivamente(caminhoCompleto))
    } else {
      // Se for um arquivo, adiciona à lista
      arquivos.push(caminhoCompleto)
    }
  }
  return arquivos
}

function fluxoRecursivo(): void {


  const FILES: string[] = listarArquivosRecursivamente(PATH_FILES)
    .filter(file => REGEX.test(file))

  let tamanhoTotal: number = 0
  const filesToExclude: string[] = FILES.filter(file => REGEX.test(file))
  console.log('Arquivos para excluir:', filesToExclude)

  filesToExclude.forEach(file => {
    // const pathFile: string = path.join(PATH_FILES, file)
    const size = calcularTamanhoEmMegabytes(file)
    remove(file)

    tamanhoTotal = tamanhoTotal + size
  })

  console.log('Arquivos excluídos: ', filesToExclude.length)
  console.log(`Tamanho total: ${tamanhoTotal.toFixed(2)} MB`)
}



function cli(): void {
  if (ARG) {
    switch (ARG) {
      case '-r':
        fluxoRecursivo()
        break;
      case '--help':
        console.log('\n Execute diretamente do diretório alvo')
        console.log(`\n Use -r para recursivo \n`)
    }
    return;
  }
  fluxoPadrao()
}
cli()