import { Test, TestSuite } from "xunit.ts";
import Reading from "../WiFiHeatMap.App/Reading";
import Point from "../WiFiHeatMap.App/Point";
import Signal from "../WiFiHeatMap.App/Signal";

export default class ReadingTests extends TestSuite
{
    private static signals: Signal[] = [
        new Signal('mac1', 'ssid1', 2, -35),
        new Signal('mac2', 'ssid1', 2, -30),
        new Signal('mac3', 'ssid1', 5, -45),
        new Signal('mac4', 'ssid1', 5, -40),
        new Signal('mac5', 'ssid2', 2, -55),
        new Signal('mac6', 'ssid2', 2, -50),
        new Signal('mac7', 'ssid2', 5, -65),
        new Signal('mac8', 'ssid2', 5, -60)
    ];

    @Test()
    async canGetSignalForSingleAP(): Promise<void> {
        //arrange
        const reading = new Reading(1, new Point(2, 3), ReadingTests.signals);

        //act
        const strength = reading.signalFor('ssid1', 5, 'mac3');

        //assert
        this.assert.equal(-45, strength);
    }

    @Test()
    async canGetSignalForSSIDOnSingleFrequency(): Promise<void> {
        //arrange
        const reading = new Reading(1, new Point(2, 3), ReadingTests.signals);

        //act
        const strength = reading.signalFor('ssid1', 5);

        //assert
        this.assert.equal(-40, strength);
    }

    @Test()
    async canGetSignalForSSID(): Promise<void> {
        //arrange
        const reading = new Reading(1, new Point(2, 3), ReadingTests.signals);

        //act
        const strength = reading.signalFor('ssid2');

        //assert
        this.assert.equal(-50, strength);
    }
}