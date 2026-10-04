import { test, expect } from './flightFixtures';
import { flightPage } from '../pages/flightPage';

test('01.Searches first class one-way flights', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('One-way');
    await flight.setOrigin('Manila');
    await flight.setDestination('Boracay');
    await flight.setDate('October 25, 2026');
    await flight.selectFlightClass('First');
    await flight.clickSearchFlightButton();

    await expect(page).not.toHaveURL('https://www.cheapflights.com.au/flights');

});

test('02.Searches Business return flights', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('Return');
    await flight.setOrigin('Boracay');
    await flight.setDestination('Manila');
    await flight.setDate('October 30, 2026');
    await flight.selectFlightClass('Business');
    await flight.clickSearchFlightButton();

    await expect(page).not.toHaveURL('https://www.cheapflights.com.au/flights');
});

test('03.Searches for round trip flights', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('Multi-city');
    await flight.removeFlight()
    await flight.setOriginMultiple('Manila', 0);
    await flight.setDestination('Boracay', 0);
    await flight.setDate('October 25, 2026', 0);

    await flight.setOriginMultiple('Boracay', 1);
    await flight.setDestination('Manila', 1);
    await flight.setDate('October 30, 2026', 1);

    await flight.clickSearchFlightButton();
    await expect(page).toHaveURL(/flight-search/);



})


test('04.Searches for multi-city flights', async ({ page }) => {
    const flight = new flightPage(page);

    await flight.setTripType('Multi-city');
    await flight.setOriginMultiple('Manila', 0);
    await flight.setDestination('Boracay', 0);
    await flight.setDate('October 25, 2026', 0);

    await flight.setOriginMultiple('Boracay', 1);
    await flight.setDestination('Cebu City', 1);
    await flight.setDate('October 30, 2026', 1);

    await flight.setOriginMultiple('Cebu City', 2);
    await flight.setDestination('Manila', 2);
    await flight.setDate('November 4, 2026', 2);

    await flight.expectOriginSelected('Manila', 0);
    await flight.expectDestinationSelected('Boracay', 0);
    await flight.expectOriginSelected('Boracay', 1);
    await flight.expectDestinationSelected('Cebu City', 1);
    await flight.expectOriginSelected('Cebu City', 2);
    await flight.expectDestinationSelected('Manila', 2);
    await expect(flight.departureDate_buttons.nth(0)).toContainText('25/10');
    await expect(flight.departureDate_buttons.nth(1)).toContainText('30/10');
    await expect(flight.departureDate_buttons.nth(2)).toContainText('4/11');

    await flight.clickSearchFlightButton();
    await expect(page).toHaveURL(/flight-search/);
})

