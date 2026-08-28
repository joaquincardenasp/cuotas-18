# 🇨🇱 Calculadora Dieciochera - Paseo a la Playa 🏖️

Aplicación web interactiva para calcular y dividir equitativamente los gastos de licores y compras comunes para Fiestas Patrias (17 al 20 de septiembre).

Cotizaciones reales de distribuidora **dondelanegra.cl**.

---

## 🚀 Características Principales

1. **División Justa por Trago (Sin peleas):**
   - **Pisco:** Dividido solo entre piscoleros.
   - **Gin & Red Bull Yellow:** Dividido solo entre quienes toman Gin.
   - **Cerveza:** Dividido solo entre cerveceros.
   - **Tequila:** Dividido solo entre quienes toman Tequila.
   - **Combo Terremoto:** Pipeño + Helado de Piña + Granadina agrupados y divididos exclusivamente entre los terremoteros.
   - **Gastos Comunes:** Bebidas (Coca-Cola Zero, Sprite), Bolsas de Hielo, Vasos plásticos (divididos equitativamente entre todos).

2. **Precios Don de la Negra Precargados & Editables:**
   - Precios reales de distribuidora preconfigurados.
   - Posibilidad de modificar cantidades y precios unitarios en vivo con recálculo instantáneo.
   - Botón para agregar licores o insumos adicionales.

3. **Persistencia & Tiempo Real (Opcional):**
   - **Modo Local:** Guarda automáticamente todo en `localStorage` (no se pierde al recargar la página).
   - **Modo Tiempo Real (Firebase):** Conexión con Firestore para ver votos y divisiones en vivo entre todos los amigos + **Google OAuth Login**.

4. **Cobranza WhatsApp con 1 Clic:**
   - Genera mensaje formateado con emojis dieciocheros, desglose por amigo y datos de transferencia bancaria (RUT, Banco, Cuenta).
   - Botones para enviar mensaje directo individual a cada amigo por WhatsApp Web / App.
   - Exportación a planilla Excel (`.csv`) y copia de seguridad (`.json`).

---

## 🛠️ Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🌐 Despliegue en Vercel (En 1 minuto)

1. Sube este proyecto a un repositorio de GitHub (o usa el CLI de Vercel).
2. En [vercel.com](https://vercel.com), haz clic en **"Add New Project"** e importa tu repositorio.
3. El framework se detectará automáticamente como **Vite**.
4. Haz clic en **Deploy**. ¡Listo! Ya puedes compartir el enlace con tu grupo de amigos.

### (Opcional) Variables de Entorno en Vercel para Firebase:

Si deseas activar el tiempo real y Google Login automáticamente en Vercel, agrega estas variables de entorno en el panel de Vercel:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_AUTH_DOMAIN`

_(Nota: También puedes ingresar estas credenciales directamente desde la propia interfaz de la app en el botón de Ajustes ⚙️)._
