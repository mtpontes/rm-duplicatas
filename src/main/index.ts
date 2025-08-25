import { Command } from 'commander';
import path from 'path';
import fs, { Dirent } from 'fs';

const program = new Command();
const ENCODING: BufferEncoding = 'utf8';
const REGEX: RegExp = /^(.*) \(\d+\)\.\w+$/;

// --- Funções utilitárias ---
function remove(filePath: string): void {
  fs.rmSync(filePath, { force: true });
}

function calcularTamanhoEmMegabytes(filePath: string): number {
  const stat: number = fs.statSync(filePath).size;
  return stat / (1024 * 1024);
}

function listarArquivosRecursivamente(diretorio: string): string[] {
  let arquivos: string[] = [];
  const itens: Dirent[] = fs.readdirSync(diretorio, { withFileTypes: true });

  for (const item of itens) {
    const caminhoCompleto = path.join(diretorio, item.name);
    if (item.isDirectory()) {
      arquivos = arquivos.concat(listarArquivosRecursivamente(caminhoCompleto));
    } else {
      arquivos.push(caminhoCompleto);
    }
  }
  return arquivos;
}

// --- Fluxos ---
function fluxoPadrao(targetPath: string): void {
  let tamanhoTotal = 0;

  const filesToExclude: string[] = fs.readdirSync(targetPath, { encoding: ENCODING })
    .filter(file => REGEX.test(file))
    .map(file => path.join(targetPath, file));

  filesToExclude.forEach(file => {
    const size = calcularTamanhoEmMegabytes(file);
    remove(file);
    tamanhoTotal += size;
  });

  console.log('Arquivos excluídos: ', filesToExclude);
  console.log(`Tamanho total: ${tamanhoTotal.toFixed(2)} MB`);
}

function fluxoRecursivo(targetPath: string): void {
  const FILES: string[] = listarArquivosRecursivamente(targetPath)
    .filter(file => REGEX.test(file));

  let tamanhoTotal = 0;
  console.log('Arquivos para excluir:', FILES);

  FILES.forEach(file => {
    const size = calcularTamanhoEmMegabytes(file);
    remove(file);
    tamanhoTotal += size;
  });

  console.log('Arquivos excluídos: ', FILES.length);
  console.log(`Tamanho total: ${tamanhoTotal.toFixed(2)} MB`);
}

// --- CLI com Commander ---
program
  .name('rm-duplicatas')
  .description('Remove arquivos duplicados no formato "nome (1).ext"')
  .argument('[path]', 'Diretório alvo', process.cwd())
  .option('-r, --recursive', 'Remover arquivos recursivamente em subdiretórios', false)
  .action((targetPath: string, options: { recursive: boolean }) => {
    const fullPath = path.resolve(targetPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`Diretório não encontrado: ${fullPath}`);
      process.exit(1);
    }

    if (options.recursive) {
      fluxoRecursivo(fullPath);
    } else {
      fluxoPadrao(fullPath);
    }
  });

program.parse(process.argv);