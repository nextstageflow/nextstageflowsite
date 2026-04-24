import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Stack,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Link,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import {
  Email,
  Phone,
  LinkedIn,
  ArrowForward,
  Bolt,
  TrendingUp,
  Computer,
  Speed,
  ShowChart,
  WhatsApp,
  Menu,
  Close,
  ExpandMore,
} from '@mui/icons-material';
import logo from '../imports/Logo_NextStage_Flow_Clean.png';
import flagBr from '../imports/flags/flag-br.svg';
import flagUs from '../imports/flags/flag-us.svg';
import flagEs from '../imports/flags/flag-es.svg';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a855f7',
      light: '#c084fc',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#ea580c',
    },
    background: {
      default: '#0f172a',
      paper: '#1e1b4b',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '1.65rem',
      lineHeight: 1.2,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.3rem',
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.15rem',
      '@media (min-width:900px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.05rem',
      '@media (min-width:900px)': {
        fontSize: '1.5rem',
      },
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.7,
      '@media (min-width:900px)': {
        fontSize: '1.125rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontSize: '1rem',
          padding: '12px 32px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'linear-gradient(to bottom right, #1e1b4b, #581c87)',
        },
      },
    },
  },
});

const EMAIL_TO = 'nextstageflow@gmail.com';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '';
const SITE_URL = import.meta.env.VITE_SITE_URL ?? '';

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_WHATSAPP_LENGTH = 24;
const MAX_MESSAGE_LENGTH = 2000;
const SUBMISSION_COOLDOWN_MS = 60_000;
const CONTACT_FORM_COOLDOWN_KEY = 'nextstageflow_contact_form_cooldown_until';
const LANGUAGE_STORAGE_KEY = 'nextstageflow_language';

const isConfiguredEnvValue = (value: string, placeholderFragments: string[]) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return false;
  }

  const lowerValue = normalizedValue.toLowerCase();
  return !placeholderFragments.some((fragment) => lowerValue.includes(fragment));
};

type Language = 'pt' | 'en' | 'es';

type ContactFormState = {
  nome: string;
  email: string;
  countryIso: string;
  whatsapp: string;
  mensagem: string;
  lgpdConsent: boolean;
};

type ContactFormErrors = {
  nome: string;
  email: string;
  whatsapp: string;
  mensagem: string;
};

type ToastState = {
  open: boolean;
  severity: 'success' | 'error' | 'warning';
  message: string;
};

type CountryOption = {
  iso: string;
  name: string;
  callingCode: string;
  label: string;
  searchLabel: string;
};

type LanguageOption = {
  value: Language;
  label: string;
  flagSrc: string;
};

type SeoConfig = {
  title: string;
  description: string;
  keywords: string;
};

