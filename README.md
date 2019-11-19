# JSnake

>Proyecto de Desarrollo Web Cliente (2DAW) por Ethan Hildick  
Se puede jugar en [GitHub Pages](https://hildickethan.github.io/JSnake)

## Introducción
---
### Motivación

Buscaba un juego simple para hacer en canvas, también me gustan las serpientes.

### Objetivos propuestos

- Crear un juego funcional en canvas.
- Usar objetos.

## Explicación en profundidad de la aplicación
---

El juego empieza al pulsar el botón verde "start", esto creará la serpiente representado como un cuadrado naranja y una bola representado como un cuadrado azul, la cual reaparece en un lugar aleatorio al tocarlo. La dirección de la serpiente se controla con WASD, ZQSD o las flechas y el objetivo es tocar la máxima cantidad de bolas antes de colisionar con el borde del juego.  
Se puede usar el botón "stop" para acabar el juego sin tocar el border. El input de "pieces per ball" te permite cambiar cuanto crece la serpiente con cada bola. "Points" te indica cuantas bolas se han tocado.  
A la derecha hay un ranking que se guarda en el localstorage del navegador. Al acabar la partida el navegador te pedirá el nombre que comprueba contra un RegEx para guardar tu puntuación en el ranking, que ordena de mayor a menor; también se puede no poner nombre para no guardar en el ranking. Se puede limpiar el ranking con el botón de "clear ranking".

## Conclusiones
---
### Objetivos alcanzados

- El juego funciona correctamente.
- Cada pieza de la serpiente es un objeto.

### Posibles mejoras futuras

- Detectar la colisión entre la cabeza y el resto del cuerpo
- Polimorfismo
- Cambiar el "stop" a una pausa que se puede reanudar
