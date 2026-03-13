# Padrões de Criação de Componentes UI

Este documento descreve os padrões e convenções a serem seguidos ao criar componentes na pasta `src/components/ui`.

## Dependências

Todos os componentes devem utilizar as seguintes dependências para estilização e composição:

- **tailwind-variants**: Para definir variantes e tamanhos de componentes de forma tipada.
- **tailwind-merge**: Para mesclar classes CSS dinâmicas e evitar conflitos.
- **tailwindcss**: Para estilização baseada em utilidades.

## Estrutura do Componente

1.  **Arquivo**: O componente deve ser um arquivo `.tsx` dentro de `src/components/ui/`.
2.  **Named Exports**: Nunca use default exports. Exporte a função do componente e sua interface de props explicitamente.
    ```typescript
    export function Button({ ... }: ButtonProps) { ... }
    export interface ButtonProps { ... }
    ```
3.  **Interface de Props**: A interface deve estender `React.ComponentProps<"element">` (ex: `React.ButtonHTMLAttributes<HTMLButtonElement>`) para incluir propriedades nativas, e `VariantProps<typeof variantFunction>` para incluir as variantes definidas via `tailwind-variants`.
    ```typescript
    export interface ButtonProps
      extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
      asChild?: boolean; // Opcional, para composição
    }
    ```

## Estilização com Tailwind Variants

1.  **Função `cva`**: Utilize a função `cva` do `tailwind-variants` para definir as classes base, variantes e tamanhos.
2.  **Classes Base**: Inclua classes utilitárias comuns (flex, focus, disabled, etc.).
3.  **Variantes**: Defina variantes para aparência (`variant`) e tamanho (`size`).
    - `variant`: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, e variantes específicas do componente (ex: `submit`).
    - `size`: `default`, `sm`, `lg`, `icon`, e variantes específicas (ex: `submit`).
4.  **Cores do Tema**: Utilize as cores definidas no `globals.css` via `@theme` (ex: `bg-primary`, `text-destructive`, `bg-accent-green`).

## Exemplo de Padrão

```typescript
import { type VariantProps, cva } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

const componentVariants = cva("base-class", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      // ...
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      // ...
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ComponentProps
  extends React.ComponentProps<"element">,
    VariantProps<typeof componentVariants> {}

export function Component({
  className,
  variant,
  size,
  ...props
}: ComponentProps) {
  return (
    <element
      className={twMerge(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

## Padrões de Arquivo

- Nome do arquivo: `component-name.tsx` (kebab-case).
- Nome da função: `ComponentName` (PascalCase).
- Nome da interface: `ComponentNameProps`.

## Exemplos de Uso

```tsx
import { Button } from "@/components/ui/button";

<Button variant="submit" size="submit">
  Enviar
</Button>
```