type FaqConfig = {
  title: string;
  subtitle: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

const initialFormState: ContactFormState = {
  nome: '',
  email: '',
  countryIso: 'BR',
  whatsapp: '',
  mensagem: '',
  lgpdConsent: false,
};

const initialFormErrors: ContactFormErrors = {
  nome: '',
  email: '',
  whatsapp: '',
  mensagem: '',
};

const languageToLocale: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

const languageFlags: Record<Language, string> = {
  pt: flagBr,
  en: flagUs,
  es: flagEs,
};

const translations = {
  pt: {
    nav: {
      about: 'Sobre',
      services: 'Serviços',
      contact: 'Contato',
      language: 'Idioma',
      privacy: 'Política de Privacidade e LGPD',
    },
    languageNames: {
      pt: 'Português',
      en: 'English',
      es: 'Español',
    },
    hero: {
      titleLine1: 'Automatize processos e',
      titleHighlight: 'elimine trabalho manual',
      body:
        'A NextStage Flow une consultoria, agilidade e automação para melhorar processos, aumentar produtividade e criar workflows personalizados, sites e apps que aceleram resultados reais no seu negócio.',
      primaryButton: 'Automatizar Processos',
      secondaryButton: 'Ver Soluções',
      headerButton: 'Iniciar Automação',
      headerButtonMobile: 'Iniciar',
    },
    values: [
      {
        title: 'Automatização Total',
        description: 'Eliminamos tarefas manuais e processos repetitivos',
      },
      {
        title: 'Máxima Eficiência',
        description: 'Reduzimos tempo, custos e erros operacionais',
      },
      {
        title: 'Ganho de Produtividade',
        description: 'Sua equipe focada em atividades estratégicas',
      },
    ],
    about: {
      title: 'Pare de Perder Tempo com Tarefas Manuais',
      paragraph1Before: 'Nossa missão é ',
      paragraph1Highlight: 'eliminar o trabalho manual repetitivo',
      paragraph1After:
        ' que consome o tempo valioso da sua equipe. Na NextStage Flow, aplicamos consultoria com agilidade para transformar processos complexos em automação, workflows personalizados e operações mais simples, rápidas e confiáveis.',
      paragraph2:
        'Seja na entrada de dados, geração de relatórios, envio de comunicações, processamento de documentos, criação de site e apps ou integração entre sistemas, entregamos personalização, melhoria de processos e soluções sob medida para gerar produtividade e crescimento.',
      highlight: 'Menos trabalho manual. Mais produtividade. Mais resultados.',
    },
    services: {
      title: 'Como Automatizamos Seu Negócio',
      subtitle:
        'Consultoria, automação, workflows personalizados, sites e apps para melhorar processos e multiplicar sua produtividade',
      items: [
        {
          title: 'Automação Inteligente',
          description:
            'Eliminamos tarefas manuais e repetitivas através de automações personalizadas que economizam tempo e reduzem erros.',
        },
        {
          title: 'Aumento de Eficiência',
          description:
            'Otimizamos processos operacionais, administrativos e financeiros para maximizar produtividade e resultados.',
        },
        {
          title: 'Workflows Personalizados',
          description:
            'Criamos sistemas e fluxos de trabalho sob medida que transformam operações complexas em processos simples e automatizados.',
        },
        {
          title: 'Automação n8n',
          description:
            'Implementamos automações com n8n, integrações entre ferramentas, atendimento ao cliente, CRM, formulários, planilhas e sistemas internos.',
        },
        {
          title: 'Sites, Apps e Ferramentas',
          description:
            'Desenvolvemos sites, aplicativos e ferramentas digitais para acelerar operações, validar ideias e remover gargalos manuais.',
        },
        {
          title: 'Consultoria Ágil',
          description:
            'Apoiamos empresas com consultoria ágil, melhoria de processos, priorização de iniciativas e criação de soluções práticas para ganhar velocidade.',
        },
      ],
      processesLead: 'Processos que automatizamos:',
      processes:
        'Entrada e processamento de dados | Geração automática de relatórios | Integração entre sistemas | Gestão de documentos | Fluxos de aprovação | Comunicação automatizada | Tarefas administrativas e financeiras | Workflows e workflows personalizados | Automação n8n | Criação de site e apps | Atendimento ao cliente',
    },
    contact: {
      title: 'Pronto para Automatizar?',
      subtitle:
        'Vamos identificar como consultoria, agilidade, automação e melhoria de processos podem aumentar a produtividade da sua empresa',
      whatsapp: 'WhatsApp',
      email: 'E-mail',
      linkedin: 'LinkedIn',
      linkedinName: 'NextStage Flow',
    },
    footer: {
      description: 'Consultoria em tecnologia e automação de processos',
      founded: 'Fundada em 2025 | NextStage Flow',
      copyright: '© 2025 NextStage Flow. Todos os direitos reservados.',
    },
    form: {
      title: 'Envie sua mensagem',
      emailConfigWarning:
        'Para habilitar o envio, crie o arquivo `.env` na raiz do projeto e preencha `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` e `VITE_EMAILJS_PUBLIC_KEY` com os dados da sua conta EmailJS.',
      recaptchaWarning:
        'Para ativar o Google reCAPTCHA, adicione `VITE_RECAPTCHA_SITE_KEY` no arquivo `.env` usando a site key do seu domínio.',
      nameLabel: 'Seu nome',
      emailLabel: 'Seu e-mail',
      emailPlaceholder: 'nome@empresa.com',
      emailHelper: 'Sem espaços e em formato válido, como nome@empresa.com.',
      countryLabel: 'País / código',
      countryPlaceholder: 'Pesquise o país',
      whatsappLabel: 'Seu WhatsApp',
      whatsappHelper:
        'Pesquise o país ao lado; o código aparece aqui e a máscara é aplicada automaticamente.',
      messageLabel: 'Sua mensagem',
      privacyInfo:
        'Usaremos seus dados apenas para responder seu contato, apresentar propostas e dar continuidade à conversa comercial, conforme nossa Política de Privacidade.',
      securityInfo:
        'Este site não solicita pagamentos, downloads, senhas, códigos de verificação ou dados bancários. O formulário serve apenas para contato comercial com a NextStage Flow.',
      consentBefore: 'Li e concordo com a ',
      consentLink: 'Política de Privacidade e tratamento de dados pessoais',
      consentAfter: ' para envio desta mensagem.',
      cancel: 'Cancelar',
      submit: 'Enviar e-mail',
      sending: 'Enviando...',
      validation: {
        nameRequired: 'Informe seu nome.',
        emailRequired: 'Informe um e-mail.',
        emailInvalid: 'Digite um e-mail válido.',
        whatsappRequired: 'Informe um WhatsApp.',
        whatsappInvalidCode: 'Digite um número válido com código do país.',
        whatsappInvalidCountry: 'Digite um número válido para o país selecionado.',
        messageRequired: 'Escreva sua mensagem.',
      },
    },
    privacy: {
      title: 'Política de Privacidade e LGPD',
      intro:
        'Esta política explica como a NextStage Flow trata dados pessoais enviados pelo formulário de contato, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).',
      sections: [
        {
          title: '1. Dados coletados',
          body:
            'Podemos coletar nome, e-mail, telefone/WhatsApp, mensagem enviada e informações técnicas necessárias para segurança e prevenção de abuso, como validação por reCAPTCHA.',
        },
        {
          title: '2. Finalidade do tratamento',
          body:
            'Os dados são utilizados para responder seu contato, elaborar propostas, manter comunicação comercial relacionada ao seu pedido e proteger o formulário contra spam, fraude e uso automatizado indevido.',
        },
        {
          title: '3. Base legal',
          body:
            'O tratamento ocorre com base no seu consentimento ao enviar o formulário e, quando aplicável, em legítimo interesse para responder solicitações comerciais e adotar medidas de segurança.',
        },
        {
          title: '4. Compartilhamento',
          body:
            'Para operar o formulário, seus dados podem ser processados por provedores contratados pela NextStage Flow, como serviços de envio de e-mail e mecanismos de verificação anti-bot, sempre limitados à finalidade deste contato.',
        },
        {
          title: '5. Retenção',
          body:
            'Os dados serão mantidos pelo tempo necessário para atender sua solicitação, conduzir o relacionamento comercial e cumprir obrigações legais ou regulatórias, quando existirem.',
        },
        {
          title: '6. Seus direitos',
          body:
            'Você pode solicitar confirmação do tratamento, acesso, correção, atualização, anonimização, eliminação, portabilidade ou revogação do consentimento, observadas as hipóteses legais aplicáveis.',
        },
        {
          title: '7. Contato para privacidade',
          body:
            'Para assuntos relacionados a dados pessoais e privacidade, entre em contato pelo e-mail nextstageflow@gmail.com.',
        },
      ],
      close: 'Fechar',
    },
    toasts: {
      success: 'Mensagem enviada com sucesso para a NextStage Flow.',
      cooldown: 'Aguarde um minuto antes de enviar outra mensagem.',
      review: 'Revise os campos de e-mail e WhatsApp antes de enviar.',
      consent:
        'Confirme a concordância com a Política de Privacidade e tratamento de dados para enviar.',
      emailConfig: 'Configure as chaves do EmailJS no arquivo .env para habilitar o envio.',
      recaptchaConfig:
        'Configure a chave do Google reCAPTCHA no arquivo .env para habilitar o envio.',
      captcha: 'Confirme o reCAPTCHA antes de enviar a mensagem.',
      error:
        'Não foi possível enviar o e-mail agora. Revise as credenciais do EmailJS e tente novamente.',
    },
  },
  en: {
    nav: {
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      language: 'Language',
      privacy: 'Privacy Policy and LGPD',
    },
    languageNames: {
      pt: 'Portuguese',
      en: 'English',
      es: 'Spanish',
    },
    hero: {
      titleLine1: 'Automate processes and',
      titleHighlight: 'eliminate manual work',
      body:
        'NextStage Flow combines consulting, agility, and automation to improve processes, increase productivity, and build custom workflows, websites, and apps that drive real business results.',
      primaryButton: 'Automate Processes',
      secondaryButton: 'View Solutions',
      headerButton: 'Start Automation',
      headerButtonMobile: 'Start',
    },
    values: [
      {
        title: 'Full Automation',
        description: 'We eliminate manual tasks and repetitive workflows',
      },
      {
        title: 'Maximum Efficiency',
        description: 'We reduce time, costs, and operational errors',
      },
      {
        title: 'Productivity Gains',
        description: 'Your team stays focused on strategic work',
      },
    ],
    about: {
      title: 'Stop Losing Time on Manual Tasks',
      paragraph1Before: 'Our mission is to ',
      paragraph1Highlight: 'eliminate repetitive manual work',
      paragraph1After:
        " that consumes your team's valuable time. At NextStage Flow, we implement smart automations that turn complex processes into simple, fast, and error-free flows.",
      paragraph2:
        'Whether it is data entry, report generation, communications, document processing, or system integration, we create tailored solutions that dramatically improve operational efficiency and free your team to focus on high-value strategic activities.',
      highlight: 'Less manual work. More results. Maximum efficiency.',
    },
    services: {
      title: 'How We Automate Your Business',
      subtitle: 'Solutions that remove manual processes and multiply your productivity',
      items: [
        {
          title: 'Intelligent Automation',
          description:
            'We eliminate manual and repetitive tasks through tailored automations that save time and reduce errors.',
        },
        {
          title: 'Efficiency Growth',
          description:
            'We optimize operational, administrative, and financial processes to maximize productivity and results.',
        },
        {
          title: 'Custom Workflows',
          description:
            'We build custom systems and workflows that transform complex operations into simple automated processes.',
        },
        {
          title: 'n8n Automation',
          description:
            'We implement n8n automations, tool integrations, customer support flows, CRM processes, forms, spreadsheets, and internal systems.',
        },
        {
          title: 'Websites, Apps, and Tools',
          description:
            'We develop websites, apps, and digital tools to accelerate operations, validate ideas, and remove manual bottlenecks.',
        },
        {
          title: 'Agile Consulting',
          description:
            'We support companies with agile consulting, process improvement, initiative prioritization, and practical solutions that create speed.',
        },
      ],
      processesLead: 'Processes we automate:',
      processes:
        'Data intake and processing | Automatic report generation | System integrations | Document management | Approval workflows | Automated communications | Administrative and financial tasks | n8n automation | Websites, apps, and tools | Customer service',
    },
    contact: {
      title: 'Ready to Automate?',
      subtitle: "Let's identify which manual processes we can eliminate in your business",
      whatsapp: 'WhatsApp',
      email: 'Email',
      linkedin: 'LinkedIn',
      linkedinName: 'NextStage Flow',
    },
    footer: {
      description: 'Technology and process automation consulting',
      founded: 'Founded in 2025 | NextStage Flow',
      copyright: '© 2025 NextStage Flow. All rights reserved.',
    },
    form: {
      title: 'Send us a message',
      emailConfigWarning:
        'To enable sending, create a `.env` file in the project root and fill in `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` with your EmailJS account data.',
      recaptchaWarning:
        'To enable Google reCAPTCHA, add `VITE_RECAPTCHA_SITE_KEY` to the `.env` file using the site key for your domain.',
      nameLabel: 'Your name',
      emailLabel: 'Your email',
      emailPlaceholder: 'name@company.com',
      emailHelper: 'No spaces and in a valid format, such as name@company.com.',
      countryLabel: 'Country / code',
      countryPlaceholder: 'Search for a country',
      whatsappLabel: 'Your WhatsApp',
      whatsappHelper:
        'Search for the country next to it; the code appears here and formatting is applied automatically.',
      messageLabel: 'Your message',
      privacyInfo:
        'We will use your data only to respond to your inquiry, present proposals, and continue the commercial conversation according to our Privacy Policy.',
      securityInfo:
        'This site does not request payments, downloads, passwords, verification codes, or banking details. This form is only for business contact with NextStage Flow.',
      consentBefore: 'I have read and agree to the ',
      consentLink: 'Privacy Policy and personal data processing',
      consentAfter: ' for sending this message.',
      cancel: 'Cancel',
      submit: 'Send email',
      sending: 'Sending...',
      validation: {
        nameRequired: 'Please enter your name.',
        emailRequired: 'Please enter an email.',
        emailInvalid: 'Please enter a valid email.',
        whatsappRequired: 'Please enter a WhatsApp number.',
        whatsappInvalidCode: 'Please enter a valid number with country code.',
        whatsappInvalidCountry: 'Please enter a valid number for the selected country.',
        messageRequired: 'Please write your message.',
      },
    },
    privacy: {
      title: 'Privacy Policy and LGPD',
      intro:
        'This policy explains how NextStage Flow processes personal data submitted through the contact form, in compliance with the Brazilian General Data Protection Law (LGPD - Law No. 13,709/2018).',
      sections: [
        {
          title: '1. Data collected',
          body:
            'We may collect name, email, phone/WhatsApp number, submitted message, and technical information required for security and abuse prevention, such as reCAPTCHA validation.',
        },
        {
          title: '2. Purpose of processing',
          body:
            'The data is used to respond to your inquiry, prepare proposals, maintain business communication related to your request, and protect the form against spam, fraud, and improper automated use.',
        },
        {
          title: '3. Legal basis',
          body:
            'Processing takes place based on your consent when submitting the form and, when applicable, on legitimate interest to respond to business requests and adopt security measures.',
        },
        {
          title: '4. Sharing',
          body:
            'To operate the form, your data may be processed by providers hired by NextStage Flow, such as email delivery services and anti-bot verification mechanisms, always limited to the purpose of this contact.',
        },
        {
          title: '5. Retention',
          body:
            'The data will be retained for as long as necessary to address your request, manage the business relationship, and comply with legal or regulatory obligations where applicable.',
        },
        {
          title: '6. Your rights',
          body:
            'You may request confirmation of processing, access, correction, updating, anonymization, deletion, portability, or withdrawal of consent, subject to the applicable legal conditions.',
        },
        {
          title: '7. Privacy contact',
          body:
            'For matters related to personal data and privacy, please contact nextstageflow@gmail.com.',
        },
      ],
      close: 'Close',
    },
    toasts: {
      success: 'Message sent successfully to NextStage Flow.',
      cooldown: 'Please wait one minute before sending another message.',
      review: 'Please review the email and WhatsApp fields before sending.',
      consent:
        'Please confirm agreement with the Privacy Policy and data processing before sending.',
      emailConfig: 'Set the EmailJS keys in the .env file to enable sending.',
      recaptchaConfig: 'Set the Google reCAPTCHA key in the .env file to enable sending.',
      captcha: 'Please complete the reCAPTCHA before sending the message.',
      error: 'We could not send the email right now. Please review the EmailJS credentials and try again.',
    },
  },
  es: {
    nav: {
      about: 'Sobre',
      services: 'Servicios',
      contact: 'Contacto',
      language: 'Idioma',
      privacy: 'Política de Privacidad y LGPD',
    },
    languageNames: {
      pt: 'Português',
      en: 'Inglés',
      es: 'Español',
    },
    hero: {
      titleLine1: 'Automatiza procesos y',
      titleHighlight: 'elimina el trabajo manual',
      body:
        'NextStage Flow transforma tareas repetitivas en procesos automatizados. Aumentamos la eficiencia, reducimos costos operativos y liberamos a tu equipo para enfocarse en lo que realmente importa.',
      primaryButton: 'Automatizar Procesos',
      secondaryButton: 'Ver Soluciones',
      headerButton: 'Iniciar Automatización',
      headerButtonMobile: 'Iniciar',
    },
    values: [
      {
        title: 'Automatización Total',
        description: 'Eliminamos tareas manuales y procesos repetitivos',
      },
      {
        title: 'Máxima Eficiencia',
        description: 'Reducimos tiempo, costos y errores operativos',
      },
      {
        title: 'Mayor Productividad',
        description: 'Tu equipo enfocado en actividades estratégicas',
      },
    ],
    about: {
      title: 'Deja de Perder Tiempo con Tareas Manuales',
      paragraph1Before: 'Nuestra misión es ',
      paragraph1Highlight: 'eliminar el trabajo manual repetitivo',
      paragraph1After:
        ' que consume el tiempo valioso de tu equipo. En NextStage Flow implementamos automatizaciones inteligentes que convierten procesos complejos en flujos simples, rápidos y sin errores.',
      paragraph2:
        'Ya sea en la entrada de datos, generación de informes, envío de comunicaciones, procesamiento de documentos o integración entre sistemas, creamos soluciones personalizadas que aumentan drásticamente la eficiencia operativa y liberan a tu equipo para enfocarse en actividades estratégicas de alto valor.',
      highlight: 'Menos trabajo manual. Más resultados. Máxima eficiencia.',
    },
    services: {
      title: 'Cómo Automatizamos Tu Negocio',
      subtitle: 'Soluciones que eliminan procesos manuales y multiplican tu productividad',
      items: [
        {
          title: 'Automatización Inteligente',
          description:
            'Eliminamos tareas manuales y repetitivas mediante automatizaciones personalizadas que ahorran tiempo y reducen errores.',
        },
        {
          title: 'Aumento de Eficiencia',
          description:
            'Optimizamos procesos operativos, administrativos y financieros para maximizar productividad y resultados.',
        },
        {
          title: 'Workflows Personalizados',
          description:
            'Creamos sistemas y flujos de trabajo a medida que transforman operaciones complejas en procesos simples y automatizados.',
        },
        {
          title: 'Automatización con n8n',
          description:
            'Implementamos automatizaciones con n8n, integraciones entre herramientas, atención al cliente, CRM, formularios, hojas de cálculo y sistemas internos.',
        },
        {
          title: 'Sitios, Apps y Herramientas',
          description:
            'Desarrollamos sitios web, aplicaciones y herramientas digitales para acelerar operaciones, validar ideas y eliminar cuellos de botella manuales.',
        },
        {
          title: 'Consultoría Ágil',
          description:
            'Apoyamos a empresas con consultoría ágil, mejora de procesos, priorización de iniciativas y creación de soluciones prácticas para ganar velocidad.',
        },
      ],
      processesLead: 'Procesos que automatizamos:',
      processes:
        'Entrada y procesamiento de datos | Generación automática de informes | Integración entre sistemas | Gestión documental | Flujos de aprobación | Comunicación automatizada | Tareas administrativas y financieras | Automatización n8n | Creación de sitios, apps y herramientas | Atención al cliente',
    },
    contact: {
      title: '¿Listo para Automatizar?',
      subtitle: 'Vamos a identificar qué procesos manuales podemos eliminar en tu empresa',
      whatsapp: 'WhatsApp',
      email: 'Correo',
      linkedin: 'LinkedIn',
      linkedinName: 'NextStage Flow',
    },
    footer: {
      description: 'Consultoría en tecnología y automatización de procesos',
      founded: 'Fundada en 2025 | NextStage Flow',
      copyright: '© 2025 NextStage Flow. Todos los derechos reservados.',
    },
    form: {
      title: 'Envíanos tu mensaje',
      emailConfigWarning:
        'Para habilitar el envío, crea el archivo `.env` en la raíz del proyecto y completa `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` y `VITE_EMAILJS_PUBLIC_KEY` con los datos de tu cuenta de EmailJS.',
      recaptchaWarning:
        'Para activar Google reCAPTCHA, agrega `VITE_RECAPTCHA_SITE_KEY` en el archivo `.env` usando la site key de tu dominio.',
      nameLabel: 'Tu nombre',
      emailLabel: 'Tu correo',
      emailPlaceholder: 'nombre@empresa.com',
      emailHelper: 'Sin espacios y en un formato válido, como nombre@empresa.com.',
      countryLabel: 'País / código',
      countryPlaceholder: 'Busca un país',
      whatsappLabel: 'Tu WhatsApp',
      whatsappHelper:
        'Busca el país al lado; el código aparece aquí y el formato se aplica automáticamente.',
      messageLabel: 'Tu mensaje',
      privacyInfo:
        'Usaremos tus datos solo para responder tu contacto, presentar propuestas y dar continuidad a la conversación comercial, conforme a nuestra Política de Privacidad.',
      securityInfo:
        'Este sitio no solicita pagos, descargas, contraseñas, códigos de verificación ni datos bancarios. Este formulario es solo para contacto comercial con NextStage Flow.',
      consentBefore: 'He leído y acepto la ',
      consentLink: 'Política de Privacidad y tratamiento de datos personales',
      consentAfter: ' para enviar este mensaje.',
      cancel: 'Cancelar',
      submit: 'Enviar correo',
      sending: 'Enviando...',
      validation: {
        nameRequired: 'Ingresa tu nombre.',
        emailRequired: 'Ingresa un correo electrónico.',
        emailInvalid: 'Ingresa un correo electrónico válido.',
        whatsappRequired: 'Ingresa un número de WhatsApp.',
        whatsappInvalidCode: 'Ingresa un número válido con código de país.',
        whatsappInvalidCountry: 'Ingresa un número válido para el país seleccionado.',
        messageRequired: 'Escribe tu mensaje.',
      },
    },
    privacy: {
      title: 'Política de Privacidad y LGPD',
      intro:
        'Esta política explica cómo NextStage Flow trata los datos personales enviados a través del formulario de contacto, en conformidad con la Ley General de Protección de Datos Personales de Brasil (LGPD - Ley nº 13.709/2018).',
      sections: [
        {
          title: '1. Datos recopilados',
          body:
            'Podemos recopilar nombre, correo electrónico, teléfono/WhatsApp, mensaje enviado e información técnica necesaria para seguridad y prevención de abuso, como la validación mediante reCAPTCHA.',
        },
        {
          title: '2. Finalidad del tratamiento',
          body:
            'Los datos se utilizan para responder tu contacto, elaborar propuestas, mantener comunicación comercial relacionada con tu solicitud y proteger el formulario contra spam, fraude y uso automatizado indebido.',
        },
        {
          title: '3. Base legal',
          body:
            'El tratamiento se realiza con base en tu consentimiento al enviar el formulario y, cuando corresponda, en interés legítimo para responder solicitudes comerciales y adoptar medidas de seguridad.',
        },
        {
          title: '4. Compartición',
          body:
            'Para operar el formulario, tus datos pueden ser procesados por proveedores contratados por NextStage Flow, como servicios de envío de correo y mecanismos de verificación anti-bot, siempre limitados a la finalidad de este contacto.',
        },
        {
          title: '5. Conservación',
          body:
            'Los datos se conservarán durante el tiempo necesario para atender tu solicitud, gestionar la relación comercial y cumplir obligaciones legales o regulatorias cuando correspondan.',
        },
        {
          title: '6. Tus derechos',
          body:
            'Puedes solicitar confirmación del tratamiento, acceso, corrección, actualización, anonimización, eliminación, portabilidad o revocación del consentimiento, observando las hipótesis legales aplicables.',
        },
        {
          title: '7. Contacto de privacidad',
          body:
            'Para asuntos relacionados con datos personales y privacidad, contáctanos en nextstageflow@gmail.com.',
        },
      ],
      close: 'Cerrar',
    },
    toasts: {
      success: 'Mensaje enviado con éxito a NextStage Flow.',
      cooldown: 'Espera un minuto antes de enviar otro mensaje.',
      review: 'Revisa los campos de correo y WhatsApp antes de enviar.',
      consent:
        'Confirma tu acuerdo con la Política de Privacidad y el tratamiento de datos antes de enviar.',
      emailConfig: 'Configura las claves de EmailJS en el archivo .env para habilitar el envío.',
      recaptchaConfig:
        'Configura la clave de Google reCAPTCHA en el archivo .env para habilitar el envío.',
      captcha: 'Completa el reCAPTCHA antes de enviar el mensaje.',
      error:
        'No fue posible enviar el correo ahora. Revisa las credenciales de EmailJS y vuelve a intentarlo.',
    },
  },
};
const seoContent: Record<Language, SeoConfig> = {
  pt: {
    title: 'NextStage Flow | NextStage, Next Stage, Automacao, Consultoria e Apps',
    description:
      'NextStage Flow, NextStage e Next Stage: consultoria com agilidade, automacao, melhoria de processos, workflows personalizados e criacao de sites e apps para acelerar resultados.',
    keywords:
      'nextstage, next stage, nextstage flow, nextstageflow, consultoria, agilidade, automacao, melhoria de processos, processos, produtividade, criacao de site e apps, site, app, workflow, workflows, personalizacao, workflows personalizados',
  },
  en: {
    title: 'NextStage Flow | NextStage, Next Stage, Consulting, Automation and Apps',
    description:
      'NextStage Flow, NextStage, and Next Stage deliver consulting, agility, automation, process improvement, custom workflows, and website and app development.',
    keywords:
      'nextstage, next stage, nextstage flow, nextstageflow, consulting, agility, automation, process improvement, processes, productivity, website and app creation, website, app, workflow, workflows, customization, custom workflows',
  },
  es: {
    title: 'NextStage Flow | NextStage, Next Stage, Consultoria, Automatizacion y Apps',
    description:
      'NextStage Flow, NextStage y Next Stage ofrecen consultoria con agilidad, automatizacion, mejora de procesos, workflows personalizados y creacion de sitios y apps.',
    keywords:
      'nextstage, next stage, nextstage flow, nextstageflow, consultoria, agilidad, automatizacion, mejora de procesos, procesos, productividad, creacion de sitios y apps, sitio, app, workflow, workflows, personalizacion, workflows personalizados',
  },
};

const faqContent: Record<Language, FaqConfig> = {
  pt: {
    title: 'Perguntas frequentes',
    subtitle: 'Respostas rapidas sobre automacao, n8n, sites, apps e consultoria.',
    items: [
      {
        question: 'Que tipos de automacao e melhoria de processos voces fazem?',
        answer:
          'Fazemos automacao de processos, melhoria de processos, workflows e workflows personalizados com integracoes, CRM, planilhas, documentos, atendimento e tarefas operacionais repetitivas.',
      },
      {
        question: 'Voces criam workflows personalizados e integracoes entre ferramentas?',
        answer:
          'Sim. Criamos workflows personalizados com personalizacao de acordo com sua operacao, integrando WhatsApp, formularios, CRM, planilhas, e-mails e sistemas internos.',
      },
      {
        question: 'A NextStage Flow tambem faz criacao de site e apps?',
        answer:
          'Sim. Alem da consultoria e da automacao, fazemos criacao de site e apps, ferramentas sob medida e solucoes digitais para ganhar produtividade e acelerar resultados.',
      },
      {
        question: 'Como funciona a consultoria agil?',
        answer:
          'Mapeamos processos, priorizamos oportunidades de ganho rapido, desenhamos a solucao e implementamos melhorias praticas com foco em velocidade, eficiencia e resultado de negocio.',
      },
    ],
  },
  en: {
    title: 'Frequently asked questions',
    subtitle: 'Quick answers about automation, n8n, websites, apps, and consulting.',
    items: [
      {
        question: 'What kinds of automation and process improvement do you deliver?',
        answer:
          'We deliver automation, process improvement, workflows, and custom workflows across integrations, CRM, spreadsheets, documents, customer service, and repetitive operations.',
      },
      {
        question: 'Do you build custom workflows and tool integrations?',
        answer:
          'Yes. We build custom workflows and tailored integrations connecting WhatsApp, forms, CRM, spreadsheets, email, and internal systems.',
      },
      {
        question: 'Does NextStage Flow also create websites and apps?',
        answer:
          'Yes. In addition to consulting and automation, we create websites, apps, and tailored digital tools to improve productivity and support business growth.',
      },
      {
        question: 'How does your agile consulting work?',
        answer:
          'We map processes, prioritize fast-win opportunities, design the solution, and implement practical improvements focused on speed, efficiency, and business results.',
      },
    ],
  },
  es: {
    title: 'Preguntas frecuentes',
    subtitle: 'Respuestas rapidas sobre automatizacion, n8n, sitios, apps y consultoria.',
    items: [
      {
        question: 'Que tipo de automatizacion y mejora de procesos realizan?',
        answer:
          'Realizamos automatizacion, mejora de procesos, workflows y workflows personalizados con integraciones, CRM, hojas de calculo, documentos, atencion y tareas operativas repetitivas.',
      },
      {
        question: 'Crean workflows personalizados e integraciones entre herramientas?',
        answer:
          'Si. Creamos workflows personalizados con personalizacion segun tu operacion, integrando WhatsApp, formularios, CRM, hojas de calculo, correo electronico y sistemas internos.',
      },
      {
        question: 'NextStage Flow tambien hace creacion de sitios y apps?',
        answer:
          'Si. Ademas de la consultoria y la automatizacion, creamos sitios, apps y herramientas digitales a medida para aumentar productividad y acelerar resultados.',
      },
      {
        question: 'Como funciona la consultoria agil?',
        answer:
          'Mapeamos procesos, priorizamos oportunidades de resultado rapido, diseniamos la solucion e implementamos mejoras practicas enfocadas en velocidad, eficiencia y resultados de negocio.',
      },
    ],
  },
};

const valueIcons = [<Speed />, <TrendingUp />, <ShowChart />];
const serviceIcons = [
  <Bolt sx={{ fontSize: 48 }} />,
  <TrendingUp sx={{ fontSize: 48 }} />,
  <Computer sx={{ fontSize: 48 }} />,
  <Speed sx={{ fontSize: 48 }} />,
  <Computer sx={{ fontSize: 48 }} />,
  <ShowChart sx={{ fontSize: 48 }} />,
];

const normalizedSiteUrl = SITE_URL.trim().replace(/\/+$/, '');

const getBaseSiteUrl = () => {
  if (/^https?:\/\//i.test(normalizedSiteUrl)) {
    return normalizedSiteUrl;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
};

const buildAssetUrl = (path: string) => {
  const baseSiteUrl = getBaseSiteUrl();
  return baseSiteUrl ? `${baseSiteUrl}${path}` : path;
};

const upsertMetaTag = (attributeName: 'name' | 'property', key: string, value: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attributeName}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
};

const upsertLinkTag = (rel: string, href: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const upsertStructuredData = (id: string, data: unknown) => {
  if (typeof document === 'undefined') {
    return;
  }

  let element = document.head.querySelector<HTMLScriptElement>(`script#${id}`);

  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
};

const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') {
    return 'pt';
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const language of languages) {
    const normalized = language.toLowerCase();

    if (normalized.startsWith('es')) {
      return 'es';
    }

    if (normalized.startsWith('en')) {
      return 'en';
    }

    if (normalized.startsWith('pt')) {
      return 'pt';
    }
  }

  return 'pt';
};

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'pt';
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (stored === 'pt' || stored === 'en' || stored === 'es') {
    return stored;
  }

  return detectBrowserLanguage();
};

