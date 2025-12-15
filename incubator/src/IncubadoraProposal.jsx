import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Download, Check } from 'lucide-react';

const IncubadoraProposal = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

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
              <li>• Capacitar 90 estudantes em competências técnicas e empreendedoriais nos primeiros 18 meses</li>
              <li>• Incubar 15-20 projetos tecnológicos com potencial de se tornarem startups viáveis</li>
              <li>• Criar pelo menos 5 startups funcionais que gerem emprego e receita</li>
              <li>• Estabelecer parcerias estratégicas com 10+ empresas de TIC e organizações relevantes</li>
              <li>• Posicionar a UTDEG como líder em inovação tecnológica no ensino superior moçambicano</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Impacto Esperado (18 meses)</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">90+</div>
                <div className="text-gray-600">Estudantes Formados</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">15-20</div>
                <div className="text-gray-600">Projetos Incubados</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-2xl font-bold text-green-600">5+</div>
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
            <p className="text-gray-700">Orçamento total para 18 meses: <span className="font-bold">2.850.000,00 MZN</span> (~45.000 USD)</p>
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
              <li>• Criar um ecossistema de inovação na região de Matola/Maputo</li>
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
                    <th className="border p-2 text-center">Meta 18M</th>
                    <th className="border p-2 text-left">Método</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Estudantes formados</td>
                    <td className="border p-2 text-center font-bold">90+</td>
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
                    <th className="border p-2 text-center">Meta 18M</th>
                    <th className="border p-2 text-left">Método</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Projetos incubados</td>
                    <td className="border p-2 text-center font-bold">15-20</td>
                    <td className="border p-2">Projetos aceites</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">Startups constituídas</td>
                    <td className="border p-2 text-center font-bold">5-7</td>
                    <td className="border p-2">Registos comerciais</td>
                  </tr>
                  <tr>
                    <td className="border p-2">MVPs funcionais</td>
                    <td className="border p-2 text-center font-bold">12-15</td>
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
                    <th className="border p-2 text-center">Meta 18M</th>
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
                    <th className="border p-2 text-center">Meta 18M</th>
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
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
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
            <p><strong>Duração:</strong> 18 meses (Mai 2026 - Out 2027)</p>
          </div>
          <div className="text-right">
            <p><strong>Orçamento:</strong> 2.850.000 MZN</p>
            <p><strong>Versão:</strong> 1.0 - Dezembro 2025</p>
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


