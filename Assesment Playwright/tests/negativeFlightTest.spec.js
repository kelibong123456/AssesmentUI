import { test, expect } from './flightFixtures';
import { flightPage } from '../pages/flightPage';

test('01.Searches first class one-way flights with no origin ', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('One-way');
    await flight.setOrigin('Manila');
    await flight.setDestination('Boracay');
    await flight.setDate('October 25, 2026');
    await flight.selectFlightClass('First');
    await flight.removeOrigin()
    await flight.clickSearchFlightButton();

    await expect(page).not.toHaveURL(/flight-search/);
});

test('02.Searches Business return flights with no destination', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('Return');
    await flight.setOrigin('Manila');
    await flight.setDestination('Boracay');
    await flight.selectFlightClass('Business');
    await flight.removeDestination()
    await flight.clickSearchFlightButton();

    await expect(page).not.toHaveURL(/flight-search/);
});

test('03.Searches for a one way flight with no origin and destination', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('One-way');
    await flight.setOrigin('Manila');
    await flight.setDestination('Boracay');
    await flight.setDate('October 25, 2026');
    await flight.selectFlightClass('First');
    await flight.removeOrigin()
    await flight.removeDestination()
    await flight.clickSearchFlightButton();

    await expect(page).not.toHaveURL(/flight-search/);
})

test('04.Searches for a one way flight with the same origin and destination', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('One-way');
    await flight.setOrigin('Manila');
    await flight.setDestination('Manila');
    await flight.setDate('October 25, 2026');
    await flight.selectFlightClass('First');
    await flight.removeOrigin()
    await flight.removeDestination()
    await flight.clickSearchFlightButton();

    await expect(page).not.toHaveURL(/flight-search/);
})

test('05.Searches for a one way flight with no departure date', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('One-way');
    await flight.setOrigin('Manila');
    await flight.setDestination('Boracay');
    await flight.selectFlightClass('First');
    await flight.clickSearchFlightButton();

    await expect(page).not.toHaveURL(/flight-search/);

})

test('06.Searches for a round trip flight with no return data', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('Multi-city');
    await flight.removeFlight()
    await flight.setOriginMultiple('Manila', 0);
    await flight.setDestination('Boracay', 0);
    await flight.setDate('October 25, 2026', 0);


    await flight.clickSearchFlightButton();
    await expect(page).not.toHaveURL(/flight-search/);

})

test.only('07.Searches for a round trip flight with no data', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('Multi-city');
    await flight.removeFlight()


    await flight.clickSearchFlightButton();
    await expect(page).not.toHaveURL(/flight-search/);

})

