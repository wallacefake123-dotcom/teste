import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

interface HelpCenterProps {
  onBackToHome: () => void;
  onContactSupport: () => void;
}

type Tab = 'driver' | 'host';
type ViewState = 'main' | 'category-details';

const HelpCenter: React.FC<HelpCenterProps> = ({ onBackToHome, onContactSupport }) => {
  const [activeTab, setActiveTab] = useState<Tab>('driver');
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCategoryClick = (title: string) => {
    // Logic for navigating to detail views based on category title
    // Allow navigation for specific categories based on title match
    const validTitles = [
        'Cadastrar Meu Carro', 
        'Conta e Perfil',
        'Viagens e Reservas', 
        'Ganhos e Financeiro',
        'Segurança e Confiança', 
        'Pagamentos',
        'Gestão de Reservas',
        'Suporte e Proteção'
    ];
    
    if (validTitles.includes(title)) {
      setSelectedCategoryTitle(title);
      setCurrentView('category-details');
      setOpenFaqIndex(null); // Reset open accordion
      setSearchQuery(''); // Clear search query when entering category
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedCategoryTitle('');
    setOpenFaqIndex(null);
  };

  // Helper function to format answer text (Highlight lead-ins)
  const renderFormattedAnswer = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} className="block content-[''] h-3" />;
      
      const colonIndex = line.indexOf(':');
      // If there is a colon in the first 50 chars, assume it's a lead-in/subtitle
      if (colonIndex > -1 && colonIndex < 50) {
        const title = line.substring(0, colonIndex + 1);
        const content = line.substring(colonIndex + 1);
        return (
          <p key={i} className="mb-1 text-[#3A4150]">
            <span className="font-bold text-[#1C2230]">{title}</span>
            {content}
          </p>
        );
      }
      return <p key={i} className="mb-1 text-[#3A4150]">{line}</p>;
    });
  };

  // --- CATEGORIES DEFINITION ---
  
  // Categories for Drivers
  const driverCategories = [
    { icon: 'fa-user-circle', title: 'Conta e Perfil', desc: 'Gerenciar configurações e verificação.' },
    { icon: 'fa-car', title: 'Viagens e Reservas', desc: 'Como reservar, alterar ou cancelar.' },
    { icon: 'fa-shield-alt', title: 'Segurança e Confiança', desc: 'Seguros, regras e diretrizes.' },
    { icon: 'fa-credit-card', title: 'Pagamentos', desc: 'Faturas, reembolsos e ganhos.' },
  ];

  // Categories for Hosts (Proprietários) - Updated Order & Titles
  const hostCategories = [
    { icon: 'fa-car-side', title: 'Cadastrar Meu Carro', desc: 'Como listar e aprovar seu veículo.' },
    { icon: 'fa-calendar-check', title: 'Gestão de Reservas', desc: 'Check-in, Check-out e solicitações.' },
    { icon: 'fa-chart-line', title: 'Ganhos e Financeiro', desc: 'Taxas, recebimentos e saques.' },
    { icon: 'fa-shield-alt', title: 'Suporte e Proteção', desc: 'Avarias, multas e seguros.' },
  ];

  const currentCategories = activeTab === 'driver' ? driverCategories : hostCategories;


  // --- FAQ DATA ---

  // 1. Host: "Cadastrar Meu Carro"
  const registerCarFaqs = [
    {
      q: "Como cadastrar meu carro na Cube Car?",
      a: "Disponibilizar seu carro para locação é um processo simples, intuitivo e digital. Para iniciar sua jornada como Anfitrião, siga estes passos:\n\nAcesso e Início: Acesse a área \"Compartilhar Meu Carro\" no aplicativo Cube Car ou em nosso portal web e inicie o processo de cadastro do veículo.\n\nInformações Básicas: Preencha as especificações técnicas detalhadas do veículo, incluindo marca, modelo, ano de fabricação, placa e quilometragem atual.\n\nDocumentação: Faça o upload do Certificado de Registro e Licenciamento do Veículo (CRLV) atualizado e da apólice do seguro compreensivo vigente.\n\nFotografia: Tire e carregue fotos de alta qualidade do seu carro (exterior, interior, painel e motor) que representem fielmente o estado do veículo. Fotos claras e atraentes aumentam a chance de reserva!\n\nConfiguração: Defina o preço base da diária e especifique o Ponto de Encontro onde você entregará e receberá o veículo."
    },
    {
      q: "Requisitos e condições para compartilhar meu carro",
      a: "Para garantir a qualidade, segurança e conformidade legal de todos os veículos listados na plataforma, seu carro deve atender às seguintes condições rigorosas:\n\nIdade e Estado: O veículo deve ter, idealmente, no máximo 10 anos de fabricação e estar em excelente estado de conservação e funcionamento, sem avarias estruturais ou estéticas significativas.\n\nDocumentação e Débitos: É obrigatório que o veículo esteja com o licenciamento (CRLV) e o IPVA em dia. O carro não pode possuir multas pendentes, restrições judiciais ou financeiras no momento da listagem.\n\nManutenção: O Anfitrião é responsável por manter o plano de manutenção preventiva do veículo em dia (pneus, freios, fluidos), assegurando a máxima segurança para o Locatário.\n\nSeguro: Conforme nossa política, a posse de um seguro compreensivo válido e ativo é mandatório."
    },
    {
      q: "Por quê meu carro precisa ter um seguro compreensivo vigente?",
      a: "O seguro compreensivo (total) é mais do que um requisito; é a base da sua segurança financeira na plataforma P2P:\n\nProteção Primária: Embora a Cube Car ofereça proteção e mediação de sinistros, o seu seguro compreensivo particular é a apólice primária em caso de acidentes, roubo, furto ou danos significativos.\n\nComplementaridade: Ele serve como um complemento robusto à proteção da plataforma, garantindo que o seu patrimônio esteja coberto independentemente da complexidade do incidente.\n\nConfiança: A exigência de seguro ativo demonstra responsabilidade e aumenta a confiança dos Locatários em alugar seu veículo, além de garantir a sua tranquilidade como proprietário."
    },
    {
      q: "Quanto tempo até meu carro ser aprovado e listado?",
      a: "Após você finalizar o cadastro e enviar todas as informações, o processo de aprovação é conduzido com a máxima eficiência:\n\nPrazo Médio: O prazo padrão para a análise da documentação, verificação do seguro e aprovação final do veículo é de até 48 horas.\n\nProcesso: Nossa equipe de conformidade examina minuciosamente a validade dos documentos e a adequação das fotos.\n\nNotificação: Você será notificado imediatamente no aplicativo e por e-mail assim que o carro for aprovado. Uma vez aprovado, ele será automaticamente listado e estará pronto para receber as primeiras solicitações de reserva!"
    }
  ];

  // 2. Host: "Gestão de Reservas" (Previously Segurança e Confiança slot, but new content)
  const reservationManagementHostFaqs = [
    {
      q: "Recebi uma solicitação para meu carro, o que faço?",
      a: "A agilidade na resposta é crucial para garantir a reserva e a satisfação do Locatário:\n\nRevisão Imediata: Verifique imediatamente os detalhes da solicitação (datas, horários e perfil do Locatário) no aplicativo.\n\nDecisão Rápida: Você deve aceitar ou recusar a reserva em até 12 horas. Recomenda-se aceitar o quanto antes para não perder a oportunidade.\n\nComunicação: Após aceitar, utilize o chat da Cube Car para entrar em contato com o Locatário. Confirme o Ponto de Encontro e os detalhes logísticos da entrega, estabelecendo um canal de comunicação amigável."
    },
    {
      q: "Entregando o carro (Check-in)",
      a: "O Check-in é o momento formal de transferência de responsabilidade. É sua principal ferramenta de proteção:\n\nVistoria de Retirada (Obrigatória): Este é o passo mais importante. Utilize o aplicativo para realizar a Vistoria de Retirada (Check-in) de forma completa e meticulosa.\n\nRegistro Fotográfico: Registre a quilometragem, o nível de combustível e o estado geral do veículo com fotos e vídeos detalhados de todos os ângulos, incluindo quaisquer pequenos riscos preexistentes. Este registro é a sua prova oficial do estado do carro antes da locação.\n\nConferência do Locatário: Confirme a identidade do Locatário e verifique se a CNH corresponde à pessoa que está retirando o veículo.\n\nFinalização: Só entregue as chaves após finalizar e salvar a Vistoria de Retirada no sistema."
    },
    {
      q: "Recebendo o carro (Check-out)",
      a: "O Check-out é o momento de finalizar a reserva e verificar a conformidade do veículo:\n\nVistoria de Devolução (Obrigatória): Assim que o Locatário devolver o veículo, você deve realizar imediatamente a Vistoria de Devolução (Check-out) pelo aplicativo.\n\nComparação: Compare o estado do carro com as fotos do Check-in. Verifique se há novos danos, sujeira excessiva, ou divergência na quilometragem e no nível de combustível.\n\nAção: Se houver qualquer não conformidade, você deve registrar a evidência fotográfica no Check-out para dar início a um processo de disputa ou cobrança de taxas adicionais.\n\nFinalização: O Check-out finalizado é a confirmação para a Cube Car de que a viagem terminou com sucesso e desencadeia o seu pagamento."
    },
    {
      q: "Como funciona o cancelamento de uma reserva?",
      a: "A gestão dos cancelamentos é definida pela política que você escolheu:\n\nPolítica Aplicável: O tratamento do cancelamento e o eventual repasse de valores seguem a Política de Cancelamento (Flexível, Moderada ou Rígida) que você definiu para o seu anúncio.\n\nCancelamento pelo Locatário: Em caso de cancelamento tardio, você pode receber uma compensação financeira (uma parte da diária) para cobrir o bloqueio da sua agenda.\n\nCancelamento pelo Anfitrião: Cancelar uma reserva já aceita deve ser evitado ao máximo. Se você precisar cancelar, estará sujeito a multas e penalidades na sua reputação e ranking, pois isso prejudica a experiência do Locatário."
    },
    {
      q: "Como devo proceder se houver falta de combustível na devolução?",
      a: "A falta de combustível deve ser tratada de forma objetiva no Check-out:\n\nRegistro de Diferença: Durante o Check-out, se o nível de combustível estiver abaixo do registrado no Check-in, você deve registrar essa diferença no campo específico do aplicativo.\n\nCobrança Automática: A Cube Car processará a cobrança do valor equivalente ao combustível faltante (com base no preço médio da região), acrescido de uma taxa de serviço para compensar o seu tempo de reabastecimento.\n\nCrédito: O valor total (combustível + taxa) será cobrado do Locatário e creditado em sua Carteira Cube Car."
    },
    {
      q: "Com que frequência devo atualizar o status de disponibilidade do meu carro?",
      a: "A precisão do seu calendário é um fator chave para o sucesso na plataforma:\n\nEvite Cancelamentos: Recomendamos que o Anfitrião mantenha o calendário do aplicativo sempre atualizado (bloqueando datas de uso pessoal ou manutenção).\n\nReputação: Cancelamentos de última hora, causados por um calendário desatualizado, podem gerar taxas de penalidade e, mais importante, afetarão negativamente sua reputação e ranking na plataforma, diminuindo suas futuras oportunidades de reserva."
    }
  ];

  // 3. Host: "Ganhos e Financeiro"
  const financeHostFaqs = [
    {
      q: "Valor da diária e taxa Cube Car?",
      a: "Seus ganhos são resultado direto do valor que você define para seu veículo, descontado de nossa taxa de serviço:\n\nDefinição do Preço: Você, como Anfitrião, define o valor base da diária. Sugerimos que utilize nossa ferramenta de precificação e pesquise veículos similares na sua região para maximizar sua ocupação. Você pode ajustar este preço a qualquer momento.\n\nTaxa de Serviço: A Cube Car aplica uma taxa de serviço (comissão) de 10% sobre o valor total da locação. Esta taxa é fundamental, pois cobre os custos operacionais da plataforma, o suporte 24 horas, a manutenção tecnológica e os processos de segurança.\n\nValor Líquido: O valor líquido creditado em sua Carteira Cube Car corresponde ao valor bruto da reserva menos a taxa de serviço da plataforma."
    },
    {
      q: "Como recebo pelas minhas reservas?",
      a: "O processo de pagamento é rápido e seguro, priorizando a sua tranquilidade:\n\nCiclo de Crédito: Os valores líquidos da locação são processados e creditados em sua Carteira Cube Car em até 24 horas após a conclusão do Check-out da viagem.\n\nCondição: A liberação do crédito está condicionada à confirmação do término da reserva e à verificação de que não há disputas ou incidentes pendentes (como danos reportados) que exijam retenção temporária do valor para mediação.\n\nTransparência: Você pode acompanhar o histórico completo de ganhos e deduções (taxa de serviço) diretamente na seção \"Carteira\" do seu aplicativo."
    },
    {
      q: "Como posso sacar os valores da minha Carteira?",
      a: "Você tem controle total sobre quando e como transferir seus rendimentos:\n\nSolicitação de Saque: Você pode solicitar a transferência dos valores acumulados na sua Carteira Cube Car para sua conta bancária a qualquer momento, acessando a seção \"Carteira\" e selecionando \"Solicitar Saque\".\n\nSegurança: É crucial que a conta bancária de destino seja de sua titularidade e esteja previamente cadastrada e verificada na plataforma.\n\nPrazo de Compensação: O prazo padrão para o processamento da transferência e a compensação bancária é de até 2 dias úteis. Você será notificado sobre o status da transferência."
    },
    {
      q: "Como devo lidar com o Imposto de Renda sobre meus ganhos?",
      a: "É importante que você mantenha a conformidade com as obrigações fiscais do país:\n\nRenda Tributável: Os ganhos obtidos através da locação do seu veículo são, em geral, considerados renda tributável.\n\nResponsabilidade do Anfitrião: A Cube Car não é responsável pela consultoria fiscal e não retém impostos. É sua responsabilidade exclusiva declarar esses valores (rendimentos da locação) anualmente, conforme a legislação fiscal vigente e o regime tributário aplicável ao seu caso.\n\nDocumentação: Mantenha todos os registros de ganhos fornecidos pela Cube Car para facilitar sua declaração de Imposto de Renda."
    }
  ];

  // 4. Host: "Suporte e Proteção" (Previously Pagamentos slot, but new content)
  const supportProtectionHostFaqs = [
    {
      q: "Meu carro sofreu uma avaria durante a locação, o que fazer?",
      a: "Se você identificar um novo dano no veículo no momento do Check-out, siga o protocolo rigoroso:\n\nRegistro Imediato: Utilize a Vistoria de Devolução (Check-out) no aplicativo para documentar o dano com fotos e vídeos de alta resolução. É fundamental que as provas sejam claras e demonstrem que o dano é novo, comparando com as imagens do Check-in.\n\nAbertura de Disputa: Imediatamente após o Check-out, abra um processo de disputa no aplicativo, anexando todas as evidências.\n\nMediação Cube Car: A Cube Car atuará como mediadora imparcial, revisando as evidências do Check-in versus Check-out e comunicando a decisão. O Locatário será cobrado pelo custo do reparo, respeitando o valor da franquia (dedutível) aplicável."
    },
    {
      q: "Recebi uma infração de trânsito, o que faço?",
      a: "As multas geradas durante a locação são de responsabilidade direta do Locatário:\n\nEnvio de Notificação: Assim que receber a notificação oficial da infração (multa), você deve enviá-la imediatamente ao Suporte da Cube Car (via aplicativo ou e-mail de suporte).\n\nIndicação de Condutor: A plataforma providenciará a indicação formal do Locatário (motorista responsável) ao órgão de trânsito, garantindo que os pontos e a responsabilidade legal sejam transferidos corretamente.\n\nCobrança: O valor da multa será cobrado integralmente do Locatário na forma de pagamento registrada, acrescido da taxa administrativa de serviço da Cube Car pelo processamento."
    },
    {
      q: "O que acontece se meu veículo for utilizado em algum delito durante o período de locação?",
      a: "Esta é uma situação grave, que exige ação imediata e coordenação:\n\nAção Policial: Você deve reportar o caso imediatamente às autoridades policiais competentes (polícia civil) e registrar um Boletim de Ocorrência (B.O.).\n\nComunicação Urgente: Em seguida, entre em contato urgente com o Suporte 24h da Cube Car.\n\nCooperação: A plataforma cooperará integralmente com as autoridades, fornecendo todos os dados do Locatário, da reserva e, se aplicável, os dados de Telemetria e rastreamento do veículo para auxiliar na investigação."
    },
    {
      q: "O que acontece se o Locatário não devolver o carro?",
      a: "Em caso de atraso excessivo ou falha na comunicação, siga o protocolo de segurança:\n\nComunicação e Tolerância: Tente contato imediato com o Locatário. Lembre-se que atrasos menores (ex: 30 minutos) são comuns.\n\nReporte de Não Devolução: Se o Locatário não retornar o carro e não houver comunicação ou justificativa válida após um período estipulado (geralmente 12 a 24 horas), você deve reportar a situação como \"Não Devolução\" ao Suporte 24h da Cube Car.\n\nMedidas Legais: A Cube Car acionará o protocolo de segurança e, se necessário, orientará o Anfitrião a registrar um B.O. (furto ou apropriação indébita). A plataforma utilizará o sistema de Telemetria (rastreamento) para auxiliar as autoridades na localização do veículo."
    },
    {
      q: "O que é o sistema de Telemetria e como ele me protege?",
      a: "A Telemetria é uma poderosa ferramenta de segurança instalada no veículo:\n\nMonitoramento: É um sistema de rastreamento GPS que permite o monitoramento da localização do veículo e, em alguns casos, do seu padrão de uso durante a viagem.\n\nSegurança e Proteção: A Telemetria é sua principal ferramenta de proteção contra roubo ou furto e é essencial no processo de recuperação do veículo em caso de não devolução.\n\nUso: Em caso de infrações graves de trânsito ou uso indevido reportado, a Cube Car pode utilizar estes dados (respeitando as leis de privacidade) para aplicar penalidades ao Locatário."
    },
    {
      q: "Existe seguro pela plataforma Cube Car?",
      a: "A proteção é uma parceria:\n\nSeguro Próprio (Primário): Conforme exigido no cadastro, você deve manter seu seguro compreensivo particular ativo, que é a sua proteção primária.\n\nProteção da Plataforma (Complementar): A Cube Car oferece uma proteção complementar para todas as viagens, que facilita a mediação e garante a cobrança de custos do Locatário (franquia, danos) em caso de incidentes, assegurando que o Locatário arque com suas responsabilidades financeiras."
    },
    {
      q: "O que devo fazer em caso de pane ou emergência do Locatário?",
      a: "Se o Locatário entrar em contato com você reportando um problema, o procedimento deve ser rápido e direcionado:\n\nInstrução Imediata: Instrua o Locatário a interromper a viagem em segurança e entrar em contato imediatamente com o Suporte 24h da Cube Car (via telefone de emergência ou chat).\n\nCoordenação do Suporte: Nossa equipe de suporte é especializada em gestão de crises e coordenará o acionamento do guincho, assistência na estrada e comunicação com o Anfitrião, aliviando sua carga de trabalho na emergência."
    }
  ];

  // --- DRIVER DATA ---

  // 1. Driver: "Conta e Perfil"
  const accountProfileDriverFaqs = [
    { 
      q: "Quais são os requisitos mínimos para me tornar um Locatário?", 
      a: "Para garantir a segurança de toda a nossa comunidade e do patrimônio dos Anfitriões, a Cube Car exige critérios básicos de elegibilidade:\n\nIdade Mínima: Você deve ter 21 anos de idade ou mais no momento da reserva.\n\nHabilitação: É obrigatório possuir a Carteira Nacional de Habilitação (CNH) válida (física ou digital) e ter no mínimo dois anos de experiência de direção (contados a partir da data de emissão da CNH).\n\nAnálise de Segurança: Seu cadastro passará por uma análise que pode incluir a verificação de histórico de crédito e histórico de direção, assegurando que você atenda aos nossos padrões de segurança e confiabilidade." 
    },
    { 
      q: "Como é feita a verificação do meu perfil?", 
      a: "O processo de verificação é uma etapa crucial que estabelece a confiança mútua em nossa plataforma.\n\nAnálise Multifatorial: Realizamos uma análise de segurança multifatorial que combina tecnologia e avaliação humana.\n\nDados Verificados: O sistema verifica automaticamente a validade e a categoria da sua CNH, além de cruzar dados pessoais fornecidos no cadastro.\n\nObjetivo: Este rigoroso processo visa proteger os proprietários de veículos e garantir que apenas motoristas elegíveis e responsáveis tenham acesso à plataforma. Você será notificado sobre a aprovação do seu perfil." 
    },
    { 
      q: "Posso atualizar minha forma de pagamento a qualquer momento?", 
      a: "Sim, você tem total flexibilidade para gerenciar seus métodos de pagamento:\n\nGestão Flexível: Você pode adicionar, remover ou definir uma nova forma de pagamento padrão a qualquer momento, acessando a seção \"Conta e Perfil\" > \"Pagamentos\" no aplicativo.\n\nImportância: É essencial manter os dados de pagamento sempre atualizados e válidos. Em caso de falha na cobrança da reserva inicial ou de taxas pós-viagem (como multas, pedágios ou taxas de combustível), a reserva pode ser suspensa ou cancelada, e o débito será direcionado ao seu método de pagamento principal." 
    },
    { 
      q: "Quais documentos são necessários para retirar o veículo?", 
      a: "O procedimento de retirada é simples, mas exige a conferência da identidade para sua segurança e a do Anfitrião:\n\nDocumentos Exigidos: Você deve apresentar ao Anfitrião a sua CNH ativa (física ou digital) e um documento de identidade válido (RG ou a própria CNH).\n\nRegra Fundamental: Apenas o Locatário que efetuou a reserva e teve o perfil aprovado (cujo nome consta no agendamento) está autorizado a retirar e dirigir o carro. Não é permitido que um terceiro retire o veículo em seu nome, mesmo que possua seus documentos. Essa regra garante a validade do seguro da plataforma." 
    }
  ];

  // 2. Driver: "Viagens e Reservas"
  const tripsReservationsDriverFaqs = [
    {
      q: "Como faço para reservar um carro?",
      a: "O processo de reserva é intuitivo e dividido em três etapas para garantir que você encontre o veículo perfeito:\n\nSeleção: Escolha o veículo desejado, defina as datas e horários exatos de retirada e devolução, e especifique o local de encontro preferido dentro das opções do Anfitrião.\n\nConfirmação: Revise o preço total da diária, taxas, limites de quilometragem e o valor da franquia (dedutível) do seguro. Confirme sua forma de pagamento.\n\nGarantia: A sua reserva será garantida e confirmada após a aprovação do seu perfil e o processamento bem-sucedido do pagamento. Você receberá a confirmação no aplicativo e por e-mail, juntamente com os detalhes de contato do Anfitrião para acertar os pormenores da entrega."
    },
    {
      q: "O que acontece se eu precisar cancelar a reserva?",
      a: "O cancelamento está sempre sujeito à política definida pelo Anfitrião, que visa equilibrar flexibilidade e previsibilidade para ambos:\n\nPolítica de Cancelamento: O reembolso é estritamente baseado na Política de Cancelamento (geralmente Flexível, Moderada ou Rígida) selecionada pelo proprietário no momento da listagem do carro.\n\nRegra Flexível (Exemplo Padrão): Se o Anfitrião tiver a política Flexível, o cancelamento efetuado até 24 horas antes do horário de início da viagem garante um reembolso integral do valor pago. Cancelamentos feitos após esse prazo podem resultar em retenção de parte do valor.\n\nAtenção: É fundamental verificar a política específica do carro na página de reserva para saber exatamente o valor do seu reembolso em caso de necessidade."
    },
    {
      q: "Onde devo retirar e devolver o carro?",
      a: "A precisão do local de encontro é vital para a eficiência da sua viagem:\n\nPonto de Encontro Definido: O local de retirada e devolução é o Ponto de Encontro fixado pelo Anfitrião e claramente registrado no aplicativo no resumo da sua reserva.\n\nObrigatoriedade: É obrigatório que a retirada (Check-in) e a devolução (Check-out) ocorram neste local e nos horários combinados, conforme as políticas de tolerância de atraso.\n\nAlterações: Qualquer alteração no local ou horário deve ser negociada, aprovada e registrada pelo Anfitrião através do chat da Cube Car para que haja um registro oficial, garantindo a validade do seu aluguel."
    },
    {
      q: "O que acontece se o Anfitrião não aparecer no horário combinado para a entrega?",
      a: "A Cube Car valoriza seu tempo e sua confiança. Se houver um problema na entrega, siga estes passos:\n\nComunicação Imediata: Tente contato imediato com o Anfitrião (via chat do app e telefone) e aguarde o tempo de tolerância padrão (geralmente 30 minutos) no local de encontro.\n\nFalha na Entrega: Se o Anfitrião falhar na entrega após o tempo de tolerância sem aviso prévio ou justificativa, você pode cancelar a reserva pelo aplicativo.\n\nCompensação: Você receberá um reembolso integral de todos os valores pagos e, para compensar o transtorno e restabelecer a sua confiança na plataforma, a Cube Car fornecerá um cupom de cortesia para uma próxima reserva."
    }
  ];

  // 3. Shared: "Segurança e Confiança" (DRIVER ONLY NOW)
  const securityTrustDriverFaqs = [
    {
      q: "O seguro está incluso na reserva?",
      a: "Sim, a sua tranquilidade é uma prioridade. Para todas as viagens realizadas na Cube Car, você está automaticamente coberto:\n\nProteção Padrão: Um plano de proteção básica da Cube Car está sempre incluso no valor da sua reserva.\n\nCobertura: Este plano cobre responsabilidade civil (danos a terceiros) e danos ao veículo alugado (acima de um valor fixo).\n\nSua Responsabilidade (Franquia): Em caso de incidente coberto, o Locatário será responsável pelo pagamento do valor da franquia (dedutível), cujo montante é claramente especificado no resumo da reserva antes da confirmação. A plataforma arca com os custos que excedem este valor."
    },
    {
      q: "O que fazer em caso de acidente ou pane?",
      a: "Em qualquer situação de emergência, siga esta ordem de prioridade:\n\nPriorize a Segurança e Imediatamente: Garanta a segurança de todos os envolvidos, ligue para os serviços de emergência (como polícia ou resgate) se houver feridos ou risco iminente.\n\nContato com Suporte: Entre em contato imediatamente com o Suporte 24h da Cube Car (via telefone de emergência ou chat no aplicativo).\n\nOrientação e Assistência: Nossa equipe de suporte irá coordenar todo o processo, incluindo:\n\n• Acionamento da assistência na estrada (guincho ou socorro mecânico em caso de pane).\n\n• Orientação sobre a documentação necessária (registro de ocorrência ou Boletim de Ocorrência - B.O.).\n\n• Comunicação com o Anfitrião.\n\nÉ essencial não fazer acordos ou reparos sem a prévia autorização da Cube Car."
    },
    {
      q: "Preciso lavar o carro antes de devolver?",
      a: "A devolução deve respeitar o estado inicial de limpeza para garantir uma experiência justa para o próximo Locatário:\n\nLimpeza Razoável: O carro deve ser devolvido em condições razoáveis de limpeza, similar à forma como foi recebido. Não é exigida lavagem profissional, apenas a remoção de lixo e sujeira superficial.\n\nTaxa de Higienização: Se o veículo for devolvido com sujeira extrema (ex: barro excessivo, lixo, manchas internas, fortes odores) que exija limpeza especializada, será aplicada uma taxa de higienização de R$ 150,00 para compensar o Anfitrião pelo tempo e custo extra."
    },
    {
      q: "O carro pode ser dirigido por outra pessoa?",
      a: "Não. Esta é uma regra fundamental e inegociável da plataforma:\n\nRestrição Legal: Apenas o Locatário cujo nome consta na reserva, que teve o perfil verificado e aprovado pela Cube Car, está legalmente autorizado a dirigir o veículo.\n\nRisco de Invalidação: Permitir que terceiros dirijam o carro é uma violação grave dos Termos de Uso e, mais importante, pode invalidar completamente o seguro e a proteção da plataforma em caso de acidente ou incidente. Qualquer dano ou custo decorrente desta violação será de total responsabilidade do Locatário."
    }
  ];

  // 4. Shared: "Pagamentos" (DRIVER ONLY NOW)
  const paymentsDriverFaqs = [
    {
      q: "Existe um limite de quilometragem nas viagens?",
      a: "Sim. O controle de quilometragem é uma prática padrão que protege o desgaste do veículo e garante preços justos:\n\nLimite Diário: Cada reserva possui um limite de quilometragem diário estabelecido pelo Anfitrião (ex: 200 km/dia). O limite total da viagem é a soma dos limites diários (ex: 3 dias * 200 km = 600 km).\n\nCobrança por Excesso: Se a quilometragem total percorrida exceder o limite contratado, será aplicada uma cobrança extra por quilômetro rodado. A tarifa exata por quilômetro excedente é sempre exibida de forma clara no resumo da sua reserva antes da confirmação.\n\nProcesso de Cobrança: A cobrança por excesso de quilometragem é processada automaticamente após o Check-out e a leitura final do odômetro."
    },
    {
      q: "Como são cobradas taxas adicionais (pedágio, combustível, multas)?",
      a: "As taxas adicionais geradas durante a viagem são processadas de forma transparente e debitadas do Locatário:\n\nCobrança Pós-Viagem: Todas as despesas adicionais, como falta de combustível, pedágios não pagos no momento, ou multas de trânsito, são cobradas após o término da viagem.\n\nProcesso: O Anfitrião deve enviar a comprovação da despesa via aplicativo. A Cube Car analisa a comprovação e debita o valor da sua forma de pagamento registrada, acrescentando uma taxa administrativa de serviço da plataforma para a gestão e processamento da cobrança.\n\nTransparência: Você receberá uma fatura detalhada por e-mail, especificando o valor da despesa original e o valor da taxa administrativa aplicada."
    },
    {
      q: "Qual é o procedimento para multas de trânsito?",
      a: "O Locatário é integralmente responsável por todas as infrações de trânsito cometidas durante o período de locação:\n\nResponsabilidade: As multas geradas durante a locação são de responsabilidade legal do Locatário.\n\nProcessamento da Multa: O Anfitrião recebe a notificação da multa e a envia à Cube Car. A plataforma processa dois procedimentos simultâneos:\n\nCobrança Financeira: O valor da multa, mais a taxa administrativa de serviço da Cube Car, é cobrado de sua forma de pagamento registrada.\n\nIndicação de Condutor: A Cube Car providencia a indicação formal do Locatário (seu nome e CNH) ao órgão de trânsito, garantindo que os pontos na carteira sejam atribuídos corretamente ao responsável pela infração."
    },
    {
      q: "Em quanto tempo recebo um reembolso de cancelamento?",
      a: "O processo de reembolso pela Cube Car é iniciado rapidamente, mas a compensação depende dos prazos bancários:\n\nInício do Processo: O reembolso elegível (conforme a Política de Cancelamento) é processado pela Cube Car em até 2 dias úteis após a confirmação do cancelamento.\n\nPrazo Bancário: O prazo final para o valor aparecer como crédito no seu extrato bancário ou fatura do cartão de crédito é determinado pela sua instituição financeira e processadoras de pagamento. Normalmente, este processo leva entre 3 a 7 dias úteis.\n\nAcompanhamento: Em caso de dúvidas sobre o prazo após 7 dias úteis, você pode contatar o Suporte da Cube Car para receber o comprovante de estorno."
    }
  ];

  // General FAQs for the Main View
  const mainFaqs = {
    driver: [
      { q: "Como faço para reservar um carro?", a: "Para reservar, basta buscar por localização e datas na página inicial, escolher o carro ideal e clicar em 'Reservar'. O proprietário terá até 24h para aceitar, ou a reserva será confirmada instantaneamente se o carro tiver essa opção." },
      { q: "O que acontece se eu precisar cancelar?", a: "Você pode cancelar gratuitamente até 24 horas antes do início da viagem. Cancelamentos de última hora podem estar sujeitos a taxas conforme a política do anfitrião." },
      { q: "O seguro está incluso?", a: "Sim! Todas as viagens na Cube Car incluem seguro básico contra colisão e terceiros. Você pode optar por proteções extras no momento do checkout." },
      { q: "Preciso lavar o carro antes de devolver?", a: "Espera-se que você devolva o carro nas mesmas condições de limpeza que o recebeu. Sujeira excessiva pode gerar taxas de limpeza." },
      { q: "O que fazer em caso de acidente?", a: "Mantenha a calma. Garanta que todos estão bem, chame as autoridades se necessário e contate nosso suporte 24h imediatamente pelo app." }
    ],
    host: [
      { q: "Quanto custa listar meu carro?", a: "Listar seu carro é 100% gratuito. Nós cobramos apenas uma taxa de serviço sobre as viagens realizadas para cobrir os custos da plataforma e seguro." },
      { q: "Como sou pago?", a: "Os pagamentos são processados automaticamente 3 dias após a conclusão da viagem e depositados diretamente na sua conta bancária cadastrada." },
      { q: "Meu carro está seguro?", a: "Sim. A Cube Car oferece uma apólice de seguro completa durante o período de locação, protegendo seu patrimônio contra danos, roubo e terceiros." },
      { q: "Posso recusar uma reserva?", a: "Sim, você tem total controle. Pode aceitar ou recusar solicitações com base no perfil do motorista e suas avaliações." },
      { q: "O que acontece com multas?", a: "As multas ocorridas durante o período da locação são transferidas para o condutor responsável. Nossa equipe auxilia em todo o processo." }
    ]
  };

  // Determine which FAQs to show based on view
  let displayedFaqs = [];
  
  if (currentView === 'category-details') {
    // HOST CATEGORIES
    if (selectedCategoryTitle === 'Cadastrar Meu Carro') {
      displayedFaqs = registerCarFaqs;
    } else if (selectedCategoryTitle === 'Gestão de Reservas') {
      displayedFaqs = reservationManagementHostFaqs;
    } else if (selectedCategoryTitle === 'Ganhos e Financeiro') {
      displayedFaqs = financeHostFaqs;
    } else if (selectedCategoryTitle === 'Suporte e Proteção') {
      displayedFaqs = supportProtectionHostFaqs;
      
    // DRIVER CATEGORIES
    } else if (selectedCategoryTitle === 'Conta e Perfil') {
      displayedFaqs = accountProfileDriverFaqs;
    } else if (selectedCategoryTitle === 'Viagens e Reservas') {
      displayedFaqs = tripsReservationsDriverFaqs;
    } else if (selectedCategoryTitle === 'Segurança e Confiança') {
      displayedFaqs = securityTrustDriverFaqs;
    } else if (selectedCategoryTitle === 'Pagamentos') {
      displayedFaqs = paymentsDriverFaqs;
    }
  } else {
    displayedFaqs = mainFaqs[activeTab];
  }

  // Filter based on search (applies to current view's list)
  const filteredFaqs = displayedFaqs.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white animate-fade-in font-sans relative selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      
      {/* Ambient Background (Same as CarDetails) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex-grow">
      {/* Render content based on View State */}
      {currentView === 'main' ? (
        <>
            {/* Hero Section - Visible ONLY in Main View */}
            <div className="relative z-10 pt-10 pb-8">
               <div className="max-w-4xl mx-auto px-4 text-center">
                  <h1 className="text-3xl md:text-5xl font-display font-medium text-[#1C2230] mb-6">
                    Como podemos ajudar?
                  </h1>
                  
                  {/* Search Bar - Adapted for Light Background */}
                  <div className="relative max-w-2xl mx-auto">
                     <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                     <input 
                       type="text" 
                       placeholder="Busque por 'cancelamento', 'seguro', 'pagamento'..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       // CHANGED: rounded-lg to rounded-2xl to match modern pill/card inputs
                       className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-6 text-[#181824] placeholder-gray-400 focus:text-[#181824] focus:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#3667AA]/10 focus:border-[#3667AA]/50 transition-all shadow-lg text-lg"
                     />
                  </div>
               </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
                {/* TAB DESIGN (Line Style) */}
                {/* REVERTED: bg-premium-silver -> bg-white, border-white/50 -> border-gray-100 */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-12 flex justify-center overflow-hidden">
                    <button 
                      onClick={() => setActiveTab('driver')}
                      className={`px-8 py-5 text-sm font-bold tracking-wider uppercase relative transition-colors ${
                        activeTab === 'driver' 
                          ? 'text-[#3667AA]' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Motoristas
                      {activeTab === 'driver' && (
                        <motion.div 
                          layoutId="tab-underline" 
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3667AA]"
                        />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveTab('host')}
                      className={`px-8 py-5 text-sm font-bold tracking-wider uppercase relative transition-colors ${
                        activeTab === 'host' 
                          ? 'text-[#3667AA]' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Proprietários
                      {activeTab === 'host' && (
                        <motion.div 
                          layoutId="tab-underline" 
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3667AA]"
                        />
                      )}
                    </button>
                </div>

                {/* Quick Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                   {currentCategories.map((cat, idx) => (
                     <div 
                       key={idx} 
                       onClick={() => handleCategoryClick(cat.title)}
                       // REVERTED: bg-premium-silver -> bg-white, border-white/50 -> border-gray-100
                       className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-[#3667AA]/30 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
                     >
                        {/* Badge Indicator - Flow Layout to prevent overlap */}
                        <div className="flex justify-end w-full mb-2">
                           {/* REMOVED: bg and padding to leave it "dry" like the icon */}
                           <span className={`text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                             activeTab === 'driver' ? 'text-[#3667AA]' : 'text-gray-400'
                           }`}>
                             {activeTab === 'driver' ? 'Motorista' : 'Proprietário'}
                           </span>
                        </div>

                        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-grow">
                            {/* Icon "seco" (dry/plain) - Removed bg, rounded-full, scale effect */}
                            <div className="text-[#3667AA] mb-3 shrink-0">
                               <i className={`fas ${cat.icon} text-2xl`}></i>
                            </div>
                            <h3 className="font-bold mb-1 text-sm text-[#1C2230] w-full">{cat.title}</h3>
                            <p className="text-xs leading-relaxed text-[#3A4150] w-full">{cat.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>

                {/* Main FAQ Section Header */}
                <h2 className="text-2xl font-display font-medium mb-6 text-center md:text-left" style={{ color: '#1C2230' }}>Perguntas Frequentes</h2>

                {/* FAQ Accordion List (Shared) */}
                <div className="mb-16">
                   <div className="space-y-4">
                     {filteredFaqs.length > 0 ? (
                       filteredFaqs.map((faq, idx) => (
                         // REVERTED: bg-premium-silver -> bg-white, border-white/50 -> border-gray-200
                         <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-colors hover:border-gray-300">
                            <button 
                              onClick={() => toggleFaq(idx)}
                              // REVERTED HOVER: hover:bg-white/40 -> hover:bg-gray-50/50
                              className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-gray-50/50 transition-colors"
                            >
                               <span 
                                 className="font-bold text-base"
                                 style={{ color: openFaqIndex === idx ? '#3667AA' : '#1C2230' }}
                               >
                                 {faq.q}
                               </span>
                               <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`}></i>
                            </button>
                            <AnimatePresence>
                              {openFaqIndex === idx && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                   <div 
                                     className="px-5 pb-5 pt-0 text-sm leading-relaxed border-t border-gray-100 mt-2 pt-4"
                                     style={{ color: '#3A4150' }}
                                   >
                                     {renderFormattedAnswer(faq.a)}
                                   </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                       ))
                     ) : (
                       <div className="text-center py-12 text-gray-500">
                          <i className="fas fa-search text-4xl mb-4 text-gray-300"></i>
                          <p>Nenhum resultado encontrado para "{searchQuery}"</p>
                       </div>
                     )}
                   </div>
                </div>

                {/* Contact CTA */}
                {/* KEPT PREMIUM SILVER (As per context, this was the source style) */}
                <div className="bg-premium-silver rounded-2xl p-8 md:p-12 text-center border border-white/50 shadow-lg">
                   <h2 className="text-2xl font-display font-medium mb-3" style={{ color: '#1C2230' }}>Ainda precisa de ajuda?</h2>
                   <p className="mb-8 max-w-lg mx-auto" style={{ color: '#3A4150' }}>Nossa equipe de suporte está disponível 24 horas por dia, 7 dias por semana para ajudar você em qualquer situação.</p>
                   
                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={onContactSupport}
                        // CHANGED: rounded-lg to rounded-xl
                        className="bg-[#3667AA] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
                      >
                        <i className="far fa-envelope"></i> Fale Conosco
                      </button>
                      {/* CHANGED: rounded-lg to rounded-xl */}
                      <button className="bg-white border border-gray-200 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2" style={{ color: '#1C2230' }}>
                        <i className="fab fa-whatsapp text-green-500 text-lg"></i> WhatsApp
                      </button>
                   </div>
                </div>
            </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-6 pb-20">
            {/* Detail View Header */}
            <div className="mb-8">
              <button 
                onClick={handleBackToMain}
                className="flex items-center gap-2 text-[#3667AA] font-bold text-sm mb-6 hover:underline"
              >
                <i className="fas fa-arrow-left"></i> Voltar para Central de Ajuda
              </button>
              
              <div className="flex items-center gap-4 mb-2">
                 {/* CHANGED: rounded-lg to rounded-xl */}
                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#3667AA] shrink-0">
                   {/* Dynamically show icon based on category, defaulting to user */}
                   <i className={`fas ${currentCategories.find(c => c.title === selectedCategoryTitle)?.icon || 'fa-question-circle'} text-2xl`}></i>
                 </div>
                 <div>
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Categoria</span>
                   <h2 className="text-2xl md:text-3xl font-display font-medium text-[#1C2230] leading-tight">{selectedCategoryTitle}</h2>
                 </div>
              </div>
            </div>

             {/* FAQ Accordion List (Shared for both views) */}
             <div className="mb-16">
               <div className="space-y-4">
                 {filteredFaqs.length > 0 ? (
                   filteredFaqs.map((faq, idx) => (
                     // REVERTED: bg-premium-silver -> bg-white, border-white/50 -> border-gray-200
                     <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-colors hover:border-gray-300">
                        <button 
                          onClick={() => toggleFaq(idx)}
                          // REVERTED HOVER: hover:bg-white/40 -> hover:bg-gray-50/50
                          className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-gray-50/50 transition-colors"
                        >
                           <span 
                             className="font-bold text-base"
                             style={{ color: openFaqIndex === idx ? '#3667AA' : '#1C2230' }}
                           >
                             {faq.q}
                           </span>
                           <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`}></i>
                        </button>
                        <AnimatePresence>
                          {openFaqIndex === idx && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                               <div 
                                 className="px-5 pb-5 pt-0 text-sm leading-relaxed border-t border-gray-100 mt-2 pt-4"
                                 style={{ color: '#3A4150' }}
                               >
                                 {renderFormattedAnswer(faq.a)}
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-12 text-gray-500">
                      <i className="fas fa-search text-4xl mb-4 text-gray-300"></i>
                      <p>Nenhum resultado encontrado para "{searchQuery}"</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Contact CTA */}
            {/* KEPT PREMIUM SILVER (As per context, this was the source style) */}
            <div className="bg-premium-silver rounded-2xl p-8 md:p-12 text-center border border-white/50 shadow-lg">
               <h2 className="text-2xl font-display font-medium mb-3" style={{ color: '#1C2230' }}>Ainda precisa de ajuda?</h2>
               <p className="mb-8 max-w-lg mx-auto" style={{ color: '#3A4150' }}>Nossa equipe de suporte está disponível 24 horas por dia, 7 dias por semana para ajudar você em qualquer situação.</p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={onContactSupport}
                    // CHANGED: rounded-lg to rounded-xl
                    className="bg-[#3667AA] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="far fa-envelope"></i> Fale Conosco
                  </button>
                  {/* CHANGED: rounded-lg to rounded-xl */}
                  <button className="bg-white border border-gray-200 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2" style={{ color: '#1C2230' }}>
                    <i className="fab fa-whatsapp text-green-500 text-lg"></i> WhatsApp
                  </button>
               </div>
            </div>
        </div>
      )}
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;