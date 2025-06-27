# Stopwatch & Countdown Timer

Versión experimental generada enteramente utilizando **Claude Sonnet 4**

## 🌱 Prompt inicial

Necesito que me ayudes con la siguiente tarea:

- Desarrollar un componente web sencillo que contenga dos funcionalidades principales:
  - Cronómetro: debe contar hacia adelante (en segundos) desde que el usuario presione “Iniciar”.
  - Cuenta atrás: debe permitir al usuario ingresar un tiempo (en segundos o minutos) y mostrar una cuenta regresiva hasta llegar a cero.
    Ambos deben estar implementados utilizando:
- HTML
- CSS
- JavaScript
- Sin frameworks o librerías

### Requisitos mínimos

- Un botón para iniciar (start), pausar (pause) y reiniciar (reset) cada funcionalidad.
- Visualización clara y legible del tiempo.
- Código dividido en archivos: index.html, style.css, y script.js.
- Responsivo

### Otras consideraciones:

- Incluir un switcher entre modos, una navegación con botones stopwatch y countdown
- El input de tiempo para el countdown debería ser con un componente de teclado numérico, con teclas del 0 al 9 y un backspace para retroceder y corregir si nos equivocamos
  - Si es posible, añadir soporte para teclado en el keypad
- El display estará en formato HH:MM:SS.cc
- En el caso del countdown:
  - el usuario debe poder introducir un tiempo máximo de 99h, 99min, 99 segundos (las centésimas se inicializarán siempre a 0). Cuando pulsemos el botón start, el tiempo debe normalizarse a un formato correcto antes de empezar el countdown
  - Validación para que el countdown no se inicie a cero
  - Notificación (alert por ejemplo) cuando el countdown llegue a cero
- Tener en cuenta buenos principios de separación de responsabilidades y no repetir código innecesariamente. Reutilizar los componentes comunes (display y botones start y reset) entre countdown y stopwatch cuando sea posible
- Considerar añadir algunas mejoras visuales, por ejemplo:
  - parpadeo del display cuando esté pausado
  - que el texto del botón start cambie a pause una vez se haya iniciado el stopwatch o countdown, y a continue una vez pausado
- Dark mode por defecto

Genérame por favor el archivo HTML, el archivo CSS y el archivo JavaScript por separado
