# Especificação: Editor de Código com Syntax Highlight

## Resumo Executivo

Este documento descreve os requisitos e a arquitetura para a implementação de um editor de código na página inicial do DevRoast, com funcionalidades de syntax highlight automático e detecção de linguagem.

---

## 1. Contexto e Objetivos

### 1.1. Problema
A página inicial (`src/app/page.tsx`) possui uma área de código estática. Precisamos transformá-la em um editor interativo onde o usuário possa:
1.  Colar/codificar trechos de código.
2.  Visualizar o código com syntax highlight.
3.  Otimizar a detecção automática da linguagem de programação.
4.  Alterar manualmente a linguagem, se necessário.

### 1.2. Objetivos
- [ ] Editor de texto funcional (input/textarea).
- [ ] Aplicação de syntax highlight baseada em Shiki.
- [ ] Detecção automática de linguagem (Client-side).
- [ ] Interface de seleção manual de linguagem.
- [ ] Compatibilidade com o design atual (Dark Mode).

---

## 2. Análise de Soluções (Research)

### 2.1. Ray-so (Referência)
O projeto [ray-so](https://github.com/raycast/ray-so) utiliza:
-   **Highlighter**: `shiki`.
-   **Estado**: `jotai`.
-   **Engine**: WASM (Oniguruma) para parsing de gramáticas TextMate.
-   **Características**:
    -   Carregamento assíncrono de linguagens e temas.
    -   Suporte a múltiplos temas.
    -   Renderização para HTML com estilos inline.

**Ponto de atenção**: O Ray-so foca em gerar imagens estáticas. Para um editor interativo, precisaremos de uma abordagem de "highlighting em tempo real".

### 2.2. Shiki (Biblioteca Principal)
-   **Vantagens**:
    -   Usa a mesma engine do VS Code (TextMate grammars).
    -   Precisão extremamente alta.
    -   Suporte a ESM e carregamento sob demanda (bundler-friendly).
    -   Renderização para HTML, HAST ou Tokens.
-   **Desvantagens**:
    -   Não possui detecção de linguagem nativa (requer especificação manual ou implementação externa).

### 2.3. Detecção de Linguagem (Auto-detect)
Shiki não detecta linguagem automaticamente. Precisamos de uma biblioteca externa para o client-side.
-   **highlight.js**: Possui módulo de detecção (`highlightAuto`), mas o artigo menciona problemas de acurácia e performance para blocos curtos.
-   **guesslang-js**: Biblioteca ML (Machine Learning) baseada no modelo original do Google Guesslang.
    -   **Pro**: Alta acurácia.
    -   **Con**: Tamanho do modelo (~4MB) e peso de execução.
-   **Abordagem Híbrida (Recomendada)**:
    1.  Usar uma heurística simples ( Regex / keywords ) para detecção rápida (ex: checar `import`, `function`, `def`).
    2.  Fallback para uma biblioteca ML leve ou lista de suporte de linguagens comuns do projeto.

---

## 3. Arquitetura Proposta

### 3.1. Stack Tecnológica
-   **Highlighter**: `shiki` (via `shiki/bundle/web` para reduzir bundle size).
-   **Detecção**: `highlight.js` (auto-detect) ou implementação simples baseada em keywords.
-   **Editor**: `textarea` controlado por estado React + Camada de visualização (highlight) sobreposta ou renderização do HTML do Shiki.
-   **Gerenciamento de Estado**: `jotai` (inspirado no Ray-so).

### 3.2. Fluxo de Dados
1.  **Input Usuário**: Usuário digita/cola código no `textarea`.
2.  **Detecção**:
    -   Se a linguagem não estiver selecionada manualmente, rodar a função `detectLanguage(code)`.
    -   Se a linguagem for detectada, atualizar o estado `language`.
3.  **Highlighting**:
    -   O código e a linguagem são passados para o `shiki.codeToHtml()`.
    -   O HTML renderizado é exibido em uma `div` visual (camada abaixo ou sobreposta ao `textarea` transparente).
4.  **Sincronização**: O scroll do `textarea` deve ser espelhado na `div` de visualização.

### 3.3. Estrutura de Componentes

```
src/app/components/
  └── CodeEditor/
      ├── index.tsx          (Componente principal)
      ├── use-shiki.ts       (Hook para inicialização do Shiki)
      ├── LanguageSelector.tsx (Dropdown de linguagens)
      └── CodeHighlight.tsx  (Renderização do output do Shiki)
```

---

## 4. Requisitos Funcionais

### 4.1. Editor de Código
-   [ ] `textarea` transparente sobre a camada de highlight.
-   [ ] Suporte a Tab (indentação).
-   [ ] Sincronização de scroll vertical e horizontal.

### 4.2. Syntax Highlight
-   [ ] Suporte a linguagens comuns: JavaScript, TypeScript, Python, SQL, HTML, CSS, JSON.
-   [ ] Tema: `Dark Mode` (correspondente ao design atual `#111111`).
-   [ ] Renderização assíncrona (não bloquear a UI durante o parsing).

### 4.3. Detecção de Linguagem
-   [ ] **Auto-detect**: Analisar o código para determinar a linguagem (ex: verificar palavras-chave).
    -   *Exemplo simples*:
        -   Contém `def ` ou `import `? -> Python.
        -   Contém `function ` ou `const `? -> JavaScript.
        -   Contém `<html`? -> HTML.
-   [ ] **Manual**: Dropdown para seleção explícita da linguagem.

### 4.4. Interface (UI)
-   [ ] Manter o estilo visual da Screen 1 (Janela com 3 pontos de cor).
-   [ ] Adicionar seletor de linguagem na barra de ferramentas.
-   [ ] Indicador visual da linguagem detectada.

---

## 5. Tarefas (To-Dos)

### 🚀 Fase 1: Configuração e Base
- [ ] Instalar dependências: `shiki`, `jotai`.
- [ ] Criar hook `useShiki` para inicializar o highlighter (similar ao Ray-so `code.tsx`).
- [ ] Configurar carregamento de linguagens específicas (ex: `javascript`, `python`) para reduzir bundle size.

### ✨ Fase 2: Editor e Highlighting
- [ ] Criar componente `CodeEditor`.
- [ ] Implementar renderização do código com Shiki (`codeToHtml`).
- [ ] Criar camada de `textarea` transparente para input.
- [ ] Implementar sincronização de scroll entre input e visualização.

### 🔍 Fase 3: Detecção de Linguagem
- [ ] Implementar função `detectLanguage(code: string): string`.
    -   Regex simples para palavras-chave.
    -   Fallback para `plaintext` se não identificado.
- [ ] Integrar detecção automática ao estado do editor.

### 🎨 Fase 4: UI e Integração
- [ ] Criar componente `LanguageSelector`.
- [ ] Integrar ao layout da página inicial (`src/app/page.tsx`).
- [ ] Estilizar para corresponder ao design existente.

### ✅ Fase 5: Testes e Otimização
- [ ] Testar detecção com diferentes linguagens.
- [ ] Verificar performance em dispositivos móveis.
- [ ] Validar acessibilidade (ARIA labels, navegação por teclado).

---

## 6. Perguntas para Esclarecimento

1.  **Gama de Linguagens**: Quais linguagens de programação devem ser suportadas inicialmente? (ex: JS, TS, Python, SQL, Go, Rust, HTML/CSS).
2.  **Persistência**: O código digitado deve ser persistido (localStorage) ou é temporário apenas para demonstração?
3.  **Edge Cases**: Como o editor deve se comportar se o código for muito longo (ex: performance de parsing)?
4.  **Detecção vs. Manual**: Qual deve ser o comportamento padrão? (Ex: Se o usuário colar código sem especificar, deve auto-detectar ou defaultar para JavaScript?).

---

## 7. Referências

-   **Shiki Documentation**: https://shiki.style/guide
-   **Ray-so GitHub**: https://github.com/raycast/ray-so
-   **Guesslang-js**: https://github.com/hieplpvip/guesslang-js
-   **Highlight.js**: https://highlightjs.org/
