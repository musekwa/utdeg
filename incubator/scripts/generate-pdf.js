/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

const OUTPUT_DIR = path.resolve(process.cwd(), 'public')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'Proposta_IT_UTDEG.pdf')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function createDoc() {
  return new PDFDocument({
    size: 'A4',
    margins: { top: 56, bottom: 56, left: 56, right: 56 },
    info: {
      Title: 'Proposta IT-UTDEG',
      Author: 'UTDEG',
      Subject: 'Proposta de criação da Incubadora de Tecnologia',
      Keywords: 'UTDEG, Incubadora, Moçambique, TIC, Educação',
    },
  })
}

function addHeaderFooter(doc) {
  const drawHeader = () => {
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#111827')
    doc.text('Universidade Técnica Diogo Eugénio Guilande (UTDEG)', 56, 36, { width: 483 })
    doc.font('Helvetica').fontSize(9).fillColor('#374151')
    doc.text('Proposta: Incubadora de Tecnologia e Inovação Digital', 56, 48, { width: 483 })
  }
  const drawFooter = () => {
    const bottom = doc.page.height - 40
    doc.font('Helvetica').fontSize(9).fillColor('#6B7280')
    const pageStr = `Página ${doc.page.number}`
    doc.text('UTDEG • Proposta Incubadora', 56, bottom)
    doc.text(pageStr, 56, bottom, { width: doc.page.width - 112, align: 'right' })
    doc.fillColor('#E5E7EB').rect(56, bottom - 8, doc.page.width - 112, 1).fill()
    doc.fillColor('#111827')
  }
  drawHeader()
  drawFooter()
}

function h1(doc, text) {
  doc.moveDown(1)
  doc.font('Helvetica-Bold').fontSize(18).fillColor('#111827').text(text)
  doc.moveDown(0.5)
}

function h2(doc, text) {
  doc.moveDown(0.8)
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#111827').text(text)
  doc.moveDown(0.3)
}

function p(doc, text) {
  doc.font('Helvetica').fontSize(11).fillColor('#111827').text(text, { align: 'justify' })
}

function bullets(doc, items) {
  doc.moveDown(0.2)
  items.forEach((item) => {
    doc.font('Helvetica').fontSize(11)
    doc.text(`• ${item}`, { indent: 12, align: 'left' })
  })
}

function table(doc, rows, options = {}) {
  const {
    widths = [200, 160, 100],
    header = ['Categoria', 'Descrição', 'Estimativa (MZN)'],
    zebra = true,
  } = options
  const startX = doc.x
  let y = doc.y + 6
  const height = 20

  const drawRow = (cols, isHeader = false, shade = false) => {
    let x = startX
    if (shade) {
      doc.save().fillColor('#F3F4F6').rect(x, y, widths.reduce((a, b) => a + b, 0), height).fill().restore()
    }
    cols.forEach((text, idx) => {
      doc.save()
      doc.strokeColor('#E5E7EB').lineWidth(0.5).rect(x, y, widths[idx], height).stroke()
      doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).fillColor('#111827')
      const align = idx === widths.length - 1 ? 'center' : 'left'
      doc.text(String(text), x + 6, y + 6, { width: widths[idx] - 12, align })
      doc.restore()
      x += widths[idx]
    })
    y += height
  }

  drawRow(header, true, false)
  rows.forEach((r, i) => drawRow(r, false, zebra && i % 2 === 1))
  doc.moveDown(1)
  doc.y = y
}

