# 💡 QuizApp - Juego de Preguntas y Respuestas

**QuizApp** es mi proyecto final de 2º de DAM. Es una plataforma completa para jugar a trivias que funciona tanto en la **web** como en el **móvil**, conectada a un servidor central que gestiona todo.

---

## 🚀 ¿Qué hace especial a este proyecto?

Lo más importante es que el sistema es "inteligente" y utiliza dos tipos de bases de datos a la vez para aprovechar lo mejor de cada una:
1.  **MySQL:** Para guardar lo que no puede fallar, como tus datos de usuario, tu contraseña (encriptada) y tu historial de partidas.
2.  **MongoDB:** Para guardar las preguntas, ya que permite que sean variadas (unas de sí/no, otras de varias opciones) de forma muy flexible.

---

## 🛠️ Tecnologías que he usado

* **Backend (El cerebro):** Hecho con **Spring Boot**. Es el encargado de validar quién eres, corregir las preguntas y conectar con las bases de datos.
* **Seguridad:** Uso **JWT (Tokens)**. Es como un carnet de identidad digital: cuando haces login, el servidor te da un código y React lo usa para demostrar quién eres en cada clic.
* **Frontend Web:** Creado con **React**. Es la parte visual donde los usuarios juegan y los administradores gestionan las preguntas.
* **App Móvil:** Creada con **React Native** para que puedas jugar desde cualquier teléfono.
* **Música:** Conexión con la API de **Jamendo** para que suene música mientras juegas.

---

## 🎮 Cómo funciona el flujo del juego

Para que el sistema sea seguro y nadie haga trampas, he seguido estos pasos:

1.  **Protección de datos:** El servidor nunca envía la respuesta correcta al navegador. Solo envía la pregunta y las opciones.
2.  **Validación real:** Cuando eliges una respuesta, esta viaja al servidor y es allí donde se comprueba si has acertado.
3.  **Resultados:** Al terminar, tus puntos se guardan automáticamente en tu historial para que puedas ver tu progreso después.



---

## 📦 Cómo ponerlo en marcha

### 1. Preparar las Bases de Datos (Docker)
He configurado Docker para que no tengas que instalar MySQL ni MongoDB a mano:
```bash
docker-compose up -d
