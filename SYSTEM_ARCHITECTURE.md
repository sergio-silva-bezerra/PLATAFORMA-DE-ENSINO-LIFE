# Arquitetura do Sistema - Portal Acadêmico LIFE

Este documento descreve os cinco blocos principais do sistema, suas funcionalidades e como eles se conectam para formar um ecossistema educacional integrado.

---

## 1. Bloco Administrativo (Gestão Estratégica)
**Perfil:** Administrador Geral
**Objetivo:** Visão macro da instituição e controle total de recursos.

### Funcionalidades:
- **Dashboard Global:** Gráficos de novas matrículas, receita mensal e índice de inadimplência.
- **Gestão de Alunos:** Cadastro completo, edição e visualização de histórico.
- **Gestão de Cursos:** Criação e manutenção da grade curricular e cursos ativos.
- **Supervisão Financeira:** Acompanhamento de metas e saúde financeira da instituição.
- **Controle de Solicitações:** Visão geral de todos os chamados abertos no sistema.
- **Gestão de Convênios:** Controle de contratos com hospitais e clínicas parceiras.
- **Inventário de Insumos:** Monitoramento de materiais descartáveis para aulas práticas.

### Conexões:
- **Financeiro:** Recebe dados agregados para compor a receita global.
- **Secretaria:** Monitora o volume de solicitações e eficiência no atendimento.
- **Pedagógico:** Valida a abertura de novas turmas e cursos.

---

## 2. Bloco Financeiro (Gestão de Contas)
**Perfil:** Analista Financeiro
**Objetivo:** Garantir a saúde financeira e facilitar a adimplência do aluno.

### Funcionalidades:
- **Dashboard Financeiro:** Faturamento mensal, pagamentos pendentes e taxa de crescimento.
- **Processamento de Pagamentos:** Gestão de títulos via PIX, Cartão e Boleto.
- **Negociação de Dívidas:** Análise e aprovação de propostas de parcelamento enviadas pelos alunos.
- **Relatórios:** Emissão de balancetes e extratos por aluno ou curso.
- **Régua de Cobrança WhatsApp:** Automação de notificações de pagamento.
- **Assinatura Digital:** Formalização eletrônica de matrículas e contratos.

### Conexões:
- **Aluno:** Envia boletos e recebe confirmações de pagamento em tempo real.
- **Administrativo:** Alimenta a dashboard estratégica com dados de receita.

---

## 3. Bloco Pedagógico (Gestão Acadêmica)
**Perfil:** Coordenador / Professor
**Objetivo:** Garantir a qualidade do ensino e o engajamento do aluno.

### Funcionalidades:
- **Dashboard Pedagógico:** Acompanhamento de turmas, média de notas e frequência.
- **Gestão de Conteúdo:** Publicação de materiais, vídeos e atividades na Sala Virtual.
- **Cronograma:** Organização do quadro de horários e alocação de tutores.
- **Alertas de Desempenho:** Identificação proativa de alunos com baixa frequência ou notas baixas.
- **Portal de Preceptoria:** Gestão de estágios e avaliações em campo (Hospitais).
- **Trava de Biossegurança:** Condicionamento de aulas práticas à conclusão de módulos de segurança.
- **Ocupação de Laboratórios:** Agendamento e controle de bancadas físicas.

### Conexões:
- **Aluno:** Provê o ambiente de aprendizagem (Sala de Aula Virtual).
- **Secretaria:** Informa sobre a conclusão de módulos para emissão de certificados.

---

## 4. Bloco Secretaria (Gestão de Registros)
**Perfil:** Agente de Secretaria
**Objetivo:** Gestão do ciclo de vida acadêmico e documentação.

### Funcionalidades:
- **Dashboard Secretaria:** Validação de documentos de novos alunos e triagem de chamados.
- **Gestão de Documentos:** Arquivo digital de RGs, Históricos e Diplomas.
- **Processamento de Solicitações:** Atendimento de pedidos de Segunda Chamada, Transferências e Mudanças de Curso.
- **Integração SISTEC:** Exportação de dados para o sistema do MEC.
- **Dossiê de Saúde:** Controle de vacinas e seguros de estágio.
- **Diplomas Digitais:** Emissão com QR Code e autenticidade COFEN.

### Conexões:
- **Aluno:** Recebe e responde a todas as solicitações formais.
- **Pedagógico:** Sincroniza mudanças de turma ou curso para atualização de diários de classe.

---

## 5. Bloco Aluno (Portal do Aluno)
**Perfil:** Estudante
**Objetivo:** Centralizar todas as necessidades acadêmicas e financeiras.

### Funcionalidades:
- **Dashboard Personalizada:** Resumo de notas, avisos pedagógicos e status financeiro.
- **Carteira Digital:** Pagamento de mensalidades e negociação de débitos.
- **Secretaria Virtual:** Abertura de chamados e envio de documentos.
- **Vida Acadêmica:** Acesso à Sala de Aula Virtual, Quadro de Horários e Atividades Complementares.
- **Tutor IA 24h:** Assistente inteligente para dúvidas de enfermagem.
- **Gamificação:** Sistema de selos de competência técnica.
- **Interface PWA:** Acesso otimizado para dispositivos móveis.

### Conexões:
- **Financeiro:** Conexão direta para quitação de débitos.
- **Secretaria:** Canal oficial para solicitações e documentos.
- **Pedagógico:** Ambiente de estudo e acompanhamento de aulas.

---

## Matriz de Integração (Sem Pontas Soltas)

| De (Origem) | Para (Destino) | Tipo de Conexão | Status |
| :--- | :--- | :--- | :--- |
| Aluno | Financeiro | Pagamento / Negociação | **OK** |
| Aluno | Secretaria | Solicitação Acadêmica | **OK** |
| Aluno | Pedagógico | Sala Virtual / Horários | **OK** |
| Secretaria | Aluno | Validação de Documentos | **OK** |
| Financeiro | Aluno | Confirmação de Recebimento | **OK** |
| Pedagógico | Aluno | Alertas de Desempenho | **OK** |
| Administrativo | Todos | Supervisão e Relatórios | **OK** |

---
*Documento gerado automaticamente pelo Sistema de Gestão LIFE - 2026*
