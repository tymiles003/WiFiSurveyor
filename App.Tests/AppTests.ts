require('global-jsdom')();
import { Test, TestSuite } from "xunit.ts";
import App from '../App/app.vue';
import { shallowMount as mount, Wrapper } from '@vue/test-utils';
import Mockito from 'ts-mockito';
import SignalService from "../App/SignalService";
import Renderer from "../App/Renderer";
import MockFactory from "./MockFactory";
import Point from "../App/Point";
import Reading from "../App/Reading";
import AccessPoint from "../App/AccessPoint";

export default class AppTests extends TestSuite {
    @Test()
    async canCreateApp() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        //act
        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })

        //assert
        this.assert.notEmpty(component.html());
    }

    @Test()
    async canGetStatusFromSignalService() {
        //arrange
        const signal_service = MockFactory.signalService();
        Mockito.when(signal_service.status).thenReturn('test message');

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        //act
        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        await component.vm.$nextTick();

        //assert
        this.assert.stringContains('test message', component.html());
    }

    @Test()
    async showsDefaultStatusWhenLoading() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        //act
        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })

        //assert
        this.assert.stringContains('loading', component.html());
    }

    @Test()
    async resetsWhenConfirmed() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.readings = [new Reading(1, new Point(2, 3), [])];

        global.confirm = () => true;

        //act
        component.get('header-menu-stub').vm.$emit('reset');

        //assert
        this.assert.empty(component.vm.$data.readings);
    }

    @Test()
    async doesNotResetsWhenCancelled() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.readings = [new Reading(1, new Point(2, 3), [])];

        global.confirm = () => false;

        //act
        component.get('header-menu-stub').vm.$emit('reset');

        //assert
        this.assert.notEmpty(component.vm.$data.readings);
    }

    @Test()
    async performsUndoWhenConfirmed() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.readings = [new Reading(1, new Point(2, 3), [])];

        global.confirm = () => true;

        //act
        component.get('header-menu-stub').vm.$emit('undo');

        //assert
        this.assert.empty(component.vm.$data.readings);
    }

    @Test()
    async doesNotUndoWhenCancelled() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.readings = [new Reading(1, new Point(2, 3), [])];

        global.confirm = () => false;

        //act
        component.get('header-menu-stub').vm.$emit('undo');

        //assert
        this.assert.notEmpty(component.vm.$data.readings);
    }

    @Test()
    async setsPixelatedFlagWhenEnabled() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })

        //act
        component.get('header-menu-stub').vm.$emit('pixelate', true);
        await component.vm.$nextTick();

        //assert
        this.assert.equal('true', component.get('main-area-stub').attributes('pixelated'));
    }

    @Test()
    async setsDebugFlagWhenEnabled() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })

        //act
        component.get('header-menu-stub').vm.$emit('debug', true);
        await component.vm.$nextTick();

        //assert
        this.assert.equal('true', component.get('debug-panel-stub').attributes('enabled'));
    }

    @Test()
    async setsSelectedAccessPointFromEvent() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })

        //act
        component.get('header-menu-stub').vm.$emit('selected', new AccessPoint('ssid1', 2, 'mac1'));
        await component.vm.$nextTick();

        //assert
        this.assert.equal('ssid1', component.vm.$data.selected.ssid);
    }

    @Test()
    async setsBackgroundToEmptyIfNoFilesSelected() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.background = 'test.png';
        await component.vm.$nextTick();

        //act
        await component.vm.setBackground([]);

        //assert
        this.assert.empty(component.get('main-area-stub').attributes('background'));
    }

    @Test()
    async setsBackgroundToFileContentsIfNotEmpty() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.background = 'test.png';
        await component.vm.$nextTick();

        const file = new File(['file contents'], 'bkg.png', { type: 'image/png' });
        const file_list = Mockito.mock<FileList>();
        Mockito.when(file_list.length).thenReturn(1);
        Mockito.when(file_list.item(0)).thenReturn(file);

        //act
        await component.vm.setBackground(Mockito.instance(file_list));

        //assert
        this.assert.stringContains(btoa('file contents'), component.get('main-area-stub').attributes('background'));
    }

    @Test()
    async deletesDataPointWhenConfirmed() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.readings = [new Reading(1, new Point(2, 3), []), new Reading(2, new Point(3, 4), []), new Reading(3, new Point(4, 5), [])];

        global.confirm = () => true;

        //act
        component.get('main-area-stub').vm.$emit('delete', 1);

        //assert
        this.assert.count(2, component.vm.$data.readings);
        this.assert.equal(1, component.vm.$data.readings[0].id);
        this.assert.equal(3, component.vm.$data.readings[1].id);
    }

    @Test()
    async doesNotDeleteDataPointWhenNotConfirmed() {
        //arrange
        const signal_service = MockFactory.signalService();

        const canvas = MockFactory.canvas();
        const renderer = new Renderer(Mockito.instance(canvas));

        const component = mount(App, { provide: { signal_service: () => Mockito.instance(signal_service), renderer: () => renderer } })
        component.vm.$data.readings = [new Reading(1, new Point(2, 3), []), new Reading(2, new Point(3, 4), []), new Reading(3, new Point(4, 5), [])];

        global.confirm = () => false;

        //act
        component.get('main-area-stub').vm.$emit('delete', 1);

        //assert
        this.assert.count(3, component.vm.$data.readings);
    }
}