import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = newPerson => {
    return axios.post(baseUrl, newPerson).then(response => response.data)
}

const exterminate = id => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const edit = (id, newPerson) => {
    return axios.put(`${baseUrl}/${id}`, newPerson).then(response => response.data)
}

export default {getAll, create, exterminate, edit}
