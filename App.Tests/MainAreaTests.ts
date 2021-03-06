require('global-jsdom')();
import { Test, TestSuite } from "xunit.ts";
import MainArea from '../App/main-area.vue';
import { shallowMount as mount } from '@vue/test-utils';
import Reading from "../App/Reading";
import Point from "../App/Point";
import Mockito from 'ts-mockito';
import Renderer from "../App/Renderer";
import MockFactory from "./MockFactory";

export default class MainAreaTests extends TestSuite {
    @Test()
    async showsDataPointForEachReading() {
        //arrange
        const canvas = MockFactory.canvas();
        const readings: Reading[] = [
            new Reading(1, new Point(2, 3), []),
            new Reading(2, new Point(3, 4), [])
        ];

        //act
        const component = mount(MainArea, { propsData: { readings: readings, current: new Reading(0, new Point(0, 0), []), renderer: new Renderer(Mockito.instance(canvas)) } });

        //assert
        this.assert.equal(2, component.findAll('data-point-stub').length);
    }

    @Test()
    async backgroundIsSetFromData() {
        const canvas = MockFactory.canvas();
        const readings: Reading[] = [];

        //act
        const component = mount(MainArea, { propsData: { readings: readings, current: new Reading(0, new Point(0, 0), []), renderer: new Renderer(Mockito.instance(canvas)), background: 'test.png' } });

        //assert
        this.assert.stringContains('background-image: url(test.png);', component.get('.background').attributes('style'));
    }

    @Test()
    async backgroundIsPixelatedWhenFlagSet() {
        const canvas = MockFactory.canvas();
        const readings: Reading[] = [];

        //act
        const component = mount(MainArea, { propsData: { readings: readings, current: new Reading(0, new Point(0, 0), []), renderer: new Renderer(Mockito.instance(canvas)), pixelated: true } });

        //assert
        this.assert.stringContains('pixelated', component.get('.background').attributes('class'));
    }

    @Test()
    async backgroundIsNotPixelatedWhenFlagNotSet() {
        const canvas = MockFactory.canvas();
        const readings: Reading[] = [];

        //act
        const component = mount(MainArea, { propsData: { readings: readings, current: new Reading(0, new Point(0, 0), []), renderer: new Renderer(Mockito.instance(canvas)), pixelated: false } });

        //assert
        this.assert.stringDoesNotContain('pixelated', component.get('.background').attributes('class'));
    }

    @Test()
    async clickingCanvasAddsReading() {
        //arrange
        const canvas = MockFactory.canvas();
        const readings: Reading[] = [];
        const component = mount(MainArea, { propsData: { enabled: true, readings: readings, current: new Reading(0, new Point(0, 0), []), renderer: new Renderer(Mockito.instance(canvas)) } });

        //act
        await component.get('canvas').trigger('click');
        await component.vm.$nextTick();

        //assert
        this.assert.equal(1, readings.length);
    }

    @Test()
    async clickingCanvasDoesNotAddReadingWhenDisabled() {
        //arrange
        const canvas = MockFactory.canvas();
        const readings: Reading[] = [];
        const component = mount(MainArea, { propsData: { enabled: false, readings: readings, current: new Reading(0, new Point(0, 0), []), renderer: new Renderer(Mockito.instance(canvas)) } });

        //act
        await component.get('canvas').trigger('click');
        await component.vm.$nextTick();

        //assert
        this.assert.empty(readings);
    }

    @Test()
    async deleteEventIsPassedUp() {
        //arrange
        const canvas = MockFactory.canvas();
        const readings: Reading[] = [new Reading(1, new Point(2, 3), [])];
        const component = mount(MainArea, { propsData: { enabled: false, readings: readings, current: new Reading(0, new Point(0, 0), []), renderer: new Renderer(Mockito.instance(canvas)) } });

        //act
        component.get('data-point-stub').vm.$emit('delete');

        //assert
        this.assert.notNull(component.emitted('delete'));
    }
}