# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando seu e-mail;
- O usuário deve receber um e-mail com instruções para recuperar a senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar envio de e-mail em desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mail deve acontecer em segundo plano (background job);

**RN**

- O link enviado por e-mail para resetar senha, deve expirar em 2h;
- O usuário precisa digitar uma confirmação da nova senha;

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, email e senha;

**RN**

- O usuário não pode alterar seu e-mail para e-mail já em uso;
- Para atualizar sua senha, o usuário deve informar a senha atual;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos por dia;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida/não lida para controlar a visualização;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos prestadores de serviço cadastrados;
- O usuário deve poder listar os dias disponíveis na agenda de um prestador;
- O usuário deve poder listar os horários disponíveis de um dia na agenda de um prestador;
- O usuário deve poder agendar um horário com um prestador;

**RNF**

- A lista de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve dura 1h exatamente;
- Os agendamentos devem ser das 8h às 18h;
- O usuário não pode agendar em um horário já reservado;
- O usuário não pode agendar em uma data e hora passadas;
- O usuário não pode agendar serviços com ele mesmo;
