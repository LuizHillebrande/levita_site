import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos e Condições | Levita Móveis Hospitalares',
  description:
    'Termos e condições da Levita Móveis Hospitalares: privacidade, pedidos, entregas, devoluções, trocas e garantia.',
}

const sections: { title: string; paragraphs?: string[]; list?: string[] }[] = [
  {
    title: 'Segurança e Privacidade',
    paragraphs: [
      'A empresa respeita a privacidade de seus clientes e se compromete a tratar os dados pessoais fornecidos durante a navegação, cadastro e realização de pedidos de acordo com a legislação aplicável.',
      'Os dados pessoais, informações de cadastro, endereço, pagamento e demais informações fornecidas pelo cliente serão utilizados para fins relacionados ao atendimento, processamento, faturamento, entrega dos pedidos, comunicação com o cliente e cumprimento das obrigações legais.',
      'As informações fornecidas não serão comercializadas ou utilizadas para finalidades incompatíveis com aquelas informadas ao cliente, ressalvadas as hipóteses previstas em lei.',
      'As transações realizadas no ambiente de compra poderão ser processadas por empresas especializadas em meios de pagamento. Os dados relacionados ao pagamento são tratados pelos respectivos sistemas de acordo com seus protocolos de segurança.',
      'O cliente é responsável pela veracidade e atualização das informações fornecidas no momento do cadastro e da realização do pedido.',
    ],
  },
  {
    title: 'Cadastro e Informações do Cliente',
    paragraphs: [
      'Para realizar uma compra, o cliente deverá fornecer informações necessárias para identificação, faturamento e entrega do pedido.',
      'O cliente declara que todas as informações fornecidas são verdadeiras, completas e atualizadas.',
      'A empresa poderá entrar em contato com o cliente para confirmar informações relacionadas ao pedido, pagamento, endereço de entrega, especificações do produto ou demais informações necessárias para a correta execução da compra.',
      'Eventuais erros de cadastro que impossibilitem ou dificultem a entrega poderão ocasionar necessidade de atualização dos dados e novo agendamento de entrega.',
    ],
  },
  {
    title: 'Produtos',
    paragraphs: [
      'Os produtos comercializados são apresentados com suas respectivas características, especificações, dimensões, materiais, funcionalidades e demais informações disponíveis no momento da compra.',
      'As imagens apresentadas no site possuem finalidade ilustrativa. Poderão ocorrer pequenas diferenças de tonalidade, acabamento, textura, disposição de componentes ou aparência em relação às imagens apresentadas, especialmente em razão de iluminação, configuração do monitor ou características próprias dos materiais utilizados.',
      'As especificações técnicas dos produtos poderão ser atualizadas pela empresa sempre que necessário, sem prejuízo das condições já estabelecidas para pedidos devidamente confirmados.',
    ],
  },
  {
    title: 'Pedidos',
    paragraphs: [
      'A realização de um pedido pelo site representa uma solicitação de compra dos produtos selecionados pelo cliente.',
      'O pedido estará sujeito à confirmação da disponibilidade dos produtos, análise das informações fornecidas e aprovação do pagamento.',
      'Após a confirmação do pedido, o cliente receberá as informações correspondentes por meio dos canais de contato cadastrados.',
      'Em situações excepcionais, como indisponibilidade de estoque, erro evidente de preço ou informação, impossibilidade de fornecimento ou outras circunstâncias que impeçam a execução do pedido, a empresa entrará em contato com o cliente para definir a melhor solução.',
    ],
  },
  {
    title: 'Pagamentos',
    paragraphs: [
      'As condições de pagamento disponíveis serão apresentadas no momento da finalização da compra.',
      'As transações poderão ser intermediadas por empresas especializadas em meios de pagamento.',
      'A aprovação do pagamento está sujeita às regras e procedimentos da instituição financeira ou do meio de pagamento utilizado.',
      'O pedido somente será liberado para processamento após a confirmação do pagamento ou da condição de faturamento previamente aprovada pela empresa.',
      'Para compras realizadas por pessoa jurídica mediante faturamento, boleto ou outra modalidade de pagamento a prazo, a aprovação poderá estar condicionada à análise e aprovação de crédito.',
    ],
  },
  {
    title: 'Preços',
    paragraphs: [
      'Os preços dos produtos serão aqueles apresentados no momento da realização do pedido, observadas as condições comerciais informadas na página do produto ou no fechamento da compra.',
      'Os preços poderão ser alterados sem aviso prévio para novos pedidos.',
      'Eventuais descontos, promoções ou condições comerciais estarão sujeitos aos respectivos prazos, regras e disponibilidade informados pela empresa.',
    ],
  },
  {
    title: 'Entregas',
    paragraphs: [
      'A entrega será realizada no endereço informado pelo cliente no momento da compra.',
      'O prazo estimado de entrega será informado de acordo com a disponibilidade do produto, localização do destinatário, modalidade de transporte e demais condições aplicáveis ao pedido.',
      'O prazo de entrega poderá variar conforme a região, transportadora, disponibilidade do produto e condições excepcionais de transporte.',
      'O frete poderá ser calculado de acordo com características do pedido, como peso, dimensões, quantidade de produtos, endereço de entrega e modalidade de transporte.',
      'Em produtos de grandes dimensões, como camas hospitalares, macas, poltronas e outros equipamentos, poderão existir condições específicas de transporte e entrega.',
      'O cliente deverá assegurar que o local de entrega possui condições adequadas para recebimento do produto, incluindo acesso, portas, corredores, elevadores, rampas e demais condições necessárias à movimentação do produto.',
      'Quando houver impossibilidade de entrega decorrente de condições inadequadas do local ou ausência de responsável para recebimento, poderão ser necessárias novas tratativas e eventual reagendamento.',
    ],
  },
  {
    title: 'Recebimento dos Produtos',
    paragraphs: [
      'No momento da entrega, recomenda-se que o cliente confira a embalagem e as condições aparentes do produto.',
      'Caso sejam identificados danos aparentes, sinais de violação da embalagem ou divergências em relação ao pedido, o cliente deverá registrar a ocorrência no documento de entrega, sempre que possível, e comunicar a empresa imediatamente.',
      'A comunicação deverá ser acompanhada, quando possível, de fotografias ou vídeos que permitam avaliar a ocorrência.',
      'A assinatura do recebimento não impede o cliente de comunicar posteriormente defeitos ou vícios que não eram possíveis de identificar no momento da entrega, observados os prazos e condições previstos na legislação aplicável.',
    ],
  },
  {
    title: 'Devoluções e Direito de Arrependimento',
    paragraphs: [
      'Nas compras realizadas fora do estabelecimento comercial, serão respeitados os direitos previstos na legislação aplicável, inclusive o direito de arrependimento quando cabível.',
      'A solicitação deverá ser realizada pelos canais oficiais de atendimento da empresa, informando o número do pedido ou nota fiscal e o motivo da solicitação.',
      'A empresa fornecerá as orientações necessárias para o procedimento de devolução.',
      'O produto deverá ser disponibilizado para devolução conforme as orientações fornecidas pela empresa, de modo a possibilitar sua adequada identificação, transporte e recebimento.',
      'Após o recebimento, o produto poderá ser submetido à conferência para verificação de sua integridade e correspondência com o pedido.',
    ],
  },
  {
    title: 'Produtos com Defeito ou Não Conformidade',
    paragraphs: [
      'Caso o produto apresente defeito, vício ou não conformidade, o cliente deverá entrar em contato com a empresa pelos canais oficiais de atendimento.',
      'A reclamação poderá ser submetida à avaliação técnica para identificação da causa da ocorrência e definição da tratativa adequada.',
      'Quando necessário, poderão ser solicitadas fotografias, vídeos, número de série, lote, nota fiscal, descrição detalhada do problema ou outras informações necessárias à análise.',
      'Confirmada a existência de não conformidade de responsabilidade da empresa, serão adotadas as medidas cabíveis de acordo com a legislação aplicável, podendo incluir reparo, substituição de componentes, substituição do produto ou outra solução adequada ao caso.',
    ],
  },
  {
    title: 'Produtos Personalizados ou sob Encomenda',
    paragraphs: [
      'Alguns produtos poderão ser fabricados ou configurados conforme especificações fornecidas pelo cliente, incluindo dimensões, cores, revestimentos, acessórios, componentes, acabamentos ou outras características.',
      'Pedidos de produtos personalizados ou fabricados sob encomenda poderão possuir condições específicas de cancelamento, alteração e devolução, que serão informadas ao cliente previamente à confirmação do pedido.',
      'A solicitação de alteração ou cancelamento após o início da fabricação deverá ser previamente avaliada pela empresa, considerando o estágio de produção e as características específicas do pedido.',
      'Esta condição não afasta os direitos assegurados pela legislação aplicável.',
    ],
  },
  {
    title: 'Trocas',
    paragraphs: [
      'As solicitações de troca deverão ser realizadas previamente pelos canais oficiais da empresa.',
      'A troca poderá ocorrer em situações de produto em desacordo com o pedido, defeito, avaria ou outras hipóteses previstas na legislação ou nas condições comerciais aplicáveis.',
      'Nenhum produto deverá ser enviado espontaneamente para a empresa sem autorização prévia e orientação quanto ao procedimento de devolução.',
    ],
  },
  {
    title: 'Garantia',
    paragraphs: [
      'Os produtos possuem garantia conforme as condições estabelecidas para cada produto e de acordo com a legislação aplicável.',
      'A garantia está relacionada a defeitos de fabricação e demais situações abrangidas pelas condições de garantia do produto.',
      'Não estão abrangidos pela garantia, quando comprovados, danos decorrentes de utilização inadequada, instalação incorreta, alterações ou modificações não autorizadas, acidentes, impactos, armazenamento inadequado, utilização em desacordo com as instruções do fabricante ou desgaste natural decorrente do uso.',
      'A avaliação técnica poderá ser necessária para determinar a causa da ocorrência e verificar a aplicabilidade da garantia.',
    ],
  },
  {
    title: 'Instalação, Uso e Manutenção',
    paragraphs: [
      'Os produtos deverão ser instalados, utilizados, higienizados e mantidos de acordo com as instruções e recomendações fornecidas pela empresa.',
      'Quando o produto possuir manual, instruções de uso ou recomendações específicas, o cliente deverá observar essas orientações.',
      'Alterações estruturais, elétricas ou mecânicas realizadas sem autorização poderão comprometer o funcionamento e a segurança do produto e poderão afetar as condições de garantia, quando aplicável.',
      'A manutenção deverá ser realizada conforme as recomendações aplicáveis ao produto.',
    ],
  },
  {
    title: 'Devolução por Avaria de Transporte',
    paragraphs: [
      'Caso o produto apresente danos aparentemente relacionados ao transporte, o cliente deverá comunicar a empresa o mais breve possível, preferencialmente acompanhado de fotografias da embalagem, do produto e da identificação da mercadoria.',
      'A empresa realizará a análise da ocorrência e orientará o cliente sobre os procedimentos necessários.',
      'Dependendo da situação, poderão ser adotadas medidas como coleta do produto, reparo, substituição de componentes, substituição do produto ou outra solução adequada.',
    ],
  },
  {
    title: 'Reclamações e Não Conformidades',
    paragraphs: [
      'Todas as reclamações relacionadas aos produtos poderão ser registradas e avaliadas pela empresa.',
      'Quando necessário, será realizada investigação para determinar a causa da ocorrência, verificar a conformidade do produto e estabelecer a tratativa adequada.',
      'A empresa poderá utilizar informações de produção, inspeção, identificação, lote, número de série e demais registros disponíveis para realizar a rastreabilidade do produto.',
      'A estrutura interna de tratamento de reclamações poderá incluir avaliação técnica, investigação da ocorrência e comunicação da conclusão ao cliente.',
    ],
  },
  {
    title: 'Recall e Ações de Campo',
    paragraphs: [
      'Quando for identificada uma condição que possa representar risco à segurança dos usuários ou não conformidade relevante do produto, a empresa poderá realizar ações corretivas, preventivas, ações de campo ou Recall, conforme aplicável.',
      'Nessas situações, poderão ser adotadas medidas como comunicação aos clientes, identificação e rastreabilidade dos produtos, recolhimento, reparo, substituição, orientação de uso ou outras medidas necessárias.',
      'Os procedimentos internos de Recall e tecnovigilância serão conduzidos pelos responsáveis da empresa de acordo com os requisitos regulatórios aplicáveis.',
    ],
  },
  {
    title: 'Cancelamento de Pedidos',
    paragraphs: [
      'A solicitação de cancelamento deverá ser realizada pelos canais oficiais da empresa.',
      'Nos pedidos que ainda não tenham sido processados ou produzidos, a possibilidade de cancelamento será avaliada de acordo com o estágio do pedido.',
      'Nos produtos personalizados ou fabricados sob encomenda, o cancelamento após o início da fabricação poderá estar sujeito a condições específicas previamente informadas ao cliente, observada a legislação aplicável.',
      'Caso o pagamento já tenha sido realizado, eventual restituição seguirá as condições aplicáveis ao cancelamento e à modalidade de pagamento utilizada.',
    ],
  },
  {
    title: 'Frete e Custos de Devolução',
    paragraphs: [
      'As responsabilidades pelos custos de transporte relacionados à devolução, coleta ou substituição serão determinadas de acordo com o motivo da ocorrência e a legislação aplicável.',
      'Quando a ocorrência decorrer de defeito, não conformidade ou erro de fornecimento atribuível à empresa, serão adotadas as providências cabíveis para solução da ocorrência.',
      'Em outras situações, os custos e condições de transporte serão informados previamente ao cliente.',
    ],
  },
  {
    title: 'Responsabilidade do Cliente',
    paragraphs: ['O cliente é responsável por:'],
    list: [
      'Fornecer corretamente seus dados cadastrais e endereço de entrega;',
      'Conferir as informações do pedido antes de sua confirmação;',
      'Disponibilizar condições adequadas para recebimento dos produtos;',
      'Utilizar os produtos conforme suas instruções e recomendações;',
      'Realizar a manutenção e higienização conforme orientações aplicáveis;',
      'Comunicar à empresa qualquer problema identificado no produto;',
      'Fornecer informações verdadeiras e suficientes para análise de reclamações, trocas ou devoluções.',
    ],
  },
  {
    title: 'Canais de Atendimento',
    paragraphs: [
      'As solicitações relacionadas a pedidos, pagamentos, entregas, devoluções, trocas, garantia, assistência técnica ou reclamações deverão ser encaminhadas pelos canais oficiais de atendimento disponibilizados pela empresa.',
      'Para agilizar o atendimento, o cliente deverá informar, sempre que possível, número do pedido, nota fiscal, produto envolvido e descrição da solicitação.',
    ],
  },
  {
    title: 'Disposições Gerais',
    paragraphs: [
      'A realização de uma compra implica ciência das condições apresentadas no momento da contratação.',
      'Estas condições poderão ser atualizadas pela empresa sempre que necessário, sendo aplicável ao pedido a versão vigente no momento de sua contratação, ressalvadas as situações em que a legislação determine tratamento diverso.',
      'Nenhuma disposição destes Termos e Condições deverá ser interpretada como limitação ou exclusão de direitos assegurados ao consumidor pela legislação vigente.',
      'Os casos não previstos nestes Termos e Condições serão analisados individualmente pela empresa, considerando as características do pedido, do produto, da ocorrência e a legislação aplicável.',
    ],
  },
  {
    title: 'Legislação Aplicável',
    paragraphs: [
      'As relações comerciais decorrentes da utilização do site e da aquisição dos produtos serão regidas pela legislação brasileira aplicável.',
      'Quando aplicável, serão observadas as disposições do Código de Defesa do Consumidor e demais normas relacionadas à comercialização, segurança, qualidade e utilização dos produtos.',
    ],
  },
]

export default function DevolucaoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-center text-4xl font-bold text-secondary">
          Termos e Condições
        </h1>
        <p className="mb-10 text-center text-sm text-gray-500">
          Última atualização: 14/08/2026
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold text-secondary">{section.title}</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                {section.paragraphs?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="mb-3 text-gray-700">
            Dúvidas sobre devoluções, trocas ou garantia? Fale conosco.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center rounded-md bg-[#67CBDD] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4FA8B8]"
          >
            Ir para Contato
          </Link>
        </div>
      </div>
    </div>
  )
}
