import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function apiDevPlugin() {
  return {
    name: 'api-dev-plugin',
    config(config, { mode }) {
      const env = loadEnv(mode || 'development', process.cwd(), '');
      Object.assign(process.env, env);
    },
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '');
      Object.assign(process.env, env);

      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const pathname = parsedUrl.pathname;
            const filePath = path.resolve(process.cwd(), '.' + pathname + '.js');

            // Parse body for POST requests if needed
            if (req.method === 'POST' && !req.body) {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const bodyStr = Buffer.concat(buffers).toString();
              try {
                req.body = JSON.parse(bodyStr);
              } catch (e) {
                req.body = {};
              }
            }

            // Parse query params into req.query
            req.query = Object.fromEntries(parsedUrl.searchParams.entries());

            // Helper methods for res.status().json()
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };

            const module = await server.ssrLoadModule(filePath);
            if (module && module.default) {
              return await module.default(req, res);
            }
          } catch (err) {
            console.error('Vite API Middleware Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message, stack: err.stack }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
});
