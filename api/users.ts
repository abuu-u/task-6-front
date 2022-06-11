import { api } from '.'

export interface GetUsersRequest {
  seed: number
  locale: string
  page: number
  errorsCount: number
}

export type User = {
  index: number
  randomIdentifier: number
  firstName: string
  middleName: string
  lastName: string
  address: string
  phone: string
}

interface GetUsersResponse {
  users: User[]
}

interface GetCsvResponse {
  csv: string
}

export const getUsers = async (data: GetUsersRequest) => {
  const query = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const response = await fetch(`${api}/Users?${query}`, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })

  if (!response.ok) {
    return
  }

  return (await response.json()) as GetUsersResponse
}

export const getCsvUri = async (data: GetUsersRequest) => {
  const query = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const response = await fetch(`${api}/Users/csv?${query}`, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })

  if (!response.ok) {
    return
  }

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    ((await response.json()) as GetCsvResponse).csv

  return encodeURI(csvContent)
}
