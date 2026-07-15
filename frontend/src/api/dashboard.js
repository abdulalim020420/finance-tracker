import client from './client'

export const dashboardApi = {
    getSummary: (month) => client.get('/dashboard/summary', { params: { month } }),
}