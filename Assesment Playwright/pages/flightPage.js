const { expect } = require('@playwright/test');
const { assert } = require('node:console');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cityCodes = { Manila: 'MNL', Boracay: 'MPH', 'Cebu City': 'CEB' };

exports.flightPage = class flightPage {
    constructor(page) {
        this.page = page;

        this.origin_combobox = page.getByRole('combobox', { name: 'Origin location' });
        this.origin_fields = page.locator('[aria-label="Flight origin input"]');
        this.destination_combobox = page.getByRole('combobox', {
            name: /^(Destination location|Ask anything)$/,
        });
        this.destination_fields = page.locator('[aria-label="Flight destination input"]');
        this.tripType_combobox = page.getByRole('combobox', { name: /^Trip type/ }).first();
        this.departureDate_buttons = page.getByRole('button', {
            name: /^(Departure date|Departure|Departure - Return)$/,
        });
        this.datePicker = page.getByRole('button', { name: /(october|oct)\s+19,?\s*2026/i });
        this.searchFlight_button = page.getByRole('button', { name: 'Search', exact: true });
        this.removeOriginButton = page.getByLabel('Flight origin input').getByRole('button',{name:'Remove value'})
        this.removeDestinationButton = page.getByLabel('Flight destination input').getByRole('button',{name:'Remove value'})
        this.passengerCabinButton = page.getByRole('button', { name: /^\d+ adult.*Economy$/i });
        this.passengerCabinCombobox = page.getByRole('combobox', { name: 'Trip type', exact: true });
        this.removeFlightOption = page.getByRole('button', { name: 'Remove leg number 2 from your' });

    }

    async removeFlight()
    {
        await this.removeFlightOption.click();
    }

    async removeDestination(){
        await this.removeDestinationButton.click();
    }

    async gotoFlightPage() {
        await this.page.goto('https://www.cheapflights.com.au/flights', {
            waitUntil: 'domcontentloaded',
        });
        await expect(this.origin_combobox).toBeVisible();
    }

    async setTripType(tripType) {
        await this.tripType_combobox.click();
        const tripTypeOption = this.page.getByRole('option', { name: tripType, exact: true });
        await expect(tripTypeOption).toBeVisible();
        await tripTypeOption.click();
        await expect(this.tripType_combobox).toHaveAccessibleName(`Trip type ${tripType}`);

    }

    async removeOrigin(){
        await this.removeOriginButton.click();
    }

    async setOrigin(origin) {

        await this.removeOriginButton.click();
        await expect(this.origin_combobox).toBeVisible();
        await this.origin_combobox.fill(origin);
        const selectOrigin = this.page.getByRole('option', {
            name: new RegExp(`^${escapeRegExp(origin)},`, 'i'),
        });
        await expect(selectOrigin).toBeVisible();
        await selectOrigin.click();


    }

    async setOriginMultiple(origin, legIndex) {
        const originCombobox = this.origin_combobox.nth(legIndex);
        const originField = this.origin_fields.nth(legIndex);
        await expect(originCombobox).toBeVisible();

        const currentOrigin = await originField.count()
            ? await originField.innerText()
            : await originCombobox.inputValue();
        const expectedOrigin = new RegExp(`^${escapeRegExp(origin)}(?:[,\\s(]|$)`, 'i');
        if (expectedOrigin.test(currentOrigin.trim())) {
            return;
        }

        const removeOriginButton = originField.getByRole('button', { name: 'Remove value' });
        if (await removeOriginButton.count()) {
            await removeOriginButton.click();
        }

        await originCombobox.fill(origin);
        const selectOrigin = this.page.getByRole('option', {
            name: new RegExp(`^${escapeRegExp(origin)},`, 'i'),
        });
        await expect(selectOrigin).toBeVisible();
        await selectOrigin.click();
    }

    async setDestination(destination, legIndex = 0) {
        const destinationCombobox = this.destination_combobox.nth(legIndex);
        await expect(destinationCombobox).toBeVisible();
        await destinationCombobox.fill(destination);
        const selectDestination = this.page.getByRole('option', {
            name: new RegExp(`^${escapeRegExp(destination)},`, 'i'),
        });
        await expect(selectDestination).toBeVisible({ timeout: 10000 });
        await selectDestination.click();
    }

    async expectOriginSelected(origin, legIndex = 0) {
        await this.expectCitySelected(this.origin_fields, this.origin_combobox, origin, legIndex, 'data-test-origin');
    }

    async expectDestinationSelected(destination, legIndex = 0) {
        await this.expectCitySelected(this.destination_fields, this.destination_combobox, destination, legIndex, 'data-test-destination');
    }

    async expectCitySelected(fieldLocator, comboboxLocator, city, legIndex, dataAttribute) {
        const expectedCity = new RegExp(`^${escapeRegExp(city)}(?:[,\\s(]|$)`, 'i');
        const field = fieldLocator.nth(legIndex);
        if (await field.count() && expectedCity.test((await field.innerText()).trim())) {
            return;
        }

        const combobox = comboboxLocator.nth(legIndex);
        if (expectedCity.test(await combobox.inputValue())) {
            return;
        }

        const cityCode = cityCodes[city];
        if (!cityCode) {
            throw new Error(`No airport code configured for ${city}`);
        }
        await expect(combobox).toHaveAttribute(dataAttribute, cityCode);
    }


    async setDate(dateString, legIndex = 0) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            throw new Error(`Invalid date: ${dateString}`);
        }

        const month = date.toLocaleString('en-US', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();

        const departureButton = this.departureDate_buttons.nth(legIndex);
        await expect(departureButton).toBeVisible();
        await departureButton.click();

        const dateButton = this.page.getByRole('button', {
            name: new RegExp(`${month}\\s+${day},?\\s*${year}`, 'i'),
        });

        await expect(dateButton).toBeVisible({ timeout: 10000 });
        await dateButton.click();
        const confirmDateButton = this.page.getByRole('button', {
            name: 'Select this date',
            exact: true,
        });
        if (await confirmDateButton.isVisible()) {
            await confirmDateButton.click();
        }
    }

    async selectFlightClass(flightClass) {
        if (await this.passengerCabinButton.isVisible()) {
            await this.passengerCabinButton.click();
        } else {
            await this.passengerCabinCombobox.click();
        }
        const cabinOption = this.page.getByRole('radio', { name: flightClass, exact: true });
        await cabinOption.check();
    }
    async clickSearchFlightButton() {
        await expect(this.searchFlight_button).toBeVisible();
        await this.searchFlight_button.click();
        await this.page.waitForTimeout(10000);
    }

};