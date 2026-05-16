# DAWA Lab 09 — Next.js: SSR y CSR

Proyecto del laboratorio **Desarrollo de Aplicaciones Web Avanzada** que demuestra el uso combinado de **Server Side Rendering (SSR)** y **Client Side Rendering (CSR)** con **Next.js App Router**, **TypeScript**, **Tailwind CSS** y **Axios**.

Cada ejercicio vive en su propia ruta bajo `app/`. La entrega principal del lab es la galería de películas en **`/pelis-fso`**.

---

## Tabla de contenidos

1. [Tecnologías](#tecnologías)
2. [Requisitos e instalación](#requisitos-e-instalación)
3. [Rutas del proyecto](#rutas-del-proyecto)
4. [Ejercicio 1: Pokémon SSR](#ejercicio-1-pokémon-ssr)
5. [Ejercicio 2: Pokémon CSR](#ejercicio-2-pokémon-csr)
6. [Ejercicio 3: Dashboard del clima (SSR + CSR)](#ejercicio-3-dashboard-del-clima-ssr--csr)
7. [Ejercicio 4: Galería OMDb — pelis-fso](#ejercicio-4-galería-omdb--pelis-fso)
8. [SSR vs CSR — explicación técnica](#ssr-vs-csr--explicación-técnica)
9. [Estructura del proyecto](#estructura-del-proyecto)
10. [Variables de entorno](#variables-de-entorno)
11. [Despliegue en Vercel](#despliegue-en-vercel)
12. [Scripts disponibles](#scripts-disponibles)

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| [Next.js 16](https://nextjs.org/) | App Router, Server Components, rutas por carpeta |
| [React 19](https://react.dev/) | UI y hooks (`useState`, `useEffect`) |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos utilitarios y diseño responsive |
| [Axios](https://axios-http.com/) | Peticiones HTTP con `async/await` |

---

## Requisitos e instalación

- **Node.js** 18.18 o superior (recomendado 20+)
- **npm** (incluido con Node)

```bash
# Clonar o entrar al directorio del proyecto
cd next-app

# Instalar dependencias
npm install

# Variables de entorno (obligatorio para /pelis-fso)
# Crear .env.local en la raíz con:
# NEXT_PUBLIC_OMDB_API_KEY=be1550a4

# Servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La página raíz es el template por defecto de Next.js; los laboratorios están en las rutas indicadas abajo.

---

## Rutas del proyecto

| Ruta | Tipo | API externa | Descripción |
|------|------|-------------|-------------|
| `/` | Estática | — | Página inicial de create-next-app |
| `/pokemon-ssr` | **SSR** | [PokeAPI](https://pokeapi.co/) | Pokémon aleatorio renderizado en servidor |
| `/pokemon-csr` | **CSR** | PokeAPI | Pokémon aleatorio cargado en el cliente |
| `/weather` | **SSR + CSR** | [Open-Meteo](https://open-meteo.com/) | Clima de Lima (SSR) y ciudades interactivas (CSR) |
| `/pelis-fso` | **SSR + CSR** | [OMDb API](https://www.omdbapi.com/) | Galería de películas y series (entrega principal) |

---

## Ejercicio 1: Pokémon SSR

**Ruta:** `/pokemon-ssr`  
**Archivo:** `app/pokemon-ssr/page.tsx`

### Qué hace

- Obtiene un Pokémon aleatorio (ID 1–150) desde PokeAPI **en el servidor**.
- Muestra imagen, nombre y tipos antes de que el navegador ejecute JavaScript del cliente.
- Es un **Server Component** `async` (sin directiva `'use client'`).

### Cómo demuestra SSR

```tsx
async function getPokemon() {
  const randomId = Math.floor(Math.random() * 150) + 1
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
  return response.data
}

export default async function PokemonSSR() {
  const pokemon = await getPokemon()
  // ...
}
```

### Cómo verificarlo

1. Abre `/pokemon-ssr`.
2. **Ver código fuente** (Ctrl+U): el HTML ya incluye nombre e imagen del Pokémon.
3. En Network, la petición a PokeAPI ocurre en el **servidor** (build o request), no como fetch visible del usuario al cargar por primera vez en modo SSR dinámico.

---

## Ejercicio 2: Pokémon CSR

**Ruta:** `/pokemon-csr`  
**Archivo:** `app/pokemon-csr/page.tsx`

### Qué hace

- Misma API y datos que el ejercicio SSR, pero la petición se hace **en el navegador**.
- Muestra un **spinner** mientras carga.
- Usa `'use client'`, `useState` y `useEffect`.

### Cómo demuestra CSR

```tsx
'use client'

useEffect(() => {
  const fetchPokemon = async () => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    setPokemon(response.data)
    setLoading(false)
  }
  fetchPokemon()
}, [])
```

### Cómo verificarlo

1. Abre `/pokemon-csr`.
2. Verás primero el estado de carga y luego el Pokémon.
3. En **DevTools → Network**, aparece la petición a `pokeapi.co` desde el **cliente**.

---

## Ejercicio 3: Dashboard del clima (SSR + CSR)

**Ruta:** `/weather`  
**Archivos:**

- `app/weather/page.tsx` — Server Component (SSR)
- `app/weather/ClientWeatherWidget.tsx` — Client Component (CSR)

### Qué hace

Pantalla dividida en dos tarjetas:

| Tarjeta | Modo | Comportamiento |
|---------|------|----------------|
| **Lima - SSR** | Servidor | Temperatura y viento de Lima (-12.04, -77.03) obtenidos con `async/await` en `page.tsx` |
| **Mundo - CSR** | Cliente | Selector de ciudad (Tokyo, New York, London, Sydney); al cambiar ciudad se vuelve a pedir el clima sin recargar la página |

Incluye una **tabla comparativa** SSR vs CSR (SEO, tiempo inicial, interactividad, carga del servidor).

### APIs

- Base: `https://api.open-meteo.com/v1/forecast`
- Parámetros: `latitude`, `longitude`, `current_weather=true`

### Patrón híbrido

La página combina lo mejor de ambos mundos en una sola vista: contenido indexable y rápido (Lima) + interactividad (selector de ciudades).

---

## Ejercicio 4: Galería OMDb — pelis-fso

**Ruta:** `/pelis-fso`  
**Carpeta:** `app/pelis-fso/`

Aplicación tipo mini-plataforma de streaming que cumple los requisitos del laboratorio: catálogo inicial en servidor, búsqueda interactiva en cliente y detalle en modal.

### Requisitos del lab — cumplimiento

| Requisito | Implementación |
|-----------|----------------|
| **1. Página principal (SSR)** | `page.tsx` es `async` Server Component; `getCatalogMovies()` obtiene películas en el servidor |
| **2. Búsqueda (CSR)** | `MovieCatalog` + `SearchBar` con `useState` / `useEffect`, debounce 400 ms, sin recargar |
| **3. Detalle en modal** | `MovieModal` en la misma página; `getMovieById(imdbID)` con información completa |

### Estructura interna

```
app/pelis-fso/
├── page.tsx              # SSR: catálogo + destacados
├── layout.tsx            # Metadata y tema oscuro
├── components/
│   ├── HeroCarousel.tsx  # Carrusel de películas destacadas (CSR)
│   ├── MovieCatalog.tsx  # Grid, búsqueda y modal (CSR)
│   ├── SearchBar.tsx     # Input de búsqueda
│   ├── MovieCard.tsx     # Tarjeta del grid
│   └── MovieModal.tsx    # Detalle completo
├── lib/
│   └── omdb.ts           # getMovies, getMovieById, getCatalogMovies, getFeaturedMovies
└── types/
    └── movie.ts          # Tipos TypeScript OMDb
```

### Funcionalidades

1. **Catálogo inicial (SSR)**  
   - Búsquedas variadas: años recientes, géneros (acción, drama, comedia, etc.) y series.  
   - Resultados mezclados para un catálogo general (no limitado a un solo universo).

2. **Carrusel de destacados (CSR)**  
   - Hasta 6 títulos con poster válido y prioridad por año reciente.  
   - Autoavance, flechas, indicadores y enlace al catálogo (`#catalogo`).

3. **Búsqueda en tiempo real (CSR)**  
   - Cualquier término soportado por OMDb (`s=query`).  
   - Spinner y mensajes de error.

4. **Modal de detalle (CSR)**  
   - Poster, título, año, género, director, actores, sinopsis, rating IMDb, duración, tipo.  
   - Cierre con X, clic fuera o tecla Escape.  
   - Fondo con blur oscuro.

### API OMDb

- Documentación: [https://www.omdbapi.com/](https://www.omdbapi.com/)
- Búsqueda: `?apikey=KEY&s=termino`
- Detalle: `?apikey=KEY&i=imdbID`

### Diseño UI

- Tema oscuro cinematográfico (inspiración Netflix ).
- Glassmorphism (`.glass-panel` en `globals.css`).
- Colores: negro, gris oscuro, rojo `#e50914`, blanco.
- Grid responsive y animaciones hover en tarjetas.

### Nota sobre imágenes

Algunos posters vienen como `"N/A"` o con URLs rotas desde OMDb/IMDb; la app muestra placeholder en esos casos. No es un límite de la API a un solo catálogo: el buscador permite explorar cualquier título disponible en OMDb.

---

## SSR vs CSR — explicación técnica

### ¿Por qué usar SSR?

- **SEO:** motores de búsqueda reciben HTML con contenido real (catálogo, Pokémon, clima de Lima).
- **Primera carga:** el usuario ve datos antes de hidratar React en el cliente.
- **Ideal para:** páginas principales, listados iniciales, contenido que debe indexarse.

**En este proyecto:** `pokemon-ssr`, tarjeta Lima en `weather`, catálogo inicial en `pelis-fso/page.tsx`.

### ¿Por qué usar CSR?

- **Interactividad:** búsqueda, selectores, modales sin recargar la página.
- **Menos carga en servidor** en acciones repetidas del usuario.
- **Ideal para:** formularios, filtros, widgets dinámicos, detalle bajo demanda.

**En este proyecto:** `pokemon-csr`, `ClientWeatherWidget`, `MovieCatalog`, `SearchBar`, `MovieModal`, `HeroCarousel`.

### Resumen visual del flujo en pelis-fso

```
[Servidor - page.tsx]
    getCatalogMovies() ──► HTML con grid inicial
    getFeaturedMovies() ──► datos para carrusel

[Cliente - MovieCatalog]
    useState(query) + useEffect ──► getMovies(query) sin reload

[Cliente - MovieModal]
    useEffect(imdbID) ──► getMovieById(id) ──► modal con detalle
```

---

## Estructura del proyecto

```
next-app/
├── app/
│   ├── page.tsx                 # Home por defecto (create-next-app)
│   ├── layout.tsx
│   ├── globals.css
│   ├── pokemon-ssr/
│   │   └── page.tsx
│   ├── pokemon-csr/
│   │   └── page.tsx
│   ├── weather/
│   │   ├── page.tsx
│   │   └── ClientWeatherWidget.tsx
│   └── pelis-fso/
│       ├── page.tsx
│       ├── layout.tsx
│       ├── components/
│       ├── lib/omdb.ts
│       └── types/movie.ts
├── .env.local                   # No commitear (gitignore)
├── next.config.ts               # remotePatterns para posters OMDb
├── package.json
└── README.md
```

---

## Variables de entorno

Crear `.env.local` en la raíz de `next-app`:

```env
NEXT_PUBLIC_OMDB_API_KEY=be1550a4
```

| Variable | Obligatoria | Rutas |
|----------|-------------|-------|
| `NEXT_PUBLIC_OMDB_API_KEY` | Sí, para `/pelis-fso` | Galería OMDb (servidor y cliente) |

Los ejercicios de Pokémon y clima **no** requieren variables de entorno (APIs públicas sin key).

---

## Despliegue en Vercel

1. Sube el contenido de la carpeta **`next-app`** a un repositorio de GitHub (recomendado: repo dedicado solo a este proyecto).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. **Framework:** Next.js (detección automática).
4. **Root Directory:** dejar vacío si el repo es `next-app`; si el repo es más grande, apunta a la ruta de `next-app`.
5. **Environment Variables:**

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_OMDB_API_KEY` | `xxxxxxx` |

6. Deploy.

**URLs en producción:**

- Galería principal del lab: `https://tu-dominio.vercel.app/pelis-fso`
- Pokémon SSR: `https://tu-dominio.vercel.app/pokemon-ssr`
- Pokémon CSR: `https://tu-dominio.vercel.app/pokemon-csr`
- Clima: `https://tu-dominio.vercel.app/weather`

**CLI alternativa:**

```bash
npm i -g vercel
vercel login
vercel
vercel env add NEXT_PUBLIC_OMDB_API_KEY
vercel --prod
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción (tras `build`) |
| `npm run lint` | ESLint |

---

## Autor y curso

- **Curso:** DAWA — Desarrollo de Aplicaciones Web Avanzada  
- **Laboratorio:** 09 — Next.js App Router, SSR y CSR  
- **Institución:** Tecsup (quinto ciclo)

---

## Referencias

- [Next.js — Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [OMDb API](https://www.omdbapi.com/)
- [PokeAPI](https://pokeapi.co/)
- [Open-Meteo API](https://open-meteo.com/)
