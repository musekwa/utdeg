## Incubadora UTDEG (IT-UTDEG) — Proposta (UI + PDF + DOCX)

Este projeto contém uma proposta interativa (UI) para a **Incubadora de Tecnologia e Inovação Digital (IT-UTDEG)**, com exportação para:

- **PDF** (formal) via `jsPDF`
- **DOCX** (formal) via `docx`

### Funcionalidades
- **Navegação por secções** (expand/collapse)
- **Download de PDF** (“Descarregar PDF”)
- **Download de DOCX** (“Descarregar DOCX”)
- **Branding UTDEG**: logo e cores institucionais (primária `#8d5732`, secundária `#f8a50a`)

### Conteúdo da proposta
O conteúdo principal está em:

- `src/IncubadoraProposal.jsx`

Qualquer ajuste de texto/números deve ser feito ali para manter consistência entre **UI + PDF + DOCX**.

### Como executar
Instalar dependências:

```bash
npm install
```

Rodar em modo dev:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Preview do build:

```bash
npm run preview
```

### Stack
- React 18
- Vite
- Tailwind CSS
- `lucide-react`
- `jspdf` + `jspdf-autotable`
- `docx`


