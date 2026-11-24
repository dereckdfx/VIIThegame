# VII The Game

Página de fan, hecha desde cero, de un **GTA VII** ficticio.

**Proyecto de fan no oficial. No afiliado con Rockstar Games ni Take-Two Interactive.**

Grand Theft Auto, GTA y las marcas relacionadas son propiedad de sus respectivos dueños. Este sitio es un homenaje independiente, sin fines de lucro y sin material tomado de sitios oficiales.

## Cómo verla en local

En la carpeta del proyecto:

```bash
npx --yes serve -l 4173
```

O, si prefieres Python:

```bash
python3 -m http.server 4173
```

Abre [http://localhost:4173](http://localhost:4173).

Parámetros útiles:

- `?intro=0` — salta la introducción
- `?intro=hold` — deja la introducción fija
- `?reveal=1` — muestra las secciones sin esperar al scroll

## Cómo publicarla

El repositorio es [dereckdfx/VIIThegame](https://github.com/dereckdfx/VIIThegame). El proyecto de Vercel se llama `viithegame` y la dirección de producción es [https://viithegame.vercel.app](https://viithegame.vercel.app).

Un `git push` a la rama `main` vuelve a desplegar el sitio. También puedes usar la CLI de Vercel si estás autenticado:

```bash
npx vercel --prod
```

## Estructura

```
index.html              Portada
novedades.html          Muro en vivo de la comunidad
privacidad.html         Aviso de privacidad
cookies.html            Cookies y almacenamiento local
legal.html              Aviso legal
css/styles.css          Estilos (todo original)
js/config.js            URL y clave anónima de Supabase
js/main.js              Menú, idioma, movimiento, vídeo, avisos
js/novedades.js         Lectura, publicación y tiempo real del muro
assets/hero.jpg         Cartel de Dereck (también .png, .webp, og.jpg)
assets/vii-logo.png     Wordmark VII (también .webp)
assets/favicon.svg      Icono
assets/video/placeholder.webm
assets/video/placeholder.mp4
assets/video/trailer.mp4   ← aquí va el tráiler propio, cuando exista
README.md
vercel.json
```

## Assets que Dereck puede aportar

| Qué | Dónde | Cómo se usa |
| --- | --- | --- |
| Tráiler en MP4 | `assets/video/trailer.mp4` | El reproductor ya apunta a esa ruta con `data-src`. Mientras el archivo no exista, se usa el recorte animado de la portada (`placeholder.webm` / `.mp4`). |
| Más clips (Tráiler 1, 2, 3) | `assets/video/clip-1.mp4`, etc. | Cambia el `data-src` de cada `<video>` en `index.html` a tu archivo. |
| Arte extra (fondos, capturas) | `assets/` | Se puede recortar o enlazar desde las secciones de media y tienda. |
| Tipografías propias (opcionales, de uso libre) | una carpeta `fonts/` | Hoy se usan Poppins, Bebas Neue, Outfit y Syne por Google Fonts. Si quieres otras, súbelas y actualiza `css/styles.css`. |

No hace falta tocar JavaScript para estrenar un tráiler: basta con dejar el MP4 en la ruta de `data-src`.

## Novedades (Supabase)

El muro de `novedades.html` se conecta al proyecto de Supabase `pwdwyareohlqsvdrucxq` (el mismo de la Gala; no hay un proyecto aparte de VII). Solo se usa la **clave anónima** en `js/config.js`. La clave de servicio no va en el sitio.

- Tabla `public.vii_novedades`: `id`, `created_at`, `nombre`, `texto`, `categoria`
- Restricciones: texto de 1 a 280 caracteres, nombre de hasta 80, categoría en `general`, `arte`, `musica`, `comunidad`, `rumor`
- RLS: lectura pública, inserción pública (con las mismas comprobaciones), sin políticas de update ni delete
- Antispam: espera de 10 segundos en el navegador y un disparador en la base (`private.vii_novedades_guard`) que limita por huella del cliente
- Publicación en tiempo real: `supabase_realtime` incluye esta tabla; las entradas nuevas aparecen arriba en todos los dispositivos

## Menú e idioma

El menú incluye: Inicio, Ver, Edición especial, Solo en Vinewood, Media, Música y Novedades. Se cierra con la X, Escape o un clic en el panel izquierdo. El idioma (ES/EN) y el movimiento (completo o reducido) se guardan en este dispositivo. Si el sistema pide menos movimiento, las animaciones y el paralaje se apagan.
