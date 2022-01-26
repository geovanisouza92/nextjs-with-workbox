# How to use [Workbox](https://developers.google.com/web/tools/workbox/) in your Next.js app

```bash
npx create-next-app my-app

cd my-app

npm install -D workbox-webpack-plugin
```

Add `GenerateSW` to your webpack config:

```diff
diff --git a/next.config.js b/next.config.js
index 0d60710..c9691ff 100644
--- a/next.config.js
+++ b/next.config.js
@@ -1,3 +1,20 @@
+const { GenerateSW } = require('workbox-webpack-plugin');
+
 module.exports = {
   reactStrictMode: true,
+  webpack(config, options) {
+    if (options.isServer || options.isDev) {
+      return config;
+    }
+
+    config.plugins.push(
+      new GenerateSW({
+        // Using the same static folder
+        swDest: 'static/service-worker.js',
+        // Include only static files
+        include: [/.*static.*/i]
+      })
+    );
+
+    return config;
+  },
 }
```

Register the service worker in your `_app`

```diff
diff --git a/pages/_app.js b/pages/_app.js
index 1e1cec9..88f15c7 100644
--- a/pages/_app.js
+++ b/pages/_app.js
@@ -1,6 +1,25 @@
+import { useEffect } from 'react'
 import '../styles/globals.css'
 
 function MyApp({ Component, pageProps }) {
+  useEffect(() => {
+    if ('serviceWorker' in navigator) {
+      window.addEventListener('load', function () {
+        navigator.serviceWorker.register('/_next/static/service-worker.js').then(
+          function (registration) {
+            console.log(
+              'Service Worker registration successful with scope: ',
+              registration.scope
+            )
+          },
+          function (err) {
+            console.log('Service Worker registration failed: ', err)
+          }
+        )
+      })
+    }
+  }, [])
+
   return <Component {...pageProps} />
 }
```
