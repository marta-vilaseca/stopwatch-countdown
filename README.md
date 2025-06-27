# Stopwatch & Countdown Timer

Versión experimental generada enteramente utilizando **Claude Sonnet 4**

## 🌱 Prompt inicial

### Prompt

Necesito que me ayudes con la siguiente tarea:

- Desarrollar un componente web sencillo que contenga dos funcionalidades principales:
  - Cronómetro: debe contar hacia adelante (en segundos) desde que el usuario presione “Iniciar”.
  - Cuenta atrás: debe permitir al usuario ingresar un tiempo (en segundos o minutos) y mostrar una cuenta regresiva hasta llegar a cero.
    Ambos deben estar implementados utilizando:
- HTML
- CSS
- JavaScript
- Sin frameworks o librerías

##### Requisitos mínimos

- Un botón para iniciar (start), pausar (pause) y reiniciar (reset) cada funcionalidad.
- Visualización clara y legible del tiempo.
- Código dividido en archivos: index.html, style.css, y script.js.
- Responsivo

##### Otras consideraciones:

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

### Resultado

¡Perfecto! He creado los tres archivos que necesitas para tu aplicación de cronómetro y cuenta atrás. Te explico las características principales implementadas:

#### Funcionalidades Implementadas:

##### Estructura y Navegación:

- Navegación con pestañas entre "Cronómetro" y "Cuenta Atrás"
- Diseño responsive y dark mode por defecto
- Separación clara de responsabilidades en el código

##### Cronómetro:

- Cuenta hacia adelante en formato HH:MM:SS.cc
- Botones Iniciar/Pausar/Continuar y Reiniciar
- Parpadeo del display cuando está pausado

##### Cuenta Atrás:

- Input personalizado con teclado numérico visual
- Soporte para teclado físico (números 0-9 y Backspace)
- Formato de entrada intuitivo (horas, minutos, segundos)
- Normalización automática del tiempo (ej: 90 segundos = 1:30)
- Validación para evitar iniciar en cero
- Alerta cuando llega a cero

##### Características Técnicas:

- Código reutilizable: Clase base BaseTimer para funcionalidades comunes
- Precisión: Intervalos de 10ms para centésimas de segundo
- Responsive: Adapta el diseño a diferentes tamaños de pantalla
- Accesibilidad: Navegación por teclado y controles intuitivos

##### Mejoras Visuales:

- Diseño moderno con gradientes y sombras
- Animaciones suaves y efectos hover
- Parpadeo del display cuando está pausado
- Cambio dinámico de texto en botones (Iniciar → Pausar → Continuar)

##### Límites y Validaciones:

- Tiempo máximo: 99h 99m 99s (se normaliza automáticamente)
- Prevención de inicio con tiempo cero
- Gestión de estados para evitar conflictos entre modos

Los archivos están listos para usar. Solo necesitas colocar los tres archivos en la misma carpeta y abrir index.html en tu navegador. ¡Todo funciona sin dependencias externas!

## 🔃 Iteración #01

### Prompt

Genial!!! Tengo algunos apuntes y correcciones, pero en general has hecho muy buen trabajo.

- **ERROR IMPORTANTE:** el keypad debería desactivarse cuando el countdown ya está corriendo. Es importante que el usuario no pueda introducir valores nuevos en ese momento, ya que no tiene sentido
- Sería posible generar el HTML perteneciente al display, controles start/reset y keypad dinámicamente desde JavaScript? Así podemos reutilizar el código para los dos primeros y evitamos repeticiones
- Todo se ve perfecto en mobile, pero en desktop los números del display sobresalen del recuadro. Habría que ajustarlo.
- El soporte para teclado en el keypad funciona genial, podríamos incorporar que al pulsar space inicie/pause/continue los timers y al pulsar esc los resetee?

### Resultado

#### ✅ Correcciones Implementadas:

**1. ERROR IMPORTANTE - Keypad desactivado durante countdown:**

- El keypad se desactiva automáticamente cuando el countdown está corriendo
- Se reactiva cuando se pausa, resetea o termina el countdown
- Visual feedback: los botones se ven deshabilitados (opacidad reducida, sin hover)

**2. Generación dinámica de HTML:**

- Nueva clase ComponentGenerator que crea todos los elementos dinámicamente
- Reutilización completa: Display y controles se generan una sola vez y se reutilizan
- Código más limpio: HTML queda minimalista, JavaScript maneja toda la estructura
- Mejor mantenibilidad: Cambios en componentes se hacen en un solo lugar

**3. Display responsive arreglado:**

- clamp(2rem, 8vw, 4rem) para tamaño responsivo del texto
- overflow: hidden y white-space: nowrap para evitar desbordamiento
- Letter-spacing reducido para dar más espacio
- Funciona perfectamente tanto en mobile como desktop

**4. Soporte de teclado mejorado:**

- Espacio (Space): Inicia/Pausa/Continúa el timer activo
- Escape (Esc): Resetea el timer activo
- Nueva clase KeyboardManager que gestiona todos los eventos de teclado
- Funciona con ambos modos: Detecta automáticamente qué timer está activo
- Previene comportamiento por defecto para evitar scroll con espacio

#### 🔧 Mejoras Técnicas:

##### Arquitectura mejorada:

- ComponentGenerator: Generación dinámica de componentes HTML
- KeyboardManager: Gestión centralizada de eventos de teclado
- Separación de responsabilidades: Cada clase tiene una función específica
- Código más modular: Fácil de extender y mantener

##### Control de estado mejorado:

- El keypad se habilita/deshabilita según el estado del countdown
- Los atajos de teclado funcionan solo con el timer activo
- Mejor feedback visual para elementos deshabilitados

##### Responsive perfecto:

