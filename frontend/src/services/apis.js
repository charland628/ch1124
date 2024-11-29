
export default {
    async getTools() {
        return await this.getData('http://localhost:3000/getTools');
    },

    async getToolCharges() {
        return await this.getData('http://localhost:3000/getToolCharges');
    },

    async postToolRentalAgreement(payload) {
        return await this.postData('http://localhost:3000/toolRental', payload);
    },

    async getData(url) {
        const response = await this.fetchData(url);
        return response.success ? response.data : [];
    },

    async postData(url, payload) {
        let failed = { success: false };

        try {
            const body = JSON.stringify(payload);
            const headers = { "Content-Type": "application/json" };
            const response = await fetch(url, { method: 'POST', headers, body });

            if (response.status >= 200 && response.status <= 299) {
                return await response.json();
            } else {
                return failed;
            }
        } catch (error) {
            return failed;
        }
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