function generate() {
  ensureDir(OUTPUT_DIR)
  const doc = createDoc()
  const stream = fs.createWriteStream(OUTPUT_FILE)
  doc.pipe(stream)

  addHeaderFooter(doc)

  // Cover
  h1(doc, 'Incubadora de Tecnologia e Inovação Digital (IT-UTDEG)')
  p(doc, 'Localização: Machava, Matola • Horizonte: 18 meses (3 promoções) • Público-alvo: estudantes UTDEG (laboral e pós-laboral).')
  doc.moveDown(0.5)
  p(doc, 'Esta proposta estabelece uma incubadora académica de base tecnológica com foco em formação prática, mentoria e criação de startups alinhadas aos desafios do contexto moçambicano.')

  // Sumário Executivo
  h2(doc, '1. Sumário Executivo')
  p(doc, 'A incubadora visa formar competências práticas em desenvolvimento Web Full-Stack, Mobile, Análise de Dados e Fundamentos de Cloud, articulando docentes e alumni como mentores e conectando estudantes a desafios locais e oportunidades de empregabilidade.')
  bullets(doc, [
    'Formação prática orientada a projetos reais e desafios locais.',
    'Mentoria por docentes e alumni; eventos de ecossistema (talks, hackathons, demo days).',
    'Meta 18 meses: 90+ estudantes formados, 12–15 MVPs e 5–7 startups.',
  ])

  // Contexto
  h2(doc, '2. Contexto Moçambicano e Justificação')
  p(doc, 'O ecossistema digital moçambicano cresce impulsionado por serviços móveis e necessidades de digitalização. Persistem gaps entre a formação teórica e as competências práticas exigidas pelo mercado.')
  bullets(doc, [
    'Adoção de mobile money e serviços digitais (M-Pesa, e-Mola, mKesh) abre oportunidades em fintech.',
    'Prioridades: agritech, edutech, saúde digital, logística e serviços públicos digitais.',
    'Desafio central: transformar aprendizagem em experiência prática relevante.',
  ])

  // Modelo Operacional
  h2(doc, '3. Modelo Operacional')
  bullets(doc, [
    'Promoções de 6 meses (Mai–Nov); horizonte de 3 promoções em 18 meses.',
    'Turmas laboral e pós-laboral; metodologia baseada em projetos.',
    'Módulo Zero (4–6 semanas) para nivelamento de iniciantes.',
  ])

  // Infraestrutura
  h2(doc, '4. Infraestrutura e Recursos')
  bullets(doc, [
    'Salas: 3 salas de 15m × 7m (≈ 315 m² no total).',
    'Internet adequada; 30 computadores; energia permanente.',
    'Equipa: coordenação, facilitadores (docentes) e mentores (alumni).',
  ])

  // KPIs (texto resumido)
  h2(doc, '5. Indicadores de Sucesso (KPIs) – Resumo')
  bullets(doc, [
    'Formação: 90+ formados; taxa de conclusão ≥80%; satisfação ≥4.0/5.0.',
    'Startups: 15–20 projetos incubados; 5–7 constituídas; 12–15 MVPs.',
    'Impacto: 25+ empregos; 50+ participantes empregados; investimento 500k+ MZN.',
    'Ecossistema: 10+ parcerias; 6+ eventos; 15+ mentores ativos.',
  ])

  // Orçamento base (baixo custo)
  h2(doc, '6. Orçamento Base (Cenário Enxuto, 18 meses)')
  p(doc, 'Orçamento orientado ao menor custo possível, com foco em bolsas simbólicas e apoio em espécie via parcerias. A universidade pode cobrir 18 meses até a autossustentabilidade.')
  table(doc, [
    ['Coordenação (PT)', 'Coordenação do programa', '≈ 270k'],
    ['Facilitação/Mentoria', 'Bolsa simbólica docentes/alumni', '≈ 540k'],
    ['Internet/Infra', 'Ajustes e consumíveis', '≈ 54k'],
    ['Eventos', 'Hackathons e demo days', '≈ 30k'],
    ['Operacional', 'Materiais e comunicação', '≈ 60k'],
  ])
  p(doc, 'Total estimado (18 meses): ≈ 954k MZN. Observação: valores são estimativos e podem reduzir com patrocínios de tracks, doações de hardware, créditos de cloud e mentoria corporativa.')

  // Modelo de Receita e Acessibilidade
  h2(doc, '7. Modelo de Receita e Acessibilidade')
  bullets(doc, [
    'Taxa simbólica por estudante (500–1.000 MZN/mês) com bolsas sociais.',
    'Patrocínio corporativo por track/turma; workshops curtos ao público externo.',
    'Equity opcional (2–5%) em startups graduadas, dependendo do caso.',
  ])

  // Governança e Riscos
  h2(doc, '8. Governança e Riscos')
  bullets(doc, [
    'Reporte à Pró-Reitoria; Comité consultivo (2 docentes, 2 administrativos, 1 consultor externo).',
    'Riscos: adesão irregular, recursos limitados, qualidade técnica.',
    'Mitigações: calendário flexível, parcerias em espécie, currículos práticos e avaliação contínua.',
  ])

  doc.end()

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(OUTPUT_FILE))
    stream.on('error', reject)
  })
}

async function main() {
  try {
    const out = await generate()
    console.log(`PDF gerado em: ${out}`)
  } catch (err) {
    console.error('Falha ao gerar PDF:', err)
    process.exit(1)
  }
}

main()


