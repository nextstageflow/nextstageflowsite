import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Paper,
  Stack
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
  WhatsApp
} from '@mui/icons-material';
import logo from '../imports/Logo_NextStage_Flow_Clean.png';
import logo2 from '../imports/Logo_NextStage_Flow.png';

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
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
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

export default function App() {
  const whatsappNumber = '5547992902477';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const emailLink = 'mailto:nextstageflow@gmail.com';
  const linkedinLink = 'https://www.linkedin.com/company/nextstage-flow/';

  const services = [
    {
      icon: <Bolt sx={{ fontSize: 48 }} />,
      title: 'Automação Inteligente',
      description: 'Eliminamos tarefas manuais e repetitivas através de automações personalizadas que economizam tempo e reduzem erros.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48 }} />,
      title: 'Aumento de Eficiência',
      description: 'Otimizamos processos operacionais, administrativos e financeiros para maximizar produtividade e resultados.'
    },
    {
      icon: <Computer sx={{ fontSize: 48 }} />,
      title: 'Workflows Personalizados',
      description: 'Criamos sistemas e fluxos de trabalho sob medida que transformam operações complexas em processos simples e automatizados.'
    }
  ];

  const values = [
    {
      icon: <Speed />,
      title: 'Automatização Total',
      description: 'Eliminamos tarefas manuais e processos repetitivos'
    },
    {
      icon: <TrendingUp />,
      title: 'Máxima Eficiência',
      description: 'Reduzimos tempo, custos e erros operacionais'
    },
    {
      icon: <ShowChart />,
      title: 'Ganho de Produtividade',
      description: 'Sua equipe focada em atividades estratégicas'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
      }}>
        {/* Header */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <img src={logo} alt="NextStage Flow" style={{ height: '48px' }} />
            </Box>
            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" href="#sobre">Sobre</Button>
              <Button color="inherit" href="#servicos">Serviços</Button>
              <Button color="inherit" href="#contato">Contato</Button>
            </Stack>
            <Button
              variant="contained"
              sx={{
                ml: 2,
                background: 'linear-gradient(to right, #f97316, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(to right, #ea580c, #9333ea)',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                }
              }}
              href={whatsappLink}
              target="_blank"
            >
              Iniciar Automação
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box sx={{ pt: 16, pb: 10 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  Automatize processos e{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(to right, #f97316, #a855f7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    elimine trabalho manual
                  </Box>
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Transformamos tarefas repetitivas em processos automatizados. Aumentamos a eficiência,
                  reduzimos custos operacionais e liberamos sua equipe para focar no que realmente importa.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: 'linear-gradient(to right, #f97316, #a855f7)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #ea580c, #9333ea)',
                        boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
                      }
                    }}
                    href={whatsappLink}
                    target="_blank"
                  >
                    Automatizar Processos
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    href="#servicos"
                  >
                    Ver Soluções
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, #f97316, #a855f7)',
                      borderRadius: 4,
                      filter: 'blur(60px)',
                      opacity: 0.2,
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={logo2}
                    alt="NextStage Flow"
                    sx={{
                      width: '100%',
                      borderRadius: 4,
                      position: 'relative',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Values Section */}
        <Box sx={{ py: 8, backgroundColor: 'rgba(30, 27, 75, 0.3)' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: 3,
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box sx={{ color: 'secondary.main', mt: 0.5 }}>
                        {value.icon}
                      </Box>
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          {value.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {value.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* About Section */}
        <Box id="sobre" sx={{ py: 10 }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
                Pare de Perder Tempo com Tarefas Manuais
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Nossa missão é <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                eliminar o trabalho manual repetitivo</Box> que consome o tempo valioso da sua equipe.
                Implementamos automações inteligentes que transformam processos complexos em fluxos simples,
                rápidos e livres de erros.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Seja na entrada de dados, geração de relatórios, envio de comunicações, processamento de documentos
                ou integração entre sistemas — criamos soluções personalizadas que aumentam drasticamente a eficiência
                operacional e liberam sua equipe para focar em atividades estratégicas de alto valor.
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
                Menos trabalho manual. Mais resultados. Máxima eficiência.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Services Section */}
        <Box id="servicos" sx={{ py: 10, backgroundColor: 'rgba(30, 27, 75, 0.3)' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" gutterBottom>
                Como Automatizamos Seu Negócio
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Soluções que eliminam processos manuais e multiplicam sua produtividade
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {services.map((service, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    elevation={4}
                    sx={{
                      height: '100%',
                      p: 2,
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        border: '1px solid rgba(168, 85, 247, 0.6)',
                        boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)',
                        transform: 'translateY(-8px)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ color: 'secondary.main', mb: 2 }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Paper
              sx={{
                mt: 6,
                p: 4,
                background: 'linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(168, 85, 247, 0.1))',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: 3,
              }}
            >
              <Typography variant="body1" color="text.secondary" align="center">
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Processos que automatizamos:
                </Box>{' '}
                Entrada e processamento de dados | Geração automática de relatórios |
                Integração entre sistemas | Gestão de documentos | Fluxos de aprovação |
                Comunicação automatizada | Tarefas administrativas e financeiras
              </Typography>
            </Paper>
          </Container>
        </Box>

        {/* Contact Section */}
        <Box id="contato" sx={{ py: 10 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" gutterBottom>
                Pronto para Automatizar?
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Vamos identificar quais processos manuais podemos eliminar na sua empresa
              </Typography>
            </Box>
            <Grid container spacing={4} sx={{ maxWidth: 'md', mx: 'auto' }}>
              <Grid item xs={12} md={4}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '1px solid rgba(34, 197, 94, 0.6)',
                      boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)',
                    }
                  }}
                  component="a"
                  href={whatsappLink}
                  target="_blank"
                  sx={{ textDecoration: 'none' }}
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
                    <Typography variant="h5" gutterBottom>
                      WhatsApp
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (47) 99290-2477
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '1px solid rgba(249, 115, 22, 0.6)',
                      boxShadow: '0 10px 30px rgba(249, 115, 22, 0.2)',
                    }
                  }}
                  component="a"
                  href={emailLink}
                  sx={{ textDecoration: 'none' }}
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
                    <Typography variant="h5" gutterBottom>
                      E-mail
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      nextstageflow@gmail.com
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '1px solid rgba(59, 130, 246, 0.6)',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
                    }
                  }}
                  component="a"
                  href={linkedinLink}
                  target="_blank"
                  sx={{ textDecoration: 'none' }}
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
                    <Typography variant="h5" gutterBottom>
                      LinkedIn
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      NextStage Flow
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 6,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid rgba(168, 85, 247, 0.2)',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <img src={logo} alt="NextStage Flow" style={{ height: '40px' }} />
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                <Typography variant="body2" color="text.secondary">
                  Consultoria em tecnologia e automação de processos
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Fundada em 2025 | NextStage Flow
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
                >
                  <IconButton
                    href={whatsappLink}
                    target="_blank"
                    sx={{
                      backgroundColor: 'rgba(30, 27, 75, 0.8)',
                      color: '#22c55e',
                      '&:hover': { backgroundColor: 'rgba(30, 27, 75, 1)' }
                    }}
                  >
                    <Phone />
                  </IconButton>
                  <IconButton
                    href={emailLink}
                    sx={{
                      backgroundColor: 'rgba(30, 27, 75, 0.8)',
                      color: 'secondary.main',
                      '&:hover': { backgroundColor: 'rgba(30, 27, 75, 1)' }
                    }}
                  >
                    <Email />
                  </IconButton>
                  <IconButton
                    href={linkedinLink}
                    target="_blank"
                    sx={{
                      backgroundColor: 'rgba(30, 27, 75, 0.8)',
                      color: '#3b82f6',
                      '&:hover': { backgroundColor: 'rgba(30, 27, 75, 1)' }
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(71, 85, 105, 0.3)', textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                © 2025 NextStage Flow. Todos os direitos reservados.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
