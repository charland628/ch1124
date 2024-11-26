const FAKE_API_TOOLS_RESPONSE = [
    {
        type: 'chainsaw',
        code: 'CHNS',
        brand: 'Stihl',
    },
    {
        type: 'ladder',
        code: 'LADW',
        brand: 'Werner',
    },
    {
        type: 'jackhammer',
        code: 'JAKD',
        brand: 'DeWalt',
    },
    {
        type: 'jackhammer',
        code: 'JAKR',
        brand: 'Ridgid',
    },
];

const FAKE_API_TOOL_RENTAL_CHARGES = [
    {
        type: 'ladder',
        dailyCharge: 1.99,
        chargeOnWeekday: true,
        chargeOnWeekend: true,
        chargeOnHoliday: false,
    },
    {
        type: 'chainsaw',
        dailyCharge: 1.49,
        chargeOnWeekday: true,
        chargeOnWeekend: false,
        chargeOnHoliday: true,
    },
    {
        type: 'jackhammer',
        dailyCharge: 2.99,
        chargeOnWeekday: true,
        chargeOnWeekend: false,
        chargeOnHoliday: false,
    },
];

export default {
    async getToolsMOCK() {
        return FAKE_API_TOOLS_RESPONSE;
    },

    async getToolChargesMOCK() {
        return FAKE_API_TOOL_RENTAL_CHARGES;
    },

    async getTools() {
        // USE MOCK UNTIL REAL URL IS AVAILABLE.  REPLACE WITH REAL URL
        return await this.getData('https://random-data-api.com/api/v2/users');
    },

    async getToolCharges() {
        // USE MOCK UNTIL REAL URL IS AVAILABLE.  REPLACE WITH REAL URL
        return await this.getData('https://random-data-api.com/api/v2/users');
    },

    async getData(url) {
        const response = await this.fetchData(url);
        return response.success ? response.data : [];
    },

    async fetchData(url) {
        const response = await fetch(url);

        let apiResponse = {
            success: false,
            data: null,
        };

        if (response.status >= 200 && response.status <= 299) {
            const jsonResponse = await response.json();
            apiResponse.success = true;
            apiResponse.data = jsonResponse;
        } else {
            apiResponse.data = {
                status: response.status,
                statusText: response.statusText,
            };
        }
        return apiResponse;
    }
};
