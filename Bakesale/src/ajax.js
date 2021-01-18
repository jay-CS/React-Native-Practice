const ApiHost = 'https://bakesaleforgood.com';

export default {
    
    async fetchInitialDeals() {
        try {
            const response = await fetch(ApiHost + '/api/deals');
            const responseJson = await response.json();
            return responseJson;

        }
        catch(error) {
            console.log(error);
        }
    },

    async fetchDealDetails(dealId) {
        try {
            const response = await fetch(ApiHost + '/api/deals/' + dealId);
            const responseJson = await response.json();
            return responseJson;

        }
        catch(error) {
            console.log(error);
        }
    },

    async fetchDealsSearchResults(searchTerm) {

        try {
            const response = await fetch(ApiHost + '/api/deals?searchTerm=' + searchTerm);
            const responseJson = await response.json();
            return responseJson;

        }
        catch(error) {
            console.log(error);
        }

    }
}