import { test as base, expect } from '@playwright/test';
import { flightPage as FlightPage } from '../pages/flightPage';

export const test = base.extend({
    flightPageSetup: [async ({ page }, use) => {
        const flight = new FlightPage(page);
        await flight.gotoFlightPage();
        await use(flight);
    }, { auto: true }],
});

export { expect };