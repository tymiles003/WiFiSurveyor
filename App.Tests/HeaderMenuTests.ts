require('global-jsdom')();
import { Test, TestSuite } from "xunit.ts";
import HeaderMenu from '../App/header-menu.vue';
import { shallowMount as mount } from '@vue/test-utils';
import Reading from "../App/Reading";
import Point from "../App/Point";

export default class HeaderMenuTests extends TestSuite {
    @Test()
    async selectedEventIsPassedUp() {
        //arrange
        const component = mount(HeaderMenu, { propsData: { readings: [], current: new Reading(0, new Point(0, 0), []) } });

        //act
        component.get('ap-form-stub').vm.$emit('selected');

        //assert
        this.assert.notNull(component.emitted('selected'));
    }

    @Test()
    async bakgroundEventIsPassedUp() {
        //arrange
        const component = mount(HeaderMenu, { propsData: { readings: [], current: new Reading(0, new Point(0, 0), []) } });

        //act
        component.get('background-form-stub').vm.$emit('background');

        //assert
        this.assert.notNull(component.emitted('background'));
    }

    @Test()
    async pixelateEventIsPassedUp() {
        //arrange
        const component = mount(HeaderMenu, { propsData: { readings: [], current: new Reading(0, new Point(0, 0), []) } });

        //act
        component.get('background-form-stub').vm.$emit('pixelate');

        //assert
        this.assert.notNull(component.emitted('pixelate'));
    }

    @Test()
    async undoEventIsPassedUp() {
        //arrange
        const component = mount(HeaderMenu, { propsData: { readings: [], current: new Reading(0, new Point(0, 0), []) } });

        //act
        component.get('actions-stub').vm.$emit('undo');

        //assert
        this.assert.notNull(component.emitted('undo'));
    }

    @Test()
    async resetEventIsPassedUp() {
        //arrange
        const component = mount(HeaderMenu, { propsData: { readings: [], current: new Reading(0, new Point(0, 0), []) } });

        //act
        component.get('actions-stub').vm.$emit('reset');

        //assert
        this.assert.notNull(component.emitted('reset'));
    }

    @Test()
    async debugEventIsPassedUp() {
        //arrange
        const component = mount(HeaderMenu, { propsData: { readings: [], current: new Reading(0, new Point(0, 0), []) } });

        //act
        component.get('actions-stub').vm.$emit('debug');

        //assert
        this.assert.notNull(component.emitted('debug'));
    }
}