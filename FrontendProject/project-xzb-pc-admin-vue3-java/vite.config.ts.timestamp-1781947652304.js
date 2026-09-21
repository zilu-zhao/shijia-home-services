// vite.config.ts
import { loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import createVuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import path from "path";
var CWD = process.cwd();
var vite_config_default = ({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    define: {},
    resolve: {
      alias: {
        "@": path.resolve("D:\\DevelopProject\\itheimaProjects\\YLDJ\\FrontendProject\\project-xzb-pc-admin-vue3-java", "./src")
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve(
              "src/style/variables.less"
            )}";`
          },
          math: "strict",
          javascriptEnabled: true
        }
      }
    },
    plugins: [
      createVuePlugin(),
      vueJsx(),
      viteMockServe({
        mockPath: "mock",
        localEnabled: false,
        prodEnabled: true,
        supportTs: true,
        logger: true,
        injectCode: `
          import { setupProdMockServer } from '../mockProdServer';
          setupProdMockServer();
        `
      }),
      svgLoader()
    ],
    server: {
      port: 3e3,
      host: "0.0.0.0",
      open: false,
      hmr: true,
      proxy: {
        "/api": {
          target: "http://localhost:11500",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IENvbmZpZ0VudiwgVXNlckNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyB2aXRlTW9ja1NlcnZlIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcbmltcG9ydCBjcmVhdGVWdWVQbHVnaW4gZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB3aXRoU2NvcGVJZCB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgQ1dEID0gcHJvY2Vzcy5jd2QoKVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcbiAgY29uc3QgeyBWSVRFX0JBU0VfVVJMIH0gPSBsb2FkRW52KG1vZGUsIENXRClcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiBWSVRFX0JBU0VfVVJMLFxuICAgIGRlZmluZToge30sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoXCJEOlxcXFxEZXZlbG9wUHJvamVjdFxcXFxpdGhlaW1hUHJvamVjdHNcXFxcWUxESlxcXFxGcm9udGVuZFByb2plY3RcXFxccHJvamVjdC14emItcGMtYWRtaW4tdnVlMy1qYXZhXCIsICcuL3NyYycpXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgbW9kaWZ5VmFyczoge1xuICAgICAgICAgICAgaGFjazogYHRydWU7IEBpbXBvcnQgKHJlZmVyZW5jZSkgXCIke3BhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgJ3NyYy9zdHlsZS92YXJpYWJsZXMubGVzcydcbiAgICAgICAgICAgICl9XCI7YFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWF0aDogJ3N0cmljdCcsXG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBwbHVnaW5zOiBbXG4gICAgICBjcmVhdGVWdWVQbHVnaW4oKSxcbiAgICAgIHZ1ZUpzeCgpLFxuICAgICAgdml0ZU1vY2tTZXJ2ZSh7XG4gICAgICAgIG1vY2tQYXRoOiAnbW9jaycsXG4gICAgICAgIGxvY2FsRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIHByb2RFbmFibGVkOiB0cnVlLFxuICAgICAgICBzdXBwb3J0VHM6IHRydWUsXG4gICAgICAgIGxvZ2dlcjogdHJ1ZSxcbiAgICAgICAgaW5qZWN0Q29kZTogYFxuICAgICAgICAgIGltcG9ydCB7IHNldHVwUHJvZE1vY2tTZXJ2ZXIgfSBmcm9tICcuLi9tb2NrUHJvZFNlcnZlcic7XG4gICAgICAgICAgc2V0dXBQcm9kTW9ja1NlcnZlcigpO1xuICAgICAgICBgXG4gICAgICB9KSxcbiAgICAgIHN2Z0xvYWRlcigpXG4gICAgXSxcblxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogMzAwMCxcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgaG1yOiB0cnVlLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDoxMTUwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgICAgLy8gYnlwYXNzKHJlcSxyZXMsb3B0aW9ucyl7XG4gICAgICAgICAgLy8gICBjb25zdCBwcm94eVVybCA9IG5ldyBVUkwgKHJlcS51cmwgLCAob3B0aW9ucy50YXJnZXQpYXMgc3RyaW5nKT8uaHJlZlxuICAgICAgICAgIC8vICAgcmVxLmhlYWRlcnNbJ3JlZmVyZXJzcyddID0gcHJveHlVcmxcbiAgICAgICAgICAvLyAgIHJlcy5zZXRIZWFkZXIoJ3JlZmVyZXJzcycsIHByb3h5VXJsKVxuICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQWdDLGVBQWU7QUFDL0MsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZUFBZTtBQUV0QixPQUFPLFVBQVU7QUFHakIsSUFBTSxNQUFNLFFBQVEsSUFBSTtBQUd4QixJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQTZCO0FBQ2xELFFBQU0sRUFBRSxjQUFjLElBQUksUUFBUSxNQUFNLEdBQUc7QUFDM0MsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sUUFBUSxDQUFDO0FBQUEsSUFDVCxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSw4RkFBOEYsT0FBTztBQUFBLE1BQ3pIO0FBQUEsSUFDRjtBQUFBLElBRUEsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osWUFBWTtBQUFBLFlBQ1YsTUFBTSw4QkFBOEIsS0FBSztBQUFBLGNBQ3ZDO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLE1BQU07QUFBQSxVQUNOLG1CQUFtQjtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNQLGdCQUFnQjtBQUFBLE1BQ2hCLE9BQU87QUFBQSxNQUNQLGNBQWM7QUFBQSxRQUNaLFVBQVU7QUFBQSxRQUNWLGNBQWM7QUFBQSxRQUNkLGFBQWE7QUFBQSxRQUNiLFdBQVc7QUFBQSxRQUNYLFFBQVE7QUFBQSxRQUNSLFlBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUlkLENBQUM7QUFBQSxNQUNELFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQU05QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
