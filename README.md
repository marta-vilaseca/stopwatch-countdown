# Stopwatch & Countdown Timer

Una aplicación web simple y funcional que combina un cronómetro y un temporizador de cuenta atrás en una interfaz limpia y accesible.

## 🚀 Features

### Cronómetro (Stopwatch)

- **Precisión de centisegundos**: Muestra el tiempo con precisión de 10ms
- **Controles intuitivos**: Start/Pause y Reset con iconos Material Design
- **Estados visuales claros**: Los botones cambian de apariencia según el estado del timer

### Temporizador de Cuenta Atrás (Countdown)

- **Input flexible**: Teclado numérico virtual para introducir tiempo (HH:MM:SS)
- **Normalización automática**: Acepta valores como 90 segundos y los convierte a 01:30:00
- **Soporte de teclado**: Control completo desde el teclado físico
- **Notificación al finalizar**: Alert cuando el countdown llega a cero
- **Validación de entrada**: Previene iniciar con tiempo 00:00:00

### Características Generales

- **Interfaz responsive**: Adaptada para móvil y desktop
- **Indicadores visuales**: Parpadeo del display cuando está pausado
- **Accesibilidad completa**: Navegación por teclado, ARIA labels, focus visible
- **Respeto por preferencias**: Desactiva animaciones si el usuario tiene `prefers-reduced-motion`
- **Diseño moderno**: Esquema de colores oscuro con acentos dorados

## 🛠️ Decisiones Técnicas

### Estructura de la Solución

La aplicación está estructurada siguiendo principios de separación de responsabilidades:

**TimerController**: Un objeto controlador centralizado que maneja toda la lógica del timer independientemente de la UI. Utiliza callbacks para comunicarse con la interfaz, permitiendo que diferentes modos (stopwatch/countdown) puedan reutilizar la misma lógica base de timing.

**Funciones de UI modulares**: Cada modo tiene sus propias funciones de setup (`setStopwatchUI`, `setCountdownUI`) que generan el HTML dinámicamente y configuran los event listeners específicos. Esto permite cambiar completamente la interfaz sin conflictos.

**Sistema de templates**: Las funciones `getDisplayHTML`, `getControlsHTML`, y `getKeypadHTML` generan HTML de forma modular, facilitando el mantenimiento y la consistencia.

### Decisiones de Desarrollo

Durante el desarrollo, decidí **no usar clases** a pesar de ser una de las posibilidades de mejora. En este caso específico, no veía valor añadido ya que:

- No hay necesidad de instanciar múltiples timers
- La funcionalidad no se reutiliza en otros contextos
- Un objeto literal (`TimerController`) proporciona la misma encapsulación sin la complejidad adicional

**Manejo de teclado inteligente**: Implementé un sistema que agrega/remueve event listeners dinámicamente solo cuando el modo countdown está activo, evitando conflictos (acumulación de event handlers) y mejorando el rendimiento.

**Gestión de estado visual**: Los botones cambian su clase CSS (`start`, `paused`, `running`) y contenido de forma dinámica, proporcionando feedback visual inmediato al usuario.

### Proceso de Desarrollo

Mi proceso fue incremental y bien planificado:

1. **Análisis de requerimientos**: Primero definí claramente qué funcionalidades necesitaba cada modo y cómo deberían interactuar
2. **Estructura básica**: Creé un HTML semántico y CSS mínimo funcional
3. **JavaScript funcional**: Implementé la lógica core con un primer commit funcional
4. **Iteración con IA**: Utilicé asistencia de IA para refinar aspectos específicos como:
   - Mejoras de accesibilidad (ARIA attributes, focus management)
   - Optimizaciones de rendimiento (cleanup de event listeners)
   - Añadir extras como soporte completo de teclado

## 🎨 Características de Diseño

- **Paleta de colores consistente**: Variables CSS personalizadas para fácil mantenimiento
- **Tipografía dual**: Inter para UI, Space Mono para el display del tiempo
- **Responsive design fluido**: Uso de `clamp()` para escalado suave entre dispositivos
- **Estados de hover inteligentes**: Solo se aplican en dispositivos que soportan hover
- **Animaciones respetuosas**: Se desactivan automáticamente si el usuario prefiere reducir movimiento

## 🔧 Tecnologías Utilizadas

- **HTML5 semántico** con ARIA attributes para accesibilidad
- **CSS moderno** con custom properties, flexbox, grid, y media queries
- **JavaScript vanilla** sin dependencias externas
- **Material Icons** para iconografía consistente
- **Google Fonts** (Inter y Space Mono)

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles y tablets
- ✅ Navegación por teclado completa
- ✅ Lectores de pantalla
- ✅ Usuarios con preferencias de movimiento reducido

## 🚀 Uso

1. Abre `index.html` en tu navegador
2. **Modo Stopwatch**: Haz clic en "Start" para comenzar, "Pause" para pausar, "Reset" para reiniciar
3. **Modo Countdown**:
   - Introduce el tiempo usando el teclado numérico (formato HHMMSS)
   - O usa tu teclado físico (números, Backspace, Enter para start, Escape para reset)
   - Haz clic en "Start" para comenzar la cuenta atrás

La aplicación es completamente autónoma y no requiere instalación ni dependencias adicionales.