const normalizeEmail = (email: string) => email.replace(/\s+/g, '').toLowerCase();

const sanitizeSingleLineInput = (
  value: string,
  maxLength: number,
  options?: { trim?: boolean },
) => {
  const sanitizedValue = value
    .replace(/[<>{}]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[^\S\r\n]+/g, ' ')
    .slice(0, maxLength);

  return options?.trim === false ? sanitizedValue : sanitizedValue.trim();
};

const sanitizeMessageInput = (value: string) =>
  value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, MAX_MESSAGE_LENGTH);

const buildCountryOptions = (language: Language): CountryOption[] => {
  const regionNames =
    typeof Intl !== 'undefined' && typeof Intl.DisplayNames !== 'undefined'
      ? new Intl.DisplayNames([languageToLocale[language], 'en'], { type: 'region' })
      : null;

  return getCountries()
    .map((iso) => {
      const name = regionNames?.of(iso) ?? iso;
      const callingCode = `+${getCountryCallingCode(iso)}`;

      return {
        iso,
        name,
        callingCode,
        label: `${name} (${callingCode})`,
        searchLabel: `${name} ${callingCode} ${iso}`,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, languageToLocale[language]));
};

const getCountryOptionByIso = (iso: string, countryOptions: CountryOption[]) =>
  countryOptions.find((option) => option.iso === iso) ?? countryOptions[0];

const formatWhatsappByCountry = (digits: string, countryIso: string) => {
  const formatter = new AsYouType(countryIso);
  return formatter.input(digits.slice(0, 15));
};

const validateEmail = (email: string, content: (typeof translations)[Language]) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return content.form.validation.emailRequired;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
    return content.form.validation.emailInvalid;
  }

  return '';
};

