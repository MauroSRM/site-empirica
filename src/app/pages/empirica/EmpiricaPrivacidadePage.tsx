/**
 * EmpiricaPrivacidadePage — Política de Privacidade e Cookies
 * /politica-de-privacidade
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React from "react";
import { EmpiricaLayout } from "./EmpiricaLayout";
import { EmpiricaBanner } from "./EmpiricaBanner";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { useTheme } from "../../../design-system";


function H2({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme();
  return (
    <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text16, fontWeight: 700, color: t.primary800, margin: "40px 0 12px" }}>
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme();
  return (
    <p style={{ fontFamily: t.fontFamily, fontSize: t.textXl, color: t.neutral700, lineHeight: 1.85, margin: "0 0 16px" }}>
      {children}
    </p>
  );
}

export default function EmpiricaPrivacidadePage() {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();

  return (
    <EmpiricaLayout>
      <EmpiricaBanner
        title="Política de Privacidade e Cookies"
        subtitle="Entenda os tipos de informação que utilizamos ao coletar seus dados em nossos serviços."
        badge="LGPD · Lei 13.709/2018"
        breadcrumbs={[{ label: "Política de Privacidade" }]}
      />

      <section style={{
        background: t.surfaceDefault,
        padding: isMobile ? "48px 24px 80px" : "72px 80px 96px",
        width: "100%", boxSizing: "border-box",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          <p style={{ fontFamily: t.fontFamily, fontSize: t.text2Xs, color: t.borderStrong, margin: "0 0 40px" }}>
            Última atualização: 01 de novembro de 2024
          </p>

          <P>
            Nós, da SRM Empírica, estamos comprometidos em resguardar sua privacidade e proteger seus dados. O presente documento tem como objetivo estabelecer as regras sobre o uso, armazenamento e tratamento dos dados e informações coletadas dos usuários no site <strong style={{ color: t.primary800 }}>https://srmempirica.com.br</strong> e explicar como suas informações e seus dados são solicitados, coletados, utilizados, compartilhados e armazenados dentro da nossa plataforma. Para fornecer os serviços ou produtos solicitados nós coletamos, por meio do nosso site e landing pages, os dados do usuário com o intuito de oferecer uma melhor navegação e experiência em nosso site. Sabemos que a privacidade dos seus dados é muito importante, por isso, todas as medidas para deixá-los protegidos estão sendo tomadas. A SRM Empírica coleta informações para administrar sua conta e configurá-la de acordo com suas especificações, como idioma e interesses, fornecer o que você nos solicita e, eventualmente, enviar informações sobre os nossos produtos, serviços e outros assuntos do seu interesse.
          </P>

          <H2>A quem se aplica?</H2>
          <P>
            Esta Política de Privacidade se aplica a todos que forneceram ou aos que desejam fornecer seus dados à nossa base utilizando algum serviço de coleta de dados, como preenchimento de formulários em páginas de ofertas de conteúdo, tais como ebooks, calculadoras ou solicitações de contato por nossos vendedores.
          </P>
          <P>Ao aceitar nossa Política de Privacidade, você nos informa que está ciente das especificações citadas em relação ao tratamento dos dados informados.</P>

          <H2>Quais são os dados de menores?</H2>
          <P>Não recolhemos intencionalmente, uma vez que não conseguimos distinguir, dados de menores, ou seja, com idade inferior a 18 (dezoito) anos. No entanto, com a informação de que foram recolhidos dados de menores, iremos de imediato proceder com a eliminação destes.</P>

          <H2>Quais são as fontes de dados?</H2>
          <P>Ao coletar seus dados, eles serão tratados e analisados, porém sempre mantendo a confidencialidade de acordo com a nossa Política de Privacidade.</P>
          <P>Coletamos seus dados pessoais por meio de: nosso site, quando você navega por ele coletamos algumas informações superficiais por meio de cookies; interações com anúncios, quando você interage ou compartilha algum de nossos anúncios, coletamos dados de seu computador também por meio de cookies; eventos, quando você fornece seus dados em eventos que estejamos participando como expositor ou patrocinador; e envios de dados por meio de formulários existentes em nossas páginas do site ou páginas de ofertas após você ter aceitado nossa Política de Privacidade.</P>

          <H2>O que fazemos com essas informações?</H2>
          <P>Quando você efetua sua inscrição para receber alguma oferta em nosso site, ou receber o contato de nossa equipe de consultores, automaticamente coletamos dados pessoais como nome, e-mail etc.</P>
          <P>Quando você acessa nosso site, também recebemos automaticamente o protocolo de internet do seu computador, endereço de IP, com o objetivo de obter informações que nos ajudam a aprender sobre seu navegador e sistema operacional.</P>
          <P>Envios de e-mail marketing serão realizados apenas caso você permita. Nestes e-mails você poderá receber notícias e informativos sobre a SRM Empírica, novos produtos e outras atualizações. A qualquer momento, poderá se descadastrar, se assim desejar.</P>

          <H2>Transferência internacional de dados</H2>
          <P>Usamos os dados aqui coletados também para análises de desempenho da plataforma, nacional e internacionalmente. Seus dados pessoais não são detalhados e não serão transferidos para nenhuma outra base de dados da SRM Empírica; nós apenas compartilhamos os dados obtidos a partir das análises deles.</P>
          <P>Como seus contatos serão coletados pela SRM Empírica, esses dados serão regidos pela Lei Brasileira. Ao acessar nossos serviços ou fornecer seus dados para nós, você concorda com o processamento e transferência mencionados acima.</P>

          <H2>Como obtemos seu consentimento?</H2>
          <P>Quando você fornece suas informações pessoais em nossas páginas para receber algum produto, serviço, conteúdo ou oferta, entendemos que você está de acordo com nossa política de tratamento de dados e que eles podem ser utilizados pela nossa empresa.</P>

          <H2>Como solicitar a exclusão de dados?</H2>
          <P>
            Você pode solicitar a exclusão dos seus dados pessoais de nossa plataforma a qualquer momento. Todos os seus dados serão excluídos assim que solicitado. Para solicitar a exclusão de seus dados pessoais é só enviar um e-mail para{" "}
            <a href="mailto:dpo@srmasset.com" style={{ color: t.brandPrimary, textDecoration: "none", fontWeight: 500 }}>dpo@srmasset.com</a>{" "}
            com o assunto: "EXCLUSÃO DE DADOS PESSOAIS".
          </P>

          <H2>Como entrar em contato com a SRM Empírica?</H2>
          <P>
            Caso você deseje entrar em contato conosco para excluir, corrigir, ou realizar qualquer outra especificação sobre os seus dados pessoais que estão em nossa base, você pode nos acionar no endereço de e-mail{" "}
            <a href="mailto:dpo@srmasset.com" style={{ color: t.brandPrimary, textDecoration: "none", fontWeight: 500 }}>dpo@srmasset.com</a>{" "}
            ou pelo número{" "}
            <a href="tel:+551132257840" style={{ color: t.brandPrimary, textDecoration: "none", fontWeight: 500 }}>+55 (11) 3225-7840</a>.
          </P>

          <H2>Divulgação</H2>
          <P>Podemos divulgar seus dados pessoais caso seja solicitado pela lei ou se você violar nossos termos de serviço.</P>

          <H2>Quais são os direitos dos titulares de dados?</H2>
          <P>Os Leitores podem exercer os direitos para os contatos do responsável pelo tratamento dos dados pessoais da SRM Empírica mencionados abaixo na presente Política de Privacidade e Cookies. Os Leitores detêm e podem exercer os seguintes direitos referentes aos respectivos dados pessoais: direito de informação, direito de acesso, direito de retificação, direito de eliminação, direito à limitação do tratamento, direito de portabilidade dos dados, direito de oposição, direito ao conhecimento da existência de uma violação de dados e direito de reclamação para autoridade de controle.</P>

          <H2>Serviços de terceiros</H2>
          <P>Os fornecedores terceirizados da SRM Empírica irão apenas coletar e utilizar suas informações, obedecendo à nossa Política de Privacidade, na medida em que eles precisam desses dados para fornecer os serviços por nós contratados.</P>

          <H2>Compartilhamento</H2>
          <P>A SRM Empírica compartilha dados somente com empresas que prestam serviços terceirizados. Essas empresas usam os dados apenas para coleta, análise, uso e divulgação dos dados dentro das especificações da LGPD.</P>

          <H2>Links externos</H2>
          <P>Ao clicar em alguns links em nosso site, eventualmente eles podem te levar para outras páginas fora do nosso site. Não nos responsabilizamos pela Política de Privacidade dos outros sites.</P>

          <H2>Segurança</H2>
          <P>Para sua segurança e proteção de seus dados pessoais, tomamos as maiores precauções e seguimos as melhores práticas do mercado para nos certificarmos de que eles não serão perdidos inadequadamente, usurpados, acessados, divulgados, alterados ou destruídos.</P>

          <H2>Por quanto tempo os dados são armazenados?</H2>
          <P>Os dados armazenados são mantidos em nossa base por tempo indeterminado ou pelo tempo necessário para cumprir com as finalidades pelas quais foram solicitados.</P>

          <H2>Política de Cookies</H2>
          <P>Utilizamos cookies automaticamente, por ser um padrão da plataforma Amazon Web Services, onde estamos hospedados. Qualquer navegador de internet permite ao utilizador aceitar, recusar ou apagar cookies.</P>

          <H2>Transferência de propriedade</H2>
          <P>Se nossa empresa for adquirida ou fundida com outra empresa, suas informações podem ser transferidas para os novos proprietários.</P>

          <H2>Atualizações da Política de Privacidade</H2>
          <P>A SRM Empírica está sempre buscando melhorar seus serviços e, por isso, este documento pode ser devidamente atualizado perante a lei.</P>

          <div style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: `1px solid ${t.borderDefault}`,
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <span style={{ fontFamily: t.fontFamily, fontSize: t.textLg, fontWeight: 600, color: t.primary800 }}>SRM Empírica</span>
            <span style={{ fontFamily: t.fontFamily, fontSize: t.text2Xs, color: t.borderStrong }}>01 de novembro de 2024</span>
          </div>

        </div>
      </section>
    </EmpiricaLayout>
  );
}
