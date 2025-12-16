import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronRight, Download, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const IncubadoraProposal = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const proposalRef = useRef(null);

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

  const generateFormalPdf = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const left = 15;
    const right = 195;
    let y = 20;

    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Universidade Técnica Diogo Eugénio Guilande (UTDEG)', left, 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Proposta de Criação: Incubadora de Tecnologia e Inovação Digital', left, 17);
      const date = 'Dezembro 2025';
      doc.text(date, right, 12, { align: 'right' });
      doc.line(left, 18, right, 18);
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
    addTitle('Proposta de Projecto');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Incubadora de Tecnologia e Inovação Digital (IT-UTDEG)', left, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
      addParagraph('Localização: Machava, Matola • Horizonte: 9 meses (3M pré + 6M inc.) • Público-alvo: estudantes UTDEG (laboral e pós-laboral) e externos.');
    y += 6;
    addFooter();
    newPage();

    // Executive summary
    addH2('1. Sumário Executivo');
    addParagraph('A UTDEG propõe a criação de uma incubadora académica de base tecnológica para formar competências práticas alinhadas ao mercado moçambicano e apoiar a criação de startups de impacto. O modelo privilegia custos baixos, inclusão (Módulo Zero) e parcerias locais.');
    addBullets([
      'Formação prática em Web Full-Stack, Mobile, Dados e Fundamentos de Cloud.',
      'Mentoria por docentes e alumni; integração com desafios locais e eventos.',
      'Meta (1 ciclo / 9 meses): 70 participantes formados, 12 MVPs (6 diurno + 6 noturno), 3–5 startups.',
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
      'Seleção com quotas: 20 laboral, 20 pós-laboral, 30 externos (15 diurno / 15 noturno).',
      'Turmas laboral e pós-laboral; metodologia baseada em projetos.',
      'Módulo Zero (4–6 semanas) para iniciantes: alfabetização digital e fundamentos.',
    ]);

    // Program phases
    addH2('4. Fases do Programa (9 meses)');
    addBullets([
      'Fase 1 – Seleção: candidatura e seleção de participantes (laboral, pós-laboral e externos) de acordo com quotas definidas.',
      'Fase 2 – Pré-incubação (3 meses): formações, mentorias e introdução a tecnologias (Web Full-Stack, Mobile, IA/Dados); apresentação de ideias; seleção das 6 melhores ideias no diurno e 6 no noturno; formação de grupos (5–6 membros).',
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
          ['Participantes formados', '70', 'Registos de conclusão'],
          ['Taxa de conclusão', '≥80%', 'Concluem vs. iniciam'],
          ['Satisfação', '≥4.0/5.0', 'Questionários pós-programa'],
        ],
      },
      {
        title: '7. KPIs – Criação de Startups',
        head: [['Indicador', 'Meta (1 ciclo / 9M)', 'Método']],
        body: [
          ['Projetos incubados', '12 (6 diurno + 6 noturno)', 'Projetos aceites'],
          ['Startups constituídas', '3–5', 'Registos comerciais'],
          ['MVPs funcionais', '12', 'Produtos demonstráveis'],
        ],
      },
      {
        title: '8. KPIs – Impacto Económico',
        head: [['Indicador', 'Meta (1 ciclo / 9M)', 'Método']],
        body: [
          ['Empregos criados', '25+', 'Contratos nas startups'],
          ['Participantes empregados', '50+', 'Follow-up pós-programa'],
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
        headStyles: { fillColor: [219, 234, 254], textColor: 20 },
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
      headStyles: { fillColor: [243, 244, 246], textColor: 20 },
      footStyles: { fillColor: [226, 232, 240], textColor: 20, fontStyle: 'bold' },
      margin: { left, right: 15 },
    });
    y = (doc.lastAutoTable?.finalY || y) + 8;
    addParagraph('Observação: valores são estimativas. Parcerias (patrocínio de turmas/tracks, doações de hardware, créditos de cloud, mentoria corporativa) podem reduzir substancialmente os custos diretos.');

    // Revenue model and accessibility
    addH2('12. Modelo de Receita e Acessibilidade');
    addBullets([
      'Taxa simbólica por estudante (500–1.000 MZN/mês) com bolsas para casos sociais.',
      'Patrocínio corporativo por track/turma e workshops curtos para público externo.',
      'Equity opcional (2–5%) em startups graduadas, caso adequado.',
    ]);

    // Risks
    addH2('13. Riscos e Mitigações');
    addBullets([
      'Adesão irregular: oferta laboral e pós-laboral; Módulo Zero para nivelamento.',
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
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Visão</h4>
            <p className="text-gray-700">Tornar a UTDEG o centro de referência nacional em formação de empreendedores tecnológicos, capacitando estudantes com competências práticas para o mercado de TIC e criando soluções inovadoras para os desafios moçambicanos.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Objetivo Geral</h4>
            <p className="text-gray-700">Estabelecer a Incubadora de Tecnologia e Inovação Digital da UTDEG (IT-UTDEG) como programa integrado de formação prática, incubação de startups tecnológicas e ponte entre a academia e o mercado de trabalho em TIC.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Objetivos Específicos</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Capacitar 70 participantes (20 laboral, 20 pós-laboral, 30 externos) em competências técnicas e empreendedoriais por ciclo (9 meses)</li>
              <li>• Incubar 12 projetos tecnológicos por ciclo (6 diurno + 6 noturno), com potencial de se tornarem startups viáveis</li>
              <li>• Apoiar a criação/estruturação de 3–5 startups funcionais por ciclo (ou encaminhamento para estágios/emprego)</li>
              <li>• Estabelecer parcerias estratégicas com 10+ empresas de TIC e organizações relevantes</li>
              <li>• Posicionar a UTDEG como líder em inovação tecnológica no ensino superior moçambicano</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Impacto Esperado (1 ciclo / 9 meses)</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">70</div>
                <div className="text-gray-600">Estudantes Formados</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">12</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border-l-4 border-blue-500 pl-3">
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Framework de Avaliação</h4>
            <p className="text-sm text-gray-700">Os KPIs estão organizados em 4 dimensões principais que refletem os objetivos da incubadora.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">3.1 Dimensão 1: Formação e Capacitação</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border text-gray-800">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border p-2 text-left">Indicador</th>
                    <th className="border p-2 text-center">Meta (1 ciclo / 9M)</th>
                    <th className="border p-2 text-left">Método</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Participantes formados</td>
                    <td className="border p-2 text-center font-bold">70</td>
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
                    <td className="border p-2 text-center font-bold">12</td>
                    <td className="border p-2">Projetos aceites</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Startups constituídas</td>
                    <td className="border p-2 text-center font-bold">3-5</td>
                    <td className="border p-2">Registos comerciais</td>
                  </tr>
                  <tr>
                    <td className="border p-2">MVPs funcionais</td>
                    <td className="border p-2 text-center font-bold">12</td>
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
                    <td className="border p-2 text-center font-bold">50+</td>
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
          <div>
            <h4 className="font-semibold mb-2">Estrutura de Promoções</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ciclo do programa: 9 meses (3M pré-incubação + 6M incubação)</li>
              <li>Participantes por ciclo: 70 (20 laboral, 20 pós-laboral, 30 externos — 15 dia / 15 noite)</li>
              <li>Tracks: Desenvolvimento Web Full-Stack, Mobile, Análise de Dados/IA, Fundamentos de Cloud</li>
              <li>Turmas laboral e pós-laboral (adequadas a estudantes que trabalham)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Seleção e Quotas</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>20 estudantes UTDEG (laboral)</li>
              <li>20 estudantes UTDEG (pós-laboral)</li>
              <li>30 participantes externos (15 alocados ao incubador diurno e 15 ao noturno)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Fases do Programa (9 meses)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Seleção</strong>: candidatura e seleção com base em motivação e disponibilidade</li>
              <li><strong>Pré-incubação (3 meses)</strong>: treinamentos, mentorias e introdução a tecnologias (Web, Mobile, IA); apresentação de ideias; seleção de 6 melhores ideias (diurno) e 6 (noturno); formação de grupos (5–6 membros)</li>
              <li><strong>Incubação (6 meses)</strong>: desenvolvimento do MVP com mentoria; apresentação pública a startups/instituições; certificados de participação</li>
              <li><strong>Pós-incubação / Follow-up</strong>: apoio à criação de startups, reconfiguração de equipas ou encaminhamento para estágios</li>
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Carga Horária</h5>
              <p className="text-xs text-gray-600">3 sessões/semana por track, 2h por sessão + 1h de laboratório assistido.</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <h5 className="font-semibold text-sm mb-1">Metodologia</h5>
              <p className="text-xs text-gray-600">Aprendizagem baseada em projetos, desafios locais, mentoria de docentes e alumni.</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Módulo Zero (Acessibilidade)</h4>
            <p className="text-sm">4-6 semanas introdutórias para iniciantes (alfabetização digital, Git, HTML/CSS/JS básico), garantindo inclusão de estudantes com nível técnico variado.</p>
          </div>
        </div>
      )
    },
    {
      id: 'implementacao',
      title: '5. Plano de Implementação (9 meses)',
      content: (
        <div className="space-y-3 text-gray-700">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Seleção (semanas 1–4)</strong>: divulgação, candidaturas e seleção das 70 vagas (20 laboral, 20 pós-laboral, 30 externos)</li>
            <li><strong>Pré-incubação (meses 1–3)</strong>: formações e mentorias; apresentação de ideias; seleção de 6 melhores ideias (diurno) e 6 (noturno); formação de grupos (5–6)</li>
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
          <ul className="list-disc pl-5 space-y-1">
            <li>Coordenação: 1 coordenador(a) do programa</li>
            <li>Facilitadores: docentes interessados por track</li>
            <li>Mentoria: pool de alumni voluntários e docentes</li>
            <li>Apoio administrativo: secretaria e comunicação</li>
          </ul>
        </div>
      )
    },
    {
      id: 'parcerias',
      title: '8. Parcerias e Networking',
      content: (
        <div className="space-y-3 text-gray-700">
          <p className="text-sm">Atividades propostas:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mapear e convidar startups de IT moçambicanas como mentoras/parceiras</li>
            <li>Estabelecer parcerias com empresas de TIC, organizações locais e ONGs</li>
            <li>Articular com entidades públicas (ex.: IPEME) quando oportuno</li>
            <li>Organizar eventos: talks, hackathons, demo days</li>
          </ul>
        </div>
      )
    },
    {
      id: 'orcamento',
      title: '9. Orçamento Base (baixo custo) e Sustentabilidade',
      content: (
        <div className="space-y-4 text-gray-700">
          <p className="text-sm">Sugerimos um orçamento enxuto, adequado a uma iniciativa académica e ao perfil socioeconómico dos estudantes, com cofinanciamento via parcerias.</p>
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
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 text-sm">
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
          <ul className="list-disc pl-5 space-y-1">
            <li>Taxa simbólica por estudante (ex.: 500–1.000 MZN/mês), com bolsas para casos sociais</li>
            <li>Patrocínio corporativo por track/turma</li>
            <li>Serviços de projeto (projetos curtos para empresas locais)</li>
            <li>Workshops pagos ao público externo (curta duração)</li>
            <li>Equity opcional (2–5%) em startups graduadas, mediante avaliação</li>
          </ul>
        </div>
      )
    },
    {
      id: 'governanca',
      title: '11. Governança',
      content: (
        <div className="space-y-3 text-gray-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>Reporte: Pró-Reitoria</li>
            <li>Comité Consultivo: 5 membros (2 docentes, 2 administrativos, 1 consultor externo)</li>
            <li>Políticas de seleção, avaliação e progressão definidas e publicadas</li>
          </ul>
        </div>
      )
    },
    {
      id: 'riscos',
      title: '12. Riscos e Mitigações',
      content: (
        <div className="space-y-3 text-gray-700">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Adesão irregular</strong>: calendário flexível (laboral/pós-laboral) e Módulo Zero</li>
            <li><strong>Recursos limitados</strong>: parcerias em espécie (cloud credits, mentoria, hardware)</li>
            <li><strong>Qualidade técnica</strong>: currículos práticos e mentoria próxima</li>
          </ul>
        </div>
      )
    },
    {
      id: 'atividades',
      title: '13. Atividades Prioritárias (curto prazo)',
      content: (
        <div className="space-y-3 text-gray-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>Identificar e convidar startups parceiras</li>
            <li>Estabelecer parcerias com empresas e organizações em Moçambique</li>
            <li>Definir coordenação e equipa de facilitadores</li>
            <li>Concluir currículos por track e calendário (Mai–Nov 2026)</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white" ref={proposalRef}>
      <div className="mb-8 border-b-4 border-blue-600 pb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Proposta de Projecto: Incubadora de Tecnologia e Inovação Digital
        </h1>
        <h2 className="text-2xl text-gray-700 mb-4">
          Universidade Técnica Diogo Eugénio Guilande (UTDEG)
        </h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <p><strong>Localização:</strong> Machava, Matola</p>
            <p><strong>Duração:</strong> 9 meses</p>
          </div>
          <div className="text-right">
            <p><strong>Versão:</strong> 1.1 - Dezembro 2025</p>
            <button
              onClick={generateFormalPdf}
              className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              Descarregar PDF Formal
            </button>
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

      <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Próximos Passos</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li>1. Apresentação e aprovação pela Pró-Reitoria da UTDEG</li>
          <li>2. Alocação de orçamento e recursos iniciais</li>
          <li>3. Recrutamento da equipa de gestão</li>
          <li>4. Início das atividades de preparação (Janeiro 2026)</li>
          <li>5. Lançamento oficial da incubadora (Maio 2026)</li>
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