const validateName = (name: string, content: (typeof translations)[Language]) => {
  if (!sanitizeSingleLineInput(name, MAX_NAME_LENGTH)) {
    return content.form.validation.nameRequired;
  }

  return '';
};

const validateMessage = (message: string, content: (typeof translations)[Language]) => {
  if (!sanitizeMessageInput(message).trim()) {
    return content.form.validation.messageRequired;
  }

  return '';
};

const validateWhatsapp = (
  selectedCountry: CountryOption,
  whatsapp: string,
  content: (typeof translations)[Language],
) => {
  const digits = whatsapp.replace(/\D/g, '');
  const fullInternationalNumber = `${selectedCountry.callingCode}${digits}`;

  if (!digits) {
    return content.form.validation.whatsappRequired;
  }

  if (digits.length < 6 || fullInternationalNumber.replace(/\D/g, '').length > 15) {
    return content.form.validation.whatsappInvalidCode;
  }

  const parsedNumber = parsePhoneNumberFromString(fullInternationalNumber);

  if (!parsedNumber?.isPossible()) {
    return content.form.validation.whatsappInvalidCountry;
  }

  return '';
};

export default function App() {
  const whatsappNumber = '5547992902477';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const linkedinLink = 'https://www.linkedin.com/company/nextstage-flow/';
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>(initialFormErrors);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(() => {
    if (typeof window === 'undefined') {
      return 0;
    }

    return Number(window.localStorage.getItem(CONTACT_FORM_COOLDOWN_KEY) ?? '0');
  });
  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: 'success',
    message: '',
  });

  const content = translations[language];
  const seo = seoContent[language];
  const faq = faqContent[language];
  const countryOptions = buildCountryOptions(language);
  const selectedCountry = getCountryOptionByIso(formState.countryIso, countryOptions);
  const languageOptions: LanguageOption[] = (['pt', 'en', 'es'] as Language[]).map((option) => ({
    value: option,
    label: content.languageNames[option],
    flagSrc: languageFlags[option],
  }));
  const isEmailConfigured =
    isConfiguredEnvValue(EMAILJS_SERVICE_ID, ['your_', 'service_id']) &&
    isConfiguredEnvValue(EMAILJS_TEMPLATE_ID, ['your_', 'template_id']) &&
    isConfiguredEnvValue(EMAILJS_PUBLIC_KEY, ['your_', 'public_key']);
  const isRecaptchaConfigured = isConfiguredEnvValue(RECAPTCHA_SITE_KEY, [
    'your_',
    'site_key',
  ]);
  const isCooldownActive = cooldownUntil > Date.now();

  useEffect(() => {
    document.documentElement.lang = languageToLocale[language];
    document.title = seo.title;

    const currentPageUrl =
      typeof window !== 'undefined' ? window.location.href.split('#')[0] : getBaseSiteUrl() || '/';
    const imageUrl = buildAssetUrl('/og-image.png');
    const baseSiteUrl = getBaseSiteUrl() || currentPageUrl;
    const structuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NextStage Flow',
        url: baseSiteUrl,
        inLanguage: languageToLocale[language],
        description: seo.description,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NextStage Flow',
        alternateName: ['NextStage', 'Next Stage', 'nextstageflow', 'next stage flow'],
        url: baseSiteUrl,
        logo: imageUrl,
        image: imageUrl,
        email: EMAIL_TO,
        sameAs: [linkedinLink],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'NextStage Flow',
        alternateName: ['NextStage', 'Next Stage', 'nextstageflow', 'next stage flow'],
        url: currentPageUrl,
        image: imageUrl,
        logo: imageUrl,
        description: seo.description,
        email: EMAIL_TO,
        telephone: '+55-47-99290-2477',
        areaServed: 'Brazil',
        availableLanguage: ['Portuguese', 'English', 'Spanish'],
        sameAs: [linkedinLink],
        serviceType: content.services.items.map((service) => service.title),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ];

    upsertMetaTag('name', 'description', seo.description);
    upsertMetaTag('name', 'keywords', seo.keywords);
    upsertMetaTag(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    upsertMetaTag(
      'name',
      'googlebot',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    upsertMetaTag('property', 'og:title', seo.title);
    upsertMetaTag('property', 'og:description', seo.description);
    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:site_name', 'NextStage Flow');
    upsertMetaTag('property', 'og:locale', languageToLocale[language].replace('-', '_'));
    upsertMetaTag('property', 'og:url', currentPageUrl);
    upsertMetaTag('property', 'og:image', imageUrl);
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', seo.title);
    upsertMetaTag('name', 'twitter:description', seo.description);
    upsertMetaTag('name', 'twitter:image', imageUrl);
    upsertMetaTag('name', 'twitter:image:alt', 'NextStage Flow');
    upsertMetaTag('name', 'application-name', 'NextStage Flow');
    upsertMetaTag('name', 'apple-mobile-web-app-title', 'NextStage Flow');
    upsertLinkTag('canonical', currentPageUrl);
    upsertStructuredData('nextstageflow-structured-data', structuredData);
  }, [content.services.items, faq.items, language, linkedinLink, seo]);

  const showToast = (severity: ToastState['severity'], message: string) => {
    setToast({ open: true, severity, message });
  };

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  };

  const handleLanguageChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const nextLanguage = event.target.value as Language;
    changeLanguage(nextLanguage);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeContactModal = () => {
    if (isSending) {
      return;
    }

    setIsContactModalOpen(false);
    setCaptchaToken('');
    setFormErrors(initialFormErrors);
    recaptchaRef.current?.reset();
  };

  const openPrivacyModal = () => {
    setIsPrivacyModalOpen(true);
  };

  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  const handleFieldChange =
    (field: keyof ContactFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      if (field === 'email') {
        const nextEmail = normalizeEmail(value);

        setFormState((current) => ({
          ...current,
          email: nextEmail,
        }));

        setFormErrors((current) => ({
          ...current,
          email: nextEmail ? validateEmail(nextEmail, content) : '',
        }));

        return;
      }

      if (field === 'whatsapp') {
        const nextWhatsapp = formatWhatsappByCountry(
          value.replace(/\D/g, ''),
          formState.countryIso,
        );

        setFormState((current) => ({
          ...current,
          whatsapp: nextWhatsapp,
        }));

        setFormErrors((current) => ({
          ...current,
          whatsapp: nextWhatsapp ? validateWhatsapp(selectedCountry, nextWhatsapp, content) : '',
        }));

        return;
      }

      if (field === 'nome') {
        const nextName = sanitizeSingleLineInput(value, MAX_NAME_LENGTH, { trim: false });

        setFormState((current) => ({
          ...current,
          nome: nextName,
        }));

        setFormErrors((current) => ({
          ...current,
          nome: nextName ? validateName(nextName, content) : '',
        }));

        return;
      }

      if (field === 'mensagem') {
        const nextMessage = sanitizeMessageInput(value);

        setFormState((current) => ({
          ...current,
          mensagem: nextMessage,
        }));

        setFormErrors((current) => ({
          ...current,
          mensagem: nextMessage ? validateMessage(nextMessage, content) : '',
        }));

        return;
      }

      setFormState((current) => ({
        ...current,
        [field]: value,
      }));
    };

  const handleConsentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((current) => ({
      ...current,
      lgpdConsent: event.target.checked,
    }));
  };

  const handleCountryChange = (_event: SyntheticEvent, nextCountry: CountryOption | null) => {
    const nextCountryIso = nextCountry?.iso ?? 'BR';
    const reformattedWhatsapp = formatWhatsappByCountry(
      formState.whatsapp.replace(/\D/g, ''),
      nextCountryIso,
    );
    const nextCountryOption = getCountryOptionByIso(nextCountryIso, countryOptions);

    setFormState((current) => ({
      ...current,
      countryIso: nextCountryIso,
      whatsapp: reformattedWhatsapp,
    }));

    setFormErrors((current) => ({
      ...current,
      whatsapp: reformattedWhatsapp
        ? validateWhatsapp(nextCountryOption, reformattedWhatsapp, content)
        : '',
    }));
  };

  const validateContactForm = () => {
    const nextErrors: ContactFormErrors = {
      nome: validateName(formState.nome, content),
      email: validateEmail(formState.email, content),
      whatsapp: validateWhatsapp(selectedCountry, formState.whatsapp, content),
      mensagem: validateMessage(formState.mensagem, content),
    };

    setFormErrors(nextErrors);

    return !nextErrors.nome && !nextErrors.email && !nextErrors.whatsapp && !nextErrors.mensagem;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCooldownActive) {
      showToast('warning', content.toasts.cooldown);
      return;
    }

    if (!validateContactForm()) {
      showToast('warning', content.toasts.review);
      return;
    }

    if (!formState.lgpdConsent) {
      showToast('warning', content.toasts.consent);
      return;
    }

    if (!isEmailConfigured) {
      showToast('error', content.toasts.emailConfig);
      return;
    }

    if (!isRecaptchaConfigured) {
      showToast('error', content.toasts.recaptchaConfig);
      return;
    }

    if (!captchaToken) {
      showToast('warning', content.toasts.captcha);
      return;
    }

    setIsSending(true);

    try {
      const sanitizedPayload = {
        nome: sanitizeSingleLineInput(formState.nome, MAX_NAME_LENGTH),
        email: normalizeEmail(formState.email).slice(0, MAX_EMAIL_LENGTH),
        whatsapp: `${selectedCountry.callingCode} ${formState.whatsapp}`
          .trim()
          .slice(0, MAX_WHATSAPP_LENGTH),
        mensagem: sanitizeMessageInput(formState.mensagem).trim(),
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          nome: sanitizedPayload.nome,
          email: sanitizedPayload.email,
          whatsapp: sanitizedPayload.whatsapp,
          mensagem: sanitizedPayload.mensagem,
          reply_to: sanitizedPayload.email,
          lgpd_consent: 'Yes',
          lgpd_consent_timestamp: new Date().toISOString(),
          language,
          source_email: EMAIL_TO,
          destination_email: EMAIL_TO,
          'g-recaptcha-response': captchaToken,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        },
      );

      const nextCooldownUntil = Date.now() + SUBMISSION_COOLDOWN_MS;

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CONTACT_FORM_COOLDOWN_KEY, String(nextCooldownUntil));
      }

      setFormState(initialFormState);
      setFormErrors(initialFormErrors);
      setCaptchaToken('');
      setCooldownUntil(nextCooldownUntil);
      recaptchaRef.current?.reset();
      setIsContactModalOpen(false);
      showToast('success', content.toasts.success);
    } catch (error) {
      console.error('Email sending failed', error);
      showToast('error', content.toasts.error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
          textAlign: 'center',
          overflowX: 'hidden',
          '& .MuiTypography-root': {
            maxWidth: { xs: 'calc(100vw - 32px)', md: '100%' },
            overflowWrap: 'anywhere',
            mx: 'auto',
          },
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
          }}
        >
          <Toolbar
            sx={{
              py: { xs: 1.25, md: 1 },
              px: { xs: 2, sm: 3 },
              gap: { xs: 1.25, md: 2 },
              flexWrap: { xs: 'nowrap', md: 'nowrap' },
              alignItems: 'center',
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0, textAlign: 'left' }}>
              <img
                src={logo}
                alt="NextStage Flow"
                style={{ height: '48px', borderRadius: '30px' }}
              />
            </Box>
            <Stack
              direction="row"
              spacing={4}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Button color="inherit" href="#sobre">
                {content.nav.about}
              </Button>
              <Button color="inherit" href="#servicos">
                {content.nav.services}
              </Button>
              <Button color="inherit" href="#contato">
                {content.nav.contact}
              </Button>
            </Stack>
            <TextField
              select
              size="small"
              label={content.nav.language}
              value={language}
              onChange={handleLanguageChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                display: { xs: 'none', md: 'block' },
                minWidth: 190,
                maxWidth: 220,
                '& .MuiInputBase-root': {
                  color: 'text.primary',
                  backgroundColor: 'rgba(15, 23, 42, 0.22)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.16)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'text.primary',
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiInputLabel-shrink': {
                  px: 0.75,
                  backgroundColor: 'rgba(30, 27, 75, 0.95)',
                  borderRadius: 1,
                },
              }}
              SelectProps={{
                renderValue: (selected) => {
                  const selectedOption = languageOptions.find(
                    (option) => option.value === selected,
                  );

                  return selectedOption
                    ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            component="img"
                            src={selectedOption.flagSrc}
                            alt={selectedOption.label}
                            sx={{ width: 18, height: 13, borderRadius: '2px', objectFit: 'cover' }}
                          />
                          <Box component="span">{selectedOption.label}</Box>
                        </Box>
                      )
                    : selected;
                },
              }}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={option.flagSrc}
                      alt={option.label}
                      sx={{ width: 18, height: 13, borderRadius: '2px', objectFit: 'cover' }}
                    />
                    <Box component="span">{option.label}</Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              sx={{
                ml: 2,
                display: { xs: 'none', md: 'inline-flex' },
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(to right, #f97316, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(to right, #ea580c, #9333ea)',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                },
              }}
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {content.hero.headerButton}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                {content.hero.headerButtonMobile}
              </Box>
            </Button>
            <IconButton
              color="inherit"
              onClick={openMobileMenu}
              aria-label="Open navigation menu"
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                border: '1px solid rgba(168, 85, 247, 0.3)',
                backgroundColor: 'rgba(15, 23, 42, 0.32)',
              }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="right"
          open={isMobileMenuOpen}
          onClose={closeMobileMenu}
          PaperProps={{
            sx: {
              width: 'min(84vw, 320px)',
              background:
                'linear-gradient(to bottom right, rgba(15, 23, 42, 0.98), rgba(88, 28, 135, 0.98))',
              color: 'text.primary',
              borderLeft: '1px solid rgba(168, 85, 247, 0.28)',
            },
          }}
        >
          <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box component="img" src={logo} alt="NextStage Flow" sx={{ height: 38, width: 'auto' }} />
            <IconButton color="inherit" onClick={closeMobileMenu} aria-label="Close navigation menu">
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
          <List sx={{ px: 1.5, py: 1.5 }}>
            <ListItemButton component="a" href="#sobre" onClick={closeMobileMenu} sx={{ borderRadius: 3 }}>
              <ListItemText primary={content.nav.about} />
            </ListItemButton>
            <ListItemButton component="a" href="#servicos" onClick={closeMobileMenu} sx={{ borderRadius: 3 }}>
              <ListItemText primary={content.nav.services} />
            </ListItemButton>
            <ListItemButton component="a" href="#contato" onClick={closeMobileMenu} sx={{ borderRadius: 3 }}>
              <ListItemText primary={content.nav.contact} />
            </ListItemButton>
          </List>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
          <Box sx={{ p: 2.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label={content.nav.language}
              value={language}
              onChange={handleLanguageChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 2.5,
                '& .MuiInputBase-root': {
                  color: 'text.primary',
                  backgroundColor: 'rgba(15, 23, 42, 0.22)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.16)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'text.primary',
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiInputLabel-shrink': {
                  px: 0.75,
                  backgroundColor: 'rgba(30, 27, 75, 0.95)',
                  borderRadius: 1,
                },
              }}
              SelectProps={{
                renderValue: (selected) => {
                  const selectedOption = languageOptions.find(
                    (option) => option.value === selected,
                  );

                  return selectedOption
                    ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            component="img"
                            src={selectedOption.flagSrc}
                            alt={selectedOption.label}
                            sx={{ width: 18, height: 13, borderRadius: '2px', objectFit: 'cover' }}
                          />
                          <Box component="span">{selectedOption.label}</Box>
                        </Box>
                      )
                    : selected;
                },
              }}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={option.flagSrc}
                      alt={option.label}
                      sx={{ width: 18, height: 13, borderRadius: '2px', objectFit: 'cover' }}
                    />
                    <Box component="span">{option.label}</Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              fullWidth
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeMobileMenu}
              sx={{
                py: 1.4,
                background: 'linear-gradient(to right, #f97316, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(to right, #ea580c, #9333ea)',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                },
              }}
            >
              {content.hero.headerButton}
            </Button>
          </Box>
        </Drawer>

        <Box component="main">
        <Box sx={{ pt: { xs: 24, sm: 20, md: 16 }, pb: { xs: 8, md: 10 } }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: 'md', mx: 'auto', textAlign: 'center' }}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  maxWidth: '100%',
                  overflowWrap: 'break-word',
                }}
              >
                {content.hero.titleLine1}{' '}
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(to right, #f97316, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {content.hero.titleHighlight}
                </Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                {content.hero.body}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ '& > *': { width: { xs: '100%', sm: 'auto' } } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(to right, #f97316, #a855f7)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #ea580c, #9333ea)',
                      boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
                    },
                  }}
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.hero.primaryButton}
                </Button>
                <Button variant="outlined" size="large" color="primary" href="#servicos">
                  {content.hero.secondaryButton}
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>

        <Box component="section" sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'rgba(30, 27, 75, 0.3)' }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 4,
                justifyItems: 'stretch',
              }}
            >
              {content.values.map((value, index) => (
                <Box key={value.title} sx={{ minWidth: 0 }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: 3,
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      transition: 'all 0.3s',
                      textAlign: 'center',
                      '&:hover': {
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Stack direction="column" spacing={2} alignItems="center">
                      <Box sx={{ color: 'secondary.main', mt: 0.5 }}>{valueIcons[index]}</Box>
                      <Box>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {value.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {value.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="section" id="sobre" aria-labelledby="about-heading" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography id="about-heading" variant="h2" component="h2" gutterBottom sx={{ mb: 4 }}>
                {content.about.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {content.about.paragraph1Before}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {content.about.paragraph1Highlight}
                </Box>
                {content.about.paragraph1After}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {content.about.paragraph2}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mt: 4,
                  background: 'linear-gradient(to right, #f97316, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                }}
              >
                {content.about.highlight}
              </Typography>
            </Box>
          </Container>
        </Box>

        <Box
          component="section"
          id="servicos"
          aria-labelledby="services-heading"
          sx={{ py: { xs: 7, md: 10 }, backgroundColor: 'rgba(30, 27, 75, 0.3)' }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography id="services-heading" variant="h2" component="h2" gutterBottom>
                {content.services.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {content.services.subtitle}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 4,
                alignItems: 'stretch',
              }}
            >
              {content.services.items.map((service, index) => (
                <Box key={service.title} sx={{ minWidth: 0 }}>
                  <Card
                    elevation={4}
                    sx={{
                      height: '100%',
                      p: 2,
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                      '&:hover': {
                        border: '1px solid rgba(168, 85, 247, 0.6)',
                        boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)',
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ color: 'secondary.main', mb: 2 }}>{serviceIcons[index]}</Box>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
            <Paper
              sx={{
                mt: 6,
                p: 4,
                background:
                  'linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.1))',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: 3,
              }}
            >
              <Typography variant="body1" color="text.secondary" align="center">
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {content.services.processesLead}
                </Box>{' '}
                {content.services.processes}
              </Typography>
            </Paper>
          </Container>
        </Box>

        <Box component="section" id="faq" aria-labelledby="faq-heading" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography id="faq-heading" variant="h2" component="h2" gutterBottom>
                {faq.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {faq.subtitle}
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {faq.items.map((item) => (
                <Accordion
                  key={item.question}
                  disableGutters
                  sx={{
                    backgroundColor: 'rgba(15, 23, 42, 0.72)',
                    border: '1px solid rgba(168, 85, 247, 0.22)',
                    borderRadius: '16px !important',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'text.secondary' }} />}>
                    <Typography variant="h6" component="h3" sx={{ textAlign: 'left' }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left' }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="section" id="contato" aria-labelledby="contact-heading" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography id="contact-heading" variant="h2" component="h2" gutterBottom>
                {content.contact.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {content.contact.subtitle}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 4,
                justifyItems: 'stretch',
                alignItems: 'stretch',
                maxWidth: { xs: '100%', md: 1100 },
                width: '100%',
                mx: 'auto',
              }}
            >
              <Box sx={{ minWidth: 0, width: '100%' }}>
                <Card
                  elevation={3}
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: { xs: 180, md: 220 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    color: 'inherit',
                    '&:hover': {
                      border: '1px solid rgba(34, 197, 94, 0.6)',
                      boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)',
                    },
                    textDecoration: 'none',
                  }}
                  component="a"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        mb: 2,
                      }}
                    >
                      <WhatsApp sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {content.contact.whatsapp}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (47) 99290-2477
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ minWidth: 0, width: '100%' }}>
                <Card
                  elevation={3}
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: { xs: 180, md: 220 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    color: 'inherit',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    '&:hover': {
                      border: '1px solid rgba(249, 115, 22, 0.6)',
                      boxShadow: '0 10px 30px rgba(249, 115, 22, 0.2)',
                    },
                    textDecoration: 'none',
                  }}
                  component="button"
                  onClick={openContactModal}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        color: 'secondary.main',
                        mb: 2,
                      }}
                    >
                      <Email sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {content.contact.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {EMAIL_TO}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ minWidth: 0, width: '100%' }}>
                <Card
                  elevation={3}
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: { xs: 180, md: 220 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    color: 'inherit',
                    '&:hover': {
                      border: '1px solid rgba(59, 130, 246, 0.6)',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
                    },
                    textDecoration: 'none',
                  }}
                  component="a"
                  href={linkedinLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        mb: 2,
                      }}
                    >
                      <LinkedIn sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {content.contact.linkedin}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {content.contact.linkedinName}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Container>
        </Box>
        </Box>

        <Box
          sx={{
            py: 6,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid rgba(168, 85, 247, 0.2)',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 4,
                alignItems: 'center',
                justifyItems: 'center',
              }}
            >
              <Box sx={{ width: '100%', minWidth: 0, textAlign: 'center' }}>
                <img
                  src={logo}
                  alt="NextStage Flow"
                  style={{ height: '40px', borderRadius: '30px' }}
                />
              </Box>
              <Box sx={{ width: '100%', minWidth: 0, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {content.footer.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {content.footer.founded}
                </Typography>
                <Link
                  component="button"
                  type="button"
                  onClick={openPrivacyModal}
                  underline="hover"
                  color="secondary.light"
                  sx={{ mt: 1.5, display: 'inline-block', fontSize: '0.875rem' }}
                >
                  {content.nav.privacy}
                </Link>
              </Box>
              <Box sx={{ width: '100%', minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: 'center', flexWrap: 'wrap' }}
                >
                  <IconButton
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      backgroundColor: 'rgba(30, 27, 75, 0.8)',
                      color: '#22c55e',
                      '&:hover': { backgroundColor: 'rgba(30, 27, 75, 1)' },
                    }}
                  >
                    <Phone />
                  </IconButton>
                  <IconButton
                    onClick={openContactModal}
                    sx={{
                      backgroundColor: 'rgba(30, 27, 75, 0.8)',
                      color: 'secondary.main',
                      '&:hover': { backgroundColor: 'rgba(30, 27, 75, 1)' },
                    }}
                  >
                    <Email />
                  </IconButton>
                  <IconButton
                    href={linkedinLink}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      backgroundColor: 'rgba(30, 27, 75, 0.8)',
                      color: '#3b82f6',
                      '&:hover': { backgroundColor: 'rgba(30, 27, 75, 1)' },
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
            <Box
              sx={{
                mt: 4,
                pt: 4,
                borderTop: '1px solid rgba(71, 85, 105, 0.3)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {content.footer.copyright}
              </Typography>
            </Box>
          </Container>
        </Box>

        <Dialog
          open={isContactModalOpen}
          onClose={closeContactModal}
          fullWidth
          maxWidth="sm"
          fullScreen={isMobile}
          scroll="paper"
          PaperProps={{
            sx: {
              backgroundImage:
                'linear-gradient(to bottom right, rgba(30, 27, 75, 0.98), rgba(88, 28, 135, 0.98))',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: { xs: 0, sm: 4 },
              m: { xs: 0, sm: 2 },
              minHeight: { xs: '100dvh', sm: 'auto' },
              maxHeight: { xs: '100dvh', sm: 'calc(100dvh - 32px)' },
              display: 'flex',
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
            }}
          >
            <DialogTitle
              sx={{
                px: { xs: 2, sm: 3 },
                pt: { xs: 2.25, sm: 3 },
                pb: 1.5,
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: 'rgba(66, 31, 115, 0.96)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {content.form.title}
            </DialogTitle>
            <DialogContent
              sx={{
                pt: '8px !important',
                px: { xs: 2, sm: 3 },
                pb: 2,
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <Stack spacing={2.5}>
                {!isEmailConfigured && (
                  <Alert severity="warning" sx={{ textAlign: 'left' }}>
                    {content.form.emailConfigWarning}
                  </Alert>
                )}

                {!isRecaptchaConfigured && (
                  <Alert severity="warning" sx={{ textAlign: 'left' }}>
                    {content.form.recaptchaWarning}
                  </Alert>
                )}

                <TextField
                  label={content.form.nameLabel}
                  value={formState.nome}
                  onChange={handleFieldChange('nome')}
                  onBlur={() =>
                    setFormErrors((current) => ({
                      ...current,
                      nome: validateName(formState.nome, content),
                    }))
                  }
                  required
                  fullWidth
                  inputProps={{ maxLength: MAX_NAME_LENGTH }}
                  error={Boolean(formErrors.nome)}
                  helperText={formErrors.nome || ' '}
                />
                <TextField
                  label={content.form.emailLabel}
                  type="email"
                  value={formState.email}
                  onChange={handleFieldChange('email')}
                  onBlur={() =>
                    setFormErrors((current) => ({
                      ...current,
                      email: validateEmail(formState.email, content),
                    }))
                  }
                  required
                  fullWidth
                  placeholder={content.form.emailPlaceholder}
                  inputProps={{
                    autoCapitalize: 'none',
                    autoCorrect: 'off',
                    inputMode: 'email',
                    maxLength: MAX_EMAIL_LENGTH,
                  }}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email || content.form.emailHelper}
                />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'minmax(210px, 0.95fr) minmax(0, 1.35fr)',
                    },
                    gap: 2,
                    alignItems: 'start',
                  }}
                >
                  <Autocomplete
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    autoHighlight
                    fullWidth
                    isOptionEqualToValue={(option, value) => option.iso === value.iso}
                    getOptionLabel={(option) => option.label}
                    filterOptions={(options, state) => {
                      const query = state.inputValue.trim().toLowerCase();

                      if (!query) {
                        return options;
                      }

                      return options.filter((option) =>
                        option.searchLabel.toLowerCase().includes(query),
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={content.form.countryLabel}
                        placeholder={content.form.countryPlaceholder}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.name} ({option.callingCode})
                      </Box>
                    )}
                  />
                  <TextField
                    label={content.form.whatsappLabel}
                    value={formState.whatsapp}
                    onChange={handleFieldChange('whatsapp')}
                    onBlur={() =>
                      setFormErrors((current) => ({
                        ...current,
                        whatsapp: validateWhatsapp(selectedCountry, formState.whatsapp, content),
                      }))
                    }
                    required
                    fullWidth
                    placeholder={
                      selectedCountry.iso === 'BR' ? '(47) 99999-9999' : '123 456 7890'
                    }
                    inputProps={{
                      inputMode: 'tel',
                      maxLength: MAX_WHATSAPP_LENGTH,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {selectedCountry.callingCode}
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(formErrors.whatsapp)}
                    helperText={formErrors.whatsapp || content.form.whatsappHelper}
                  />
                </Box>
                <TextField
                  label={content.form.messageLabel}
                  value={formState.mensagem}
                  onChange={handleFieldChange('mensagem')}
                  onBlur={() =>
                    setFormErrors((current) => ({
                      ...current,
                      mensagem: validateMessage(formState.mensagem, content),
                    }))
                  }
                  required
                  fullWidth
                  multiline
                  minRows={5}
                  inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
                  error={Boolean(formErrors.mensagem)}
                  helperText={
                    formErrors.mensagem || `${formState.mensagem.length}/${MAX_MESSAGE_LENGTH}`
                  }
                />
                <Alert severity="info" sx={{ textAlign: 'left' }}>
                  {content.form.privacyInfo}
                </Alert>
                <Alert severity="info" sx={{ textAlign: 'left' }}>
                  {content.form.securityInfo}
                </Alert>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formState.lgpdConsent}
                      onChange={handleConsentChange}
                      color="secondary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      {content.form.consentBefore}
                      <Link
                        component="button"
                        type="button"
                        onClick={openPrivacyModal}
                        underline="hover"
                        color="secondary.light"
                      >
                        {content.form.consentLink}
                      </Link>
                      {content.form.consentAfter}
                    </Typography>
                  }
                  sx={{
                    alignItems: 'flex-start',
                    ml: 0,
                    '& .MuiFormControlLabel-label': { mt: 0.6 },
                  }}
                />

                {isRecaptchaConfigured && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) => setCaptchaToken(token ?? '')}
                      onExpired={() => setCaptchaToken('')}
                    />
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                px: { xs: 2, sm: 3 },
                pb: { xs: 2.5, sm: 3 },
                pt: 1.5,
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                gap: 1,
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'rgba(38, 20, 72, 0.96)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                '& > *': { width: { xs: '100%', sm: 'auto' }, ml: '0 !important' },
              }}
            >
              <Button onClick={closeContactModal} disabled={isSending} color="inherit">
                {content.form.cancel}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  isSending ||
                  isCooldownActive ||
                  !isEmailConfigured ||
                  !isRecaptchaConfigured ||
                  !captchaToken ||
                  !formState.lgpdConsent
                }
                sx={{
                  minWidth: 190,
                  background: 'linear-gradient(to right, #f97316, #a855f7)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #ea580c, #9333ea)',
                  },
                }}
              >
                {isSending ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} color="inherit" />
                    <span>{content.form.sending}</span>
                  </Stack>
                ) : (
                  content.form.submit
                )}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Dialog
          open={isPrivacyModalOpen}
          onClose={closePrivacyModal}
          fullWidth
          maxWidth="md"
          fullScreen={isMobile}
          scroll="paper"
          PaperProps={{
            sx: {
              backgroundImage:
                'linear-gradient(to bottom right, rgba(15, 23, 42, 0.98), rgba(30, 27, 75, 0.98))',
              border: '1px solid rgba(168, 85, 247, 0.28)',
              borderRadius: { xs: 0, sm: 4 },
              m: { xs: 0, sm: 2 },
              minHeight: { xs: '100dvh', sm: 'auto' },
              maxHeight: { xs: '100dvh', sm: 'calc(100dvh - 32px)' },
              display: 'flex',
            },
          }}
        >
          <DialogTitle
            sx={{
              px: { xs: 2, sm: 3 },
              pt: { xs: 2.25, sm: 3 },
              pb: 1.5,
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'rgba(18, 26, 56, 0.96)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {content.privacy.title}
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              borderColor: 'rgba(148, 163, 184, 0.18)',
              px: { xs: 2, sm: 3 },
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary">
                {content.privacy.intro}
              </Typography>
              {content.privacy.sections.map((section) => (
                <Box key={section.title}>
                  <Typography variant="h6" gutterBottom>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.body}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              px: { xs: 2, sm: 3 },
              pb: { xs: 2.5, sm: 3 },
              pt: 1.5,
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'rgba(18, 26, 56, 0.96)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              '& > *': { width: { xs: '100%', sm: 'auto' }, ml: '0 !important' },
            }}
          >
            <Button onClick={closePrivacyModal} variant="contained" color="secondary">
              {content.privacy.close}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={toast.open}
          autoHideDuration={5000}
          onClose={() => setToast((current) => ({ ...current, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast((current) => ({ ...current, open: false }))}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}