- Display se adapta fluidamente a cualquier tamaño de pantalla
- No más desbordamiento de texto en desktop
- Mantiene legibilidad en todos los dispositivos

¡Ahora la aplicación está mucho más pulida y profesional! El keypad se comporta correctamente, el código es más mantenible y los atajos de teclado hacen la experiencia de usuario mucho más fluida.

## 🔃 Iteración #02

> [!IMPORTANT]  
> La versión gratuita de Claude no deja que los chats excedan de cierta longitud, así que para este último ajuste he abierto un chat nuevo con el mismo modelo, dándole el contexto necesario para ajustar el detalle que quería

### Prompt

Hola! Me has ayudado antes con una aplicación de stopwatch/countdown, te adjunto el código como referencia.

_(\* HTML, CSS y JavaScript adjuntos)_

Todo funciona perfecto, pero todavía tenemos un pequeño problema con la visualización del display. Los dígitos encajan justo dentro del recuadro; si el usuario introduce un valor temporal grande que deba normalizarse a más de 100 horas, el ancho total del tiempo a mostrar aumenta ligeramente y "se sale" de los límites del display, quedando parcialmente oculto. De nuevo, solo ocurre en desktop. Podemos solucionarlo? Quizás aumentando el padding lateral de la caja del display o reduciendo un poco más el tamaño de los dígitos.

### Resultado

Perfecto, veo el problema. Cuando el tiempo excede las 99 horas, el display muestra más de 8 caracteres (como "100:30:45.50" en lugar de "01:30:45.50"), lo que hace que el texto se salga del contenedor.
Te propongo varias soluciones. La más elegante sería combinar un aumento del padding lateral con una reducción ligera del tamaño de fuente para valores muy grandes.

Aquí tienes las opciones:

```css
/* Solución 1: Aumentar padding lateral y hacer el contenedor más responsive */
.time-display {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 300;
  font-family: "Courier New", monospace;
  color: var(--text-primary);
  background: var(--bg-secondary);
  padding: 30px 40px; /* Aumentado de 20px a 40px el padding lateral */
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  letter-spacing: 0.05em;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  transition: var(--transition);
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  /* Hacer el contenedor un poco más ancho para valores grandes */
  min-width: 350px;
}

/* Solución 2: Clase adicional para cuando el tiempo es muy grande (>99 horas) */
.time-display.large-time {
  font-size: clamp(1.8rem, 7vw, 3.5rem); /* Reducir un poco el tamaño */
  padding: 30px 50px; /* Más padding para valores grandes */
  min-width: 400px; /* Ancho mínimo mayor */
}

/* Solución 3: Media queries específicas para desktop */
@media (min-width: 601px) {
  .time-display {
    padding: 30px 50px; /* Más padding en desktop */
    min-width: 380px;
    font-size: clamp(2rem, 6vw, 3.8rem); /* Ligeramente más pequeño en desktop */
  }

  .time-display.large-time {
    font-size: clamp(1.8rem, 5vw, 3.2rem);
    padding: 30px 60px;
    min-width: 420px;
  }
}

/* Mantener el responsive para móviles */
@media (max-width: 600px) {
  .time-display {
    font-size: 2.5rem;
    padding: 20px 25px; /* Aumentado ligeramente */
    min-height: 100px;
    min-width: 280px; /* Ancho mínimo para móviles */
  }

  .time-display.large-time {
    font-size: 2.2rem; /* Más pequeño para valores grandes en móvil */
    padding: 20px 30px;
  }
}

@media (max-width: 400px) {
  .time-display {
    font-size: 2rem;
    padding: 20px;
    min-width: 250px;
  }

  .time-display.large-time {
    font-size: 1.8rem;
    padding: 20px 25px;
  }
}
```

Ahora necesitamos modificar el JavaScript para aplicar la clase large-time cuando sea necesario:

```javascript
// Método mejorado para formatear tiempo con detección de valores grandes
formatTime(totalCentiseconds) {
  const hours = Math.floor(totalCentiseconds / 360000);
  const minutes = Math.floor((totalCentiseconds % 360000) / 6000);
  const seconds = Math.floor((totalCentiseconds % 6000) / 100);
  const centiseconds = totalCentiseconds % 100;

  // Detectar si el tiempo es "grande" (más de 99 horas)
  const isLargeTime = hours > 99;

  // Aplicar clase CSS según el tamaño del tiempo
  if (this.displayElement) {
    if (isLargeTime) {
      this.displayElement.classList.add('large-time');
    } else {
      this.displayElement.classList.remove('large-time');
    }
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
}

// Para el cronómetro, actualizar el método updateDisplayText
updateDisplayText() {
  this.displayElement.textContent = this.formatTime(this.centiseconds);
}

// Para la cuenta atrás, actualizar el método updateDisplayText
updateDisplayText() {
  this.displayElement.textContent = this.formatTime(this.remainingCentiseconds);
}
```

#### Resumen de las soluciones:

- Padding lateral aumentado: De 20px a 40px en desktop, de 15px a 25px en móvil
- Ancho mínimo: Se establecen anchos mínimos para evitar que el contenedor sea demasiado estrecho
- Clase dinámica: Se aplica automáticamente la clase large-time cuando el tiempo excede 99 horas
- Tamaño de fuente adaptativo: Ligeramente más pequeño para valores grandes
- Media queries específicas: Diferentes valores para desktop y móvil

#### Para implementar:

- Reemplaza las reglas CSS de .time-display con las del primer artifact
- Modifica el método formatTime en ambas clases (Stopwatch y Countdown) con el código del segundo artifact

Esto debería resolver completamente el problema de overflow, manteniendo una buena legibilidad tanto para valores pequeños como grandes, y conservando el diseño responsive.
