# Testimonials / Reviews Guide
# Guia de Testimonios / Reseñas

---

## English

### How to Add New Testimonials

To add new customer reviews to the landing page, you only need to edit **one file**:

**File:** `src/i18n/translations.js`

### Step-by-Step Instructions

1. **Open the translations file:**
   ```
   src/i18n/translations.js
   ```

2. **Find the testimonials section** (search for `testimonials:`):
   - English version: Around line 155-200
   - Spanish version: Around line 1385-1430

3. **Add a new review object** to the `reviews` array:

   ```javascript
   {
     name: 'John D.',           // Use initials for privacy (e.g., "John D.")
     role: 'Bitcoin Investor',  // Short description of the person
     stars: 5,                  // Rating from 1-5
     text: 'Your review text here. Keep it authentic and relevant to Bitcoin self-custody security.'
   }
   ```

4. **Add the same review in Spanish** in the `es` section:

   ```javascript
   {
     name: 'John D.',
     role: 'Inversor de Bitcoin',
     stars: 5,
     text: 'Texto de la reseña aquí en español.'
   }
   ```

### Example: Adding a New Review

**English (in `en.landing.testimonials.reviews`):**
```javascript
{
  name: 'Robert M.',
  role: 'Cold Storage Expert',
  stars: 5,
  text: 'The multi-signature guide was exactly what I needed. Clear, concise, and actually secure. My Bitcoin has never been safer.'
}
```

**Spanish (in `es.landing.testimonials.reviews`):**
```javascript
{
  name: 'Robert M.',
  role: 'Experto en Cold Storage',
  stars: 5,
  text: 'La guía de multi-firma era exactamente lo que necesitaba. Clara, concisa y realmente segura. Mi Bitcoin nunca ha estado más seguro.'
}
```

### Important Notes

- **Privacy:** Always use initials or first name + initial (e.g., "Sarah K.") - never full names
- **Photos:** The "?" badge automatically appears on avatars to indicate privacy protection
- **Stars:** Use 5 stars for positive testimonials
- **Length:** Keep reviews between 100-200 characters for best display
- **Authenticity:** Use real feedback from customers
- **Both Languages:** Always add reviews in BOTH English AND Spanish

### File Structure Reference

```
translations.js
├── en (English)
│   └── landing
│       └── testimonials
│           ├── title: "What Our Users Say"
│           ├── subtitle: "Real feedback..."
│           ├── privacyNote: "Privacy Protected"
│           └── reviews: [ {...}, {...}, ... ]
│
└── es (Spanish)
    └── landing
        └── testimonials
            ├── title: "Lo Que Dicen Nuestros Usuarios"
            ├── subtitle: "Opiniones reales..."
            ├── privacyNote: "Privacidad Protegida"
            └── reviews: [ {...}, {...}, ... ]
```

---

## Español

### Cómo Agregar Nuevos Testimonios

Para agregar nuevas reseñas de clientes a la página de inicio, solo necesitas editar **un archivo**:

**Archivo:** `src/i18n/translations.js`

### Instrucciones Paso a Paso

1. **Abre el archivo de traducciones:**
   ```
   src/i18n/translations.js
   ```

2. **Encuentra la sección de testimonios** (busca `testimonials:`):
   - Versión en inglés: Alrededor de la línea 155-200
   - Versión en español: Alrededor de la línea 1385-1430

3. **Agrega un nuevo objeto de reseña** al array `reviews`:

   ```javascript
   {
     name: 'Juan P.',           // Usa iniciales por privacidad (ej: "Juan P.")
     role: 'Inversor Bitcoin',  // Descripción corta de la persona
     stars: 5,                  // Calificación de 1-5
     text: 'Tu texto de reseña aquí. Mantenlo auténtico y relevante a la seguridad de auto-custodia Bitcoin.'
   }
   ```

4. **Agrega la misma reseña en inglés** en la sección `en`:

   ```javascript
   {
     name: 'Juan P.',
     role: 'Bitcoin Investor',
     stars: 5,
     text: 'Review text here in English.'
   }
   ```

### Ejemplo: Agregando una Nueva Reseña

**Español (en `es.landing.testimonials.reviews`):**
```javascript
{
  name: 'Roberto M.',
  role: 'Experto en Cold Storage',
  stars: 5,
  text: 'La guía de multi-firma era exactamente lo que necesitaba. Clara, concisa y realmente segura. Mi Bitcoin nunca ha estado más seguro.'
}
```

**Inglés (en `en.landing.testimonials.reviews`):**
```javascript
{
  name: 'Roberto M.',
  role: 'Cold Storage Expert',
  stars: 5,
  text: 'The multi-signature guide was exactly what I needed. Clear, concise, and actually secure. My Bitcoin has never been safer.'
}
```

### Notas Importantes

- **Privacidad:** Siempre usa iniciales o nombre + inicial (ej: "María G.") - nunca nombres completos
- **Fotos:** La insignia "?" aparece automáticamente en los avatares para indicar protección de privacidad
- **Estrellas:** Usa 5 estrellas para testimonios positivos
- **Longitud:** Mantén las reseñas entre 100-200 caracteres para mejor visualización
- **Autenticidad:** Usa comentarios reales de clientes
- **Ambos Idiomas:** Siempre agrega reseñas en AMBOS idiomas, inglés Y español

### Referencia de Estructura del Archivo

```
translations.js
├── en (Inglés)
│   └── landing
│       └── testimonials
│           ├── title: "What Our Users Say"
│           ├── subtitle: "Real feedback..."
│           ├── privacyNote: "Privacy Protected"
│           └── reviews: [ {...}, {...}, ... ]
│
└── es (Español)
    └── landing
        └── testimonials
            ├── title: "Lo Que Dicen Nuestros Usuarios"
            ├── subtitle: "Opiniones reales..."
            ├── privacyNote: "Privacidad Protegida"
            └── reviews: [ {...}, {...}, ... ]
```

---

## Quick Reference / Referencia Rápida

| Field | English Example | Spanish Example |
|-------|-----------------|-----------------|
| name | "Sarah K." | "María G." |
| role | "Bitcoin Holder" | "Holder de Bitcoin" |
| stars | 5 | 5 |
| text | "Great service..." | "Excelente servicio..." |
