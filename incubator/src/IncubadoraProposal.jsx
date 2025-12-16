import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronRight, Download, FileText, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import utdegLogoUrl from '../assets/images/utdeg-logo.jpeg';

const IncubadoraProposal = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const proposalRef = useRef(null);
  const BRAND_PRIMARY = '#8d5732';
  const BRAND_SECONDARY = '#f8a50a';

  const hexToRgb = (hex) => {
    const normalized = hex.replace('#', '').trim();
    const full = normalized.length === 3
      ? normalized.split('').map((c) => c + c).join('')
      : normalized;
    const num = parseInt(full, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const fetchAsUint8Array = async (url) => {
    const res = await fetch(url);
    const ab = await res.arrayBuffer();
    return new Uint8Array(ab);
  };

  const fetchAsDataUrl = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const generateDocx = async () => {
    const title = 'Proposta de Projecto: Incubadora de Tecnologia e Inovação Digital';
    const org = 'Universidade Técnica Diogo Eugénio Guilande (UTDEG)';
    const program = 'Incubadora de Tecnologia e Inovação Digital (IT-UTDEG)';
    const date = 'Dezembro 2025';
    const logoBytes = await fetchAsUint8Array(utdegLogoUrl);

    const h1 = (text) =>
      new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { after: 200 } });

    const h2 = (text) =>
      new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 120, after: 120 } });

    const h3 = (text) =>
      new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 100, after: 80 } });

    const p = (text) =>
      new Paragraph({
        children: [new TextRun({ text })],
        spacing: { after: 120 },
      });

    const bullets = (items) =>
      items.map((t) =>
        new Paragraph({
          text: t,
          bullet: { level: 0 },
          spacing: { after: 60 },
        })
      );

    const makeTable = (rows) =>
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows.map((r) =>
          new TableRow({
            children: r.map((cell) =>
              new TableCell({
                width: { size: 33, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: String(cell) })],
              })
            ),
          })
        ),
      });

    const kpis1 = [
      ['Indicador', 'Meta (1 ciclo / 9M)', 'Método'],
      ['Participantes formados', '50', 'Registos de conclusão'],
      ['Taxa de conclusão', '≥80%', 'Concluem vs. iniciam'],
      ['Satisfação', '≥4.0/5.0', 'Questionários pós-programa'],
    ];

    const kpis2 = [
      ['Indicador', 'Meta (1 ciclo / 9M)', 'Método'],
      ['Projetos incubados', '8 (4 diurno + 4 noturno)', 'Projetos aceites'],
      ['Startups constituídas', '3–5', 'Registos comerciais'],
      ['MVPs funcionais', '8', 'Produtos demonstráveis'],
    ];

    const kpis3 = [
      ['Indicador', 'Meta (1 ciclo / 9M)', 'Método'],
      ['Empregos criados', '25+', 'Contratos nas startups'],
      ['Participantes empregados', '30+', 'Follow-up pós-programa'],
      ['Investimento captado', '500k+ MZN', 'Contratos de investimento'],
    ];

    const kpis4 = [
      ['Indicador', 'Meta (1 ciclo / 9M)', 'Método'],
      ['Parcerias ativas', '10+', 'MoUs assinados'],
      ['Eventos realizados', '6+', 'Hackathons, demo days, talks'],
      ['Mentores ativos', '15+', 'Pool de mentores'],
    ];

    const budget = [
      ['Categoria', 'Descrição', 'Estimativa (MZN)'],
      ['Coordenação (PT)', 'Coordenação do programa', '~25k/mês × 9 = 225k'],
      ['Facilitação/Mentoria', 'Bolsa simbólica para docentes/alumni', '~45k/mês × 9 = 405k'],
      ['Internet/Infra', 'Ajustes e consumíveis', '~5k/mês × 9 = 45k'],
      ['Eventos', 'Hackathons, demo days', '~5k/trimestre × 3 = 15k'],
      ['Operacional', 'Materiais, comunicação', '~100k'],
      ['TOTAL', 'Total estimado (1 ciclo / 9 meses)', '≈ 790k MZN'],
    ];

    const coverSection = {
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new ImageRun({
              data: logoBytes,
              transformation: { width: 120, height: 90 },
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: org, bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: title, bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: program })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        }),
        new Paragraph({
          text: 'Localização: Machava, Matola',
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: 'Duração: 9 meses (3M pré-incubação + 6M incubação)',
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: 'Calendário anual: Abril–Dezembro',
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: date })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
      ],
    };

    const contentChildren = [
      h1('Proposta de Projecto'),
      p(
        'O presente documento apresenta a proposta de criação da Incubadora de Tecnologia e Inovação Digital (IT-UTDEG), incluindo objetivos, modelo operacional, plano anual (Abril–Dezembro) e parâmetros de implementação.'
      ),

      h2('1. Sumário Executivo'),
      p(
        'A UTDEG propõe a criação de uma incubadora académica de base tecnológica para formar competências práticas alinhadas ao mercado moçambicano e apoiar a criação de startups de impacto.'
      ),
      ...bullets([
        'Ciclo anual: Abril–Dezembro (9 meses) com 2 incubadores paralelos (diurno e noturno).',
        'Capacidade: 50 participantes por ciclo (15 internos diurno, 15 internos noturno, 10 externos diurno, 10 externos noturno).',
        'Meta do ciclo: 8 MVPs (4 diurno + 4 noturno) e 3–5 startups (ou encaminhamento para estágios/emprego).',
        'Objetivo: unir excelência académica com aplicações reais de negócio (academia + mercado).',
        'Laptop pessoal recomendado para maximizar prática, trabalhos e colaboração.',
      ]),
      h3('Objetivo Geral'),
      p(
        'Estabelecer a Incubadora de Tecnologia e Inovação Digital da UTDEG (IT-UTDEG) como programa integrado de formação prática, incubação de startups tecnológicas e ponte entre a academia e o mercado de trabalho em TIC.'
      ),
      h3('Objetivos específicos'),
      ...bullets([
        'Capacitar 50 participantes por ciclo em competências técnicas e empreendedoriais.',
        'Incubar 8 projetos por ciclo (4 diurno + 4 noturno), com formação de equipas (5–6 membros).',
        'Unir excelência académica com aplicações reais de negócio, aproximando sala de aula e mercado.',
        'Apoiar a criação/estruturação de 3–5 startups por ciclo (ou encaminhamento para oportunidades).',
        'Estabelecer parcerias estratégicas com 10+ empresas/organizações relevantes.',
      ]),
      h3('Investimento (cenário enxuto)'),
      p('Orçamento estimado para 1 ciclo / 9 meses: ≈ 790.000 MZN (com redução possível via parcerias em espécie).'),

      h2('2. Contextualização e Justificação'),
      p(
        'Moçambique enfrenta gaps entre formação académica e necessidades do mercado em TIC. A incubadora foca em prática e execução, conectando estudantes, mentores e desafios reais.'
      ),
      h3('Gaps identificados'),
      ...bullets([
        'Gap de competências práticas: pouco desenvolvimento real de software.',
        'Gap de conexão com mercado: desalinhamento entre academia e necessidades das empresas.',
        'Gap de empreendedorismo: poucos caminhos para transformar ideias em negócios.',
        'Gap de ecossistema: falta de networking, mentoria e acesso a oportunidades.',
      ]),
      h3('Áreas prioritárias (exemplos)'),
      ...bullets([
        'Fintech & Mobile Money; Agritech; Edutech; Healthtech; Logística; Serviços Públicos Digitais.',
      ]),

      h2('3. Indicadores de Sucesso (KPIs)'),
      p('KPIs medidos mensalmente e por fase, com evidências (presenças, repositórios, demos, relatórios de mentoria e questionários).'),
      h3('3.1 Formação e Capacitação'),
      makeTable(kpis1),
      new Paragraph({ text: '', spacing: { after: 120 } }),
      h3('3.2 Criação de Startups'),
      makeTable(kpis2),
      new Paragraph({ text: '', spacing: { after: 120 } }),
      h3('3.3 Impacto Económico'),
      makeTable(kpis3),
      new Paragraph({ text: '', spacing: { after: 120 } }),
      h3('3.4 Ecossistema e Parcerias'),
      makeTable(kpis4),

      h2('4. Modelo Operacional da Incubadora'),
      p('O programa opera com 2 incubadores paralelos (diurno e noturno), com metodologia baseada em projetos e entregáveis claros por fase.'),
      h3('Estrutura de promoções'),
      ...bullets([
        'Duração: 9 meses (3M pré-incubação + 6M incubação).',
        'Turmas: diurno e noturno, com o mesmo padrão de avaliação.',
        'Tracks: Web Full-Stack, Mobile (React Native), IA/Dados e Fundamentos de Cloud.',
        'Curso transversal: Fundamentos de Cibersegurança para todos os participantes.',
      ]),
      h3('Seleção e quotas (por ciclo)'),
      ...bullets([
        '15 estudantes internos (diurno).',
        '15 estudantes internos (noturno).',
        '10 participantes externos (diurno).',
        '10 participantes externos (noturno).',
      ]),
      p('Critérios de seleção: motivação, compromisso, disponibilidade e necessidades de nivelamento (Módulo Zero).'),
      h3('Fases do programa (entregáveis)'),
      ...bullets([
        'Seleção (semanas 1–4): divulgação, candidaturas, lista final + lista de espera.',
        'Pré-incubação (3 meses): treinos/mentorias; pitch; seleção de 4+4 ideias; equipas 5–6 por projeto.',
        'Incubação (6 meses): sprints, validação, iterações; MVP demonstrável; Demo Day; certificados.',
        'Pós-incubação: criação de startup, reconfiguração de equipas ou encaminhamento para estágios/emprego.',
      ]),

      h2('5. Plano de Implementação (9 meses)'),
      p('Calendário anual sugerido: execução do ciclo de Abril a Dezembro; preparação de Janeiro a Março.'),
      ...bullets([
        'Abr: seleção/onboarding + arranque da pré-incubação.',
        'Abr–Jun: pré-incubação (formação, mentorias, pitch, seleção 4+4).',
        'Jul–Dez: incubação (execução, validação, construção do MVP).',
        'Dez: Demo Day + encerramento + follow-up.',
      ]),

      h2('6. Infraestrutura e Recursos'),
      ...bullets([
        'Salas: 3 salas de 15m × 7m (≈ 315 m² no total).',
        'Internet adequada; energia permanente; computadores (mínimo 30).',
        'Recomendação: laptop pessoal por participante (quando possível).',
      ]),

      h2('7. Recursos Humanos e Mentoria'),
      ...bullets([
        'Coordenação: 1 coordenador(a) do programa.',
        'Facilitadores: docentes por track.',
        'Mentoria: pool de alumni voluntários e docentes.',
        'Apoio administrativo: secretaria e comunicação.',
      ]),

      h2('8. Parcerias e Networking'),
      ...bullets([
        'Parcerias para mentoria, desafios reais, validação e oportunidades de estágio/emprego.',
        'Eventos: talks, hackathons e demo days.',
        'Apoio em espécie: hardware, conectividade e créditos cloud.',
      ]),
      h3('Estratégia de comunicação'),
      ...bullets([
        'Criar um website oficial da incubadora (programa, calendário Abril–Dezembro, candidaturas e resultados).',
        'Alcançar o público-alvo via redes sociais (calls for applications, histórias de equipas, resultados e eventos).',
        'Organizar sessões ao vivo (ex.: live coding, talks com mentores e demos de MVPs).',
      ]),

      h2('9. Orçamento Base (baixo custo) e Sustentabilidade'),
      p('Orçamento enxuto orientado ao menor custo possível, com cofinanciamento via parcerias.'),
      makeTable(budget),
      new Paragraph({ text: '', spacing: { after: 120 } }),
      p('Nota: priorizar angariação de fundos através de parcerias e patrocínios; a UTDEG pode cobrir 1 ciclo (9 meses) até autossustentabilidade.'),

      h2('10. Modelo de Receita e Acessibilidade'),
      ...bullets([
        'Receita principal: criação e implementação de cursos de curta duração em IT (alinhados às áreas da incubadora).',
        'Exemplos: Web Full-Stack, Mobile (React Native), IA/Dados, Fundamentos de Cloud e Fundamentos de Cibersegurança.',
        'Cofinanciamento via patrocínios/bolsas corporativas para garantir acessibilidade (quando aplicável).',
      ]),

      h2('11. Governança'),
      ...bullets([
        'Reporte: Pró-Reitoria.',
        'Comité consultivo: 5 membros (2 docentes, 2 administrativos, 1 consultor externo).',
        'Políticas de seleção, avaliação e progressão definidas e publicadas.',
      ]),

      h2('12. Riscos e Mitigações'),
      ...bullets([
        'Adesão irregular: calendário flexível + Módulo Zero + checkpoints (demos).',
        'Recursos limitados: parcerias em espécie (hardware, cloud, mentoria).',
        'Qualidade técnica: currículos práticos, code review e validação com utilizadores.',
      ]),

      h2('13. Atividades Prioritárias (curto prazo)'),
      ...bullets([
        'Identificar e convidar startups parceiras.',
        'Estabelecer parcerias com empresas/organizações.',
        'Definir coordenação e facilitadores.',
        'Concluir currículos por track e calendário anual (Abr–Dez).',
        'Implementar canais de comunicação (website, redes sociais e agenda de lives: live coding, talks e demos).',
        'Preparar formulário, critérios de seleção e datas de pitch/Demo Day.',
      ]),
    ];

    const doc = new Document({
      sections: [
        coverSection,
        {
          properties: {},
          children: [
            new Paragraph({ text: '', pageBreakBefore: true }),
            ...contentChildren,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    downloadBlob(blob, 'Proposta_IT_UTDEG.docx');
  };

  const generateFormalPdf = async () => {
    const logoDataUrl = await fetchAsDataUrl(utdegLogoUrl);
    const doc = new jsPDF('p', 'mm', 'a4');
    const primaryRgb = hexToRgb(BRAND_PRIMARY);
    const secondaryRgb = hexToRgb(BRAND_SECONDARY);
    const left = 15;
    const right = 195;
    let y = 20;

    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      const logoW = 10;
      const logoH = 10;
      doc.addImage(logoDataUrl, 'JPEG', left, 6, logoW, logoH);
      const textLeft = left + logoW + 3;
      doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.text('Universidade Técnica Diogo Eugénio Guilande (UTDEG)', textLeft, 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text('Proposta de Criação: Incubadora de Tecnologia e Inovação Digital', textLeft, 17);
      const date = 'Dezembro 2025';
      doc.text(date, right, 12, { align: 'right' });
      doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.line(left, 18, right, 18);
      doc.setDrawColor(0);
      doc.setTextColor(0);
    };

    const addFooter = () => {
      const page = String(doc.getNumberOfPages());
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`UTDEG • Proposta Incubadora • Página ${page}`, right, 287, { align: 'right' });
      doc.setTextColor(0);
    };

    const newPage = () => {
      doc.addPage();
      addHeader();
      addFooter();
      y = 25;
    };

    const ensureSpace = (needed = 10) => {
      if (y + needed > 280) newPage();
    };

    const addTitle = (text) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(text, left, y);
      y += 10;
    };

    const addH2 = (text) => {
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(text, left, y);
      y += 8;
    };

    const addParagraph = (text) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, right - left);
      lines.forEach((line) => {
        ensureSpace(8);
        doc.text(line, left, y);
        y += 6;
      });
      y += 2;
    };

    const addBullets = (items) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      items.forEach((item) => {
        ensureSpace(8);
        const lines = doc.splitTextToSize(item, right - (left + 6));
        doc.text('•', left, y);
        doc.text(lines, left + 6, y);
        y += 6 + (lines.length - 1) * 6;
      });
      y += 2;
    };

    // Cover
    addHeader();
    const coverLogoW = 28;
    const coverLogoH = 21;
    doc.addImage(logoDataUrl, 'JPEG', (left + right - coverLogoW) / 2, y, coverLogoW, coverLogoH);
    y += coverLogoH + 6;
    doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    addTitle('Proposta de Projecto');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Incubadora de Tecnologia e Inovação Digital (IT-UTDEG)', left, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
      addParagraph('Localização: Machava, Matola • Horizonte: 9 meses (3M pré + 6M inc.) • Calendário anual: Abril–Dezembro • Público-alvo: estudantes UTDEG (diurno e noturno) e externos.');
    y += 6;
    addFooter();
    newPage();

    // Executive summary
    addH2('1. Sumário Executivo');
    addParagraph('A UTDEG propõe a criação de uma incubadora académica de base tecnológica para formar competências práticas alinhadas ao mercado moçambicano e apoiar a criação de startups de impacto. O modelo privilegia custos baixos, inclusão (Módulo Zero) e parcerias locais.');
    addBullets([
      'Formação prática em Web Full-Stack, Mobile, Dados e Fundamentos de Cloud.',
      'Curso transversal (para todos): Fundamentos de Cibersegurança.',
      'Mentoria por docentes e alumni; integração com desafios locais e eventos.',
      'Meta (1 ciclo / 9 meses): 50 participantes formados, 8 MVPs (4 diurno + 4 noturno), 3–5 startups.',
      'Recomendação: candidatos são encorajados a possuir laptop pessoal para melhor aproveitar as sessões práticas e o trabalho em equipa.',
    ]);

    // Context Mozambique
    addH2('2. Contexto Moçambicano e Justificação');
    addParagraph('O ecossistema digital em Moçambique cresce impulsionado por serviços móveis e necessidades de digitalização pública e privada. Persistem gaps entre formação teórica e competências práticas, especialmente em desenvolvimento de software e dados.');
    addBullets([
      'Adoção de mobile money e serviços digitais (ex.: M-Pesa, e-Mola, mKesh) cria oportunidades em fintech e pagamentos.',
      'Setores com potencial: agritech, edutech, saúde digital, logística urbana e serviços públicos digitais.',
      'Desafio central: transformar aprendizagem em experiência prática relevante ao mercado.',
    ]);

    // Operational model
    addH2('3. Modelo Operacional');
    addBullets([
      'Ciclo do programa: 9 meses (3M pré-incubação + 6M incubação).',
      'Calendário anual sugerido: Abril (início) a Dezembro (Demo Day e encerramento).',
      'Seleção com quotas: 15 internos diurno, 15 internos noturno, 10 externos diurno, 10 externos noturno.',
      'Turmas diurno e noturno; metodologia baseada em projetos.',
      'Módulo Zero (4–6 semanas) para iniciantes: alfabetização digital e fundamentos.',
      'Curso transversal (para todos): Fundamentos de Cibersegurança.',
      'Laptop pessoal recomendado para maximizar produtividade (código, prática e colaboração).',
    ]);

    // Program phases
    addH2('4. Fases do Programa (9 meses)');
    addBullets([
      'Fase 1 – Seleção: candidatura e seleção de participantes (internos diurno, internos noturno, externos diurno e externos noturno) de acordo com quotas definidas.',
      'Fase 2 – Pré-incubação (3 meses): formações, mentorias e introdução a tecnologias (Web Full-Stack, Mobile, IA/Dados); apresentação de ideias; seleção das 4 melhores ideias no diurno e 4 no noturno; formação de grupos (5–6 membros).',
      'Fase 3 – Incubação (6 meses): desenvolvimento dos MVPs com mentoria e acompanhamento; apresentação pública a startups e instituições; emissão de certificados de participação.',
      'Fase 4 – Pós-incubação/Follow-up: apoio à constituição de startups ou reconfiguração de equipas; encaminhamento para estágios/colocações.',
    ]);

    // Infrastructure
    addH2('5. Infraestrutura e Recursos');
    addBullets([
      'Salas: 3 salas de 15m × 7m (≈ 315 m² no total).',
      'Internet adequada; 30 computadores; energia permanente.',
      'Recursos humanos: coordenação, facilitadores (docentes) e mentores (alumni).',
    ]);

    // KPIs tables
    const kpiTables = [
      {
        title: '6. KPIs – Formação e Capacitação',
        head: [['Indicador', 'Meta (1 ciclo / 9M)', 'Método']],
        body: [
          ['Participantes formados', '50', 'Registos de conclusão'],
          ['Taxa de conclusão', '≥80%', 'Concluem vs. iniciam'],
          ['Satisfação', '≥4.0/5.0', 'Questionários pós-programa'],
        ],
      },
      {
        title: '7. KPIs – Criação de Startups',
        head: [['Indicador', 'Meta (1 ciclo / 9M)', 'Método']],
        body: [
          ['Projetos incubados', '8 (4 diurno + 4 noturno)', 'Projetos aceites'],
          ['Startups constituídas', '3–5', 'Registos comerciais'],
          ['MVPs funcionais', '8', 'Produtos demonstráveis'],
        ],
      },
      {
        title: '8. KPIs – Impacto Económico',
        head: [['Indicador', 'Meta (1 ciclo / 9M)', 'Método']],
        body: [
          ['Empregos criados', '25+', 'Contratos nas startups'],
          ['Participantes empregados', '30+', 'Follow-up pós-programa'],
          ['Investimento captado', '500k+ MZN', 'Contratos de investimento'],
        ],
      },
      {
        title: '9. KPIs – Ecossistema e Parcerias',
        head: [['Indicador', 'Meta (1 ciclo / 9M)', 'Método']],
        body: [
          ['Parcerias ativas', '10+', 'MoUs assinados'],
          ['Eventos realizados', '6+', 'Hackathons, demo days, talks'],
          ['Mentores ativos', '15+', 'Pool de mentores'],
        ],
      },
    ];

    kpiTables.forEach((t) => {
      ensureSpace(20);
      addH2(t.title);
      autoTable(doc, {
        head: t.head,
        body: t.body,
        startY: y,
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b], textColor: 255 },
        margin: { left, right: 15 },
      });
      y = (doc.lastAutoTable?.finalY || y) + 8;
    });

    // Partnerships and governance
    addH2('10. Parcerias e Governança');
    addBullets([
      'Mapear e convidar startups de IT no país; firmar parcerias com empresas e ONGs.',
      'Reporte à Pró-Reitoria; Comité consultivo de 5 membros (2 docentes, 2 administrativos, 1 consultor externo).',
      'Eventos de ecossistema: talks, hackathons e demo days por promoção.',
      'Estratégia de comunicação: website oficial da incubadora, divulgação em redes sociais e sessões ao vivo (live coding, talks, demos).',
    ]);

    // Lean budget table (lowest cost)
    addH2('11. Orçamento Base (Cenário Enxuto)');
    addParagraph('Orçamento orientado ao menor custo possível, com foco em bolsas simbólicas e apoio em espécie via parcerias. A universidade pode cobrir 1 ciclo (9 meses) até autossustentabilidade.');
    autoTable(doc, {
      head: [['Categoria', 'Descrição', 'Estimativa (MZN)']],
      body: [
        ['Coordenação (PT)', 'Coordenação do programa', '≈ 15k/mês × 9 = 135k'],
        ['Facilitação/Mentoria', 'Bolsa simbólica docentes/alumni', '≈ 30k/mês × 9 = 270k'],
        ['Internet/Infra', 'Ajustes e consumíveis', '≈ 3k/mês × 9 = 27k'],
        ['Eventos', 'Hackathons e demo days', '≈ 5k/trimestre × 3 = 15k'],
        ['Operacional', 'Materiais e comunicação', '≈ 60k'],
      ],
      foot: [['Total estimado (1 ciclo / 9 meses)', '', '≈ 507k MZN']],
      startY: y,
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [primaryRgb.r, primaryRgb.g, primaryRgb.b], textColor: 255 },
      footStyles: { fillColor: [secondaryRgb.r, secondaryRgb.g, secondaryRgb.b], textColor: 20, fontStyle: 'bold' },
      margin: { left, right: 15 },
    });
    y = (doc.lastAutoTable?.finalY || y) + 8;
    addParagraph('Observação: valores são estimativas. Parcerias (patrocínio de turmas/tracks, doações de hardware, créditos de cloud, mentoria corporativa) podem reduzir substancialmente os custos diretos.');

    // Revenue model and accessibility
    addH2('12. Modelo de Receita e Acessibilidade');
    addBullets([
      'Receita principal: criação e implementação de cursos de curta duração em IT (alinhados às áreas da incubadora).',
      'Exemplos: Web Full-Stack, Mobile (React Native), IA/Dados, Fundamentos de Cloud e Fundamentos de Cibersegurança.',
      'Acessibilidade: bolsas e patrocínios corporativos podem reduzir custos para participantes com limitações financeiras.',
    ]);

    // Risks
    addH2('13. Riscos e Mitigações');
    addBullets([
      'Adesão irregular: oferta diurna e noturna; Módulo Zero para nivelamento.',
      'Recursos limitados: foco em parcerias em espécie (hardware, cloud, mentoria).',
      'Qualidade técnica: currículos práticos, avaliação contínua e demo days.',
    ]);

    addFooter();
    doc.save('Proposta_IT_UTDEG.pdf');
  };

  const sections = [
    {
      id: 'sumario',
      title: '1. Sumário Executivo',
      content: (
        <div className="space-y-4">
          <div className="bg-[#8d5732]/10 border-l-4 border-[#8d5732] p-4">
            <h4 className="font-semibold text-[#8d5732] mb-2">Visão</h4>
            <p className="text-gray-700">Tornar a UTDEG o centro de referência nacional em formação de empreendedores tecnológicos, capacitando estudantes com competências práticas para o mercado de TIC e criando soluções inovadoras para os desafios moçambicanos.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-2">Como o programa funciona</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li><strong>Ciclo anual:</strong> Abril–Dezembro (9 meses)</li>
                <li><strong>2 incubadores:</strong> diurno e noturno</li>
                <li><strong>Estrutura:</strong> 3M pré-incubação + 6M incubação</li>
                <li><strong>Final:</strong> Demo Day + certificados</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-2">Requisitos e recomendações</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li><strong>Compromisso:</strong> assiduidade, participação em equipa e entregáveis</li>
                <li><strong>Laptop pessoal (recomendado):</strong> para prática contínua, trabalhos e colaboração</li>
                <li><strong>Inclusão:</strong> Módulo Zero para nivelamento de iniciantes</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Objetivo Geral</h4>
            <p className="text-gray-700">Estabelecer a Incubadora de Tecnologia e Inovação Digital da UTDEG (IT-UTDEG) como programa integrado de formação prática, incubação de startups tecnológicas e ponte entre a academia e o mercado de trabalho em TIC.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Objetivos Específicos</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Capacitar 50 participantes (15 internos diurno, 15 internos noturno, 10 externos diurno, 10 externos noturno) em competências técnicas e empreendedoriais por ciclo (9 meses)</li>
              <li>• Incubar 8 projetos tecnológicos por ciclo (4 diurno + 4 noturno), com potencial de se tornarem startups viáveis</li>
              <li>• Unir excelência académica com aplicações reais de negócio, aproximando sala de aula e mercado</li>
              <li>• Apoiar a criação/estruturação de 3–5 startups funcionais por ciclo (ou encaminhamento para estágios/emprego)</li>
              <li>• Estabelecer parcerias estratégicas com 10+ empresas de TIC e organizações relevantes</li>
              <li>• Posicionar a UTDEG como líder em inovação tecnológica no ensino superior moçambicano</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Impacto Esperado (1 ciclo / 9 meses)</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">50</div>
                <div className="text-gray-600">Estudantes Formados</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-gray-600">Projetos Incubados</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">3-5</div>
                <div className="text-gray-600">Startups Criadas</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">25+</div>
                <div className="text-gray-600">Empregos Gerados</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Investimento Requerido</h4>
            <p className="text-gray-700">Orçamento estimado (cenário enxuto) para 1 ciclo / 9 meses: <span className="font-bold">≈ 790.000 MZN</span></p>
            <p className="text-sm text-gray-600 mt-1">Retorno esperado através de impacto social, posicionamento institucional e potencial equity em startups graduadas</p>
          </div>
        </div>
      )
    },
    {
      id: 'contexto',
      title: '2. Contextualização e Justificação',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded border">
            <h4 className="font-semibold mb-2">Porque esta incubadora é necessária</h4>
            <p className="text-sm text-gray-700">
              A proposta responde diretamente a 3 desafios: (i) baixa experiência prática em desenvolvimento de software,
              (ii) fraca ligação universidade–mercado e (iii) poucas rotas para transformar ideias em soluções testadas.
              O desenho do programa (pré-incubação + incubação) reduz o risco de “ideias sem execução”, garantindo entregáveis reais.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2.1 Contexto Nacional</h4>
            <p className="text-gray-700 mb-3">Moçambique enfrenta desafios significativos no desenvolvimento do sector de TIC, com gaps evidentes entre a formação académica e as necessidades do mercado. A penetração digital está a crescer rapidamente (mais de 60% de penetração móvel), mas faltam profissionais qualificados e soluções tecnológicas locais.</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 my-3">
              <p className="text-sm text-gray-700"><strong>Oportunidade:</strong> O mercado de TIC em Moçambique está em expansão, com crescente demanda por desenvolvedores, analistas de dados e empreendedores tecnológicos capazes de criar soluções contextualizadas.</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2.2 Gaps Identificados</h4>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Gap de Competências Práticas:</strong> Estudantes formam-se com conhecimento teórico mas pouca experiência em desenvolvimento real de software</li>
              <li><strong>Gap de Conexão com Mercado:</strong> Desconexão entre o que as universidades ensinam e o que as empresas procuram</li>
              <li><strong>Gap de Empreendedorismo:</strong> Poucos programas que apoiam estudantes a transformar ideias em negócios viáveis</li>
              <li><strong>Gap de Ecossistema:</strong> Falta de espaços para networking, mentoria e acesso a financiamento inicial</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2.3 Papel da UTDEG</h4>
            <p className="text-gray-700 mb-2">Como universidade técnica com vocação para inovação, a UTDEG está posicionada para:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• Formar profissionais com competências alinhadas às necessidades do mercado</li>
              <li>• Criar um ecossistema de inovação na Província e Cidade de Maputo</li>
              <li>• Estabelecer-se como referência em empreendedorismo tecnológico</li>
              <li>• Contribuir para o desenvolvimento económico local através de startups de impacto</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2.4 Áreas Prioritárias para Soluções Tecnológicas</h4>
            <p className="text-sm text-gray-600 mb-2">
              As áreas abaixo funcionam como <strong>fontes de problemas</strong> e oportunidades. As equipas podem escolher outras áreas,
              desde que demonstrem relevância local, viabilidade técnica e potencial de adoção.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border-l-4 border-[#8d5732] pl-3">
                <h5 className="font-semibold text-sm">Fintech & Mobile Money</h5>
                <p className="text-xs text-gray-600">Pagamentos digitais, literacia financeira, microcrédito</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <h5 className="font-semibold text-sm">Agritech</h5>
                <p className="text-xs text-gray-600">Conectar agricultores a mercados, previsões climáticas, gestão de produção</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3">
                <h5 className="font-semibold text-sm">Edutech</h5>
                <p className="text-xs text-gray-600">Plataformas de aprendizagem, gestão escolar, formação profissional</p>
              </div>
              <div className="border-l-4 border-red-500 pl-3">
                <h5 className="font-semibold text-sm">Healthtech</h5>
                <p className="text-xs text-gray-600">Telemedicina, gestão de consultas, informação de saúde</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3">
                <h5 className="font-semibold text-sm">Logística</h5>
                <p className="text-xs text-gray-600">Gestão de entregas, tracking, marketplaces locais</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-3">
                <h5 className="font-semibold text-sm">Serviços Públicos Digitais</h5>
                <p className="text-xs text-gray-600">Digitalização de processos, acesso a informação pública</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'kpis',
      title: '3. Indicadores de Sucesso (KPIs)',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#8d5732]/10 to-[#f8a50a]/15 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Framework de Avaliação</h4>
            <p className="text-sm text-gray-700">Os KPIs estão organizados em 4 dimensões principais que refletem os objetivos da incubadora.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <h4 className="font-semibold mb-2">Como os KPIs serão medidos</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li><strong>Cadência:</strong> monitoria mensal (presenças, entregáveis) e revisão por fase (pré/incubação)</li>
              <li><strong>Evidências:</strong> registos de presença, repositórios de código, demos, relatórios de mentoria e questionários</li>
                <li><strong>Transparência:</strong> critérios publicados para progressão e seleção de projetos (4+4)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">3.1 Dimensão 1: Formação e Capacitação</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border text-gray-800">
                <thead className="bg-[#8d5732]/15">
                  <tr>
                    <th className="border p-2 text-left">Indicador</th>
                    <th className="border p-2 text-center">Meta (1 ciclo / 9M)</th>
                    <th className="border p-2 text-left">Método</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Participantes formados</td>
                    <td className="border p-2 text-center font-bold">50</td>
                    <td className="border p-2">Registos de conclusão</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Taxa de conclusão</td>
                    <td className="border p-2 text-center font-bold">≥80%</td>
                    <td className="border p-2">Participantes que concluem vs. iniciam</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Satisfação</td>
                    <td className="border p-2 text-center font-bold">≥4.0/5.0</td>
                    <td className="border p-2">Questionários pós-programa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">3.2 Dimensão 2: Criação de Startups</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border text-gray-800">
                <thead className="bg-green-100">
                  <tr>
                    <th className="border p-2 text-left">Indicador</th>
                    <th className="border p-2 text-center">Meta (1 ciclo / 9M)</th>
                    <th className="border p-2 text-left">Método</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Projetos incubados</td>
                    <td className="border p-2 text-center font-bold">8</td>
                    <td className="border p-2">Projetos aceites</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Startups constituídas</td>
                    <td className="border p-2 text-center font-bold">3-5</td>
                    <td className="border p-2">Registos comerciais</td>
                  </tr>
                  <tr>
                    <td className="border p-2">MVPs funcionais</td>
                    <td className="border p-2 text-center font-bold">8</td>
                    <td className="border p-2">Produtos demonstráveis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">3.3 Dimensão 3: Impacto Económico</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border text-gray-800">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="border p-2 text-left">Indicador</th>
                    <th className="border p-2 text-center">Meta (1 ciclo / 9M)</th>
                    <th className="border p-2 text-left">Método</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Empregos criados</td>
                    <td className="border p-2 text-center font-bold">25+</td>
                    <td className="border p-2">Contratos nas startups</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Participantes empregados</td>
                    <td className="border p-2 text-center font-bold">30+</td>
                    <td className="border p-2">Follow-up pós-programa</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Investimento captado</td>
                    <td className="border p-2 text-center font-bold">500k+ MZN</td>
                    <td className="border p-2">Contratos de investimento</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">3.4 Dimensão 4: Ecossistema e Parcerias</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border text-gray-800">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="border p-2 text-left">Indicador</th>
                    <th className="border p-2 text-center">Meta (1 ciclo / 9M)</th>
                    <th className="border p-2 text-left">Método</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Parcerias ativas</td>
                    <td className="border p-2 text-center font-bold">10+</td>
                    <td className="border p-2">MoUs assinados</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Eventos realizados</td>
                    <td className="border p-2 text-center font-bold">6+</td>
                    <td className="border p-2">Hackathons, demo days, talks</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Mentores ativos</td>
                    <td className="border p-2 text-center font-bold">15+</td>
                    <td className="border p-2">Pool de mentores voluntários</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'modelo',
      title: '4. Modelo Operacional da Incubadora',
      content: (
        <div className="space-y-4 text-gray-700">
          <div className="bg-[#8d5732]/10 border-l-4 border-[#8d5732] p-3 rounded">
            <p className="text-sm">
              O programa funciona em <strong>2 incubadores paralelos</strong> (diurno e noturno), garantindo inclusão de
              estudantes UTDEG (diurno e noturno) e participação de interessados externos. Cada ciclo tem
              <strong> 9 meses</strong> e termina com apresentação pública de <strong>MVPs</strong>.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Estrutura de Promoções</h4>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">Duração e lógica do ciclo</div>
                  <p className="text-sm text-gray-600">
                    9 meses por ciclo: <strong>3 meses de pré-incubação</strong> (formação + ideação) e{' '}
                    <strong>6 meses de incubação</strong> (construção do MVP, validação e Demo Day).
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">Capacidade e composição da turma</div>
                  <p className="text-sm text-gray-600">
                    50 participantes por ciclo: <strong>15 internos (diurno)</strong>, <strong>15 internos (noturno)</strong>
                    {' '}e <strong>20 externos</strong> (10 alocados ao diurno e 10 ao noturno). Esta estrutura garante
                    diversidade e networking para o ecossistema local.
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">Tracks (componentes técnicas)</div>
                  <p className="text-sm text-gray-600">
                    Trilhas de aprendizagem e prática com entregáveis: <strong>Web Full-Stack</strong> (ex.: React, Node,
                    bases de dados), <strong>Mobile</strong> (React Native), <strong>IA/Dados</strong> (ML básico,
                    análise/visualização) e <strong>Fundamentos de Cloud</strong> (deploy, CI/CD, boas práticas).
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">Curso transversal (para todos)</div>
                  <p className="text-sm text-gray-600">
                    <strong>Fundamentos de Cibersegurança</strong> para todos os participantes (boas práticas, proteção de dados,
                    noções de risco, segurança em aplicações web/mobile e higiene digital).
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">Adequação a estudantes trabalhadores</div>
                  <p className="text-sm text-gray-600">
                    Duas modalidades (diurno e noturno) com horários compatíveis, mantendo o mesmo padrão de
                    avaliação e os mesmos checkpoints (demos, revisões e entregáveis).
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Seleção e Quotas</h4>
            <p className="text-sm text-gray-600 mb-2">
              A seleção privilegia <strong>motivação</strong>, <strong>compromisso</strong> e <strong>disponibilidade</strong>.
              Não é obrigatório ter experiência avançada (o Módulo Zero cobre nivelamento).
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Recomendação:</strong> candidatos são encorajados a possuir <strong>laptop pessoal</strong> para praticar fora das sessões,
              contribuir no repositório do projeto e colaborar melhor em equipa.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded border">
                <h5 className="font-semibold text-sm mb-1">Quotas (por ciclo)</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>15 estudantes internos (diurno)</li>
                  <li>15 estudantes internos (noturno)</li>
                  <li>10 externos (diurno)</li>
                  <li>10 externos (noturno)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded border">
                <h5 className="font-semibold text-sm mb-1">Como é feita a seleção</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Inscrição com carta curta de motivação e disponibilidade (diurno/noturno)</li>
                  <li>Triagem: perfil, compromisso e alinhamento com as regras do programa</li>
                  <li>Entrevista rápida (ou teste simples) para identificar necessidades de nivelamento</li>
                  <li>Lista final por quota + lista de espera (para substituir desistências)</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Fases do Programa (9 meses)</h4>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">1) Seleção (semanas 1–4)</div>
                  <p className="text-sm text-gray-600">
                    Divulgação, candidaturas e seleção final das 50 vagas por quota (internos diurno, internos noturno,
                    externos diurno e externos noturno). Resultado: lista de selecionados, lista de espera e onboarding do programa.
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">2) Pré-incubação (3 meses)</div>
                  <p className="text-sm text-gray-600">
                    Formação intensiva (treinos, mentorias e palestras) com exposição a tecnologias <strong>Web Full‑Stack</strong>,
                    <strong> Mobile</strong> e <strong>IA/Dados</strong>. A fase termina com{' '}
                    <strong>pitch de ideias</strong>: selecionam-se <strong>4 melhores ideias no diurno</strong> e{' '}
                    <strong>4 no noturno</strong>, formando equipas de <strong>5–6 membros</strong> por projeto.
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">3) Incubação (6 meses)</div>
                  <p className="text-sm text-gray-600">
                    As equipas executam o projeto com acompanhamento (mentoria técnica e de produto), trabalhando em
                    sprints com checkpoints (demo interno, validação com utilizadores e iterações). Entregável final:
                    <strong> MVP demonstrável</strong> apresentado publicamente (startups, instituições públicas/privadas).
                    No final, são emitidos <strong>certificados de participação</strong>.
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-[#8d5732]">•</span>
                <div>
                  <div className="font-semibold">4) Pós-incubação / Follow-up</div>
                  <p className="text-sm text-gray-600">
                    As equipas escolhem: manter a composição para criar startup, ajustar membros (reconfigurar papéis) ou
                    seguir para oportunidades de <strong>estágio</strong> e integração em equipas/empresas parceiras.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Carga Horária</h5>
              <p className="text-xs text-gray-600">
                3 sessões/semana por track, 2h por sessão + 1h de laboratório assistido. Inclui tempo para prática,
                revisão de código, e acompanhamento de entregáveis (mini‑projetos, checkpoints e demos).
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Metodologia</h5>
              <p className="text-xs text-gray-600">
                Aprendizagem baseada em projetos (ABP): desafios reais, sprints curtos, demos frequentes e mentoria de
                docentes/alumni. Foco em produto (problema‑solução), qualidade técnica e comunicação (pitch e documentação).
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Módulo Zero (Acessibilidade)</h4>
            <p className="text-sm text-gray-600">
              4–6 semanas introdutórias para iniciantes, com foco em nivelamento: alfabetização digital, Git/GitHub,
              lógica de programação e bases de HTML/CSS/JS. Objetivo: garantir que todos entram na pré‑incubação com
              competências mínimas para acompanhar as trilhas e contribuir em equipa.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'implementacao',
      title: '5. Plano de Implementação (9 meses)',
      content: (
        <div className="space-y-3 text-gray-700">
          <div className="bg-gray-50 p-4 rounded border">
            <h4 className="font-semibold mb-2">Calendário anual sugerido</h4>
            <p className="text-sm text-gray-700 mb-2">
              O ciclo pode iniciar <strong>sempre em Abril</strong> e terminar em <strong>Dezembro</strong>, repetindo-se a cada ano.
              Os meses de <strong>Jan–Mar</strong> ficam para preparação (parcerias, mentores, currículos e divulgação).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li><strong>Abril:</strong> seleção/onboarding + arranque da pré-incubação</li>
              <li><strong>Abr–Jun:</strong> pré-incubação (treinos, mentorias, pitch e seleção de 4+4 ideias)</li>
              <li><strong>Jul–Dez:</strong> incubação (sprints, validação, construção do MVP)</li>
              <li><strong>Dezembro:</strong> Demo Day + encerramento + encaminhamentos (follow-up)</li>
            </ul>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Seleção (semanas 1–4)</strong>: divulgação, candidaturas e seleção das 50 vagas (15 internos diurno, 15 internos noturno, 10 externos diurno, 10 externos noturno)</li>
            <li><strong>Pré-incubação (meses 1–3)</strong>: formações e mentorias; apresentação de ideias; seleção de 4 melhores ideias (diurno) e 4 (noturno); formação de grupos (5–6)</li>
            <li><strong>Incubação (meses 4–9)</strong>: desenvolvimento dos MVPs com mentoria; validação e iteração; Demo Day/Apresentação pública no final do ciclo</li>
            <li><strong>Pós-incubação (contínuo)</strong>: encaminhamento para startups/estágios e apoio à constituição de empresas</li>
          </ul>
        </div>
      )
    },
    {
      id: 'infraestrutura',
      title: '6. Infraestrutura e Recursos',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm text-gray-600">
            A infraestrutura proposta é mínima e orientada à prática: acesso a internet confiável, laboratório e salas para aulas/mentorias.
            Sempre que possível, parcerias (doações/empréstimos) podem reduzir custos em hardware e conectividade.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Salas: 3 salas de 15m × 7m (≈ 105 m² cada; total ≈ 315 m²)</li>
            <li>Internet: adequada para atividades letivas e laboratórios</li>
            <li>Computadores: 30 unidades disponíveis</li>
            <li>Energia: fornecimento permanente</li>
          </ul>
        </div>
      )
    },
    {
      id: 'recursosHumanos',
      title: '7. Recursos Humanos e Mentoria',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm text-gray-600">
            A equipa combina coordenação, facilitação por trilha e mentoria. O objetivo é garantir acompanhamento próximo sem elevar custos,
            aproveitando docentes e alumni (voluntários ou com bolsa simbólica).
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Coordenação: 1 coordenador(a) do programa</li>
            <li>Facilitadores: docentes interessados por track</li>
            <li>Mentoria: pool de alumni voluntários e docentes</li>
            <li>Apoio administrativo: secretaria e comunicação</li>
          </ul>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Responsabilidades-chave</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Coordenação: calendário, parceiros, avaliação e gestão de risco</li>
                <li>Facilitadores: aulas práticas, revisão de entregáveis e demos</li>
                <li>Mentores: orientação técnica/produto, networking e validação</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Acompanhamento das equipas</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Check-in quinzenal por equipa (progresso e bloqueios)</li>
                <li>Revisões de sprint e demo interno mensal</li>
                <li>Registo simples de mentoria (ações e próximos passos)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'parcerias',
      title: '8. Parcerias e Networking',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm">
            As parcerias reduzem custos, aumentam a qualidade do programa e criam ponte direta para estágios/emprego.
            Procuramos parceiros para mentoria, desafios reais, créditos de cloud, eventos e oportunidades para equipas graduadas.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mapear e convidar startups de IT moçambicanas como mentoras/parceiras</li>
            <li>Estabelecer parcerias com empresas de TIC, organizações locais e ONGs</li>
            <li>Articular com entidades públicas (ex.: IPEME) quando oportuno</li>
            <li>Organizar eventos: talks, hackathons, demo days</li>
          </ul>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">O que os parceiros podem fornecer</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Mentores e palestrantes (técnico e produto)</li>
                <li>Problemas reais (desafios) e validação com utilizadores</li>
                <li>Créditos de cloud, ferramentas e apoio em espécie</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">O que os parceiros ganham</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Pipeline de talentos (estágios e contratações)</li>
                <li>Visibilidade institucional e impacto social</li>
                <li>Acesso antecipado a soluções/MVPs com potencial</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <h5 className="font-semibold text-sm mb-1">Estratégia de Comunicação</h5>
            <p className="text-sm text-gray-700 mb-2">
              Para alcançar estudantes (UTDEG diurno/noturno) e público externo, a incubadora deve manter uma comunicação contínua e prática.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Criar um <strong>website</strong> oficial da incubadora (programa, calendário Abril–Dezembro, candidaturas e resultados)</li>
              <li>Divulgar via <strong>redes sociais</strong> (calls for applications, histórias de equipas, resultados e eventos)</li>
              <li>Realizar <strong>sessões ao vivo</strong> (ex.: live coding, talks com mentores, demos de MVPs)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'orcamento',
      title: '9. Orçamento Base (baixo custo) e Sustentabilidade',
      content: (
        <div className="space-y-4 text-gray-700">
          <p className="text-sm">Sugerimos um orçamento enxuto, adequado a uma iniciativa académica e ao perfil socioeconómico dos estudantes, com cofinanciamento via parcerias.</p>
          <div className="bg-gray-50 p-3 rounded border text-sm">
            <p>
              <strong>Nota de escopo:</strong> o orçamento cobre custos essenciais do ciclo (coordenação, facilitação/mentoria, infraestrutura básica e eventos).
              Custos podem ser reduzidos via <strong>apoio em espécie</strong> (hardware, conectividade, créditos cloud, espaços e mentoria corporativa).
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Categoria</th>
                  <th className="border p-2 text-left">Descrição</th>
                  <th className="border p-2 text-center">Estimativa (MZN)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Coordenação (PT)</td>
                  <td className="border p-2">Coordenação do programa</td>
                  <td className="border p-2 text-center">~25k/mês × 9 = 225k</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Facilitação/Mentoria</td>
                  <td className="border p-2">Bolsa simbólica para docentes/alumni</td>
                  <td className="border p-2 text-center">~45k/mês × 9 = 405k</td>
                </tr>
                <tr>
                  <td className="border p-2">Internet/Infra</td>
                  <td className="border p-2">Ajustes e consumíveis</td>
                  <td className="border p-2 text-center">~5k/mês × 9 = 45k</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2">Eventos</td>
                  <td className="border p-2">Hackathons, demo days</td>
                  <td className="border p-2 text-center">~5k/trimestre × 3 = 15k</td>
                </tr>
                <tr>
                  <td className="border p-2">Operacional</td>
                  <td className="border p-2">Materiais, comunicação</td>
                  <td className="border p-2 text-center">~100k</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="border p-2 font-semibold" colSpan={2}>Total estimado (1 ciclo / 9 meses)</td>
                  <td className="border p-2 text-center font-bold">≈ 790k MZN</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="bg-[#f8a50a]/10 border-l-4 border-[#f8a50a] p-3 text-sm">
            <p><strong>Nota:</strong> Evitar destacar o orçamento. Priorizar angariação de fundos através de parcerias (patrocínios, doações em espécie, bolsas corporativas). A universidade poderá cobrir custos por 1 ciclo (9 meses) enquanto a incubadora caminha para a autossustentabilidade.</p>
          </div>
        </div>
      )
    },
    {
      id: 'modeloReceita',
      title: '10. Modelo de Receita e Acessibilidade',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm text-gray-600">
            O modelo de receita busca equilíbrio entre acessibilidade e sustentabilidade. Sempre que possível, bolsas e patrocínios cobrem custos
            para participantes com limitações financeiras, mantendo o programa inclusivo.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Receita principal:</strong> criação e implementação de cursos de curta duração na área de IT, alinhados às áreas de interesse da incubadora</li>
            <li><strong>Temas (exemplos):</strong> Web Full-Stack, Mobile (React Native), IA/Dados, Fundamentos de Cloud e Fundamentos de Cibersegurança</li>
            <li><strong>Acessibilidade:</strong> bolsas e patrocínios corporativos para reduzir custos quando aplicável</li>
          </ul>
        </div>
      )
    },
    {
      id: 'governanca',
      title: '11. Governança',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm text-gray-600">
            A governança assegura transparência na seleção, progressão e gestão de recursos, com políticas publicadas e tomada de decisão colegial.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reporte: Pró-Reitoria</li>
            <li>Comité Consultivo: 5 membros (2 docentes, 2 administrativos, 1 consultor externo)</li>
            <li>Políticas de seleção, avaliação e progressão definidas e publicadas</li>
          </ul>
          <div className="bg-gray-50 p-3 rounded border">
            <h5 className="font-semibold text-sm mb-1">Processos recomendados</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Comissão de seleção (critérios e atas simples)</li>
              <li>Rubricas de avaliação por fase (pré/incubação) e por entregável</li>
              <li>Regras básicas de ética, uso de dados e propriedade intelectual (quando aplicável)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'riscos',
      title: '12. Riscos e Mitigações',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm text-gray-600">
            Os riscos abaixo são os mais prováveis numa iniciativa académica. As mitigações propostas priorizam ações simples e de baixo custo,
            com foco em assiduidade, qualidade técnica e estabilidade operacional.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Adesão irregular</strong>: calendário flexível (diurno/noturno) e Módulo Zero</li>
            <li><strong>Recursos limitados</strong>: parcerias em espécie (cloud credits, mentoria, hardware)</li>
            <li><strong>Qualidade técnica</strong>: currículos práticos e mentoria próxima</li>
          </ul>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Medidas operacionais</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Checkpoints obrigatórios (demos) para manter ritmo</li>
                <li>Regras de reposição (lista de espera) e acompanhamento de desistências</li>
                <li>Padrões mínimos: GitHub, documentação curta e deploy simples</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Qualidade e validação</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Validação com utilizadores desde a pré-incubação</li>
                <li>Revisão técnica periódica (code review / arquitetura básica)</li>
                <li>Demo Day com feedback estruturado (rubrica)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'atividades',
      title: '13. Atividades Prioritárias (curto prazo)',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm text-gray-600">
            O foco inicial é preparar o primeiro ciclo anual (Abr–Dez) com parceiros, mentores e currículos prontos.
            As atividades abaixo podem ser executadas em 6–10 semanas.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identificar e convidar startups parceiras</li>
            <li>Estabelecer parcerias com empresas e organizações em Moçambique</li>
            <li>Definir coordenação e equipa de facilitadores</li>
            <li>Concluir currículos por track e calendário anual (Abr–Dez)</li>
            <li>Implementar canais de comunicação: website da incubadora, redes sociais e agenda de sessões ao vivo (live coding, talks, demos)</li>
          </ul>
          <div className="bg-gray-50 p-3 rounded border">
            <h5 className="font-semibold text-sm mb-1">Checklist mínimo antes de Abril</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Regulamento do programa (assiduidade, progressão, entregáveis e ética)</li>
              <li>Formulário de candidatura e critérios de seleção publicados</li>
              <li>Calendário do ciclo + datas de pitch e Demo Day</li>
              <li>Lista inicial de mentores/parceiros e agenda de palestras</li>
              <li>Plano de comunicação (website + redes sociais + lives) e materiais de divulgação</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white" ref={proposalRef}>
      <div className="mb-8 border-b-4 border-[#8d5732] pb-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={utdegLogoUrl}
            alt="UTDEG"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="text-4xl font-bold text-[#8d5732] mb-2">
              Proposta de Projecto: Incubadora de Tecnologia e Inovação Digital
            </h1>
            <h2 className="text-2xl text-gray-700">
              Universidade Técnica Diogo Eugénio Guilande (UTDEG)
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <p><strong>Localização:</strong> Machava, Matola</p>
            <p><strong>Duração:</strong> 9 meses</p>
            <p><strong>Calendário anual:</strong> Abril–Dezembro</p>
          </div>
          <div className="text-right">
            <p><strong>Versão:</strong> 1.1 - Dezembro 2025</p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={generateFormalPdf}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#8d5732] hover:bg-[#7a4b2b] text-white rounded transition-colors"
              >
                <Download className="w-4 h-4" />
                Descarregar PDF
              </button>
              <button
                onClick={generateDocx}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#f8a50a] hover:bg-[#de9208] text-gray-900 rounded transition-colors"
              >
                <FileText className="w-4 h-4" />
                Descarregar DOCX
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg shadow-sm">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              {expandedSections[section.id] ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {expandedSections[section.id] && (
              <div className="p-6 border-t">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-[#8d5732]/10 border-2 border-[#8d5732]/30 rounded-lg">
        <h3 className="text-lg font-semibold text-[#8d5732] mb-3">Próximos Passos</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li>1. Apresentação e aprovação pela Pró-Reitoria da UTDEG</li>
          <li>2. Alocação de orçamento e recursos iniciais</li>
          <li>3. Recrutamento da equipa de gestão</li>
          <li>4. Preparação do ciclo (Jan–Mar): currículos, parceiros, mentores e divulgação</li>
          <li>5. Execução do ciclo anual (Abr–Dez): seleção → pré-incubação → incubação → Demo Day</li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded text-center text-sm text-gray-600">
        <p>Este é um documento resumido. Clique em cada secção para ver detalhes completos.</p>
        <p className="mt-2">Para a proposta completa com orçamentos detalhados, cronogramas e anexos, contacte a equipa de projeto.</p>
      </div>
    </div>
  );
};

export default IncubadoraProposal;


