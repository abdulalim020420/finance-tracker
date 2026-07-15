import client from './client'

export const transactionsApi = {
    getAll:  (params)     => client.get('/transactions', { params }),
    create:  (data)       => client.post('/transactions', data),
    update:  (id, data)   => client.put(`/transactions/${id}`, data),
    delete:  (id)         => client.delete(`/transactions/${id}`),
}