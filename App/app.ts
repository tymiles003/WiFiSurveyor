import { createApp, h as render } from "vue";
import App from "./app.vue";
import Factory from "./Factory";
import Signal from "./Signal";

const app = createApp({
    el: 'app',
    render: () => render(App),
    provide: {
        signal_service: (signals: Signal[]) => Factory.signalService(signals),
        renderer: (canvas: HTMLCanvasElement) => Factory.renderer(canvas)
    }
});

app.mount('app');